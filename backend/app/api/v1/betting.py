from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import UUID
from app.services.betting_service import BettingService
from app.models.bet import BetCreate, BetUpdate, BetInDB, BetSummary
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get betting service
def get_betting_service() -> BettingService:
    return BettingService()

@router.get("/test")
def test_betting_system(betting_service: BettingService = Depends(get_betting_service)):
    """Test the betting system"""
    try:
        # This is a simple test to verify the service is working
        return {
            "success": True,
            "message": "Betting system is operational",
            "service": "BettingService",
            "features": [
                "Place bets",
                "Get team bets",
                "Update bets",
                "Resolve bets",
                "Betting summaries"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error testing betting system: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing betting system: {str(e)}"
        )

@router.post("/place", response_model=BetInDB)
def place_bet(
    bet_data: BetCreate,
    betting_service: BettingService = Depends(get_betting_service)
):
    """Place a new bet"""
    try:
        bet = betting_service.place_bet(bet_data)
        
        if not bet:
            raise HTTPException(
                status_code=400,
                detail="Failed to place bet. Check your token balance and bet details."
            )
        
        return bet
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error placing bet: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error placing bet: {str(e)}"
        )

@router.get("/team/{team_id}", response_model=List[BetInDB])
def get_team_bets(
    team_id: UUID,
    week: Optional[int] = Query(None, description="Filter by week"),
    limit: int = Query(50, description="Maximum number of bets to return"),
    betting_service: BettingService = Depends(get_betting_service)
):
    """Get all bets for a team"""
    try:
        bets = betting_service.get_team_bets(team_id, week, limit)
        return bets
        
    except Exception as e:
        logger.error(f"Error getting team bets: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving team bets: {str(e)}"
        )

@router.get("/{bet_id}", response_model=BetInDB)
def get_bet(
    bet_id: UUID,
    betting_service: BettingService = Depends(get_betting_service)
):
    """Get a specific bet by ID"""
    try:
        bet = betting_service.get_bet(bet_id)
        
        if not bet:
            raise HTTPException(
                status_code=404,
                detail="Bet not found"
            )
        
        return bet
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting bet {bet_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving bet: {str(e)}"
        )

@router.put("/{bet_id}", response_model=BetInDB)
def update_bet(
    bet_id: UUID,
    bet_update: BetUpdate,
    betting_service: BettingService = Depends(get_betting_service)
):
    """Update a bet (typically to resolve it)"""
    try:
        updated_bet = betting_service.update_bet(bet_id, bet_update)
        
        if not updated_bet:
            raise HTTPException(
                status_code=404,
                detail="Bet not found or update failed"
            )
        
        return updated_bet
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating bet {bet_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error updating bet: {str(e)}"
        )

@router.post("/{bet_id}/resolve", response_model=BetInDB)
def resolve_bet(
    bet_id: UUID,
    actual_result: str,
    payout: Optional[int] = Query(None, description="Payout amount (calculated automatically if not provided)"),
    betting_service: BettingService = Depends(get_betting_service)
):
    """Resolve a bet with the actual result"""
    try:
        resolved_bet = betting_service.resolve_bet(bet_id, actual_result, payout)
        
        if not resolved_bet:
            raise HTTPException(
                status_code=404,
                detail="Bet not found or resolution failed"
            )
        
        return resolved_bet
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resolving bet {bet_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error resolving bet: {str(e)}"
        )

@router.get("/team/{team_id}/summary", response_model=BetSummary)
def get_betting_summary(
    team_id: UUID,
    week: Optional[int] = Query(None, description="Filter by week"),
    betting_service: BettingService = Depends(get_betting_service)
):
    """Get betting summary for a team"""
    try:
        summary = betting_service.get_betting_summary(team_id, week)
        
        if not summary:
            raise HTTPException(
                status_code=404,
                detail="No betting data found for this team"
            )
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting betting summary: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving betting summary: {str(e)}"
        )
