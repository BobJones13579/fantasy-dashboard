from typing import Optional, List, Dict, Any
from espn_api.football import League
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class ESPNService:
    def __init__(self):
        self.league_id: Optional[int] = None
        self.year: Optional[int] = None
        self.espn_s2: Optional[str] = None
        self.swid: Optional[str] = None
        self.league: Optional[League] = None
    
    def configure_league(self, league_id: int, year: int, espn_s2: Optional[str] = None, swid: Optional[str] = None):
        """Configure the ESPN league connection"""
        self.league_id = league_id
        self.year = year
        self.espn_s2 = espn_s2
        self.swid = swid
        
        try:
            # Initialize the league connection
            self.league = League(
                league_id=league_id,
                year=year,
                espn_s2=espn_s2,
                swid=swid,
                debug=False
            )
            logger.info(f"Successfully connected to ESPN league {league_id} for year {year}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to ESPN league: {e}")
            return False
    
    def get_league_info(self) -> Optional[Dict[str, Any]]:
        """Get basic league information"""
        if not self.league:
            return None
        
        try:
            settings = self.league.settings
            return {
                "league_id": self.league_id,
                "year": self.year,
                "name": getattr(settings, 'name', 'Unknown League'),
                "team_count": getattr(settings, 'team_count', 0),
                "reg_season_count": getattr(settings, 'reg_season_count', 0),
                "playoff_team_count": getattr(settings, 'playoff_team_count', 0),
                "veto_votes_required": getattr(settings, 'veto_votes_required', 0)
            }
        except Exception as e:
            logger.error(f"Error getting league info: {e}")
            return None
    
    def get_teams(self) -> List[Dict[str, Any]]:
        """Get all teams in the league"""
        if not self.league:
            return []
        
        try:
            teams = []
            for team in self.league.teams:
                teams.append({
                    "espn_team_id": team.team_id,
                    "name": team.team_name,
                    "owner": team.owner,
                    "wins": team.wins,
                    "losses": team.losses,
                    "ties": team.ties,
                    "final_standing": team.final_standing,
                    "points_for": team.points_for,
                    "points_against": team.points_against
                })
            return teams
        except Exception as e:
            logger.error(f"Error getting teams: {e}")
            return []
    
    def get_matchups(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get matchups for a specific week or current week"""
        if not self.league:
            return []
        
        try:
            if week is None:
                # Get current week matchups
                matchups = self.league.scoreboard()
            else:
                matchups = self.league.scoreboard(week)
            
            matchup_data = []
            for matchup in matchups:
                matchup_data.append({
                    "week": week,
                    "home_team": {
                        "espn_team_id": matchup.home_team.team_id,
                        "name": matchup.home_team.team_name,
                        "score": matchup.home_score
                    },
                    "away_team": {
                        "espn_team_id": matchup.away_team.team_id,
                        "name": matchup.away_team.team_name,
                        "score": matchup.away_score
                    }
                })
            return matchup_data
        except Exception as e:
            logger.error(f"Error getting matchups: {e}")
            return []
    
    def get_box_scores(self, week: int) -> List[Dict[str, Any]]:
        """Get detailed box scores for a specific week"""
        if not self.league:
            return []
        
        try:
            box_scores = self.league.box_scores(week)
            box_score_data = []
            
            for box_score in box_scores:
                home_lineup = []
                away_lineup = []
                
                # Process home team lineup
                for player in box_score.home_lineup:
                    home_lineup.append({
                        "name": player.name,
                        "position": player.position,
                        "slot_position": player.slot_position,
                        "points": player.points,
                        "projected_points": player.projected_points,
                        "pro_opponent": player.pro_opponent,
                        "pro_pos_rank": player.pro_pos_rank
                    })
                
                # Process away team lineup
                for player in box_score.away_lineup:
                    away_lineup.append({
                        "name": player.name,
                        "position": player.position,
                        "slot_position": player.slot_position,
                        "points": player.points,
                        "projected_points": player.projected_points,
                        "pro_opponent": player.pro_opponent,
                        "pro_pos_rank": player.pro_pos_rank
                    })
                
                box_score_data.append({
                    "week": week,
                    "home_team": {
                        "espn_team_id": box_score.home_team.team_id,
                        "name": box_score.home_team.team_name,
                        "score": box_score.home_score,
                        "lineup": home_lineup
                    },
                    "away_team": {
                        "espn_team_id": box_score.away_team.team_id,
                        "name": box_score.away_team.team_name,
                        "score": box_score.away_score,
                        "lineup": away_lineup
                    }
                })
            
            return box_score_data
        except Exception as e:
            logger.error(f"Error getting box scores: {e}")
            return []
    
    def get_standings(self) -> List[Dict[str, Any]]:
        """Get current league standings"""
        if not self.league:
            return []
        
        try:
            standings = self.league.standings()
            standings_data = []
            
            for i, team in enumerate(standings):
                standings_data.append({
                    "rank": i + 1,
                    "espn_team_id": team.team_id,
                    "name": team.team_name,
                    "wins": team.wins,
                    "losses": team.losses,
                    "ties": team.ties,
                    "points_for": team.points_for,
                    "points_against": team.points_against,
                    "final_standing": team.final_standing
                })
            
            return standings_data
        except Exception as e:
            logger.error(f"Error getting standings: {e}")
            return []
    
    def get_power_rankings(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get power rankings for a specific week"""
        if not self.league:
            return []
        
        try:
            if week is None:
                # Get current week power rankings
                power_rankings = self.league.power_rankings()
            else:
                power_rankings = self.league.power_rankings(week)
            
            rankings_data = []
            for i, (score, team) in enumerate(power_rankings):
                rankings_data.append({
                    "rank": i + 1,
                    "score": float(score),
                    "espn_team_id": team.team_id,
                    "name": team.team_name
                })
            
            return rankings_data
        except Exception as e:
            logger.error(f"Error getting power rankings: {e}")
            return []
    
    def get_recent_activity(self, size: int = 25, msg_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get recent league activity (trades, waivers, etc.)"""
        if not self.league:
            return []
        
        try:
            activities = self.league.recent_activity(size=size, msg_type=msg_type)
            activity_data = []
            
            for activity in activities:
                activity_data.append({
                    "date": activity.date,
                    "message": activity.message,
                    "msg_type": activity.msg_type,
                    "team": activity.team.team_name if activity.team else None
                })
            
            return activity_data
        except Exception as e:
            logger.error(f"Error getting recent activity: {e}")
            return []
    
    def get_team_roster(self, team_id: int) -> List[Dict[str, Any]]:
        """Get roster for a specific team"""
        if not self.league:
            return []
        
        try:
            # Find the team
            team = None
            for t in self.league.teams:
                if t.team_id == team_id:
                    team = t
                    break
            
            if not team:
                return []
            
            roster_data = []
            for player in team.roster:
                roster_data.append({
                    "name": player.name,
                    "position": player.position,
                    "points": player.points,
                    "projected_points": player.projected_points,
                    "pro_opponent": player.pro_opponent,
                    "pro_pos_rank": player.pro_pos_rank
                })
            
            return roster_data
        except Exception as e:
            logger.error(f"Error getting team roster: {e}")
            return []
    
    def test_connection(self) -> bool:
        """Test the ESPN API connection"""
        if not self.league:
            return False
        
        try:
            # Try to get basic league info
            info = self.get_league_info()
            return info is not None
        except Exception as e:
            logger.error(f"ESPN connection test failed: {e}")
            return False
