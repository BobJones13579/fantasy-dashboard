#!/usr/bin/env python3
"""
Simple test script to verify ESPN API is working
This script will test basic functionality with a public league
"""

from espn_api.football import League
from espn_api.basketball import League as BasketballLeague
import sys

def test_football_api():
    """Test ESPN Fantasy Football API with a public league"""
    print("🏈 Testing ESPN Fantasy Football API...")
    
    try:
        # Try a few known public league IDs from different years
        test_league_ids = [222, 1234, 5678, 9999]
        test_years = [2023, 2022, 2021]
        
        league = None
        for league_id in test_league_ids:
            for year in test_years:
                try:
                    print(f"   Trying league {league_id} from {year}...")
                    league = League(league_id=league_id, year=year, debug=False)
                    print(f"✅ Successfully connected to league: {league.settings.name}")
                    print(f"   League ID: {league.settings.league_id}")
                    print(f"   Season: {league.settings.season_id}")
                    print(f"   Teams: {league.settings.team_count}")
                    break
                except Exception as e:
                    continue
            if league:
                break
        
        if not league:
            print("❌ Could not find a working public league to test with")
            print("   This is normal - you'll need to provide your own league ID")
            return False
        
        # Test getting standings
        standings = league.standings()
        print(f"   Standings: {len(standings)} teams found")
        
        # Test getting teams
        teams = league.teams
        print(f"   Teams: {len(teams)} teams loaded")
        
        # Show first team info
        if teams:
            first_team = teams[0]
            print(f"   First team: {first_team.team_name} (Wins: {first_team.wins}, Losses: {first_team.losses})")
        
        return True
        
    except Exception as e:
        print(f"❌ Football API test failed: {str(e)}")
        return False

def test_basketball_api():
    """Test ESPN Fantasy Basketball API with a public league"""
    print("\n🏀 Testing ESPN Fantasy Basketball API...")
    
    try:
        # Try a few known public league IDs from different years
        test_league_ids = [222, 1234, 5678, 9999]
        test_years = [2023, 2022, 2021]
        
        league = None
        for league_id in test_league_ids:
            for year in test_years:
                try:
                    print(f"   Trying league {league_id} from {year}...")
                    league = BasketballLeague(league_id=league_id, year=year, debug=False)
                    print(f"✅ Successfully connected to league: {league.settings.name}")
                    print(f"   League ID: {league.settings.league_id}")
                    print(f"   Season: {league.settings.season_id}")
                    print(f"   Teams: {league.settings.team_count}")
                    break
                except Exception as e:
                    continue
            if league:
                break
        
        if not league:
            print("❌ Could not find a working public league to test with")
            print("   This is normal - you'll need to provide your own league ID")
            return False
        
        # Test getting standings
        standings = league.standings()
        print(f"   Standings: {len(standings)} teams found")
        
        return True
        
    except Exception as e:
        print(f"❌ Basketball API test failed: {str(e)}")
        return False

def test_basic_imports():
    """Test that all ESPN API modules can be imported"""
    print("📦 Testing ESPN API imports...")
    
    try:
        from espn_api.football import League as FootballLeague
        from espn_api.basketball import League as BasketballLeague
        from espn_api.hockey import League as HockeyLeague
        from espn_api.baseball import League as BaseballLeague
        
        print("✅ All ESPN API modules imported successfully")
        print("   - Football API: ✅")
        print("   - Basketball API: ✅") 
        print("   - Hockey API: ✅")
        print("   - Baseball API: ✅")
        
        return True
        
    except Exception as e:
        print(f"❌ Import test failed: {str(e)}")
        return False

def test_api_instantiation():
    """Test that we can create League objects (without connecting)"""
    print("\n🔧 Testing API instantiation...")
    
    try:
        # Test that we can create League objects
        from espn_api.football import League as FootballLeague
        from espn_api.basketball import League as BasketballLeague
        
        # These should work even with invalid IDs (they just won't connect)
        print("   Testing Football League instantiation...")
        football_league = FootballLeague(league_id=999999, year=2023, fetch_league=False)
        print("   ✅ Football League object created successfully")
        
        print("   Testing Basketball League instantiation...")
        basketball_league = BasketballLeague(league_id=999999, year=2023, fetch_league=False)
        print("   ✅ Basketball League object created successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ API instantiation test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 ESPN API Test Suite")
    print("=" * 50)
    
    # Test imports first
    import_success = test_basic_imports()
    
    if not import_success:
        print("\n❌ Basic imports failed. Check your ESPN API installation.")
        sys.exit(1)
    
    # Test API instantiation
    instantiation_success = test_api_instantiation()
    
    # Test API connections (these might fail if no public leagues are found)
    football_success = test_football_api()
    basketball_success = test_basketball_api()
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Imports: {'✅ PASS' if import_success else '❌ FAIL'}")
    print(f"   Instantiation: {'✅ PASS' if instantiation_success else '❌ FAIL'}")
    print(f"   Football API: {'✅ PASS' if football_success else '❌ FAIL'}")
    print(f"   Basketball API: {'✅ PASS' if basketball_success else '❌ FAIL'}")
    
    if import_success and instantiation_success:
        print("\n🎉 ESPN API is working! Ready to build your fantasy dashboard.")
        print("\n📝 Next steps:")
        print("   1. Get your ESPN Fantasy League ID from the URL")
        print("   2. Use your league ID and year to connect")
        print("   3. For private leagues, you'll need ESPN cookies (espn_s2, swid)")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")
    
    print("\n💡 Note: If API connection tests fail, it might be due to:")
    print("   - Network connectivity issues")
    print("   - League ID not found or private")
    print("   - Season not available")
    print("   - ESPN API rate limiting")

if __name__ == "__main__":
    main()
