from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import statistics
import math
from app.services.espn_service import ESPNService
from app.services.monte_carlo import MonteCarloSimulator
from app.core.database import get_supabase
import logging

logger = logging.getLogger(__name__)

class OddsService:
    def __init__(self):
        self.espn_service = ESPNService()
        self.monte_carlo = MonteCarloSimulator(iterations=10000)
        self.supabase = get_supabase()
    
    def calculate_matchup_odds(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Calculate odds for all matchups in a given week"""
        try:
            # Get matchups for the week
            matchups = self.espn_service.get_matchups(week)
            if not matchups:
                return []
            
            odds_data = []
            for matchup in matchups:
                home_team = matchup['home_team']
                away_team = matchup['away_team']
                
                # Calculate win probabilities
                home_win_prob, away_win_prob = self._calculate_win_probabilities(
                    home_team, away_team, week
                )
                
                # Calculate spread
                spread = self._calculate_spread(home_team, away_team, week)
                
                # Calculate total points
                total = self._calculate_total_points(home_team, away_team, week)
                
                # Create odds data
                odds_data.append({
                    'week': week or self.espn_service.league.current_week if self.espn_service.league else 1,
                    'home_team': {
                        'id': home_team['espn_team_id'],
                        'name': home_team['name'],
                        'win_probability': home_win_prob,
                        'moneyline': self._probability_to_moneyline(home_win_prob),
                        'spread': -spread,  # Home team spread is negative
                        'projected_score': self._get_projected_score(home_team, week)
                    },
                    'away_team': {
                        'id': away_team['espn_team_id'],
                        'name': away_team['name'],
                        'win_probability': away_win_prob,
                        'moneyline': self._probability_to_moneyline(away_win_prob),
                        'spread': spread,  # Away team spread is positive
                        'projected_score': self._get_projected_score(away_team, week)
                    },
                    'total': total,
                    'over_odds': -110,  # Standard -110 for over/under
                    'under_odds': -110,
                    'last_updated': datetime.utcnow().isoformat()
                })
            
            return odds_data
            
        except Exception as e:
            logger.error(f"Error calculating matchup odds: {e}")
            return []
    
    def _calculate_win_probabilities(self, home_team: Dict, away_team: Dict, week: Optional[int]) -> Tuple[float, float]:
        """Calculate win probabilities for a matchup using multiple factors"""
        try:
            # Get historical performance data
            home_stats = self._get_team_stats(home_team['espn_team_id'], week)
            away_stats = self._get_team_stats(away_team['espn_team_id'], week)
            
            # Calculate base probabilities from season performance
            home_season_avg = home_stats.get('season_avg', 0)
            away_season_avg = away_stats.get('season_avg', 0)
            
            # Calculate recent form (last 4 weeks)
            home_recent_avg = home_stats.get('recent_avg', home_season_avg)
            away_recent_avg = away_stats.get('recent_avg', away_season_avg)
            
            # Calculate home field advantage (typically 2-3 points in fantasy)
            home_advantage = 2.5
            
            # Weighted calculation: 60% recent form, 40% season average
            home_projected = (home_recent_avg * 0.6 + home_season_avg * 0.4) + home_advantage
            away_projected = away_recent_avg * 0.6 + away_season_avg * 0.4
            
            # Convert to probabilities using normal distribution approximation
            point_diff = home_projected - away_projected
            std_dev = 15.0  # Typical fantasy football standard deviation
            
            # Calculate win probability for home team
            home_win_prob = 0.5 + (0.5 * math.erf(point_diff / (std_dev * math.sqrt(2))))
            away_win_prob = 1.0 - home_win_prob
            
            # Ensure probabilities are between 0.05 and 0.95 (avoid extreme odds)
            home_win_prob = max(0.05, min(0.95, home_win_prob))
            away_win_prob = max(0.05, min(0.95, away_win_prob))
            
            return home_win_prob, away_win_prob
            
        except Exception as e:
            logger.error(f"Error calculating win probabilities: {e}")
            # Return equal probabilities if calculation fails
            return 0.5, 0.5
    
    def _calculate_spread(self, home_team: Dict, away_team: Dict, week: Optional[int]) -> float:
        """Calculate the point spread for a matchup"""
        try:
            home_stats = self._get_team_stats(home_team['espn_team_id'], week)
            away_stats = self._get_team_stats(away_team['espn_team_id'], week)
            
            home_projected = home_stats.get('recent_avg', home_stats.get('season_avg', 0))
            away_projected = away_stats.get('recent_avg', away_stats.get('season_avg', 0))
            
            # Add home field advantage
            home_advantage = 2.5
            spread = (home_projected + home_advantage) - away_projected
            
            # Round to nearest 0.5
            return round(spread * 2) / 2
            
        except Exception as e:
            logger.error(f"Error calculating spread: {e}")
            return 0.0
    
    def _calculate_total_points(self, home_team: Dict, away_team: Dict, week: Optional[int]) -> float:
        """Calculate the total points over/under for a matchup"""
        try:
            home_stats = self._get_team_stats(home_team['espn_team_id'], week)
            away_stats = self._get_team_stats(away_team['espn_team_id'], week)
            
            home_projected = home_stats.get('recent_avg', home_stats.get('season_avg', 0))
            away_projected = away_stats.get('recent_avg', away_stats.get('season_avg', 0))
            
            total = home_projected + away_projected
            
            # Round to nearest 0.5
            return round(total * 2) / 2
            
        except Exception as e:
            logger.error(f"Error calculating total points: {e}")
            return 0.0
    
    def _get_team_stats(self, team_id: int, week: Optional[int]) -> Dict[str, float]:
        """Get team statistics for odds calculation"""
        try:
            if not self.espn_service.league:
                return {'season_avg': 0, 'recent_avg': 0}
            
            # Get team data
            team = None
            for t in self.espn_service.league.teams:
                if t.team_id == team_id:
                    team = t
                    break
            
            if not team:
                return {'season_avg': 0, 'recent_avg': 0}
            
            # Calculate season average
            season_avg = team.points_for / max(team.wins + team.losses, 1)
            
            # Calculate recent average (last 4 weeks)
            recent_scores = []
            current_week = self.espn_service.league.current_week
            
            # Get recent box scores
            for w in range(max(1, current_week - 4), current_week):
                try:
                    box_scores = self.espn_service.league.box_scores(w)
                    for box_score in box_scores:
                        if box_score.home_team.team_id == team_id:
                            recent_scores.append(box_score.home_score)
                        elif box_score.away_team.team_id == team_id:
                            recent_scores.append(box_score.away_score)
                except:
                    continue
            
            recent_avg = statistics.mean(recent_scores) if recent_scores else season_avg
            
            return {
                'season_avg': season_avg,
                'recent_avg': recent_avg
            }
            
        except Exception as e:
            logger.error(f"Error getting team stats: {e}")
            return {'season_avg': 0, 'recent_avg': 0}
    
    def _get_projected_score(self, team: Dict, week: Optional[int]) -> float:
        """Get projected score for a team"""
        try:
            team_stats = self._get_team_stats(int(team['espn_team_id']), week)
            return team_stats.get('recent_avg', team_stats.get('season_avg', 0))
        except:
            return 0.0
    
    def _probability_to_moneyline(self, probability: float) -> int:
        """Convert win probability to moneyline odds"""
        try:
            if probability >= 0.5:
                # Favorite (negative odds)
                odds = -int((probability / (1 - probability)) * 100)
            else:
                # Underdog (positive odds)
                odds = int(((1 - probability) / probability) * 100)
            
            # Round to nearest 5
            return round(odds / 5) * 5
            
        except:
            return 100  # Default to +100 if calculation fails
    
    def get_odds_for_week(self, week: int) -> List[Dict[str, Any]]:
        """Get odds for a specific week"""
        return self.calculate_matchup_odds(week)
    
    def get_current_odds(self) -> List[Dict[str, Any]]:
        """Get odds for the current week"""
        return self.calculate_matchup_odds()
    
    def update_odds(self, week: Optional[int] = None) -> bool:
        """Update and store odds in database"""
        try:
            odds_data = self.calculate_matchup_odds(week)
            
            if not odds_data:
                return False
            
            # Store odds in database (we'll create an odds table later)
            # For now, just return success
            logger.info(f"Updated odds for {len(odds_data)} matchups")
            return True
            
        except Exception as e:
            logger.error(f"Error updating odds: {e}")
            return False
    
    def calculate_advanced_odds(self, team1_stats: Dict[str, Any], team2_stats: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate advanced odds using Monte Carlo simulation
        
        Args:
            team1_stats: Team 1 statistics
            team2_stats: Team 2 statistics
            
        Returns:
            Dictionary with advanced odds calculations
        """
        try:
            # Run Monte Carlo simulation
            simulation_result = self.monte_carlo.simulate_matchup(team1_stats, team2_stats)
            
            # Convert probabilities to odds
            team1_win_prob = simulation_result.win_probability
            team2_win_prob = 1 - team1_win_prob
            
            # Calculate moneylines
            team1_moneyline = self._probability_to_moneyline(team1_win_prob)
            team2_moneyline = self._probability_to_moneyline(team2_win_prob)
            
            # Calculate spread based on average scores
            spread = simulation_result.team1_avg_score - simulation_result.team2_avg_score
            
            # Calculate total
            total = simulation_result.team1_avg_score + simulation_result.team2_avg_score
            
            return {
                "team1": {
                    "win_probability": team1_win_prob,
                    "moneyline": team1_moneyline,
                    "projected_score": simulation_result.team1_avg_score,
                    "confidence_interval": simulation_result.confidence_interval
                },
                "team2": {
                    "win_probability": team2_win_prob,
                    "moneyline": team2_moneyline,
                    "projected_score": simulation_result.team2_avg_score,
                    "confidence_interval": (1 - simulation_result.confidence_interval[1], 1 - simulation_result.confidence_interval[0])
                },
                "spread": round(spread, 1),
                "total": round(total, 1),
                "simulation_details": {
                    "iterations": simulation_result.iterations,
                    "team1_std_dev": simulation_result.team1_std_dev,
                    "team2_std_dev": simulation_result.team2_std_dev
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating advanced odds: {e}")
            return {
                "team1": {"win_probability": 0.5, "moneyline": -110, "projected_score": 100.0},
                "team2": {"win_probability": 0.5, "moneyline": -110, "projected_score": 100.0},
                "spread": 0.0,
                "total": 200.0,
                "simulation_details": {"error": str(e)}
            }
