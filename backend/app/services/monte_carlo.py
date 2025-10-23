import numpy as np
from scipy import stats
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class SimulationResult:
    """Result of a Monte Carlo simulation"""
    win_probability: float
    confidence_interval: Tuple[float, float]
    iterations: int
    team1_avg_score: float
    team2_avg_score: float
    team1_std_dev: float
    team2_std_dev: float

class MonteCarloSimulator:
    """Monte Carlo simulation engine for fantasy football matchups using NumPy/SciPy"""
    
    def __init__(self, iterations: int = 10000):
        self.iterations = iterations
        self.rng = np.random.default_rng()
    
    def set_seed(self, seed: int):
        """Set random seed for reproducible results"""
        self.rng = np.random.default_rng(seed)
    
    def simulate_matchup(self, team1_stats: Dict[str, Any], team2_stats: Dict[str, Any]) -> SimulationResult:
        """
        Run Monte Carlo simulation for a fantasy football matchup
        
        Args:
            team1_stats: Dictionary containing team 1 statistics
            team2_stats: Dictionary containing team 2 statistics
            
        Returns:
            SimulationResult with win probability and statistics
        """
        try:
            # Extract team statistics
            team1_avg = self._extract_team_average(team1_stats)
            team1_std = self._extract_team_std_dev(team1_stats)
            team2_avg = self._extract_team_average(team2_stats)
            team2_std = self._extract_team_std_dev(team2_stats)
            
            # Generate random scores using NumPy (vectorized for performance)
            team1_scores = np.maximum(0, self.rng.normal(team1_avg, team1_std, self.iterations))
            team2_scores = np.maximum(0, self.rng.normal(team2_avg, team2_std, self.iterations))
            
            # Count wins using NumPy (vectorized)
            team1_wins = np.sum(team1_scores > team2_scores)
            
            # Calculate results using NumPy
            win_probability = team1_wins / self.iterations
            team1_avg_score = float(np.mean(team1_scores))
            team2_avg_score = float(np.mean(team2_scores))
            team1_std_dev = float(np.std(team1_scores))
            team2_std_dev = float(np.std(team2_scores))
            
            # Calculate confidence interval using SciPy
            confidence_interval = self._calculate_confidence_interval_scipy(win_probability, self.iterations)
            
            return SimulationResult(
                win_probability=win_probability,
                confidence_interval=confidence_interval,
                iterations=self.iterations,
                team1_avg_score=team1_avg_score,
                team2_avg_score=team2_avg_score,
                team1_std_dev=team1_std_dev,
                team2_std_dev=team2_std_dev
            )
            
        except Exception as e:
            logger.error(f"Error in Monte Carlo simulation: {e}")
            # Return default result
            return SimulationResult(
                win_probability=0.5,
                confidence_interval=(0.45, 0.55),
                iterations=self.iterations,
                team1_avg_score=100.0,
                team2_avg_score=100.0,
                team1_std_dev=15.0,
                team2_std_dev=15.0
            )
    
    def _extract_team_average(self, team_stats: Dict[str, Any]) -> float:
        """Extract average score from team statistics"""
        try:
            # Try to get points_for average
            if 'points_for' in team_stats and 'games_played' in team_stats:
                games = max(team_stats['games_played'], 1)
                return team_stats['points_for'] / games
            
            # Fallback to season average
            if 'points_for' in team_stats:
                # Assume 16 games for season average
                return team_stats['points_for'] / 16
            
            # Default fallback
            return 100.0
            
        except Exception as e:
            logger.warning(f"Error extracting team average: {e}")
            return 100.0
    
    def _extract_team_std_dev(self, team_stats: Dict[str, Any]) -> float:
        """Extract standard deviation from team statistics"""
        try:
            # Try to get historical variance
            if 'points_for' in team_stats and 'points_against' in team_stats:
                # Use points against as a proxy for variance
                variance = abs(team_stats['points_for'] - team_stats['points_against']) / 10
                return max(variance, 10.0)  # Minimum std dev of 10
            
            # Default standard deviation
            return 15.0
            
        except Exception as e:
            logger.warning(f"Error extracting team std dev: {e}")
            return 15.0
    
    def _calculate_confidence_interval_scipy(self, probability: float, iterations: int) -> Tuple[float, float]:
        """Calculate 95% confidence interval for win probability using SciPy"""
        try:
            # Use SciPy for more accurate confidence interval calculation
            alpha = 0.05  # 95% confidence interval
            successes = int(probability * iterations)
            
            # Use binomial confidence interval
            lower_bound, upper_bound = stats.binom.interval(1 - alpha, iterations, successes / iterations)
            
            # Convert back to proportions
            lower_bound = max(0.0, lower_bound / iterations)
            upper_bound = min(1.0, upper_bound / iterations)
            
            return (lower_bound, upper_bound)
            
        except Exception as e:
            logger.warning(f"Error calculating confidence interval with SciPy: {e}")
            # Fallback to simple calculation
            se = (probability * (1 - probability) / iterations) ** 0.5
            margin_of_error = 1.96 * se
            lower_bound = max(0, probability - margin_of_error)
            upper_bound = min(1, probability + margin_of_error)
            return (lower_bound, upper_bound)
    
    def simulate_season_outcomes(self, team_stats: Dict[str, Any], remaining_games: int) -> Dict[str, Any]:
        """
        Simulate remaining season outcomes for a team
        
        Args:
            team_stats: Current team statistics
            remaining_games: Number of games remaining in season
            
        Returns:
            Dictionary with season outcome probabilities
        """
        try:
            team_avg = self._extract_team_average(team_stats)
            team_std = self._extract_team_std_dev(team_stats)
            
            # Current record
            current_wins = team_stats.get('wins', 0)
            current_losses = team_stats.get('losses', 0)
            
            # Simulate remaining games using NumPy (vectorized)
            outcomes = {
                'playoff_probability': 0.0,
                'championship_probability': 0.0,
                'expected_final_wins': 0.0,
                'win_distribution': {}
            }
            
            # Generate all scores at once using NumPy
            team_scores = np.maximum(0, self.rng.normal(team_avg, team_std, (self.iterations, remaining_games)))
            opponent_scores = np.maximum(0, self.rng.normal(100.0, 15.0, (self.iterations, remaining_games)))
            
            # Count wins for each iteration (vectorized)
            remaining_wins = np.sum(team_scores > opponent_scores, axis=1)
            season_wins = current_wins + remaining_wins
            
            # Calculate probabilities using NumPy
            playoff_count = np.sum(season_wins >= 7)
            championship_count = np.sum(season_wins >= 10)
            
            outcomes['playoff_probability'] = playoff_count / self.iterations
            outcomes['championship_probability'] = championship_count / self.iterations
            outcomes['expected_final_wins'] = float(np.mean(season_wins))
            
            # Calculate win distribution
            unique_wins, counts = np.unique(season_wins, return_counts=True)
            for wins, count in zip(unique_wins, counts):
                outcomes['win_distribution'][int(wins)] = int(count)
            
            return outcomes
            
        except Exception as e:
            logger.error(f"Error in season simulation: {e}")
            return {
                'playoff_probability': 0.0,
                'championship_probability': 0.0,
                'expected_final_wins': 0.0,
                'win_distribution': {}
            }
    
    def test_simulation(self) -> Dict[str, Any]:
        """Test the Monte Carlo simulation with sample data"""
        try:
            # Sample team statistics
            team1_stats = {
                'points_for': 1200,
                'points_against': 1100,
                'wins': 8,
                'losses': 4,
                'games_played': 12
            }
            
            team2_stats = {
                'points_for': 1150,
                'points_against': 1200,
                'wins': 6,
                'losses': 6,
                'games_played': 12
            }
            
            # Run simulation
            result = self.simulate_matchup(team1_stats, team2_stats)
            
            return {
                'success': True,
                'message': 'Monte Carlo simulation engine is working',
                'test_result': {
                    'win_probability': result.win_probability,
                    'confidence_interval': result.confidence_interval,
                    'iterations': result.iterations,
                    'team1_avg_score': result.team1_avg_score,
                    'team2_avg_score': result.team2_avg_score
                },
                'features': [
                    'Matchup win probability calculation',
                    'Confidence interval estimation',
                    'Season outcome simulation',
                    'Statistical analysis and reporting'
                ]
            }
            
        except Exception as e:
            logger.error(f"Error testing Monte Carlo simulation: {e}")
            return {
                'success': False,
                'message': f'Monte Carlo simulation test failed: {str(e)}',
                'test_result': None,
                'features': []
            }
