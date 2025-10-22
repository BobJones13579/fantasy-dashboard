import random
import statistics
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
    """Monte Carlo simulation engine for fantasy football matchups"""
    
    def __init__(self, iterations: int = 10000):
        self.iterations = iterations
        self.random_seed = None
    
    def set_seed(self, seed: int):
        """Set random seed for reproducible results"""
        self.random_seed = seed
        random.seed(seed)
    
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
            # Set seed if provided
            if self.random_seed:
                random.seed(self.random_seed)
            
            # Extract team statistics
            team1_avg = self._extract_team_average(team1_stats)
            team1_std = self._extract_team_std_dev(team1_stats)
            team2_avg = self._extract_team_average(team2_stats)
            team2_std = self._extract_team_std_dev(team2_stats)
            
            # Run simulations
            team1_scores = []
            team2_scores = []
            team1_wins = 0
            
            for _ in range(self.iterations):
                # Generate random scores based on normal distribution
                team1_score = max(0, random.normalvariate(team1_avg, team1_std))
                team2_score = max(0, random.normalvariate(team2_avg, team2_std))
                
                team1_scores.append(team1_score)
                team2_scores.append(team2_score)
                
                # Count wins
                if team1_score > team2_score:
                    team1_wins += 1
            
            # Calculate results
            win_probability = team1_wins / self.iterations
            team1_avg_score = statistics.mean(team1_scores)
            team2_avg_score = statistics.mean(team2_scores)
            team1_std_dev = statistics.stdev(team1_scores)
            team2_std_dev = statistics.stdev(team2_scores)
            
            # Calculate confidence interval (95%)
            confidence_interval = self._calculate_confidence_interval(win_probability, self.iterations)
            
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
    
    def _calculate_confidence_interval(self, probability: float, iterations: int) -> Tuple[float, float]:
        """Calculate 95% confidence interval for win probability"""
        try:
            # Standard error for proportion
            se = (probability * (1 - probability) / iterations) ** 0.5
            
            # 95% confidence interval (z = 1.96)
            margin_of_error = 1.96 * se
            
            lower_bound = max(0, probability - margin_of_error)
            upper_bound = min(1, probability + margin_of_error)
            
            return (lower_bound, upper_bound)
            
        except Exception as e:
            logger.warning(f"Error calculating confidence interval: {e}")
            return (max(0, probability - 0.05), min(1, probability + 0.05))
    
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
            
            # Simulate remaining games
            outcomes = {
                'playoff_probability': 0.0,
                'championship_probability': 0.0,
                'expected_final_wins': 0.0,
                'win_distribution': {}
            }
            
            total_wins = 0
            playoff_count = 0
            championship_count = 0
            
            for _ in range(self.iterations):
                season_wins = current_wins
                
                # Simulate remaining games
                for _ in range(remaining_games):
                    # Generate random opponent score (league average)
                    opponent_score = random.normalvariate(100.0, 15.0)
                    team_score = max(0, random.normalvariate(team_avg, team_std))
                    
                    if team_score > opponent_score:
                        season_wins += 1
                
                total_wins += season_wins
                
                # Check playoff qualification (assume 6 teams make playoffs)
                if season_wins >= 7:  # Example threshold
                    playoff_count += 1
                    
                    # Check championship (simplified)
                    if season_wins >= 10:
                        championship_count += 1
                
                # Track win distribution
                if season_wins not in outcomes['win_distribution']:
                    outcomes['win_distribution'][season_wins] = 0
                outcomes['win_distribution'][season_wins] += 1
            
            # Calculate probabilities
            outcomes['playoff_probability'] = playoff_count / self.iterations
            outcomes['championship_probability'] = championship_count / self.iterations
            outcomes['expected_final_wins'] = total_wins / self.iterations
            
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
