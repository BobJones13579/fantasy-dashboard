#!/usr/bin/env python3
"""
Test script for ESPN league configuration
Use this to test your specific ESPN league connection
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.espn_service import ESPNService

def test_espn_league():
    """Test ESPN league connection with your credentials"""
    print("🏈 Testing ESPN League Connection")
    print("=" * 50)
    
    # Your ESPN credentials
    espn_s2 = 'AEBhPR9cLPaEZz7Ql8PBKJxddtevPLnTyHqE2%2FsYhCL4p5zQf3dlYwkgMeZcxZN9FZveLlGZaz5xPwv7wuvAR7UWkQU7jZlgkLWo63RZdvOOdEWcFsCa0hHOuAYxZv6dxxKAe4wE2Eq0a2YBBvaG6qPN2%2FTHZJgMIRVEixfVDHkjaQfxYTt6kRo4EbpDfSjq0rvasg6aSFssw%2BqtZZDpWEMn2DlKmwUOKMVq2%2F2X6iCQMKUYVexOFv9fy8K7TLDzJGaw6lWYz5MknrQU0KLoIfZF'
    swid = '{E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}'
    
    print(f"ESPN S2: {espn_s2[:30]}...")
    print(f"SWID: {swid}")
    print()
    
    # You need to provide your actual league ID
    print("📋 To test your league, you need to provide:")
    print("1. Your ESPN League ID (from the URL)")
    print("2. The current season year")
    print()
    print("Example URL: https://fantasy.espn.com/football/league/settings?leagueId=YOUR_LEAGUE_ID&seasonId=2024")
    print()
    
    # Get league ID from user input
    try:
        league_id = input("Enter your ESPN League ID: ").strip()
        if not league_id:
            print("❌ No league ID provided")
            return False
        
        league_id = int(league_id)
        year = int(input("Enter the season year (e.g., 2024): ").strip() or "2024")
        
        print(f"\n🔗 Testing connection to league {league_id} for year {year}...")
        
        # Initialize ESPN service
        espn_service = ESPNService()
        
        # Configure league
        success = espn_service.configure_league(
            league_id=league_id,
            year=year,
            espn_s2=espn_s2,
            swid=swid
        )
        
        if success:
            print("✅ ESPN API connection successful!")
            
            # Test getting league info
            print("\n📊 Getting league information...")
            league_info = espn_service.get_league_info()
            if league_info:
                print(f"✅ League: {league_info.get('name', 'Unknown')}")
                print(f"   Teams: {league_info.get('team_count', 0)}")
                print(f"   Season: {league_info.get('reg_season_count', 0)} games")
                print(f"   Playoff Teams: {league_info.get('playoff_team_count', 0)}")
            else:
                print("❌ Failed to get league info")
                return False
            
            # Test getting teams
            print("\n👥 Getting teams...")
            teams = espn_service.get_teams()
            if teams:
                print(f"✅ Retrieved {len(teams)} teams:")
                for i, team in enumerate(teams[:5], 1):  # Show first 5 teams
                    print(f"   {i}. {team['name']} (ID: {team['espn_team_id']}) - {team['wins']}-{team['losses']}")
                if len(teams) > 5:
                    print(f"   ... and {len(teams) - 5} more teams")
            else:
                print("❌ Failed to get teams")
                return False
            
            # Test getting matchups
            print("\n🏈 Getting current matchups...")
            matchups = espn_service.get_matchups()
            if matchups:
                print(f"✅ Retrieved {len(matchups)} matchups:")
                for i, matchup in enumerate(matchups[:3], 1):  # Show first 3 matchups
                    home = matchup['home_team']
                    away = matchup['away_team']
                    print(f"   {i}. {away['name']} @ {home['name']}")
                    if home['score'] is not None and away['score'] is not None:
                        print(f"      Score: {away['score']} - {home['score']}")
            else:
                print("❌ Failed to get matchups")
                return False
            
            # Test getting standings
            print("\n📈 Getting standings...")
            standings = espn_service.get_standings()
            if standings:
                print(f"✅ Retrieved {len(standings)} team standings:")
                for i, standing in enumerate(standings[:5], 1):  # Show top 5
                    print(f"   {i}. {standing['name']} ({standing['wins']}-{standing['losses']}) - {standing['points_for']:.1f} PF")
            else:
                print("❌ Failed to get standings")
                return False
            
            print("\n🎉 ESPN league integration successful!")
            print("\n🚀 Next Steps:")
            print("1. Your league is now configured and ready")
            print("2. You can use the API endpoints to access your league data")
            print("3. Start building the frontend features with real data")
            
            return True
            
        else:
            print("❌ ESPN API connection failed!")
            print("\nPossible issues:")
            print("- Invalid league ID")
            print("- Expired authentication cookies")
            print("- Private league access issues")
            print("- Network connectivity problems")
            return False
            
    except ValueError:
        print("❌ Invalid league ID or year. Please enter numbers only.")
        return False
    except KeyboardInterrupt:
        print("\n\n👋 Test cancelled by user")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_espn_league()
    sys.exit(0 if success else 1)
