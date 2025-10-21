from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from pydantic import BaseModel
from app.services.espn_service import ESPNService

router = APIRouter()

# Dependency to get ESPN service
def get_espn_service() -> ESPNService:
    return ESPNService()

# Request models
class LeagueConfigRequest(BaseModel):
    league_id: int
    year: int
    espn_s2: Optional[str] = None
    swid: Optional[str] = None

class WeekRequest(BaseModel):
    week: Optional[int] = None

class ActivityRequest(BaseModel):
    size: int = 25
    msg_type: Optional[str] = None

@router.post("/configure")
async def configure_league(
    config: LeagueConfigRequest,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Configure ESPN league connection"""
    success = espn_service.configure_league(
        league_id=config.league_id,
        year=config.year,
        espn_s2=config.espn_s2,
        swid=config.swid
    )
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to connect to ESPN league")
    
    return {"message": "ESPN league configured successfully", "league_id": config.league_id, "year": config.year}

@router.get("/test-connection")
async def test_connection(espn_service: ESPNService = Depends(get_espn_service)):
    """Test ESPN API connection"""
    success = espn_service.test_connection()
    
    if not success:
        raise HTTPException(status_code=400, detail="ESPN connection test failed")
    
    return {"message": "ESPN connection successful"}

@router.get("/league-info")
async def get_league_info(espn_service: ESPNService = Depends(get_espn_service)):
    """Get basic league information"""
    info = espn_service.get_league_info()
    
    if not info:
        raise HTTPException(status_code=404, detail="League not configured or connection failed")
    
    return info

@router.get("/teams")
async def get_teams(espn_service: ESPNService = Depends(get_espn_service)):
    """Get all teams in the league"""
    teams = espn_service.get_teams()
    
    if not teams:
        raise HTTPException(status_code=404, detail="No teams found or league not configured")
    
    return {"teams": teams, "count": len(teams)}

@router.get("/matchups")
async def get_matchups(
    week: Optional[int] = None,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Get matchups for a specific week or current week"""
    matchups = espn_service.get_matchups(week)
    
    if not matchups:
        raise HTTPException(status_code=404, detail="No matchups found or league not configured")
    
    return {"matchups": matchups, "week": week, "count": len(matchups)}

@router.get("/box-scores/{week}")
async def get_box_scores(
    week: int,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Get detailed box scores for a specific week"""
    box_scores = espn_service.get_box_scores(week)
    
    if not box_scores:
        raise HTTPException(status_code=404, detail="No box scores found or league not configured")
    
    return {"box_scores": box_scores, "week": week, "count": len(box_scores)}

@router.get("/standings")
async def get_standings(espn_service: ESPNService = Depends(get_espn_service)):
    """Get current league standings"""
    standings = espn_service.get_standings()
    
    if not standings:
        raise HTTPException(status_code=404, detail="No standings found or league not configured")
    
    return {"standings": standings, "count": len(standings)}

@router.get("/power-rankings")
async def get_power_rankings(
    week: Optional[int] = None,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Get power rankings for a specific week"""
    rankings = espn_service.get_power_rankings(week)
    
    if not rankings:
        raise HTTPException(status_code=404, detail="No power rankings found or league not configured")
    
    return {"power_rankings": rankings, "week": week, "count": len(rankings)}

@router.get("/recent-activity")
async def get_recent_activity(
    size: int = 25,
    msg_type: Optional[str] = None,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Get recent league activity"""
    activities = espn_service.get_recent_activity(size=size, msg_type=msg_type)
    
    if not activities:
        raise HTTPException(status_code=404, detail="No recent activity found or league not configured")
    
    return {"activities": activities, "count": len(activities)}

@router.get("/teams/{team_id}/roster")
async def get_team_roster(
    team_id: int,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Get roster for a specific team"""
    roster = espn_service.get_team_roster(team_id)
    
    if not roster:
        raise HTTPException(status_code=404, detail="Team not found or no roster data available")
    
    return {"team_id": team_id, "roster": roster, "count": len(roster)}
