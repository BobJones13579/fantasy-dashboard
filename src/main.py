#!/usr/bin/env python3
"""
ESPN Fantasy Football Personal Data Toolkit - Main Entry Point

This script connects to your ESPN Fantasy Football league and displays
basic information about your league, teams, and current standings.
"""

import sys
import os
from datetime import datetime

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from espn_api.football import League

# Your league information
LEAGUE_ID = 637913
SEASON_YEAR = 2025

def print_header():
    """Print a nice header for the application"""
    print("🏈 ESPN Fantasy Football Personal Data Toolkit")
    print("=" * 60)
    print(f"League ID: {LEAGUE_ID}")
    print(f"Season: {SEASON_YEAR}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

def test_league_connection():
    """Test connection to the user's specific league"""
    print("\n🔗 Testing connection to your league...")
    
    try:
        # Try to connect to the league
        league = League(league_id=LEAGUE_ID, year=SEASON_YEAR, debug=False)
        
        print(f"✅ Successfully connected to league!")
        print(f"   League Name: {league.settings.name}")
        print(f"   League ID: {league.settings.league_id}")
        print(f"   Season: {league.settings.season_id}")
        print(f"   Number of Teams: {league.settings.team_count}")
        print(f"   Regular Season Games: {league.settings.reg_season_count}")
        
        return league
        
    except Exception as e:
        print(f"❌ Failed to connect to league: {str(e)}")
        print("\n💡 This might be because:")
        print("   - The league is private and requires authentication cookies")
        print("   - The league ID or season is incorrect")
        print("   - ESPN's API is temporarily unavailable")
        print("   - The league doesn't exist or isn't accessible")
        
        return None

def display_league_info(league):
    """Display basic league information"""
    print(f"\n📊 League Information:")
    print(f"   Name: {league.settings.name}")
    print(f"   Teams: {league.settings.team_count}")
    print(f"   Regular Season: {league.settings.reg_season_count} games")
    print(f"   Playoff Teams: {league.settings.playoff_team_count}")
    
    # Check if league uses FAAB
    if hasattr(league.settings, 'faab') and league.settings.faab:
        print(f"   FAAB Budget: ${league.settings.acquisition_budget}")
    
    # Display scoring format if available
    if hasattr(league.settings, 'scoring_format'):
        print(f"   Scoring Categories: {len(league.settings.scoring_format)}")

def display_standings(league):
    """Display current league standings"""
    print(f"\n🏆 Current Standings:")
    
    try:
        standings = league.standings()
        
        for i, team in enumerate(standings, 1):
            print(f"   {i:2d}. {team.team_name:<20} ({team.wins}-{team.losses})")
            
    except Exception as e:
        print(f"   ❌ Could not fetch standings: {str(e)}")

def display_teams(league):
    """Display all teams in the league"""
    print(f"\n👥 Teams in League:")
    
    try:
        teams = league.teams
        
        for team in teams:
            print(f"   • {team.team_name} (ID: {team.team_id})")
            if hasattr(team, 'owner') and team.owner:
                print(f"     Owner: {team.owner}")
            
    except Exception as e:
        print(f"   ❌ Could not fetch teams: {str(e)}")

def display_recent_activity(league):
    """Display recent league activity"""
    print(f"\n📰 Recent League Activity:")
    
    try:
        # Get the last 5 activities
        activities = league.recent_activity(size=5)
        
        if not activities:
            print("   No recent activity found")
            return
            
        for activity in activities:
            print(f"   • {activity.date}: {activity.msg_type}")
            for action in activity.actions:
                team, action_type, player = action
                print(f"     {team.team_name} {action_type} {player}")
                
    except Exception as e:
        print(f"   ❌ Could not fetch recent activity: {str(e)}")

def main():
    """Main application entry point"""
    print_header()
    
    # Test connection to the league
    league = test_league_connection()
    
    if league is None:
        print("\n❌ Cannot proceed without a valid league connection.")
        print("\n🔧 Troubleshooting steps:")
        print("   1. Verify your league ID and season year")
        print("   2. Check if your league is public or private")
        print("   3. For private leagues, you'll need ESPN cookies (espn_s2, swid)")
        print("   4. Try running with debug=True to see detailed error messages")
        return
    
    # Display league information
    display_league_info(league)
    display_standings(league)
    display_teams(league)
    display_recent_activity(league)
    
    print(f"\n🎉 Success! Your ESPN Fantasy Football toolkit is working!")
    print(f"\n📝 Next steps:")
    print(f"   • Explore the data available in your league")
    print(f"   • Build analysis modules for deeper insights")
    print(f"   • Create automated reports and dashboards")
    print(f"   • Add features like waiver wire analysis and matchup predictions")

if __name__ == "__main__":
    main()
