#!/usr/bin/env python3
"""
Fantasy Football Odds Engine Prototype
Inspired by Fantom Odds - Real-time odds calculation for League TB12
"""

import sys
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from espn_api.football import League

# Your league information and credentials
LEAGUE_ID = 637913
SEASON_YEAR = 2025
ESPN_S2 = "AEBa4ko%2BALL%2Fhgg1vGCoFTT9J26cpyirymHOF3FIJzgkXbUhqkoFSZsa%2FvyRm%2FD%2FxLAnvEQyG8MgYmw6TIC3Ep78hAiefvTj%2Fi%2FkKsusCaJh8EwfoJyqu4%2Fs4IqOPuz%2BIUt8z9S%2BBsdV2COvzMW4x9Zrel1pSFEH%2BgvwZHBEgcVJrKLBjZILGYz7uDeRXAb14NTaqw%2B9HOoVN9UxLk0q9PJy3aXr3KsNlmx6v2g%2BH29Bhe3LNWVdT10tgI3FCmeA9fksOy4DR054g6x49rxkDRhw"
SWID = "{E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}"

class OddsCalculator:
    """Core odds calculation engine"""
    
    @staticmethod
    def calculate_moneyline_odds(team1_projection: float, team2_projection: float) -> Tuple[int, int]:
        """
        Calculate moneyline odds based on projected scores
        Returns: (team1_odds, team2_odds)
        """
        total = team1_projection + team2_projection
        team1_prob = team1_projection / total
        
        if team1_prob > 0.5:
            # Team 1 is favorite (negative odds)
            team1_odds = -100 * team1_prob / (1 - team1_prob)
            team2_odds = 100 * (1 - team1_prob) / team1_prob
        else:
            # Team 2 is favorite (positive odds)
            team1_odds = 100 * (1 - team1_prob) / team1_prob
            team2_odds = -100 * team1_prob / (1 - team1_prob)
        
        return (round(team1_odds), round(team2_odds))
    
    @staticmethod
    def calculate_spread(team1_projection: float, team2_projection: float) -> float:
        """
        Calculate point spread between teams
        """
        spread = team1_projection - team2_projection
        return round(spread * 2) / 2  # Round to nearest 0.5
    
    @staticmethod
    def calculate_matchup_total(team1_projection: float, team2_projection: float) -> float:
        """
        Calculate total points for matchup
        """
        total = team1_projection + team2_projection
        return round(total * 2) / 2  # Round to nearest 0.5

class Market:
    """Base class for all betting markets"""
    
    def __init__(self, market_type: str, week: int):
        self.market_type = market_type
        self.week = week
        self.created_at = datetime.now()
        self.status = "active"
    
    def get_odds(self) -> Dict:
        """Get current odds for this market"""
        raise NotImplementedError

class MoneylineMarket(Market):
    """Moneyline betting market"""
    
    def __init__(self, team1, team2, week: int):
        super().__init__("moneyline", week)
        self.team1 = team1
        self.team2 = team2
        self.odds = self.calculate_odds()
    
    def calculate_odds(self) -> Tuple[int, int]:
        """Calculate moneyline odds"""
        # For prototype, we'll use team records as proxy for projections
        team1_strength = self.team1.wins + (self.team1.points_for / 100)
        team2_strength = self.team2.wins + (self.team2.points_for / 100)
        
        return OddsCalculator.calculate_moneyline_odds(team1_strength, team2_strength)
    
    def get_odds(self) -> Dict:
        """Get moneyline odds"""
        return {
            "market_type": "moneyline",
            "week": self.week,
            "team1": {
                "name": self.team1.team_name,
                "odds": self.odds[0],
                "record": f"{self.team1.wins}-{self.team1.losses}"
            },
            "team2": {
                "name": self.team2.team_name,
                "odds": self.odds[1],
                "record": f"{self.team2.wins}-{self.team2.losses}"
            }
        }

