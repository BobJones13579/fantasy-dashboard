from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from app.services.trade_service import TradeService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get trade service
def get_trade_service() -> TradeService:
    return TradeService()

@router.get("/", response_model=List[Dict[str, Any]])
def get_league_trades(
    week: Optional[int] = Query(None, description="Filter by week number"),
    trade_service: TradeService = Depends(get_trade_service)
):
    """Get all trades in the league"""
    try:
        trades = trade_service.get_league_trades(week)
        
        if not trades:
            raise HTTPException(
                status_code=404,
                detail=f"No trades found{' for week ' + str(week) if week else ''}. Make sure the league is configured and has trade data."
            )
        
        return trades
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting league trades: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving league trades: {str(e)}"
        )

@router.get("/tree", response_model=Dict[str, Any])
def get_trade_tree(
    team_id: Optional[int] = Query(None, description="Filter by team ID"),
    trade_service: TradeService = Depends(get_trade_service)
):
    """Get trade tree visualization data"""
    try:
        tree_data = trade_service.get_trade_tree(team_id)
        
        if tree_data["total_trades"] == 0:
            raise HTTPException(
                status_code=404,
                detail="No trade data available for tree visualization. Make sure the league has trade history."
            )
        
        return tree_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting trade tree: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving trade tree: {str(e)}"
        )

@router.get("/analytics", response_model=Dict[str, Any])
def get_trade_analytics(
    trade_service: TradeService = Depends(get_trade_service)
):
    """Get comprehensive trade analytics"""
    try:
        analytics = trade_service.get_trade_analytics()
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error getting trade analytics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving trade analytics: {str(e)}"
        )

@router.get("/team/{team_id}", response_model=List[Dict[str, Any]])
def get_team_trades(
    team_id: int,
    week: Optional[int] = Query(None, description="Filter by week number"),
    trade_service: TradeService = Depends(get_trade_service)
):
    """Get trades for a specific team"""
    try:
        all_trades = trade_service.get_league_trades(week)
        
        # Filter trades involving the specified team
        team_trades = []
        for trade in all_trades:
            if any(team["team_id"] == team_id for team in trade["teams_involved"]):
                team_trades.append(trade)
        
        if not team_trades:
            raise HTTPException(
                status_code=404,
                detail=f"No trades found for team {team_id}{' in week ' + str(week) if week else ''}."
            )
        
        return team_trades
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting team trades: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving team trades: {str(e)}"
        )

@router.get("/test")
def test_trade_system(trade_service: TradeService = Depends(get_trade_service)):
    """Test the trade system"""
    try:
        # Test getting trades
        trades = trade_service.get_league_trades()
        trades_count = len(trades)
        
        # Test trade tree
        tree_data = trade_service.get_trade_tree()
        tree_trades = tree_data["total_trades"]
        
        # Test analytics
        analytics = trade_service.get_trade_analytics()
        analytics_trades = analytics["total_trades"]
        
        return {
            "success": True,
            "message": "Trade system is operational",
            "service": "TradeService",
            "test_results": {
                "league_trades": trades_count,
                "tree_trades": tree_trades,
                "analytics_trades": analytics_trades
            },
            "features": [
                "League trade history",
                "Trade tree visualization",
                "Trade analytics and insights",
                "Team-specific trade analysis",
                "Trade value calculations"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error testing trade system: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing trade system: {str(e)}"
        )
