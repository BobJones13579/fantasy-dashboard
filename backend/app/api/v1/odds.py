from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from app.services.odds_service import OddsService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get odds service
def get_odds_service() -> OddsService:
    return OddsService()

@router.get("/matchups", response_model=List[Dict[str, Any]])
def get_matchup_odds(
    week: Optional[int] = Query(None, description="Week number (defaults to current week)"),
    odds_service: OddsService = Depends(get_odds_service)
):
    """Get odds for all matchups in a given week"""
    try:
        if week:
            odds_data = odds_service.get_odds_for_week(week)
        else:
            odds_data = odds_service.get_current_odds()
        
        if not odds_data:
            raise HTTPException(
                status_code=404,
                detail=f"No odds data found for week {week or 'current'}. Make sure the league is configured and the week has matchups."
            )
        
        return odds_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting matchup odds: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving matchup odds: {str(e)}"
        )

@router.get("/matchups/{week}", response_model=List[Dict[str, Any]])
def get_matchup_odds_for_week(
    week: int,
    odds_service: OddsService = Depends(get_odds_service)
):
    """Get odds for all matchups in a specific week"""
    try:
        odds_data = odds_service.get_odds_for_week(week)
        
        if not odds_data:
            raise HTTPException(
                status_code=404,
                detail=f"No odds data found for week {week}. Make sure the league is configured and the week has matchups."
            )
        
        return odds_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting matchup odds for week {week}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving matchup odds for week {week}: {str(e)}"
        )

@router.post("/update")
def update_odds(
    week: Optional[int] = Query(None, description="Week number to update (defaults to current week)"),
    odds_service: OddsService = Depends(get_odds_service)
):
    """Update odds for a specific week or current week"""
    try:
        success = odds_service.update_odds(week)
        
        if success:
            return {
                "success": True,
                "message": f"Odds updated successfully for week {week or 'current'}",
                "week": week
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to update odds for week {week or 'current'}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating odds: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error updating odds: {str(e)}"
        )

@router.get("/test")
def test_odds_calculation(odds_service: OddsService = Depends(get_odds_service)):
    """Test the odds calculation system"""
    try:
        # Test with week 1 (should have data)
        test_odds = odds_service.get_odds_for_week(1)
        
        if test_odds:
            return {
                "success": True,
                "message": "Odds calculation system is working",
                "test_week": 1,
                "matchups_found": len(test_odds),
                "sample_odds": test_odds[0] if test_odds else None
            }
        else:
            return {
                "success": False,
                "message": "No odds data found for test week 1",
                "test_week": 1,
                "matchups_found": 0
            }
        
    except Exception as e:
        logger.error(f"Error testing odds calculation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing odds calculation: {str(e)}"
        )

@router.get("/monte-carlo/test", response_model=Dict[str, Any])
def test_monte_carlo_system(odds_service: OddsService = Depends(get_odds_service)):
    """Test the Monte Carlo simulation system"""
    try:
        return odds_service.monte_carlo.test_simulation()
    except Exception as e:
        logger.error(f"Error testing Monte Carlo system: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing Monte Carlo system: {str(e)}"
        )

@router.post("/monte-carlo/advanced", response_model=Dict[str, Any])
def calculate_advanced_odds(
    team1_stats: Dict[str, Any],
    team2_stats: Dict[str, Any],
    odds_service: OddsService = Depends(get_odds_service)
):
    """Calculate advanced odds using Monte Carlo simulation"""
    try:
        return odds_service.calculate_advanced_odds(team1_stats, team2_stats)
    except Exception as e:
        logger.error(f"Error calculating advanced odds: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating advanced odds: {str(e)}"
        )
