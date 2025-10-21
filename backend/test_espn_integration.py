#!/usr/bin/env python3
"""
Test script for ESPN API integration
Run this to test the ESPN API connection and data retrieval
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.espn_service import ESPNService

def test_espn_connection():
    """Test ESPN API connection with sample data"""
    print("🧪 Testing ESPN API Integration")
    print("=" * 50)
    
    # Initialize ESPN service
    espn_service = ESPNService()
    
    # Test with a public league (you can replace with your league ID)
    # Note: This is just for testing the connection, not actual data
    test_league_id = 123456  # Replace with actual league ID
    test_year = 2024
    
    print(f"📡 Attempting to connect to ESPN league {test_league_id} for year {test_year}")
    
    # Configure league (without authentication for public league)
    success = espn_service.configure_league(
        league_id=test_league_id,
        year=test_year
    )
    
    if success:
        print("✅ ESPN API connection successful!")
        
        # Test getting league info
        print("\n📊 Testing league info retrieval...")
        league_info = espn_service.get_league_info()
        if league_info:
            print(f"✅ League info retrieved: {league_info.get('name', 'Unknown')}")
            print(f"   Teams: {league_info.get('team_count', 0)}")
            print(f"   Season: {league_info.get('reg_season_count', 0)} games")
        else:
            print("❌ Failed to retrieve league info")
        
        # Test getting teams
        print("\n👥 Testing teams retrieval...")
        teams = espn_service.get_teams()
        if teams:
            print(f"✅ Retrieved {len(teams)} teams")
            for team in teams[:3]:  # Show first 3 teams
                print(f"   - {team['name']} (ID: {team['espn_team_id']})")
        else:
            print("❌ Failed to retrieve teams")
        
        # Test getting matchups
        print("\n🏈 Testing matchups retrieval...")
        matchups = espn_service.get_matchups()
        if matchups:
            print(f"✅ Retrieved {len(matchups)} matchups")
            for matchup in matchups[:2]:  # Show first 2 matchups
                print(f"   - {matchup['home_team']['name']} vs {matchup['away_team']['name']}")
        else:
            print("❌ Failed to retrieve matchups")
        
        # Test getting standings
        print("\n📈 Testing standings retrieval...")
        standings = espn_service.get_standings()
        if standings:
            print(f"✅ Retrieved {len(standings)} team standings")
            for standing in standings[:3]:  # Show top 3
                print(f"   {standing['rank']}. {standing['name']} ({standing['wins']}-{standing['losses']})")
        else:
            print("❌ Failed to retrieve standings")
        
    else:
        print("❌ ESPN API connection failed!")
        print("   This could be due to:")
        print("   - Invalid league ID")
        print("   - Private league requiring authentication")
        print("   - Network connectivity issues")
        print("   - ESPN API changes")
    
    print("\n" + "=" * 50)
    print("🎯 Next Steps:")
    print("1. Replace test_league_id with your actual league ID")
    print("2. If your league is private, add espn_s2 and swid authentication")
    print("3. Test with your actual league data")
    print("4. Integrate with the Supabase database")

def test_with_authentication():
    """Test ESPN API with authentication (if provided)"""
    print("\n🔐 Testing ESPN API with Authentication")
    print("=" * 50)
    
    # Get credentials from environment or user input
    league_id = os.getenv("ESPN_LEAGUE_ID")
    year = int(os.getenv("ESPN_YEAR", "2024"))
    espn_s2 = os.getenv("ESPN_S2")
    swid = os.getenv("ESPN_SWID")
    
    if not league_id:
        print("❌ ESPN_LEAGUE_ID environment variable not set")
        print("   Set it with: export ESPN_LEAGUE_ID=your_league_id")
        return
    
    if not espn_s2 or not swid:
        print("⚠️  ESPN_S2 or ESPN_SWID not set - testing public access only")
        espn_s2 = None
        swid = None
    
    espn_service = ESPNService()
    
    success = espn_service.configure_league(
        league_id=int(league_id),
        year=year,
        espn_s2=espn_s2,
        swid=swid
    )
    
    if success:
        print(f"✅ Connected to league {league_id} for year {year}")
        
        # Test all major functions
        league_info = espn_service.get_league_info()
        if league_info:
            print(f"📊 League: {league_info.get('name', 'Unknown')}")
        
        teams = espn_service.get_teams()
        print(f"👥 Teams: {len(teams)}")
        
        matchups = espn_service.get_matchups()
        print(f"🏈 Matchups: {len(matchups)}")
        
        standings = espn_service.get_standings()
        print(f"📈 Standings: {len(standings)}")
        
        # Test recent activity (requires authentication)
        if espn_s2 and swid:
            activities = espn_service.get_recent_activity(size=5)
            print(f"📰 Recent Activity: {len(activities)}")
        
    else:
        print("❌ Failed to connect to ESPN league")

if __name__ == "__main__":
    # Test basic connection
    test_espn_connection()
    
    # Test with authentication if available
    test_with_authentication()
