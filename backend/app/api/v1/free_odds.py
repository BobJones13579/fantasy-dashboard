"""
Free Odds API - Provides odds data using multiple free services
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
import logging

from app.services.free_odds_service import free_odds_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/nfl-odds")
async def get_free_nfl_odds(week: Optional[int] = None) -> Dict[str, Any]:
    """
    Get NFL odds using free services
    Combines TheSportsDB, API-American-Football, and The Odds API free tiers
    """
    try:
        odds_data = await free_odds_service.get_nfl_odds(week)
        return {
            "success": True,
            "odds_data": odds_data,
            "message": f"Retrieved odds from {odds_data.get('source', 'unknown')} service"
        }
    except Exception as e:
        logger.error(f"Error getting free NFL odds: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/usage-stats")
async def get_free_api_usage_stats() -> Dict[str, Any]:
    """
    Get usage statistics for all free APIs
    """
    try:
        stats = await free_odds_service.get_usage_stats()
        return {
            "success": True,
            "usage_stats": stats,
            "message": "Free API usage statistics retrieved"
        }
    except Exception as e:
        logger.error(f"Error getting usage stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-services")
async def test_free_services() -> Dict[str, Any]:
    """
    Test all free services to see which ones are working
    """
    try:
        test_results = await free_odds_service.test_all_services()
        return {
            "success": True,
            "test_results": test_results,
            "message": "Free services test completed"
        }
    except Exception as e:
        logger.error(f"Error testing free services: {e}")
        raise HTTPException(status_code=500, detail=str(e))
