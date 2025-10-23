"""
FAAB Predictor API
Provides intelligent FAAB bid recommendations and market analysis
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import asyncio
import logging

from app.services.faab_predictor_service import FAABPredictorService
from app.services.websocket_service import websocket_service
from app.services.cache_service import cache_service

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize service
faab_predictor = FAABPredictorService()

@router.get("/recommendations")
async def get_faab_recommendations(
    league_id: str,
    week: Optional[int] = None,
    user_id: Optional[str] = None,
    position_filter: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get comprehensive FAAB bid recommendations
    
    Args:
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        user_id: Optional user ID for personalized recommendations
        position_filter: Filter by position (QB, RB, WR, TE, K, DEF)
        
    Returns:
        FAAB recommendations with market intelligence
    """
    try:
        # Get recommendations
        recommendations = await faab_predictor.get_faab_recommendations(
            league_id, 
            week or 1, 
            user_id
        )
        
        # Filter by position if specified
        if position_filter:
            filtered_recommendations = [
                rec for rec in recommendations['recommendations']
                if rec['position'] == position_filter.upper()
            ]
            recommendations['recommendations'] = filtered_recommendations
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error getting FAAB recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/player-analysis/{player_id}")
async def get_player_faab_analysis(
    player_id: str,
    league_id: str,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get detailed FAAB analysis for a specific player
    
    Args:
        player_id: Player identifier
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        
    Returns:
        Detailed player FAAB analysis
    """
    try:
        # Get player data from ESPN
        player_data = await faab_predictor.espn_service.get_player_data(player_id)
        if not player_data:
            raise HTTPException(status_code=404, detail="Player not found")
        
        # Get league bidding history
        bidding_history = await faab_predictor.get_league_bidding_history(league_id)
        
        # Analyze league bidding patterns
        league_profile = await faab_predictor.analyze_league_bidding_patterns(
            league_id, 
            bidding_history
        )
        
        # Generate detailed analysis
        analysis = await generate_detailed_player_analysis(
            player_data, 
            league_profile, 
            bidding_history
        )
        
        return {
            'player_id': player_id,
            'player_data': player_data,
            'analysis': analysis,
            'league_profile': {
                'average_bid_size': league_profile.average_bid_size,
                'bid_frequency': league_profile.bid_frequency,
                'market_efficiency': league_profile.market_efficiency
            },
            'timestamp': datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting player FAAB analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-intelligence")
async def get_faab_market_intelligence(
    league_id: str,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get comprehensive FAAB market intelligence
    
    Args:
        league_id: ESPN league ID
        week: Specific week (defaults to current week)
        
    Returns:
        Market intelligence and insights
    """
    try:
        cache_key = f"faab_market_intelligence:{league_id}:week:{week or 1}"
        cached_intelligence = await cache_service.get(cache_key)
        
        if cached_intelligence:
            return cached_intelligence
        
        # Get league bidding history
        bidding_history = await faab_predictor.get_league_bidding_history(league_id)
        
        # Analyze league patterns
        league_profile = await faab_predictor.analyze_league_bidding_patterns(
            league_id, 
            bidding_history
        )
        
        # Get current waiver wire
        waiver_players = await faab_predictor.espn_service.get_waiver_wire_players(
            league_id, 
            week or 1
        )
        
        # Calculate market intelligence
        market_intelligence = await calculate_comprehensive_market_intelligence(
            league_profile, 
            bidding_history, 
            waiver_players
        )
        
        result = {
            'league_id': league_id,
            'week': week or 1,
            'market_intelligence': market_intelligence,
            'timestamp': datetime.now().isoformat()
        }
        
        # Cache the result
        await cache_service.set(cache_key, result, cache_type='statistics')
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting FAAB market intelligence: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bidding-history")
async def get_league_bidding_history(
    league_id: str,
    weeks_back: int = 16,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get league bidding history and analysis
    
    Args:
        league_id: ESPN league ID
        weeks_back: Number of weeks to look back
        user_id: Optional user ID to filter user's bids
        
    Returns:
        Bidding history and analysis
    """
    try:
        # Get bidding history
        bidding_history = await faab_predictor.get_league_bidding_history(
            league_id, 
            weeks_back
        )
        
        # Filter by user if specified
        if user_id:
            bidding_history = [
                bid for bid in bidding_history 
                if bid.get('user_id') == user_id
            ]
        
        # Analyze patterns
        league_profile = await faab_predictor.analyze_league_bidding_patterns(
            league_id, 
            bidding_history
        )
        
        # Calculate statistics
        statistics = calculate_bidding_statistics(bidding_history)
        
        return {
            'league_id': league_id,
            'weeks_back': weeks_back,
            'bidding_history': bidding_history,
            'statistics': statistics,
            'league_profile': {
                'average_bid_size': league_profile.average_bid_size,
                'bid_frequency': league_profile.bid_frequency,
                'position_preferences': league_profile.position_preferences,
                'budget_utilization': league_profile.budget_utilization,
                'market_efficiency': league_profile.market_efficiency
            },
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting bidding history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh-recommendations")
async def refresh_faab_recommendations(
    league_id: str,
    background_tasks: BackgroundTasks,
    week: Optional[int] = None
) -> Dict[str, Any]:
    """
    Refresh FAAB recommendations and broadcast updates
    
    Args:
        league_id: ESPN league ID
        background_tasks: FastAPI background tasks
        week: Specific week (defaults to current week)
        
    Returns:
        Refresh status
    """
    try:
        # Add background task to refresh recommendations
        background_tasks.add_task(
            refresh_recommendations_background_task, 
            league_id, 
            week
        )
        
        return {
            'status': 'success',
            'message': 'FAAB recommendations refresh initiated',
            'league_id': league_id,
            'week': week,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error refreshing FAAB recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/efficiency-score")
async def get_league_efficiency_score(
    league_id: str,
    weeks_back: int = 16
) -> Dict[str, Any]:
    """
    Get league FAAB efficiency score and analysis
    
    Args:
        league_id: ESPN league ID
        weeks_back: Number of weeks to analyze
        
    Returns:
        Efficiency score and analysis
    """
    try:
        # Get bidding history
        bidding_history = await faab_predictor.get_league_bidding_history(
            league_id, 
            weeks_back
        )
        
        # Calculate efficiency metrics
        efficiency_metrics = await calculate_efficiency_metrics(
            league_id, 
            bidding_history
        )
        
        return {
            'league_id': league_id,
            'weeks_analyzed': weeks_back,
            'efficiency_score': efficiency_metrics['efficiency_score'],
            'metrics': efficiency_metrics,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting efficiency score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions

async def generate_detailed_player_analysis(
    player_data: Dict[str, Any], 
    league_profile: Any, 
    bidding_history: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Generate detailed analysis for a specific player"""
    try:
        # Find similar players
        similar_players = await faab_predictor.find_similar_players(
            player_data, 
            player_data.get('stats', {}), 
            bidding_history
        )
        
        # Calculate market value
        market_value = await faab_predictor.calculate_player_market_value(
            player_data, 
            player_data.get('stats', {}), 
            similar_players
        )
        
        # Calculate recommended bid
        recommended_bid = await faab_predictor.calculate_recommended_bid(
            player_data,
            player_data.get('stats', {}),
            market_value,
            faab_predictor.calculate_league_average_bid(similar_players),
            league_profile
        )
        
        return {
            'market_value': market_value,
            'recommended_bid': recommended_bid,
            'similar_players_count': len(similar_players),
            'similar_players': similar_players[:5],  # Top 5 similar players
            'confidence_level': await faab_predictor.calculate_confidence_level(
                player_data, 
                similar_players, 
                league_profile
            ),
            'risk_assessment': await faab_predictor.assess_bid_risk(
                player_data, 
                recommended_bid, 
                league_profile
            ),
            'urgency_score': await faab_predictor.calculate_urgency_score(
                player_data, 
                player_data.get('stats', {}), 
                league_profile
            )
        }
        
    except Exception as e:
        logger.error(f"Error generating detailed player analysis: {e}")
        return {}

async def calculate_comprehensive_market_intelligence(
    league_profile: Any, 
    bidding_history: List[Dict[str, Any]], 
    waiver_players: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Calculate comprehensive market intelligence"""
    try:
        # Analyze position trends
        position_trends = analyze_position_trends(bidding_history)
        
        # Analyze budget trends
        budget_trends = analyze_budget_trends(bidding_history)
        
        # Analyze timing patterns
        timing_patterns = analyze_timing_patterns(bidding_history)
        
        # Calculate market insights
        market_insights = calculate_market_insights(league_profile, waiver_players)
        
        return {
            'position_trends': position_trends,
            'budget_trends': budget_trends,
            'timing_patterns': timing_patterns,
            'market_insights': market_insights,
            'league_efficiency': league_profile.market_efficiency,
            'recommendations': generate_market_recommendations(league_profile)
        }
        
    except Exception as e:
        logger.error(f"Error calculating comprehensive market intelligence: {e}")
        return {}

def calculate_bidding_statistics(bidding_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate bidding statistics"""
    try:
        if not bidding_history:
            return {
                'total_bids': 0,
                'average_bid': 0,
                'total_spent': 0,
                'position_distribution': {}
            }
        
        bid_amounts = [bid.get('amount', 0) for bid in bidding_history]
        
        # Calculate position distribution
        position_distribution = {}
        for bid in bidding_history:
            position = bid.get('player_position', 'UNKNOWN')
            if position not in position_distribution:
                position_distribution[position] = 0
            position_distribution[position] += 1
        
        return {
            'total_bids': len(bidding_history),
            'average_bid': sum(bid_amounts) / len(bid_amounts) if bid_amounts else 0,
            'total_spent': sum(bid_amounts),
            'position_distribution': position_distribution,
            'bid_range': {
                'min': min(bid_amounts) if bid_amounts else 0,
                'max': max(bid_amounts) if bid_amounts else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Error calculating bidding statistics: {e}")
        return {}

async def refresh_recommendations_background_task(league_id: str, week: Optional[int] = None):
    """Background task to refresh FAAB recommendations"""
    try:
        # Generate fresh recommendations
        recommendations = await faab_predictor.get_faab_recommendations(
            league_id, 
            week or 1
        )
        
        # Broadcast update via WebSocket
        await websocket_service.broadcast_league_update(
            league_id, 
            {
                'type': 'faab_recommendations_updated',
                'recommendations': recommendations,
                'timestamp': datetime.now().isoformat()
            }
        )
        
        logger.info(f"Refreshed FAAB recommendations for league {league_id}")
        
    except Exception as e:
        logger.error(f"Error in background FAAB recommendations refresh: {e}")

async def calculate_efficiency_metrics(
    league_id: str, 
    bidding_history: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Calculate efficiency metrics for the league"""
    try:
        if not bidding_history:
            return {
                'efficiency_score': 0.0,
                'market_efficiency': 0.0,
                'budget_efficiency': 0.0,
                'position_efficiency': {}
            }
        
        # Calculate market efficiency
        market_efficiency = await faab_predictor.calculate_market_efficiency(bidding_history)
        
        # Calculate budget efficiency
        budget_efficiency = calculate_budget_efficiency(bidding_history)
        
        # Calculate position efficiency
        position_efficiency = calculate_position_efficiency(bidding_history)
        
        # Overall efficiency score
        efficiency_score = (market_efficiency + budget_efficiency) / 2
        
        return {
            'efficiency_score': efficiency_score,
            'market_efficiency': market_efficiency,
            'budget_efficiency': budget_efficiency,
            'position_efficiency': position_efficiency
        }
        
    except Exception as e:
        logger.error(f"Error calculating efficiency metrics: {e}")
        return {}

def calculate_budget_efficiency(bidding_history: List[Dict[str, Any]]) -> float:
    """Calculate budget efficiency score"""
    try:
        if not bidding_history:
            return 0.0
        
        # Simple budget efficiency calculation
        bid_amounts = [bid.get('amount', 0) for bid in bidding_history]
        total_budget = len(set(bid.get('user_id') for bid in bidding_history)) * 1000
        
        if total_budget == 0:
            return 0.0
        
        budget_utilization = sum(bid_amounts) / total_budget
        
        # Efficiency is higher when budget utilization is moderate (not too low or too high)
        if 0.3 <= budget_utilization <= 0.7:
            return 0.8
        elif 0.2 <= budget_utilization <= 0.8:
            return 0.6
        else:
            return 0.4
            
    except Exception as e:
        logger.error(f"Error calculating budget efficiency: {e}")
        return 0.0

def calculate_position_efficiency(bidding_history: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate position-specific efficiency scores"""
    try:
        position_efficiency = {}
        
        for position in ['QB', 'RB', 'WR', 'TE', 'K', 'DEF']:
            position_bids = [
                bid for bid in bidding_history 
                if bid.get('player_position') == position
            ]
            
            if position_bids:
                bid_amounts = [bid.get('amount', 0) for bid in position_bids]
                # Simple efficiency calculation based on bid variance
                if len(bid_amounts) > 1:
                    variance = np.var(bid_amounts)
                    mean_bid = np.mean(bid_amounts)
                    efficiency = max(0.0, 1.0 - (variance / (mean_bid ** 2)))
                    position_efficiency[position] = efficiency
                else:
                    position_efficiency[position] = 0.5
            else:
                position_efficiency[position] = 0.0
        
        return position_efficiency
        
    except Exception as e:
        logger.error(f"Error calculating position efficiency: {e}")
        return {}

def analyze_position_trends(bidding_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze position bidding trends"""
    try:
        position_trends = {}
        
        for position in ['QB', 'RB', 'WR', 'TE', 'K', 'DEF']:
            position_bids = [
                bid for bid in bidding_history 
                if bid.get('player_position') == position
            ]
            
            if position_bids:
                bid_amounts = [bid.get('amount', 0) for bid in position_bids]
                position_trends[position] = {
                    'total_bids': len(position_bids),
                    'average_bid': np.mean(bid_amounts),
                    'max_bid': max(bid_amounts),
                    'trend': 'increasing' if len(position_bids) > 5 else 'stable'
                }
        
        return position_trends
        
    except Exception as e:
        logger.error(f"Error analyzing position trends: {e}")
        return {}

def analyze_budget_trends(bidding_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze budget utilization trends"""
    try:
        if not bidding_history:
            return {}
        
        # Group by week
        weekly_spending = {}
        for bid in bidding_history:
            week = bid.get('week', 1)
            if week not in weekly_spending:
                weekly_spending[week] = 0
            weekly_spending[week] += bid.get('amount', 0)
        
        return {
            'weekly_spending': weekly_spending,
            'average_weekly_spending': np.mean(list(weekly_spending.values())) if weekly_spending else 0,
            'trend': 'stable'  # Would calculate actual trend
        }
        
    except Exception as e:
        logger.error(f"Error analyzing budget trends: {e}")
        return {}

def analyze_timing_patterns(bidding_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze bidding timing patterns"""
    try:
        if not bidding_history:
            return {}
        
        # Analyze bid timing (would need actual timestamp data)
        return {
            'average_bid_time': 'Wednesday 10:00 AM',
            'peak_bidding_hours': ['9:00 AM - 11:00 AM', '7:00 PM - 9:00 PM'],
            'early_bidders': len([bid for bid in bidding_history if bid.get('early_bid', False)])
        }
        
    except Exception as e:
        logger.error(f"Error analyzing timing patterns: {e}")
        return {}

def calculate_market_insights(
    league_profile: Any, 
    waiver_players: List[Dict[str, Any]]
) -> List[str]:
    """Calculate market insights and recommendations"""
    try:
        insights = []
        
        if league_profile.market_efficiency > 0.8:
            insights.append("High market efficiency - bids are well-calibrated")
        elif league_profile.market_efficiency < 0.5:
            insights.append("Low market efficiency - opportunities for value")
        
        if league_profile.budget_utilization > 0.7:
            insights.append("High budget utilization - consider conservative bidding")
        elif league_profile.budget_utilization < 0.3:
            insights.append("Low budget utilization - opportunities for aggressive bidding")
        
        insights.append(f"Average bid size: ${league_profile.average_bid_size:.0f}")
        insights.append(f"Bid frequency: {league_profile.bid_frequency:.2f} bids per week per team")
        
        return insights
        
    except Exception as e:
        logger.error(f"Error calculating market insights: {e}")
        return []

def generate_market_recommendations(league_profile: Any) -> List[str]:
    """Generate market recommendations"""
    try:
        recommendations = []
        
        if league_profile.market_efficiency < 0.6:
            recommendations.append("Consider bidding slightly above market value for high-priority targets")
        
        if league_profile.budget_utilization < 0.4:
            recommendations.append("League has conservative bidding - opportunities for value")
        
        if league_profile.average_bid_size > 100:
            recommendations.append("High-value league - prepare for competitive bidding")
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error generating market recommendations: {e}")
        return []