class SpreadMarket(Market):
    """Spread betting market"""
    
    def __init__(self, team1, team2, week: int):
        super().__init__("spread", week)
        self.team1 = team1
        self.team2 = team2
        self.spread = self.calculate_spread()
        self.odds = (+100, +100)  # Even money for base spread
    
    def calculate_spread(self) -> float:
        """Calculate point spread"""
        team1_strength = self.team1.wins + (self.team1.points_for / 100)
        team2_strength = self.team2.wins + (self.team2.points_for / 100)
        
        return OddsCalculator.calculate_spread(team1_strength, team2_strength)
    
    def get_odds(self) -> Dict:
        """Get spread odds"""
        return {
            "market_type": "spread",
            "week": self.week,
            "spread": self.spread,
            "team1": {
                "name": self.team1.team_name,
                "spread": f"-{self.spread}" if self.spread > 0 else f"+{abs(self.spread)}",
                "odds": self.odds[0]
            },
            "team2": {
                "name": self.team2.team_name,
                "spread": f"+{self.spread}" if self.spread > 0 else f"-{abs(self.spread)}",
                "odds": self.odds[1]
            }
        }

class TotalsMarket(Market):
    """Totals betting market"""
    
    def __init__(self, team1, team2, week: int):
        super().__init__("totals", week)
        self.team1 = team1
        self.team2 = team2
        self.matchup_total = self.calculate_total()
        self.odds = (+100, +100)  # Even money for base total
    
    def calculate_total(self) -> float:
        """Calculate matchup total"""
        team1_strength = self.team1.wins + (self.team1.points_for / 100)
        team2_strength = self.team2.wins + (self.team2.points_for / 100)
        
        return OddsCalculator.calculate_matchup_total(team1_strength, team2_strength)
    
    def get_odds(self) -> Dict:
        """Get totals odds"""
        return {
            "market_type": "totals",
            "week": self.week,
            "total": self.matchup_total,
            "over": {
                "line": f"Over {self.matchup_total}",
                "odds": self.odds[0]
            },
            "under": {
                "line": f"Under {self.matchup_total}",
                "odds": self.odds[1]
            }
        }

class OddsEngine:
    """Main odds engine for League TB12"""
    
    def __init__(self, league):
        self.league = league
        self.markets = []
        self.week = self.get_current_week()
    
    def get_current_week(self) -> int:
        """Get current week of the season"""
        # For prototype, we'll use a fixed week
        return 12  # Current week based on your league data
    
    def create_weekly_markets(self) -> List[Market]:
        """Create all markets for the current week"""
        markets = []
        
        # Get current week matchups
        try:
            matchups = self.league.scoreboard(week=self.week)
        except:
            # If no matchups available, create sample matchups
            matchups = self.create_sample_matchups()
        
        for matchup in matchups:
            # Create moneyline market
            moneyline = MoneylineMarket(matchup.home_team, matchup.away_team, self.week)
            markets.append(moneyline)
            
            # Create spread market
            spread = SpreadMarket(matchup.home_team, matchup.away_team, self.week)
            markets.append(spread)
            
            # Create totals market
            totals = TotalsMarket(matchup.home_team, matchup.away_team, self.week)
            markets.append(totals)
        
        self.markets = markets
        return markets
    
    def create_sample_matchups(self) -> List:
        """Create sample matchups for demonstration"""
        teams = self.league.teams[:4]  # Use first 4 teams
        
        class MockMatchup:
            def __init__(self, home_team, away_team):
                self.home_team = home_team
                self.away_team = away_team
        
        return [
            MockMatchup(teams[0], teams[1]),
            MockMatchup(teams[2], teams[3])
        ]
    
    def get_all_markets(self) -> List[Dict]:
        """Get all markets with their odds"""
        if not self.markets:
            self.create_weekly_markets()
        
        return [market.get_odds() for market in self.markets]
    
    def get_weekly_high_score_odds(self) -> List[Dict]:
        """Get odds for weekly high score"""
        teams = self.league.teams
        high_score_odds = []
        
        for team in teams:
            # Calculate odds based on team performance
            strength = team.wins + (team.points_for / 100)
            total_strength = sum(t.wins + (t.points_for / 100) for t in teams)
            probability = strength / total_strength
            
            if probability > 0.1:  # Only show teams with >10% chance
                odds = 100 * (1 - probability) / probability if probability < 0.5 else -100 * probability / (1 - probability)
                high_score_odds.append({
                    "team": team.team_name,
                    "odds": round(odds),
                    "probability": f"{probability:.1%}"
                })
        
        return sorted(high_score_odds, key=lambda x: x["odds"])

