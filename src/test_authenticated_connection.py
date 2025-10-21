#!/usr/bin/env python3
"""
Test script to verify ESPN Fantasy Football league connection with user's authentication cookies.
"""

import sys
import os
from datetime import datetime

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from espn_api.football import League

# Your league information and credentials
LEAGUE_ID = 637913
SEASON_YEAR = 2025
ESPN_S2 = "AEBa4ko%2BALL%2Fhgg1vGCoFTT9J26cpyirymHOF3FIJzgkXbUhqkoFSZsa%2FvyRm%2FD%2FxLAnvEQyG8MgYmw6TIC3Ep78hAiefvTj%2Fi%2FkKsusCaJh8EwfoJyqu4%2Fs4IqOPuz%2BIUt8z9S%2BBsdV2COvzMW4x9Zrel1pSFEH%2BgvwZHBEgcVJrKLBjZILGYz7uDeRXAb14NTaqw%2B9HOoVN9UxLk0q9PJy3aXr3KsNlmx6v2g%2BH29Bhe3LNWVdT10tgI3FCmeA9fksOy4DR054g6x49rxkDRhw"
SWID = "{E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}"

def test_authenticated_connection():
    """Test connection to the user's league with authentication"""
    print("🏈 Testing ESPN Fantasy Football League Connection")
    print("=" * 60)
    print(f"League ID: {LEAGUE_ID}")
    print(f"Season: {SEASON_YEAR}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    print("\n🔗 Attempting authenticated connection...")
    
    try:
        # Create league object with authentication
        league = League(
            league_id=LEAGUE_ID,
            year=SEASON_YEAR,
            espn_s2=ESPN_S2,
            swid=SWID,
            debug=False  # Set to True if you want to see API requests
        )
        
        print("✅ Successfully connected to your league!")
        print(f"   League Name: {league.settings.name}")
        print(f"   League ID: {LEAGUE_ID}")
        print(f"   Season: {SEASON_YEAR}")
        print(f"   Number of Teams: {league.settings.team_count}")
        print(f"   Regular Season Games: {league.settings.reg_season_count}")
        
        return league
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        
        # Print more detailed error information
        import traceback
        print("\n🔍 Full error traceback:")
        traceback.print_exc()
        
        return None

def display_league_data(league):
    """Display comprehensive league data"""
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
    
    # Display additional settings
    print(f"   Veto Votes Required: {league.settings.veto_votes_required}")
    if hasattr(league.settings, 'keeper_count'):
        print(f"   Keeper Count: {league.settings.keeper_count}")

def display_standings(league):
    """Display current league standings"""
    print(f"\n🏆 Current Standings:")
    
    try:
        standings = league.standings()
        
        for i, team in enumerate(standings, 1):
            print(f"   {i:2d}. {team.team_name:<25} ({team.wins}-{team.losses})")
            if hasattr(team, 'points_for') and team.points_for:
                print(f"       Points For: {team.points_for:.2f}")
            
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
            if hasattr(team, 'wins') and hasattr(team, 'losses'):
                print(f"     Record: {team.wins}-{team.losses}")
            
    except Exception as e:
        print(f"   ❌ Could not fetch teams: {str(e)}")

def display_recent_activity(league):
    """Display recent league activity"""
    print(f"\n📰 Recent League Activity:")
    
    try:
        # Get the last 10 activities
        activities = league.recent_activity(size=10)
        
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

def display_free_agents(league):
    """Display top free agents"""
    print(f"\n🆓 Top Free Agents:")
    
    try:
        # Get top 10 free agents
        free_agents = league.free_agents(size=10)
        
        if not free_agents:
            print("   No free agents found")
            return
            
        for i, player in enumerate(free_agents, 1):
            print(f"   {i:2d}. {player.name} ({player.position})")
            if hasattr(player, 'proTeam'):
                print(f"       Team: {player.proTeam}")
            
    except Exception as e:
        print(f"   ❌ Could not fetch free agents: {str(e)}")

def main():
    """Main function"""
    # Test connection
    league = test_authenticated_connection()
    
    if league is None:
        print("\n❌ Cannot proceed without a valid league connection.")
        return
    
    # Display all available data
    display_league_data(league)
    display_standings(league)
    display_teams(league)
    display_recent_activity(league)
    display_free_agents(league)
    
    print(f"\n🎉 Success! Your ESPN Fantasy Football toolkit is working!")
    print(f"\n📝 Available data includes:")
    print(f"   • League settings and configuration")
    print(f"   • Team standings and records")
    print(f"   • Player rosters and stats")
    print(f"   • Recent transactions and activity")
    print(f"   • Free agents and waiver wire")
    print(f"   • Matchup data and scores")
    
    print(f"\n🚀 Next steps:")
    print(f"   • Build analysis modules for deeper insights")
    print(f"   • Create automated reports and dashboards")
    print(f"   • Add features like waiver wire analysis and matchup predictions")

if __name__ == "__main__":
    main()
