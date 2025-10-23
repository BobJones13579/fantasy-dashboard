"""
FAAB/Waiver Bid Predictor Service
Provides intelligent FAAB bid recommendations based on league history and player analysis
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
import numpy as np
from scipy import stats

from app.services.espn_service import ESPNService
from app.services.cache_service import cache_service

logger = logging.getLogger(__name__)

@dataclass
class FAABRecommendation:
    """FAAB bid recommendation data structure"""
    player_id: str
    player_name: str
    position: str
    team: str
    recommended_bid: int
    confidence_level: float
    reasoning: List[str]
    market_value: int
    league_average_bid: int
    historical_similar_bids: List[int]
    risk_assessment: str
    urgency_score: float

@dataclass
class LeagueBiddingProfile:
    """League bidding behavior profile"""
    league_id: str
    average_bid_size: float
    bid_frequency: float
    position_preferences: Dict[str, float]
    budget_utilization: float
    bidding_patterns: Dict[str, Any]
    market_efficiency: float

class FAABPredictorService:
    """Service for FAAB bid predictions and recommendations"""
    
    def __init__(self):
        self.espn_service = ESPNService()
        self.cache_service = cache_service
    
    async def get_faab_recommendations(
        self, 
        league_id: str, 
        week: int,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get comprehensive FAAB bid recommendations for the week
        
        Args:
            league_id: ESPN league ID
            week: Current week
            user_id: Optional user ID for personalized recommendations
            
        Returns:
            Dictionary with FAAB recommendations and analysis
        """
        try:
            # Get league data
            league_data = await self.espn_service.get_league_data(league_id)
            if not league_data:
                raise ValueError("League not found")
            
            # Get available waiver wire players
            waiver_players = await self.espn_service.get_waiver_wire_players(league_id, week)
            
            # Get league bidding history
            bidding_history = await self.get_league_bidding_history(league_id)
            
            # Analyze league bidding patterns
            league_profile = await self.analyze_league_bidding_patterns(league_id, bidding_history)
            
            # Generate recommendations for each player
            recommendations = []
            for player in waiver_players:
                recommendation = await self.generate_player_recommendation(
                    player, 
                    league_profile, 
                    bidding_history,
                    user_id
                )
                if recommendation:
                    recommendations.append(recommendation)
            
            # Sort recommendations by urgency and value
            recommendations.sort(key=lambda x: x.urgency_score, reverse=True)
            
            # Calculate market intelligence
            market_intelligence = await self.calculate_market_intelligence(
                recommendations, 
                league_profile
            )
            
            result = {
                'league_id': league_id,
                'week': week,
                'recommendations': [
                    {
                        'player_id': rec.player_id,
                        'player_name': rec.player_name,
                        'position': rec.position,
                        'team': rec.team,
                        'recommended_bid': rec.recommended_bid,
                        'confidence_level': rec.confidence_level,
                        'reasoning': rec.reasoning,
                        'market_value': rec.market_value,
                        'league_average_bid': rec.league_average_bid,
                        'risk_assessment': rec.risk_assessment,
                        'urgency_score': rec.urgency_score
                    }
                    for rec in recommendations
                ],
                'market_intelligence': market_intelligence,
                'league_profile': {
                    'average_bid_size': league_profile.average_bid_size,
                    'bid_frequency': league_profile.bid_frequency,
                    'position_preferences': league_profile.position_preferences,
                    'market_efficiency': league_profile.market_efficiency
                },
                'timestamp': datetime.now().isoformat()
            }
            
            # Cache the result
            cache_key = f"faab_recommendations:{league_id}:week:{week}"
            await self.cache_service.set(cache_key, result, cache_type='statistics')
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting FAAB recommendations: {e}")
            raise
    
    async def generate_player_recommendation(
        self, 
        player: Dict[str, Any], 
        league_profile: LeagueBiddingProfile,
        bidding_history: List[Dict[str, Any]],
        user_id: Optional[str] = None
    ) -> Optional[FAABRecommendation]:
        """Generate FAAB recommendation for a specific player"""
        try:
            player_id = player.get('id')
            player_name = player.get('name')
            position = player.get('position')
            team = player.get('team')
            
            # Get player's recent performance
            player_stats = await self.espn_service.get_player_stats(player_id)
            
            # Find similar players in bidding history
            similar_players = await self.find_similar_players(
                player, 
                player_stats, 
                bidding_history
            )
            
            # Calculate market value
            market_value = await self.calculate_player_market_value(
                player, 
                player_stats, 
                similar_players
            )
            
            # Calculate league average bid for similar players
            league_average_bid = self.calculate_league_average_bid(similar_players)
            
            # Generate recommendation
            recommended_bid = await self.calculate_recommended_bid(
                player,
                player_stats,
                market_value,
                league_average_bid,
                league_profile
            )
            
            # Calculate confidence level
            confidence_level = await self.calculate_confidence_level(
                player,
                similar_players,
                league_profile
            )
            
            # Generate reasoning
            reasoning = await self.generate_recommendation_reasoning(
                player,
                player_stats,
                market_value,
                league_average_bid,
                recommended_bid
            )
            
            # Assess risk
            risk_assessment = await self.assess_bid_risk(
                player,
                recommended_bid,
                league_profile
            )
            
            # Calculate urgency score
            urgency_score = await self.calculate_urgency_score(
                player,
                player_stats,
                league_profile
            )
            
            return FAABRecommendation(
                player_id=player_id,
                player_name=player_name,
                position=position,
                team=team,
                recommended_bid=recommended_bid,
                confidence_level=confidence_level,
                reasoning=reasoning,
                market_value=market_value,
                league_average_bid=league_average_bid,
                historical_similar_bids=[bid['amount'] for bid in similar_players],
                risk_assessment=risk_assessment,
                urgency_score=urgency_score
            )
            
        except Exception as e:
            logger.error(f"Error generating player recommendation: {e}")
            return None
    
    async def get_league_bidding_history(
        self, 
        league_id: str, 
        weeks_back: int = 16
    ) -> List[Dict[str, Any]]:
        """Get league bidding history for analysis"""
        try:
            cache_key = f"bidding_history:{league_id}:weeks:{weeks_back}"
            cached_history = await self.cache_service.get(cache_key)
            
            if cached_history:
                return cached_history
            
            # Get bidding history from ESPN API
            bidding_history = []
            for week in range(1, weeks_back + 1):
                week_bids = await self.espn_service.get_waiver_bids(league_id, week)
                bidding_history.extend(week_bids)
            
            # Cache the result
            await self.cache_service.set(cache_key, bidding_history, cache_type='statistics')
            
            return bidding_history
            
        except Exception as e:
            logger.error(f"Error getting league bidding history: {e}")
            return []
    
    async def analyze_league_bidding_patterns(
        self, 
        league_id: str, 
        bidding_history: List[Dict[str, Any]]
    ) -> LeagueBiddingProfile:
        """Analyze league bidding patterns and behavior"""
        try:
            if not bidding_history:
                return LeagueBiddingProfile(
                    league_id=league_id,
                    average_bid_size=0.0,
                    bid_frequency=0.0,
                    position_preferences={},
                    budget_utilization=0.0,
                    bidding_patterns={},
                    market_efficiency=0.0
                )
            
            # Calculate average bid size
            bid_amounts = [bid['amount'] for bid in bidding_history if bid.get('amount')]
            average_bid_size = np.mean(bid_amounts) if bid_amounts else 0.0
            
            # Calculate bid frequency (bids per week per team)
            total_weeks = len(set(bid['week'] for bid in bidding_history))
            total_teams = len(set(bid['team_id'] for bid in bidding_history))
            bid_frequency = len(bidding_history) / (total_weeks * total_teams) if total_teams > 0 else 0.0
            
            # Analyze position preferences
            position_preferences = {}
            for bid in bidding_history:
                position = bid.get('player_position', 'UNKNOWN')
                if position not in position_preferences:
                    position_preferences[position] = []
                position_preferences[position].append(bid.get('amount', 0))
            
            # Calculate average bid by position
            for position in position_preferences:
                position_preferences[position] = np.mean(position_preferences[position])
            
            # Calculate budget utilization
            total_budget = total_teams * 1000  # Assuming $1000 FAAB budget
            total_spent = sum(bid_amounts)
            budget_utilization = total_spent / total_budget if total_budget > 0 else 0.0
            
            # Analyze bidding patterns
            bidding_patterns = await self.analyze_bidding_patterns(bidding_history)
            
            # Calculate market efficiency
            market_efficiency = await self.calculate_market_efficiency(bidding_history)
            
            return LeagueBiddingProfile(
                league_id=league_id,
                average_bid_size=average_bid_size,
                bid_frequency=bid_frequency,
                position_preferences=position_preferences,
                budget_utilization=budget_utilization,
                bidding_patterns=bidding_patterns,
                market_efficiency=market_efficiency
            )
            
        except Exception as e:
            logger.error(f"Error analyzing league bidding patterns: {e}")
            return LeagueBiddingProfile(
                league_id=league_id,
                average_bid_size=0.0,
                bid_frequency=0.0,
                position_preferences={},
                budget_utilization=0.0,
                bidding_patterns={},
                market_efficiency=0.0
            )
    
    async def find_similar_players(
        self, 
        player: Dict[str, Any], 
        player_stats: Dict[str, Any],
        bidding_history: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Find similar players in bidding history"""
        try:
            similar_players = []
            target_position = player.get('position')
            target_team = player.get('team')
            
            for bid in bidding_history:
                if bid.get('player_position') == target_position:
                    # Calculate similarity score based on position, team, and stats
                    similarity_score = self.calculate_player_similarity(
                        player, 
                        player_stats, 
                        bid
                    )
                    
                    if similarity_score > 0.7:  # Threshold for similarity
                        similar_players.append(bid)
            
            # Sort by similarity and return top matches
            similar_players.sort(key=lambda x: x.get('similarity_score', 0), reverse=True)
            return similar_players[:10]  # Top 10 similar players
            
        except Exception as e:
            logger.error(f"Error finding similar players: {e}")
            return []
    
    def calculate_player_similarity(
        self, 
        player: Dict[str, Any], 
        player_stats: Dict[str, Any], 
        bid: Dict[str, Any]
    ) -> float:
        """Calculate similarity score between players"""
        try:
            # Simple similarity calculation based on position and team
            position_match = 1.0 if player.get('position') == bid.get('player_position') else 0.0
            team_match = 1.0 if player.get('team') == bid.get('player_team') else 0.0
            
            # Weighted similarity score
            similarity_score = (position_match * 0.7) + (team_match * 0.3)
            
            return similarity_score
            
        except Exception as e:
            logger.error(f"Error calculating player similarity: {e}")
            return 0.0
    
    async def calculate_player_market_value(
        self, 
        player: Dict[str, Any], 
        player_stats: Dict[str, Any],
        similar_players: List[Dict[str, Any]]
    ) -> int:
        """Calculate player's market value"""
        try:
            if not similar_players:
                # Default market value based on position
                position = player.get('position', 'UNKNOWN')
                default_values = {
                    'QB': 50,
                    'RB': 80,
                    'WR': 70,
                    'TE': 40,
                    'K': 10,
                    'DEF': 20
                }
                return default_values.get(position, 30)
            
            # Calculate market value based on similar players' bids
            bid_amounts = [bid.get('amount', 0) for bid in similar_players]
            market_value = int(np.mean(bid_amounts))
            
            return market_value
            
        except Exception as e:
            logger.error(f"Error calculating player market value: {e}")
            return 30
    
    def calculate_league_average_bid(self, similar_players: List[Dict[str, Any]]) -> int:
        """Calculate league average bid for similar players"""
        try:
            if not similar_players:
                return 0
            
            bid_amounts = [bid.get('amount', 0) for bid in similar_players]
            return int(np.mean(bid_amounts))
            
        except Exception as e:
            logger.error(f"Error calculating league average bid: {e}")
            return 0
    
    async def calculate_recommended_bid(
        self, 
        player: Dict[str, Any],
        player_stats: Dict[str, Any],
        market_value: int,
        league_average_bid: int,
        league_profile: LeagueBiddingProfile
    ) -> int:
        """Calculate recommended FAAB bid amount"""
        try:
            # Base recommendation on market value
            base_bid = market_value
            
            # Adjust based on league profile
            if league_profile.average_bid_size > 0:
                league_factor = league_profile.average_bid_size / 100  # Normalize
                base_bid = int(base_bid * league_factor)
            
            # Adjust based on player performance
            performance_factor = await self.calculate_performance_factor(player_stats)
            base_bid = int(base_bid * performance_factor)
            
            # Ensure bid is within reasonable bounds
            min_bid = 1
            max_bid = min(1000, market_value * 2)  # Cap at 2x market value or $1000
            
            recommended_bid = max(min_bid, min(max_bid, base_bid))
            
            return recommended_bid
            
        except Exception as e:
            logger.error(f"Error calculating recommended bid: {e}")
            return market_value
    
    async def calculate_performance_factor(self, player_stats: Dict[str, Any]) -> float:
        """Calculate performance factor for bid adjustment"""
        try:
            # Simple performance factor calculation
            # This would be more sophisticated in a real implementation
            recent_performance = player_stats.get('recent_performance', 0)
            
            if recent_performance > 20:
                return 1.2  # 20% increase for high performance
            elif recent_performance > 10:
                return 1.1  # 10% increase for good performance
            elif recent_performance < 5:
                return 0.8  # 20% decrease for poor performance
            else:
                return 1.0  # No adjustment
            
        except Exception as e:
            logger.error(f"Error calculating performance factor: {e}")
            return 1.0
    
    async def calculate_confidence_level(
        self, 
        player: Dict[str, Any],
        similar_players: List[Dict[str, Any]],
        league_profile: LeagueBiddingProfile
    ) -> float:
        """Calculate confidence level for the recommendation"""
        try:
            confidence = 0.5  # Base confidence
            
            # Increase confidence with more similar players
            if len(similar_players) >= 5:
                confidence += 0.2
            elif len(similar_players) >= 3:
                confidence += 0.1
            
            # Increase confidence with higher market efficiency
            confidence += league_profile.market_efficiency * 0.3
            
            # Ensure confidence is between 0 and 1
            return max(0.0, min(1.0, confidence))
            
        except Exception as e:
            logger.error(f"Error calculating confidence level: {e}")
            return 0.5
    
    async def generate_recommendation_reasoning(
        self, 
        player: Dict[str, Any],
        player_stats: Dict[str, Any],
        market_value: int,
        league_average_bid: int,
        recommended_bid: int
    ) -> List[str]:
        """Generate reasoning for the recommendation"""
        try:
            reasoning = []
            
            # Market value reasoning
            reasoning.append(f"Market value: ${market_value}")
            
            # League average reasoning
            if league_average_bid > 0:
                reasoning.append(f"League average for similar players: ${league_average_bid}")
            
            # Performance reasoning
            recent_performance = player_stats.get('recent_performance', 0)
            if recent_performance > 15:
                reasoning.append(f"Strong recent performance: {recent_performance} points")
            elif recent_performance > 10:
                reasoning.append(f"Good recent performance: {recent_performance} points")
            
            # Position reasoning
            position = player.get('position', 'UNKNOWN')
            if position in ['RB', 'WR']:
                reasoning.append("High-value position with consistent scoring potential")
            elif position == 'QB':
                reasoning.append("Quarterback position with weekly upside")
            
            return reasoning
            
        except Exception as e:
            logger.error(f"Error generating recommendation reasoning: {e}")
            return ["Recommendation based on market analysis"]
    
    async def assess_bid_risk(
        self, 
        player: Dict[str, Any],
        recommended_bid: int,
        league_profile: LeagueBiddingProfile
    ) -> str:
        """Assess the risk level of the bid"""
        try:
            risk_score = 0.0
            
            # High bid amount increases risk
            if recommended_bid > league_profile.average_bid_size * 1.5:
                risk_score += 0.3
            
            # Low confidence increases risk
            if recommended_bid > 100:
                risk_score += 0.2
            
            # Position risk
            position = player.get('position', 'UNKNOWN')
            if position in ['K', 'DEF']:
                risk_score += 0.1  # Lower risk for these positions
            
            if risk_score > 0.5:
                return "High Risk"
            elif risk_score > 0.3:
                return "Medium Risk"
            else:
                return "Low Risk"
                
        except Exception as e:
            logger.error(f"Error assessing bid risk: {e}")
            return "Medium Risk"
    
    async def calculate_urgency_score(
        self, 
        player: Dict[str, Any],
        player_stats: Dict[str, Any],
        league_profile: LeagueBiddingProfile
    ) -> float:
        """Calculate urgency score for the bid"""
        try:
            urgency = 0.0
            
            # Position urgency
            position = player.get('position', 'UNKNOWN')
            position_urgency = {
                'RB': 0.8,
                'WR': 0.7,
                'QB': 0.6,
                'TE': 0.5,
                'K': 0.3,
                'DEF': 0.4
            }
            urgency += position_urgency.get(position, 0.5)
            
            # Performance urgency
            recent_performance = player_stats.get('recent_performance', 0)
            if recent_performance > 20:
                urgency += 0.2
            elif recent_performance > 15:
                urgency += 0.1
            
            # League competition urgency
            if league_profile.bid_frequency > 0.5:
                urgency += 0.1  # High competition increases urgency
            
            return max(0.0, min(1.0, urgency))
            
        except Exception as e:
            logger.error(f"Error calculating urgency score: {e}")
            return 0.5
    
    async def calculate_market_intelligence(
        self, 
        recommendations: List[FAABRecommendation],
        league_profile: LeagueBiddingProfile
    ) -> Dict[str, Any]:
        """Calculate market intelligence and insights"""
        try:
            if not recommendations:
                return {
                    'market_efficiency': 0.0,
                    'top_positions': [],
                    'budget_recommendations': {},
                    'market_trends': []
                }
            
            # Analyze top positions
            position_counts = {}
            for rec in recommendations:
                position = rec.position
                if position not in position_counts:
                    position_counts[position] = 0
                position_counts[position] += 1
            
            top_positions = sorted(position_counts.items(), key=lambda x: x[1], reverse=True)
            
            # Budget recommendations
            total_recommended = sum(rec.recommended_bid for rec in recommendations)
            budget_recommendations = {
                'total_recommended': total_recommended,
                'percentage_of_budget': (total_recommended / 1000) * 100,
                'top_3_priorities': [
                    {
                        'player': rec.player_name,
                        'bid': rec.recommended_bid,
                        'urgency': rec.urgency_score
                    }
                    for rec in sorted(recommendations, key=lambda x: x.urgency_score, reverse=True)[:3]
                ]
            }
            
            return {
                'market_efficiency': league_profile.market_efficiency,
                'top_positions': top_positions,
                'budget_recommendations': budget_recommendations,
                'market_trends': [
                    f"Average recommended bid: ${int(np.mean([rec.recommended_bid for rec in recommendations]))}",
                    f"High priority targets: {len([rec for rec in recommendations if rec.urgency_score > 0.7])}",
                    f"Market value range: ${min([rec.market_value for rec in recommendations])} - ${max([rec.market_value for rec in recommendations])}"
                ]
            }
            
        except Exception as e:
            logger.error(f"Error calculating market intelligence: {e}")
            return {}
    
    async def analyze_bidding_patterns(self, bidding_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze bidding patterns in the league"""
        try:
            if not bidding_history:
                return {}
            
            # Analyze bid timing patterns
            bid_times = [bid.get('bid_time', 0) for bid in bidding_history]
            
            # Analyze bid amount patterns
            bid_amounts = [bid.get('amount', 0) for bid in bidding_history]
            
            return {
                'average_bid_time': np.mean(bid_times) if bid_times else 0,
                'bid_amount_distribution': {
                    'mean': np.mean(bid_amounts) if bid_amounts else 0,
                    'std': np.std(bid_amounts) if bid_amounts else 0,
                    'min': min(bid_amounts) if bid_amounts else 0,
                    'max': max(bid_amounts) if bid_amounts else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing bidding patterns: {e}")
            return {}
    
    async def calculate_market_efficiency(self, bidding_history: List[Dict[str, Any]]) -> float:
        """Calculate market efficiency score"""
        try:
            if not bidding_history:
                return 0.0
            
            # Simple market efficiency calculation
            # This would be more sophisticated in a real implementation
            bid_amounts = [bid.get('amount', 0) for bid in bidding_history]
            
            # Calculate coefficient of variation as efficiency measure
            if np.mean(bid_amounts) > 0:
                cv = np.std(bid_amounts) / np.mean(bid_amounts)
                efficiency = max(0.0, 1.0 - cv)  # Lower CV = higher efficiency
                return efficiency
            
            return 0.0
            
        except Exception as e:
            logger.error(f"Error calculating market efficiency: {e}")
            return 0.0