def main():
    """Main function to demonstrate the odds engine"""
    print("🏈 Fantasy Football Odds Engine Prototype")
    print("=" * 60)
    print(f"League: League TB12 (ID: {LEAGUE_ID})")
    print(f"Week: 12 (Current)")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Connect to league
    print("\n🔗 Connecting to League TB12...")
    try:
        league = League(
            league_id=LEAGUE_ID,
            year=SEASON_YEAR,
            espn_s2=ESPN_S2,
            swid=SWID
        )
        print("✅ Connected successfully!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return
    
    # Initialize odds engine
    print("\n🎲 Initializing Odds Engine...")
    odds_engine = OddsEngine(league)
    
    # Create markets
    print("\n📊 Creating Weekly Markets...")
    markets = odds_engine.create_weekly_markets()
    print(f"✅ Created {len(markets)} markets")
    
    # Display moneyline markets
    print("\n💰 Moneyline Markets:")
    moneyline_markets = [m for m in markets if m.market_type == "moneyline"]
    for market in moneyline_markets:
        odds = market.get_odds()
        print(f"   {odds['team1']['name']} ({odds['team1']['odds']:+d}) vs {odds['team2']['name']} ({odds['team2']['odds']:+d})")
        print(f"   Records: {odds['team1']['record']} vs {odds['team2']['record']}")
        print()
    
    # Display spread markets
    print("📏 Spread Markets:")
    spread_markets = [m for m in markets if m.market_type == "spread"]
    for market in spread_markets:
        odds = market.get_odds()
        print(f"   {odds['team1']['name']} {odds['team1']['spread']} ({odds['team1']['odds']:+d})")
        print(f"   {odds['team2']['name']} {odds['team2']['spread']} ({odds['team2']['odds']:+d})")
        print()
    
    # Display totals markets
    print("🎯 Totals Markets:")
    totals_markets = [m for m in markets if m.market_type == "totals"]
    for market in totals_markets:
        odds = market.get_odds()
        print(f"   {odds['over']['line']} ({odds['over']['odds']:+d})")
        print(f"   {odds['under']['line']} ({odds['under']['odds']:+d})")
        print()
    
    # Display weekly high score odds
    print("🏆 Weekly High Score Odds:")
    high_score_odds = odds_engine.get_weekly_high_score_odds()
    for i, team_odds in enumerate(high_score_odds, 1):
        print(f"   {i}. {team_odds['team']} ({team_odds['odds']:+d}) - {team_odds['probability']}")
    
    print(f"\n🎉 Odds Engine Prototype Complete!")
    print(f"\n📝 This demonstrates the core concept from Fantom Odds:")
    print(f"   • Real-time odds calculation")
    print(f"   • Multiple market types (moneyline, spread, totals)")
    print(f"   • League-specific data integration")
    print(f"   • Weekly high score predictions")
    
    print(f"\n🚀 Next steps:")
    print(f"   • Add token system for betting")
    print(f"   • Create web interface for placing bets")
    print(f"   • Implement real-time updates")
    print(f"   • Add player over/under markets")
    print(f"   • Build scoreboard and leaderboard")

if __name__ == "__main__":
    main()
