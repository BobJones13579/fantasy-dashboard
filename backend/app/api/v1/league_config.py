from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel
from app.services.espn_service import ESPNService
from app.core.database import get_supabase
from uuid import uuid4

router = APIRouter()

# Request models
class LeagueConfigRequest(BaseModel):
    league_id: int
    year: int
    espn_s2: Optional[str] = None
    swid: Optional[str] = None

class LeagueConfigResponse(BaseModel):
    success: bool
    message: str
    league_id: int
    year: int
    league_info: Optional[dict] = None

# Dependency to get ESPN service
def get_espn_service() -> ESPNService:
    return ESPNService()

@router.post("/configure", response_model=LeagueConfigResponse)
def configure_league(
    config: LeagueConfigRequest,
    espn_service: ESPNService = Depends(get_espn_service)
):
    """Configure ESPN league connection and save to database"""
    try:
        # Configure ESPN service
        success = espn_service.configure_league(
            league_id=config.league_id,
            year=config.year,
            espn_s2=config.espn_s2,
            swid=config.swid
        )
        
        if not success:
            raise HTTPException(
                status_code=400, 
                detail="Failed to connect to ESPN league. Check your credentials and league ID."
            )
        
        # Get league info
        league_info = espn_service.get_league_info()
        if not league_info:
            raise HTTPException(
                status_code=400,
                detail="Connected to ESPN but failed to retrieve league information"
            )
        
        # Save league to database
        supabase = get_supabase()
        league_data = {
            "name": league_info.get("name", f"League {config.league_id}"),
            "espn_league_id": str(config.league_id),
            "season": config.year,
            "settings": {
                "team_count": league_info.get("team_count", 0),
                "reg_season_count": league_info.get("reg_season_count", 0),
                "playoff_team_count": league_info.get("playoff_team_count", 0),
                "veto_votes_required": league_info.get("veto_votes_required", 0)
            }
        }
        
        # Check if league already exists
        existing_league = supabase.table("leagues").select("*").eq("espn_league_id", str(config.league_id)).eq("season", config.year).execute()
        
        if existing_league.data:
            # Update existing league
            league_id = existing_league.data[0]["id"]
            supabase.table("leagues").update(league_data).eq("id", league_id).execute()
            message = "League configuration updated successfully"
        else:
            # Create new league
            result = supabase.table("leagues").insert(league_data).execute()
            league_id = result.data[0]["id"]
            message = "League configuration created successfully"
        
        # Get teams and save them
        teams = espn_service.get_teams()
        if teams:
            # Delete existing teams for this league
            supabase.table("teams").delete().eq("league_id", league_id).execute()
            
            # Insert new teams
            team_data = []
            for team in teams:
                team_data.append({
                    "league_id": league_id,
                    "espn_team_id": str(team["espn_team_id"]),
                    "name": team["name"],
                    "owner_id": None  # Will be linked to users later
                })
            
            if team_data:
                supabase.table("teams").insert(team_data).execute()
        
        return LeagueConfigResponse(
            success=True,
            message=message,
            league_id=config.league_id,
            year=config.year,
            league_info=league_info
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/test-connection")
def test_league_connection(espn_service: ESPNService = Depends(get_espn_service)):
    """Test the current ESPN league connection"""
    try:
        success = espn_service.test_connection()
        
        if success:
            league_info = espn_service.get_league_info()
            return {
                "success": True,
                "message": "ESPN league connection is working",
                "league_info": league_info
            }
        else:
            return {
                "success": False,
                "message": "ESPN league connection failed. Please configure your league first."
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error testing connection: {str(e)}"
        )

@router.get("/league-info")
def get_league_info(espn_service: ESPNService = Depends(get_espn_service)):
    """Get current league information"""
    try:
        league_info = espn_service.get_league_info()
        
        if not league_info:
            raise HTTPException(
                status_code=404,
                detail="No league configured. Please configure your ESPN league first."
            )
        
        return league_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting league info: {str(e)}"
        )

@router.get("/teams")
def get_league_teams(espn_service: ESPNService = Depends(get_espn_service)):
    """Get all teams in the configured league"""
    try:
        teams = espn_service.get_teams()
        
        if not teams:
            raise HTTPException(
                status_code=404,
                detail="No teams found. Please configure your ESPN league first."
            )
        
        return {"teams": teams, "count": len(teams)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting teams: {str(e)}"
        )

@router.get("/matchups")
def get_league_matchups(week: Optional[int] = None, espn_service: ESPNService = Depends(get_espn_service)):
    """Get matchups for the configured league"""
    try:
        matchups = espn_service.get_matchups(week)
        
        if not matchups:
            raise HTTPException(
                status_code=404,
                detail="No matchups found. Please configure your ESPN league first."
            )
        
        return {"matchups": matchups, "week": week, "count": len(matchups)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting matchups: {str(e)}"
        )

@router.get("/standings")
def get_league_standings(espn_service: ESPNService = Depends(get_espn_service)):
    """Get current league standings"""
    try:
        standings = espn_service.get_standings()
        
        if not standings:
            raise HTTPException(
                status_code=404,
                detail="No standings found. Please configure your ESPN league first."
            )
        
        return {"standings": standings, "count": len(standings)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting standings: {str(e)}"
        )
