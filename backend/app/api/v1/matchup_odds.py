"""
Live Matchup Odds Board API
Provides comprehensive odds display with real-time updates, market intelligence, and Monte Carlo simulations
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import asyncio
import logging

from app.services.odds_api_service import OddsAPIService
from app.services.monte_carlo import MonteCarloSimulator
from app.services.websocket_service import websocket_service
from app.services.cache_service import cache_service
from app.models.bet import BetType
from app.services.espn_service import ESPNService

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
odds_api = OddsAPIService()
monte_carlo = MonteCarloSimulator()
espn_service = ESPNService()

@router.get("/matchups")
async def get_live_matchups(
    league_id: str,
    week: Optional[int] = None,
    include_odds: bool = True,
    include_simulations: bool = True
) -> Dict[str, Any]:
    """
    Get live matchup odds with real-time data
    
    Args:
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        include_odds: Include real-time odds data
        include_simulations: Include Monte Carlo simulations
        
    Returns:
        Dictionary with matchup data, odds, and simulations
    """
    try:
        # Get ESPN league matchups
        espn_data = await espn_service.get_league_matchups(league_id, week)
        
        if not espn_data:
            raise HTTPException(status_code=404, detail="League not found or no matchups available")
        
        # Get real-time odds if requested
        odds_data = []
        if include_odds:
            odds_data = await odds_api.get_nfl_odds(['h2h', 'spreads', 'totals'])
        
        # Process matchups with odds and simulations
        processed_matchups = []
        
        for matchup in espn_data.get('matchups', []):
            processed_matchup = await process_matchup_data(
                matchup, 
                odds_data, 
                include_simulations
            )
            processed_matchups.append(processed_matchup)
        
        # Get market intelligence
        market_intelligence = await get_market_intelligence(processed_matchups)
        
        result = {
            'league_id': league_id,
            'week': week or espn_data.get('current_week', 1),
            'timestamp': datetime.now().isoformat(),
            'matchups': processed_matchups,
            'market_intelligence': market_intelligence,
            'total_matchups': len(processed_matchups)
        }
        
        # Cache the result
        cache_key = f"matchups:{league_id}:week:{week or espn_data.get('current_week', 1)}"
        await cache_service.set(cache_key, result, cache_type='odds_data')
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting live matchups: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/matchup/{matchup_id}")
async def get_matchup_details(
    matchup_id: str,
    include_odds: bool = True,
    include_simulations: bool = True,
    include_history: bool = False
) -> Dict[str, Any]:
    """
    Get detailed information for a specific matchup
    
    Args:
        matchup_id: Unique matchup identifier
        include_odds: Include real-time odds data
        include_simulations: Include Monte Carlo simulations
        include_history: Include historical matchup data
        
    Returns:
        Detailed matchup information
    """
    try:
        # Get matchup data from cache or ESPN
        cache_key = f"matchup:{matchup_id}"
        cached_data = await cache_service.get(cache_key)
        
        if not cached_data:
            # Fetch from ESPN API
            matchup_data = await espn_service.get_matchup_details(matchup_id)
            if not matchup_data:
                raise HTTPException(status_code=404, detail="Matchup not found")
        else:
            matchup_data = cached_data
        
        # Get real-time odds if requested
        odds_data = []
        if include_odds:
            odds_data = await odds_api.get_nfl_odds(['h2h', 'spreads', 'totals'])
        
        # Process detailed matchup data
        processed_matchup = await process_matchup_data(
            matchup_data, 
            odds_data, 
            include_simulations,
            include_history
        )
        
        # Cache the result
        await cache_service.set(cache_key, processed_matchup, cache_type='odds_data')
        
        return processed_matchup
        
    except Exception as e:
        logger.error(f"Error getting matchup details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-intelligence")
async def get_market_intelligence_data(
    league_id: str,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get market intelligence and analytics
    
    Args:
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        
    Returns:
        Market intelligence data including upset alerts and efficiency metrics
    """
    try:
        cache_key = f"market_intelligence:{league_id}:week:{week or 1}"
        cached_data = await cache_service.get(cache_key)
        
        if cached_data:
            return cached_data
        
        # Get league matchups
        espn_data = await espn_service.get_league_matchups(league_id, week)
        odds_data = await odds_api.get_nfl_odds(['h2h', 'spreads', 'totals'])
        
        matchups = espn_data.get('matchups', [])
        
        # Calculate market intelligence
        intelligence = await calculate_market_intelligence(matchups, odds_data)
        
        # Cache the result
        await cache_service.set(cache_key, intelligence, cache_type='statistics')
        
        return intelligence
        
    except Exception as e:
        logger.error(f"Error getting market intelligence: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/upset-alerts")
