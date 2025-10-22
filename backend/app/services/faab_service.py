from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import statistics
import math
from app.services.espn_service import ESPNService
from app.core.database import get_supabase
import logging

logger = logging.getLogger(__name__)

class FAABService:
    def __init__(self):
        self.espn_service = ESPNService()
        self.supabase = get_supabase()
    
    def get_waiver_wire_players(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get available waiver wire players"""
        try:
            if not self.espn_service.league:
                return []
            
            # Get free agents from ESPN
            free_agents = self.espn_service.league.free_agents()
            
            players_data = []
            for player in free_agents:
                players_data.append({
                    "espn_player_id": player.playerId,
                    "name": player.name,
                    "position": player.position,
                    "pro_team": player.proTeam,
                    "projected_points": getattr(player, 'projected_points', 0),
                    "ownership_percentage": getattr(player, 'ownership_percentage', 0),
                    "injury_status": getattr(player, 'injury_status', 'Healthy'),
                    "last_updated": datetime.utcnow().isoformat()
                })
            
            return players_data
            
        except Exception as e:
            logger.error(f"Error getting waiver wire players: {e}")
            return []
    
    def calculate_faab_recommendations(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Calculate FAAB bid recommendations for available players"""
        try:
            players = self.get_waiver_wire_players(week)
            if not players:
                return []
            
            recommendations = []
            for player in players:
                recommendation = self._calculate_player_recommendation(player, week)
                if recommendation:
                    recommendations.append(recommendation)
            
            # Sort by recommended bid amount (highest first)
            recommendations.sort(key=lambda x: x['recommended_bid'], reverse=True)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error calculating FAAB recommendations: {e}")
            return []
    
    def _calculate_player_recommendation(self, player: Dict[str, Any], week: Optional[int]) -> Optional[Dict[str, Any]]:
        """Calculate FAAB recommendation for a specific player"""
        try:
            # Base factors for FAAB calculation
            base_value = self._get_base_player_value(player)
            position_scarcity = self._get_position_scarcity(player['position'])
            injury_impact = self._get_injury_impact(player.get('injury_status', 'Healthy'))
            ownership_impact = self._get_ownership_impact(player.get('ownership_percentage', 0))
            week_context = self._get_week_context(week)
            
            # Calculate recommended bid
            recommended_bid = self._calculate_bid_amount(
                base_value, position_scarcity, injury_impact, ownership_impact, week_context
            )
            
            # Only recommend if bid is above minimum threshold
            if recommended_bid < 5:
                return None
            
            return {
                "player": player,
                "recommended_bid": recommended_bid,
                "confidence": self._calculate_confidence(base_value, position_scarcity),
                "reasoning": self._generate_reasoning(player, recommended_bid, base_value, position_scarcity),
                "alternatives": self._get_alternative_players(player['position']),
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating player recommendation: {e}")
            return None
    
    def _get_base_player_value(self, player: Dict[str, Any]) -> float:
        """Get base value for a player based on projected points and position"""
        try:
            projected_points = player.get('projected_points', 0)
            position = player.get('position', '')
            
            # Position multipliers
            position_multipliers = {
                'QB': 1.2,
                'RB': 1.5,
                'WR': 1.3,
                'TE': 1.1,
                'K': 0.8,
                'D/ST': 0.9
            }
            
            multiplier = position_multipliers.get(position, 1.0)
            return projected_points * multiplier
            
        except Exception as e:
            logger.error(f"Error getting base player value: {e}")
            return 0.0
    
    def _get_position_scarcity(self, position: str) -> float:
        """Get position scarcity factor"""
        scarcity_factors = {
            'RB': 1.4,  # Running backs are most scarce
            'TE': 1.3,  # Tight ends are scarce
            'WR': 1.1,  # Wide receivers are moderately scarce
            'QB': 1.0,  # Quarterbacks are plentiful
            'K': 0.9,   # Kickers are very plentiful
            'D/ST': 0.9 # Defenses are plentiful
        }
        
        return scarcity_factors.get(position, 1.0)
    
    def _get_injury_impact(self, injury_status: str) -> float:
        """Get injury impact factor"""
        injury_factors = {
            'Healthy': 1.0,
            'Questionable': 0.8,
            'Doubtful': 0.5,
            'Out': 0.2,
            'IR': 0.1
        }
        
        return injury_factors.get(injury_status, 1.0)
    
    def _get_ownership_impact(self, ownership_percentage: float) -> float:
        """Get ownership percentage impact factor"""
        # Lower ownership = higher value (more available)
        if ownership_percentage < 10:
            return 1.3
        elif ownership_percentage < 25:
            return 1.1
        elif ownership_percentage < 50:
            return 1.0
        else:
            return 0.8
    
    def _get_week_context(self, week: Optional[int]) -> float:
        """Get week context factor"""
        if not week:
            return 1.0
        
        # Early season = higher FAAB values
        if week <= 4:
            return 1.2
        elif week <= 8:
            return 1.1
        elif week <= 12:
            return 1.0
        else:
            return 0.9  # Late season = lower FAAB values
    
    def _calculate_bid_amount(self, base_value: float, position_scarcity: float, 
                            injury_impact: float, ownership_impact: float, week_context: float) -> int:
        """Calculate recommended bid amount"""
        try:
            # Combine all factors
            combined_value = base_value * position_scarcity * injury_impact * ownership_impact * week_context
            
            # Convert to FAAB bid amount (scale factor)
            bid_amount = int(combined_value * 2.5)  # Adjust scaling as needed
            
            # Apply reasonable bounds
            bid_amount = max(5, min(bid_amount, 200))  # Between $5 and $200
            
            # Round to nearest $5
            bid_amount = round(bid_amount / 5) * 5
            
            return bid_amount
            
        except Exception as e:
            logger.error(f"Error calculating bid amount: {e}")
            return 10  # Default minimum bid
    
    def _calculate_confidence(self, base_value: float, position_scarcity: float) -> str:
        """Calculate confidence level for recommendation"""
        try:
            confidence_score = (base_value * position_scarcity) / 20  # Normalize
            
            if confidence_score >= 8:
                return "High"
            elif confidence_score >= 5:
                return "Medium"
            else:
                return "Low"
                
        except Exception as e:
            logger.error(f"Error calculating confidence: {e}")
            return "Low"
    
    def _generate_reasoning(self, player: Dict[str, Any], bid_amount: int, 
                          base_value: float, position_scarcity: float) -> str:
        """Generate reasoning for the recommendation"""
        try:
            reasons = []
            
            if base_value > 15:
                reasons.append("High projected points")
            elif base_value > 10:
                reasons.append("Good projected points")
            
            if position_scarcity > 1.2:
                reasons.append("Scarce position")
            
            if player.get('ownership_percentage', 0) < 25:
                reasons.append("Low ownership")
            
            if player.get('injury_status', 'Healthy') == 'Healthy':
                reasons.append("Healthy status")
            
            if not reasons:
                reasons.append("Decent value play")
            
            return f"Recommended ${bid_amount} bid. {', '.join(reasons)}."
            
        except Exception as e:
            logger.error(f"Error generating reasoning: {e}")
            return f"Recommended ${bid_amount} bid based on player analysis."
    
    def _get_alternative_players(self, position: str) -> List[Dict[str, Any]]:
        """Get alternative players at the same position"""
        try:
            # This would typically query the database for similar players
            # For now, return empty list
            return []
            
        except Exception as e:
            logger.error(f"Error getting alternative players: {e}")
            return []
    
    def get_faab_market_analysis(self, week: Optional[int] = None) -> Dict[str, Any]:
        """Get overall FAAB market analysis"""
        try:
            recommendations = self.calculate_faab_recommendations(week)
            
            if not recommendations:
                return {
                    "total_players": 0,
                    "high_value_players": 0,
                    "average_bid": 0,
                    "position_breakdown": {},
                    "market_insights": ["No waiver wire data available"]
                }
            
            # Calculate market statistics
            total_players = len(recommendations)
            high_value_players = len([r for r in recommendations if r['recommended_bid'] >= 50])
            average_bid = statistics.mean([r['recommended_bid'] for r in recommendations])
            
            # Position breakdown
            position_breakdown = {}
            for rec in recommendations:
                pos = rec['player']['position']
                if pos not in position_breakdown:
                    position_breakdown[pos] = 0
                position_breakdown[pos] += 1
            
            # Market insights
            insights = []
            if high_value_players > 0:
                insights.append(f"{high_value_players} high-value players available")
            
            if average_bid > 30:
                insights.append("Strong waiver wire this week")
            elif average_bid < 15:
                insights.append("Weak waiver wire this week")
            
            if 'RB' in position_breakdown and position_breakdown['RB'] > 2:
                insights.append("Multiple RB options available")
            
            return {
                "total_players": total_players,
                "high_value_players": high_value_players,
                "average_bid": round(average_bid, 1),
                "position_breakdown": position_breakdown,
                "market_insights": insights,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting FAAB market analysis: {e}")
            return {
                "total_players": 0,
                "high_value_players": 0,
                "average_bid": 0,
                "position_breakdown": {},
                "market_insights": ["Error analyzing market"]
            }
