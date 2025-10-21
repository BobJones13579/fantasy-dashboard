#!/usr/bin/env python3
"""
League Configuration Script
Use this to configure your ESPN league with the Fantasy Football Companion App
"""

import requests
import json
import sys

def configure_league():
    """Configure your ESPN league"""
    print("🏈 Fantasy Football Companion - League Configuration")
    print("=" * 60)
    
    # Your ESPN credentials
    espn_s2 = 'AEBhPR9cLPaEZz7Ql8PBKJxddtevPLnTyHqE2%2FsYhCL4p5zQf3dlYwkgMeZcxZN9FZveLlGZaz5xPwv7wuvAR7UWkQU7jZlgkLWo63RZdvOOdEWcFsCa0hHOuAYxZv6dxxKAe4wE2Eq0a2YBBvaG6qPN2%2FTHZJgMIRVEixfVDHkjaQfxYTt6kRo4EbpDfSjq0rvasg6aSFssw%2BqtZZDpWEMn2DlKmwUOKMVq2%2F2X6iCQMKUYVexOFv9fy8K7TLDzJGaw6lWYz5MknrQU0KLoIfZF'
    swid = '{E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}'
    
    print("📋 Your ESPN credentials are configured:")
    print(f"   ESPN S2: {espn_s2[:30]}...")
    print(f"   SWID: {swid}")
    print()
    
    # Get league information from user
    try:
        league_id = input("Enter your ESPN League ID: ").strip()
        if not league_id:
            print("❌ No league ID provided")
            return False
        
        league_id = int(league_id)
        year = int(input("Enter the season year (e.g., 2024): ").strip() or "2024")
        
        print(f"\n🔗 Configuring league {league_id} for year {year}...")
        
        # Prepare the request
        config_data = {
            "league_id": league_id,
            "year": year,
            "espn_s2": espn_s2,
            "swid": swid
        }
        
        # Make the API request
        api_url = "http://localhost:8000/api/v1/league/configure"
        
        print("📡 Sending configuration request...")
        response = requests.post(api_url, json=config_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ League configuration successful!")
            print(f"   Message: {result['message']}")
            
            if result.get('league_info'):
                league_info = result['league_info']
                print(f"\n📊 League Information:")
                print(f"   Name: {league_info.get('name', 'Unknown')}")
                print(f"   Teams: {league_info.get('team_count', 0)}")
                print(f"   Season: {league_info.get('reg_season_count', 0)} games")
                print(f"   Playoff Teams: {league_info.get('playoff_team_count', 0)}")
            
            print(f"\n🎉 Your league is now configured and ready to use!")
            print(f"\n🚀 Next Steps:")
            print("1. Your league data is now available through the API")
            print("2. You can test the endpoints at http://localhost:8000/docs")
            print("3. Start building frontend features with real data")
            print("4. Test the token system with your actual teams")
            
            return True
            
        else:
            print(f"❌ Configuration failed!")
            print(f"   Status Code: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Error: {error_detail.get('detail', 'Unknown error')}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except ValueError:
        print("❌ Invalid league ID or year. Please enter numbers only.")
        return False
    except KeyboardInterrupt:
        print("\n\n👋 Configuration cancelled by user")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server.")
        print("   Make sure the backend is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_configuration():
    """Test the league configuration"""
    print("\n🧪 Testing League Configuration")
    print("-" * 40)
    
    try:
        # Test connection
        response = requests.get("http://localhost:8000/api/v1/league/test-connection")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ League connection test successful!")
                league_info = result.get('league_info', {})
                print(f"   League: {league_info.get('name', 'Unknown')}")
                print(f"   Teams: {league_info.get('team_count', 0)}")
            else:
                print("❌ League connection test failed")
                print(f"   Message: {result.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ Connection test failed with status {response.status_code}")
            return False
        
        # Test getting teams
        response = requests.get("http://localhost:8000/api/v1/league/teams")
        
        if response.status_code == 200:
            result = response.json()
            teams = result.get('teams', [])
            print(f"✅ Retrieved {len(teams)} teams")
            for i, team in enumerate(teams[:3], 1):
                print(f"   {i}. {team['name']} (ID: {team['espn_team_id']})")
        else:
            print(f"❌ Failed to get teams: {response.status_code}")
            return False
        
        # Test getting matchups
        response = requests.get("http://localhost:8000/api/v1/league/matchups")
        
        if response.status_code == 200:
            result = response.json()
            matchups = result.get('matchups', [])
            print(f"✅ Retrieved {len(matchups)} matchups")
        else:
            print(f"❌ Failed to get matchups: {response.status_code}")
            return False
        
        print("\n🎉 All tests passed! Your league is fully configured.")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server.")
        print("   Make sure the backend is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

def main():
    """Main configuration flow"""
    print("Welcome to the Fantasy Football Companion League Configuration!")
    print()
    
    # Check if backend is running
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code != 200:
            print("❌ Backend server is not responding correctly")
            print("   Please make sure the backend is running on http://localhost:8000")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running")
        print("   Please start the backend server first:")
        print("   cd backend && source venv/bin/activate && uvicorn app.main:app --reload")
        return False
    
    print("✅ Backend server is running")
    print()
    
    # Configure the league
    success = configure_league()
    
    if success:
        # Test the configuration
        test_success = test_configuration()
        
        if test_success:
            print("\n🎊 Configuration Complete!")
            print("Your Fantasy Football Companion App is ready to use!")
        else:
            print("\n⚠️  Configuration completed but tests failed")
            print("You may need to check your league settings")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