async def get_upset_alerts(
    league_id: str,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get upset alerts for live games
    
    Args:
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        
    Returns:
        List of potential upset alerts
    """
    try:
        # Get current matchups and odds
        espn_data = await espn_service.get_league_matchups(league_id, week)
        odds_data = await odds_api.get_nfl_odds(['h2h'])
        
        matchups = espn_data.get('matchups', [])
        
        # Calculate upset alerts
        upset_alerts = await calculate_upset_alerts(matchups, odds_data)
        
        # Broadcast upset alerts via WebSocket if any
        if upset_alerts.get('alerts'):
            await websocket_service.broadcast_upset_alert(
                league_id, 
                upset_alerts
            )
        
        return upset_alerts
        
    except Exception as e:
        logger.error(f"Error getting upset alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh-odds")
async def refresh_odds_data(
    league_id: str,
    background_tasks: BackgroundTasks,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Refresh odds data and broadcast updates
    
    Args:
        league_id: ESPN league ID
        background_tasks: FastAPI background tasks
        week: Specific week (defaults to current week)
        
    Returns:
        Refresh status and updated data
    """
    try:
        # Add background task to refresh odds
        background_tasks.add_task(
            refresh_odds_background_task, 
            league_id, 
            week
        )
        
        return {
            'status': 'success',
            'message': 'Odds refresh initiated',
            'league_id': league_id,
            'week': week,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error refreshing odds: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_matchup_data(
    matchup: Dict[str, Any], 
    odds_data: List[Any], 
    include_simulations: bool = True,
    include_history: bool = False
) -> Dict[str, Any]:
    """Process matchup data with odds and simulations"""
    try:
        team1 = matchup.get('team1', {})
        team2 = matchup.get('team2', {})
        
        # Find matching odds data
        matching_odds = find_matching_odds(matchup, odds_data)
        
        # Calculate Monte Carlo simulations
        simulations = {}
        if include_simulations:
            simulations = await calculate_matchup_simulations(team1, team2)
        
        # Get historical data if requested
        history = {}
        if include_history:
            history = await get_matchup_history(team1.get('id'), team2.get('id'))
        
        processed_matchup = {
            'id': matchup.get('id'),
            'team1': {
                'id': team1.get('id'),
                'name': team1.get('name'),
                'score': team1.get('score', 0),
                'projected_score': team1.get('projected_score', 0),
                'record': team1.get('record', '0-0'),
                'stats': team1.get('stats', {})
            },
            'team2': {
                'id': team2.get('id'),
                'name': team2.get('name'),
                'score': team2.get('score', 0),
                'projected_score': team2.get('projected_score', 0),
                'record': team2.get('record', '0-0'),
                'stats': team2.get('stats', {})
            },
            'odds': matching_odds,
            'simulations': simulations,
            'history': history,
            'status': matchup.get('status', 'upcoming'),
            'week': matchup.get('week'),
            'timestamp': datetime.now().isoformat()
        }
        
        return processed_matchup
        
    except Exception as e:
        logger.error(f"Error processing matchup data: {e}")
        return matchup

async def calculate_matchup_simulations(team1: Dict[str, Any], team2: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate Monte Carlo simulations for a matchup"""
    try:
        # Extract team statistics
        team1_stats = {
            'points_for': team1.get('stats', {}).get('points_for', 0),
            'points_against': team1.get('stats', {}).get('points_against', 0),
            'wins': team1.get('stats', {}).get('wins', 0),
            'losses': team1.get('stats', {}).get('losses', 0),
            'games_played': team1.get('stats', {}).get('games_played', 1)
        }
        
        team2_stats = {
            'points_for': team2.get('stats', {}).get('points_for', 0),
            'points_against': team2.get('stats', {}).get('points_against', 0),
            'wins': team2.get('stats', {}).get('wins', 0),
            'losses': team2.get('stats', {}).get('losses', 0),
            'games_played': team2.get('stats', {}).get('games_played', 1)
        }
        
        # Run Monte Carlo simulation
        simulation_result = monte_carlo.simulate_matchup(team1_stats, team2_stats)
        
        return {
            'win_probability': simulation_result.win_probability,
            'confidence_interval': simulation_result.confidence_interval,
            'team1_avg_score': simulation_result.team1_avg_score,
            'team2_avg_score': simulation_result.team2_avg_score,
            'team1_std_dev': simulation_result.team1_std_dev,
            'team2_std_dev': simulation_result.team2_std_dev,
            'iterations': simulation_result.iterations
        }
        
    except Exception as e:
        logger.error(f"Error calculating simulations: {e}")
        return {}

def find_matching_odds(matchup: Dict[str, Any], odds_data: List[Any]) -> Dict[str, Any]:
    """Find matching odds data for a matchup"""
    try:
        team1_name = matchup.get('team1', {}).get('name', '')
        team2_name = matchup.get('team2', {}).get('name', '')
        
        for odds in odds_data:
            if (odds.team1 == team1_name and odds.team2 == team2_name) or \
               (odds.team1 == team2_name and odds.team2 == team1_name):
                return {
                    'moneyline': {
                        'team1': odds.moneyline_team1,
                        'team2': odds.moneyline_team2
                    },
                    'spread': {
                        'team1': odds.spread_team1,
                        'team2': odds.spread_team2,
                        'odds_team1': odds.spread_odds_team1,
                        'odds_team2': odds.spread_odds_team2
                    },
                    'total': {
                        'over': odds.total_over,
                        'under': odds.total_under,
                        'odds_over': odds.total_odds_over,
                        'odds_under': odds.total_odds_under
                    },
                    'bookmaker': odds.bookmaker,
                    'timestamp': odds.timestamp.isoformat()
                }
        
        return {}
        
    except Exception as e:
        logger.error(f"Error finding matching odds: {e}")
        return {}

async def get_market_intelligence(matchups: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate market intelligence metrics"""
    try:
        total_matchups = len(matchups)
        live_games = sum(1 for m in matchups if m.get('status') == 'in_progress')
        
        # Calculate upset potential
        upset_potential = 0
        for matchup in matchups:
            simulations = matchup.get('simulations', {})
            win_prob = simulations.get('win_probability', 0.5)
            if 0.3 <= win_prob <= 0.7:  # Close games
                upset_potential += 1
        
        return {
            'total_matchups': total_matchups,
            'live_games': live_games,
            'upset_potential': upset_potential,
            'market_efficiency': calculate_market_efficiency(matchups),
            'recommended_bets': get_recommended_bets(matchups)
        }
        
    except Exception as e:
        logger.error(f"Error calculating market intelligence: {e}")
        return {}

async def calculate_market_intelligence(matchups: List[Dict[str, Any]], odds_data: List[Any]) -> Dict[str, Any]:
    """Calculate comprehensive market intelligence"""
    try:
        # This would include more sophisticated analysis
        return {
            'timestamp': datetime.now().isoformat(),
            'market_efficiency': 0.85,
            'upset_alerts': [],
            'recommended_bets': [],
            'trend_analysis': {}
        }
        
    except Exception as e:
        logger.error(f"Error calculating market intelligence: {e}")
        return {}

async def calculate_upset_alerts(matchups: List[Dict[str, Any]], odds_data: List[Any]) -> Dict[str, Any]:
    """Calculate upset alerts for live games"""
    try:
        alerts = []
        
        for matchup in matchups:
            if matchup.get('status') == 'in_progress':
                simulations = matchup.get('simulations', {})
                win_prob = simulations.get('win_probability', 0.5)
                
                # Check for upset potential
                if win_prob < 0.3 or win_prob > 0.7:
                    alerts.append({
                        'matchup_id': matchup.get('id'),
                        'team1': matchup.get('team1', {}).get('name'),
                        'team2': matchup.get('team2', {}).get('name'),
                        'upset_probability': abs(win_prob - 0.5) * 2,
                        'alert_type': 'upset_potential',
                        'timestamp': datetime.now().isoformat()
                    })
        
        return {
            'alerts': alerts,
            'total_alerts': len(alerts),
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error calculating upset alerts: {e}")
        return {'alerts': [], 'total_alerts': 0}

async def refresh_odds_background_task(league_id: str, week: Optional[int] = None):
    """Background task to refresh odds data"""
    try:
        # Get fresh odds data
        odds_data = await odds_api.get_nfl_odds(['h2h', 'spreads', 'totals'])
        
        # Get league matchups
        espn_data = await espn_service.get_league_matchups(league_id, week)
        matchups = espn_data.get('matchups', [])
        
        # Process and cache updated data
        for matchup in matchups:
            processed_matchup = await process_matchup_data(matchup, odds_data, True)
            
            # Broadcast update via WebSocket
            await websocket_service.broadcast_odds_update(
                matchup.get('id'), 
                processed_matchup
            )
        
        logger.info(f"Refreshed odds data for league {league_id}, week {week}")
        
    except Exception as e:
        logger.error(f"Error in background odds refresh: {e}")

def calculate_market_efficiency(matchups: List[Dict[str, Any]]) -> float:
    """Calculate market efficiency score"""
    # Simplified market efficiency calculation
    return 0.85

def get_recommended_bets(matchups: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Get recommended bets based on analysis"""
    # This would include sophisticated betting recommendations
    return []

async def get_matchup_history(team1_id: str, team2_id: str) -> Dict[str, Any]:
    """Get historical matchup data"""
    # This would fetch historical matchup data
    return {}
