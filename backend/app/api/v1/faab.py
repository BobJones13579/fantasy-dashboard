from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from app.services.faab_service import FAABService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get FAAB service
def get_faab_service() -> FAABService:
    return FAABService()

@router.get("/waiver-wire", response_model=List[Dict[str, Any]])
def get_waiver_wire_players(
    week: Optional[int] = Query(None, description="Week number (defaults to current week)"),
    faab_service: FAABService = Depends(get_faab_service)
):
    """Get available waiver wire players"""
    try:
        players = faab_service.get_waiver_wire_players(week)
        
        if not players:
            raise HTTPException(
                status_code=404,
                detail=f"No waiver wire players found for week {week or 'current'}. Make sure the league is configured."
            )
        
        return players
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting waiver wire players: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving waiver wire players: {str(e)}"
        )

@router.get("/recommendations", response_model=List[Dict[str, Any]])
def get_faab_recommendations(
    week: Optional[int] = Query(None, description="Week number (defaults to current week)"),
    faab_service: FAABService = Depends(get_faab_service)
):
    """Get FAAB bid recommendations for available players"""
    try:
        recommendations = faab_service.calculate_faab_recommendations(week)
        
        if not recommendations:
            raise HTTPException(
                status_code=404,
                detail=f"No FAAB recommendations available for week {week or 'current'}. Make sure the league is configured and has waiver wire players."
            )
        
        return recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting FAAB recommendations: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving FAAB recommendations: {str(e)}"
        )

@router.get("/market-analysis", response_model=Dict[str, Any])
def get_faab_market_analysis(
    week: Optional[int] = Query(None, description="Week number (defaults to current week)"),
    faab_service: FAABService = Depends(get_faab_service)
):
    """Get overall FAAB market analysis"""
    try:
        analysis = faab_service.get_faab_market_analysis(week)
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error getting FAAB market analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving FAAB market analysis: {str(e)}"
        )

@router.get("/test")
def test_faab_system(faab_service: FAABService = Depends(get_faab_service)):
    """Test the FAAB system"""
    try:
        # Test waiver wire players
        players = faab_service.get_waiver_wire_players()
        players_count = len(players)
        
        # Test recommendations
        recommendations = faab_service.calculate_faab_recommendations()
        recommendations_count = len(recommendations)
        
        # Test market analysis
        market_analysis = faab_service.get_faab_market_analysis()
        
        return {
            "success": True,
            "message": "FAAB system is operational",
            "service": "FAABService",
            "test_results": {
                "waiver_wire_players": players_count,
                "recommendations": recommendations_count,
                "market_analysis": market_analysis.get("total_players", 0)
            },
            "features": [
                "Waiver wire player analysis",
                "FAAB bid recommendations",
                "Market analysis and insights",
                "Position scarcity calculations"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error testing FAAB system: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing FAAB system: {str(e)}"
        )
