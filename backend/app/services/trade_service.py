from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import statistics
from app.services.espn_service import ESPNService
from app.core.database import get_supabase
import logging

logger = logging.getLogger(__name__)

class TradeService:
    def __init__(self):
        self.espn_service = ESPNService()
        self.supabase = get_supabase()
    
    def get_league_trades(self, week: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get all trades in the league"""
        try:
            if not self.espn_service.league:
                return []
            
            # Get recent activity (trades)
            recent_activity = self.espn_service.league.recent_activity(size=100, msg_type='trade')
            
            trades_data = []
            for activity in recent_activity:
                if hasattr(activity, 'actions') and activity.actions:
                    trade_data = self._parse_trade_activity(activity)
                    if trade_data:
                        trades_data.append(trade_data)
            
            # Filter by week if specified
            if week:
                trades_data = [trade for trade in trades_data if trade.get('week') == week]
            
            return trades_data
            
        except Exception as e:
            logger.error(f"Error getting league trades: {e}")
            return []
    
    def _parse_trade_activity(self, activity) -> Optional[Dict[str, Any]]:
        """Parse trade activity from ESPN"""
        try:
            # Extract trade information
            trade_data = {
                "trade_id": getattr(activity, 'id', ''),
                "date": getattr(activity, 'date', datetime.utcnow().isoformat()),
                "week": getattr(activity, 'scoringPeriodId', 0),
                "teams_involved": [],
                "players_traded": [],
                "trade_value": 0,
                "trade_analysis": {}
            }
            
            # Parse trade actions
            if hasattr(activity, 'actions') and activity.actions:
                for action in activity.actions:
                    if hasattr(action, 'teamId') and hasattr(action, 'playerId'):
                        team_id = action.teamId
                        player_id = action.playerId
                        
                        # Get team name
                        team_name = self._get_team_name(team_id)
                        
                        # Get player name
                        player_name = self._get_player_name(player_id)
                        
                        trade_data["teams_involved"].append({
                            "team_id": team_id,
                            "team_name": team_name
                        })
                        
                        trade_data["players_traded"].append({
                            "player_id": player_id,
                            "player_name": player_name,
                            "team_id": team_id,
                            "team_name": team_name
                        })
            
            # Remove duplicates
            trade_data["teams_involved"] = list({team["team_id"]: team for team in trade_data["teams_involved"]}.values())
            
            # Calculate trade value
            trade_data["trade_value"] = self._calculate_trade_value(trade_data["players_traded"])
            
            # Analyze trade
            trade_data["trade_analysis"] = self._analyze_trade(trade_data)
            
            return trade_data
            
        except Exception as e:
            logger.error(f"Error parsing trade activity: {e}")
            return None
    
    def _get_team_name(self, team_id: int) -> str:
        """Get team name by ID"""
        try:
            if self.espn_service.league:
                for team in self.espn_service.league.teams:
                    if team.team_id == team_id:
                        return team.team_name
            return f"Team {team_id}"
        except:
            return f"Team {team_id}"
    
    def _get_player_name(self, player_id: int) -> str:
        """Get player name by ID"""
        try:
            if self.espn_service.league:
                player_info = self.espn_service.league.player_info(player_id)
                if player_info:
                    return player_info.name
            return f"Player {player_id}"
        except:
            return f"Player {player_id}"
    
    def _calculate_trade_value(self, players_traded: List[Dict[str, Any]]) -> float:
        """Calculate total trade value"""
        try:
            total_value = 0.0
            
            for player in players_traded:
                # This is a simplified calculation
                # In a real system, you'd use more sophisticated player valuation
                player_value = self._get_player_value(player["player_id"])
                total_value += player_value
            
            return total_value
            
        except Exception as e:
            logger.error(f"Error calculating trade value: {e}")
            return 0.0
    
    def _get_player_value(self, player_id: int) -> float:
        """Get player value (simplified)"""
        try:
            # This is a placeholder - in a real system, you'd use:
            # - Projected points
            # - Position scarcity
            # - Age and injury history
            # - Recent performance trends
            
            # For now, return a random value between 10-50
            import random
            return random.uniform(10, 50)
            
        except Exception as e:
            logger.error(f"Error getting player value: {e}")
            return 25.0  # Default value
    
    def _analyze_trade(self, trade_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze trade fairness and impact"""
        try:
            analysis = {
                "fairness_score": 0.0,
                "winner": None,
                "impact_analysis": {},
                "recommendations": []
            }
            
            # Calculate fairness score (simplified)
            teams = trade_data["teams_involved"]
            if len(teams) == 2:
                team1_players = [p for p in trade_data["players_traded"] if p["team_id"] == teams[0]["team_id"]]
                team2_players = [p for p in trade_data["players_traded"] if p["team_id"] == teams[1]["team_id"]]
                
                team1_value = sum(self._get_player_value(p["player_id"]) for p in team1_players)
                team2_value = sum(self._get_player_value(p["player_id"]) for p in team2_players)
                
                # Calculate fairness (closer to 1.0 = more fair)
                if team1_value > 0 and team2_value > 0:
                    fairness_ratio = min(team1_value, team2_value) / max(team1_value, team2_value)
                    analysis["fairness_score"] = fairness_ratio
                    
                    # Determine winner
                    if team1_value > team2_value * 1.2:
                        analysis["winner"] = teams[0]["team_name"]
                    elif team2_value > team1_value * 1.2:
                        analysis["winner"] = teams[1]["team_name"]
                    else:
                        analysis["winner"] = "Fair trade"
                
                # Generate recommendations
                if analysis["fairness_score"] < 0.7:
                    analysis["recommendations"].append("Trade appears unbalanced")
                elif analysis["fairness_score"] > 0.9:
                    analysis["recommendations"].append("Very fair trade")
                else:
                    analysis["recommendations"].append("Reasonable trade")
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing trade: {e}")
            return {
                "fairness_score": 0.5,
                "winner": "Unknown",
                "impact_analysis": {},
                "recommendations": ["Unable to analyze trade"]
            }
    
    def get_trade_tree(self, team_id: Optional[int] = None) -> Dict[str, Any]:
        """Get trade tree visualization data"""
        try:
            all_trades = self.get_league_trades()
            
            if team_id:
                # Filter trades involving specific team
                team_trades = []
                for trade in all_trades:
                    if any(team["team_id"] == team_id for team in trade["teams_involved"]):
                        team_trades.append(trade)
                trades = team_trades
            else:
                trades = all_trades
            
            # Build trade tree structure
            tree_data = {
                "nodes": [],
                "links": [],
                "total_trades": len(trades),
                "teams_involved": set(),
                "players_traded": set()
            }
            
            for trade in trades:
                # Add team nodes
                for team in trade["teams_involved"]:
                    if team["team_id"] not in [node["id"] for node in tree_data["nodes"] if node["type"] == "team"]:
                        tree_data["nodes"].append({
                            "id": team["team_id"],
                            "name": team["team_name"],
                            "type": "team",
                            "trades_count": 1
                        })
                        tree_data["teams_involved"].add(team["team_id"])
                    else:
                        # Update trade count
                        for node in tree_data["nodes"]:
                            if node["id"] == team["team_id"] and node["type"] == "team":
                                node["trades_count"] += 1
                
                # Add player nodes
                for player in trade["players_traded"]:
                    if player["player_id"] not in [node["id"] for node in tree_data["nodes"] if node["type"] == "player"]:
                        tree_data["nodes"].append({
                            "id": player["player_id"],
                            "name": player["player_name"],
                            "type": "player",
                            "position": self._get_player_position(player["player_id"])
                        })
                        tree_data["players_traded"].add(player["player_id"])
                
                # Add trade links
                trade_id = f"trade_{trade['trade_id']}"
                tree_data["nodes"].append({
                    "id": trade_id,
                    "name": f"Trade {trade['date'][:10]}",
                    "type": "trade",
                    "value": trade["trade_value"],
                    "fairness": trade["trade_analysis"]["fairness_score"]
                })
                
                # Link teams to trade
                for team in trade["teams_involved"]:
                    tree_data["links"].append({
                        "source": team["team_id"],
                        "target": trade_id,
                        "type": "team_to_trade"
                    })
                
                # Link players to trade
                for player in trade["players_traded"]:
                    tree_data["links"].append({
                        "source": player["player_id"],
                        "target": trade_id,
                        "type": "player_to_trade"
                    })
            
            return tree_data
            
        except Exception as e:
            logger.error(f"Error getting trade tree: {e}")
            return {
                "nodes": [],
                "links": [],
                "total_trades": 0,
                "teams_involved": set(),
                "players_traded": set()
            }
    
    def _get_player_position(self, player_id: int) -> str:
        """Get player position"""
        try:
            if self.espn_service.league:
                player_info = self.espn_service.league.player_info(player_id)
                if player_info:
                    return player_info.position
            return "Unknown"
        except:
            return "Unknown"
    
    def get_trade_analytics(self) -> Dict[str, Any]:
        """Get comprehensive trade analytics"""
        try:
            all_trades = self.get_league_trades()
            
            if not all_trades:
                return {
                    "total_trades": 0,
                    "average_trade_value": 0,
                    "most_active_teams": [],
                    "trade_frequency": {},
                    "position_breakdown": {},
                    "insights": ["No trade data available"]
                }
            
            # Calculate analytics
            total_trades = len(all_trades)
            average_trade_value = statistics.mean([trade["trade_value"] for trade in all_trades])
            
            # Most active teams
            team_activity = {}
            for trade in all_trades:
                for team in trade["teams_involved"]:
                    team_id = team["team_id"]
                    if team_id not in team_activity:
                        team_activity[team_id] = {"name": team["team_name"], "count": 0}
                    team_activity[team_id]["count"] += 1
            
            most_active_teams = sorted(team_activity.items(), key=lambda x: x[1]["count"], reverse=True)[:5]
            
            # Trade frequency by week
            trade_frequency = {}
            for trade in all_trades:
                week = trade.get("week", 0)
                if week not in trade_frequency:
                    trade_frequency[week] = 0
                trade_frequency[week] += 1
            
            # Position breakdown
            position_breakdown = {}
            for trade in all_trades:
                for player in trade["players_traded"]:
                    position = self._get_player_position(player["player_id"])
                    if position not in position_breakdown:
                        position_breakdown[position] = 0
                    position_breakdown[position] += 1
            
            # Generate insights
            insights = []
            if total_trades > 10:
                insights.append("Active trading league")
            elif total_trades < 3:
                insights.append("Conservative trading league")
            
            if average_trade_value > 100:
                insights.append("High-value trades common")
            elif average_trade_value < 50:
                insights.append("Low-value trades common")
            
            if len(most_active_teams) > 0:
                most_active = most_active_teams[0][1]
                insights.append(f"{most_active['name']} is the most active trader")
            
            return {
                "total_trades": total_trades,
                "average_trade_value": round(average_trade_value, 1),
                "most_active_teams": [{"name": data["name"], "trades": data["count"]} for _, data in most_active_teams],
                "trade_frequency": trade_frequency,
                "position_breakdown": position_breakdown,
                "insights": insights,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting trade analytics: {e}")
            return {
                "total_trades": 0,
                "average_trade_value": 0,
                "most_active_teams": [],
                "trade_frequency": {},
                "position_breakdown": {},
                "insights": ["Error analyzing trades"]
            }
