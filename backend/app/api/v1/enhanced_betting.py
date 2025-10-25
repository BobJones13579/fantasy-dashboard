"""
Enhanced Betting Interface API
Provides comprehensive betting interface with real-time updates, token management, and betting analytics
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import asyncio
import logging

from app.services.token_service import TokenService
from app.services.websocket_service import websocket_service
from app.services.cache_service import cache_service
from app.models.bet import BetType, BetStatus, BetCreate, BetInDB
from app.services.odds_api_service import OddsAPIService
from app.services.monte_carlo import MonteCarloSimulator

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
token_service = TokenService()
odds_api = OddsAPIService()
monte_carlo = MonteCarloSimulator()

@router.post("/place-bet")
async def place_bet(
    bet_data: Dict[str, Any],
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Place a new bet with validation and real-time updates
    
    Args:
        bet_data: Bet details including user_id, matchup_id, selection, amount, type
        
    Returns:
        Bet confirmation and details
    """
    try:
        # Validate bet data
        validation_result = await validate_bet(bet_data)
        if not validation_result['valid']:
            raise HTTPException(status_code=400, detail=validation_result['error'])
        
        # Check token balance
        user_id = bet_data['user_id']
        bet_amount = bet_data['amount']
        
        current_balance = await token_service.get_token_balance(user_id)
        if current_balance < bet_amount:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient tokens. Balance: {current_balance}, Required: {bet_amount}"
            )
        
        # Create bet record
        bet = BetInDB(
            id=generate_bet_id(),
            user_id=user_id,
            matchup_id=bet_data['matchup_id'],
            selection=bet_data['selection'],
            amount=bet_amount,
            odds=bet_data['odds'],
            bet_type=BetType(bet_data['type']),
            status=BetStatus.PENDING,
            created_at=datetime.now(),
            potential_payout=calculate_potential_payout(bet_amount, bet_data['odds'])
        )
        
        # Deduct tokens
        await token_service.deduct_tokens(user_id, bet_amount)
        
        # Save bet to database (would be implemented with actual database)
        await save_bet(bet)
        
        # Broadcast bet update via WebSocket
        await websocket_service.broadcast_bet_update(
            bet_data.get('league_id', 'default'),
            {
                'bet_id': bet.id,
                'user_id': user_id,
                'matchup_id': bet_data['matchup_id'],
                'selection': bet_data['selection'],
                'amount': bet_amount,
                'timestamp': datetime.now().isoformat()
            }
        )
        
        # Add background task for bet processing
        background_tasks.add_task(process_bet_background, bet)
        
        return {
            'status': 'success',
            'message': 'Bet placed successfully',
            'bet': {
                'id': bet.id,
                'user_id': user_id,
                'matchup_id': bet_data['matchup_id'],
                'selection': bet_data['selection'],
                'amount': bet_amount,
                'odds': bet_data['odds'],
                'potential_payout': bet.potential_payout,
                'status': bet.status.value,
                'created_at': bet.created_at.isoformat()
            },
            'remaining_balance': current_balance - bet_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error placing bet: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user-bets/{user_id}")
async def get_user_bets(
    user_id: str,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> Dict[str, Any]:
    """
    Get user's betting history
    
    Args:
        user_id: User identifier
        status: Filter by bet status (pending, won, lost, cancelled)
        limit: Maximum number of bets to return
        offset: Number of bets to skip
        
    Returns:
        User's betting history with pagination
    """
    try:
        # Get user bets from cache or database
        cache_key = f"user_bets:{user_id}:status:{status or 'all'}:limit:{limit}:offset:{offset}"
        cached_bets = await cache_service.get(cache_key)
        
        if cached_bets:
            return cached_bets
        
        # Fetch bets from database (would be implemented with actual database)
        bets = await fetch_user_bets(user_id, status, limit, offset)
        
        # Calculate betting statistics
        stats = await calculate_betting_stats(user_id, bets)
        
        result = {
            'user_id': user_id,
            'bets': bets,
            'statistics': stats,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'total': len(bets)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        # Cache the result
        await cache_service.set(cache_key, result, cache_type='user_data')
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting user bets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/betting-analytics/{user_id}")
async def get_betting_analytics(
    user_id: str,
    period: str = "30d"
) -> Dict[str, Any]:
    """
    Get comprehensive betting analytics for a user
    
    Args:
        user_id: User identifier
        period: Time period for analysis (7d, 30d, 90d, 1y)
        
    Returns:
        Detailed betting analytics and performance metrics
    """
    try:
        cache_key = f"betting_analytics:{user_id}:period:{period}"
        cached_analytics = await cache_service.get(cache_key)
        
        if cached_analytics:
            return cached_analytics
        
        # Get user's betting history for the period
        bets = await fetch_user_bets_by_period(user_id, period)
        
        # Calculate comprehensive analytics
        analytics = await calculate_comprehensive_analytics(user_id, bets)
        
        # Cache the result
        await cache_service.set(cache_key, analytics, cache_type='statistics')
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error getting betting analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/live-betting-opportunities")
async def get_live_betting_opportunities(
    league_id: str,
    user_id: str
) -> Dict[str, Any]:
    """
    Get live betting opportunities with real-time odds and recommendations
    
    Args:
        league_id: ESPN league ID
        user_id: User identifier
        
    Returns:
        Live betting opportunities with odds and recommendations
    """
    try:
        # Get current matchups and odds
        matchups = await get_current_matchups(league_id)
        odds_data = await odds_api.get_nfl_odds(['h2h', 'spreads', 'totals'])
        
        # Get user's betting history for context
        user_bets = await fetch_user_bets(user_id, limit=10)
        
        # Calculate betting opportunities
        opportunities = await calculate_betting_opportunities(
            matchups, 
            odds_data, 
            user_bets
        )
        
        return {
            'league_id': league_id,
            'user_id': user_id,
            'opportunities': opportunities,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting live betting opportunities: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cancel-bet/{bet_id}")
async def cancel_bet(
    bet_id: str,
    user_id: str
) -> Dict[str, Any]:
    """
    Cancel a pending bet
    
    Args:
        bet_id: Bet identifier
        user_id: User identifier
        
    Returns:
        Cancellation confirmation
    """
    try:
        # Get bet details
        bet = await fetch_bet_by_id(bet_id)
        
        if not bet:
            raise HTTPException(status_code=404, detail="Bet not found")
        
        if bet.user_id != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        if bet.status != BetStatus.PENDING:
            raise HTTPException(status_code=400, detail="Cannot cancel non-pending bet")
        
        # Check if bet is still cancellable (e.g., before game starts)
        if not is_bet_cancellable(bet):
            raise HTTPException(status_code=400, detail="Bet is no longer cancellable")
        
        # Cancel the bet
        bet.status = BetStatus.CANCELLED
        bet.cancelled_at = datetime.now()
        
        # Refund tokens
        await token_service.add_tokens(user_id, bet.amount)
        
        # Update bet in database
        await update_bet(bet)
        
        # Broadcast update
        await websocket_service.broadcast_bet_update(
            bet.league_id or 'default',
            {
                'bet_id': bet.id,
                'user_id': user_id,
                'status': 'cancelled',
                'timestamp': datetime.now().isoformat()
            }
        )
        
        return {
            'status': 'success',
            'message': 'Bet cancelled successfully',
            'bet_id': bet_id,
            'refunded_amount': bet.amount,
            'timestamp': datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling bet: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/betting-leaderboard")
async def get_betting_leaderboard(
    league_id: str,
    period: str = "season"
) -> Dict[str, Any]:
    """
    Get betting leaderboard for the league
    
    Args:
        league_id: ESPN league ID
        period: Time period (week, month, season)
        
    Returns:
        League betting leaderboard
    """
    try:
        cache_key = f"betting_leaderboard:{league_id}:period:{period}"
        cached_leaderboard = await cache_service.get(cache_key)
        
        if cached_leaderboard:
            return cached_leaderboard
        
        # Get all league members' betting data
        league_members = await get_league_members(league_id)
        leaderboard_data = []
        
        for member in league_members:
            member_stats = await calculate_member_betting_stats(member['id'], period)
            leaderboard_data.append({
                'user_id': member['id'],
                'username': member['username'],
                'total_bets': member_stats['total_bets'],
                'win_rate': member_stats['win_rate'],
                'total_winnings': member_stats['total_winnings'],
                'roi': member_stats['roi'],
                'rank': 0  # Will be calculated after sorting
            })
        
        # Sort by ROI and assign ranks
        leaderboard_data.sort(key=lambda x: x['roi'], reverse=True)
        for i, member in enumerate(leaderboard_data):
            member['rank'] = i + 1
        
        result = {
            'league_id': league_id,
            'period': period,
            'leaderboard': leaderboard_data,
            'timestamp': datetime.now().isoformat()
        }
        
        # Cache the result
        await cache_service.set(cache_key, result, cache_type='statistics')
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting betting leaderboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions

async def validate_bet(bet_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate bet data"""
    try:
        required_fields = ['user_id', 'matchup_id', 'selection', 'amount', 'odds', 'type']
        
        for field in required_fields:
            if field not in bet_data:
                return {'valid': False, 'error': f'Missing required field: {field}'}
        
        # Validate bet amount
        if bet_data['amount'] <= 0:
            return {'valid': False, 'error': 'Bet amount must be positive'}
        
        if bet_data['amount'] > 1000:  # Maximum bet limit
            return {'valid': False, 'error': 'Bet amount exceeds maximum limit'}
        
        # Validate bet type
        try:
            BetType(bet_data['type'])
        except ValueError:
            return {'valid': False, 'error': 'Invalid bet type'}
        
        return {'valid': True}
        
    except Exception as e:
        logger.error(f"Error validating bet: {e}")
        return {'valid': False, 'error': 'Validation error'}

def generate_bet_id() -> str:
    """Generate unique bet ID"""
    import uuid
    return str(uuid.uuid4())

def calculate_potential_payout(amount: int, odds: int) -> int:
    """Calculate potential payout based on odds"""
    if odds > 0:
        return int(amount * (odds / 100 + 1))
    else:
        return int(amount * (100 / abs(odds) + 1))

async def save_bet(bet: BetInDB) -> None:
    """Save bet to database"""
    # This would be implemented with actual database operations
    logger.info(f"Saving bet: {bet.id}")

async def process_bet_background(bet: BetInDB) -> None:
    """Background task to process bet"""
    try:
        # This would include bet processing logic
        logger.info(f"Processing bet: {bet.id}")
        
        # Simulate bet processing
        await asyncio.sleep(1)
        
    except Exception as e:
        logger.error(f"Error processing bet {bet.id}: {e}")

async def fetch_user_bets(user_id: str, status: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Fetch user bets from database"""
    # This would be implemented with actual database queries
    return []

async def calculate_betting_stats(user_id: str, bets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate betting statistics"""
    if not bets:
        return {
            'total_bets': 0,
            'win_rate': 0.0,
            'total_winnings': 0,
            'roi': 0.0
        }
    
    total_bets = len(bets)
    won_bets = sum(1 for bet in bets if bet.get('status') == 'won')
    total_winnings = sum(bet.get('payout', 0) for bet in bets if bet.get('status') == 'won')
    total_amount = sum(bet.get('amount', 0) for bet in bets)
    
    return {
        'total_bets': total_bets,
        'win_rate': won_bets / total_bets if total_bets > 0 else 0.0,
        'total_winnings': total_winnings,
        'roi': (total_winnings - total_amount) / total_amount if total_amount > 0 else 0.0
    }

async def fetch_user_bets_by_period(user_id: str, period: str) -> List[Dict[str, Any]]:
    """Fetch user bets for a specific period"""
    # This would be implemented with actual database queries
    return []

async def calculate_comprehensive_analytics(user_id: str, bets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate comprehensive betting analytics"""
    return {
        'user_id': user_id,
        'period_stats': {},
        'performance_metrics': {},
        'recommendations': []
    }

async def get_current_matchups(league_id: str) -> List[Dict[str, Any]]:
    """Get current matchups for the league"""
    # This would fetch from ESPN API
    return []

async def calculate_betting_opportunities(
    matchups: List[Dict[str, Any]], 
    odds_data: List[Any], 
    user_bets: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """Calculate betting opportunities based on current data"""
    return []

async def fetch_bet_by_id(bet_id: str) -> Optional[BetInDB]:
    """Fetch bet by ID"""
    # This would be implemented with actual database queries
    return None

def is_bet_cancellable(bet: BetInDB) -> bool:
    """Check if bet is still cancellable"""
    # This would check if the game has started, etc.
    return True

async def update_bet(bet: BetInDB) -> None:
    """Update bet in database"""
    # This would be implemented with actual database operations
    logger.info(f"Updating bet: {bet.id}")

async def get_league_members(league_id: str) -> List[Dict[str, Any]]:
    """Get league members"""
    # This would fetch from ESPN API
    return []

async def calculate_member_betting_stats(user_id: str, period: str) -> Dict[str, Any]:
    """Calculate betting stats for a league member"""
    return {
        'total_bets': 0,
        'win_rate': 0.0,
        'total_winnings': 0,
        'roi': 0.0
    }
