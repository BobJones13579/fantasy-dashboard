#!/usr/bin/env python3
"""
Debug script to test ESPN Fantasy Football league connection with detailed error information
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

def debug_league_connection():
    """Debug connection to the user's specific league with detailed output"""
    print("🔍 Debug Mode: Testing ESPN Fantasy Football League Connection")
    print("=" * 70)
    print(f"League ID: {LEAGUE_ID}")
    print(f"Season: {SEASON_YEAR}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    print("\n🔗 Attempting connection with debug=True...")
    
    try:
        # Try to connect with debug mode enabled
        league = League(
            league_id=LEAGUE_ID, 
            year=SEASON_YEAR, 
            debug=True,  # This will show all API requests/responses
            fetch_league=False  # Don't fetch data immediately
        )
        
        print("✅ League object created successfully!")
        print("🔍 Now attempting to fetch league data...")
        
        # Try to fetch the league data
        league.fetch_league()
        
        print("✅ Successfully fetched league data!")
        print(f"   League Name: {league.settings.name}")
        print(f"   League ID: {league.settings.league_id}")
        print(f"   Season: {league.settings.season_id}")
        print(f"   Number of Teams: {league.settings.team_count}")
        
        return league
        
    except Exception as e:
        print(f"❌ Connection failed with error: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        
        # Print more detailed error information
        import traceback
        print("\n🔍 Full error traceback:")
        traceback.print_exc()
        
        return None

def test_with_cookies():
    """Test connection with placeholder cookies (user needs to fill these in)"""
    print("\n🍪 Testing with authentication cookies...")
    print("   (You'll need to replace these with your actual cookies)")
    
    # Placeholder cookies - user needs to replace these
    espn_s2 = "YOUR_ESPN_S2_COOKIE_HERE"
    swid = "YOUR_SWID_COOKIE_HERE"
    
    if espn_s2 == "YOUR_ESPN_S2_COOKIE_HERE":
        print("   ⚠️  Please replace the placeholder cookies with your actual values")
        print("   📖 See the authentication guide for how to get these cookies")
        return None
    
    try:
        league = League(
            league_id=LEAGUE_ID,
            year=SEASON_YEAR,
            espn_s2=espn_s2,
            swid=swid,
            debug=True
        )
        
        print("✅ Successfully connected with cookies!")
        return league
        
    except Exception as e:
        print(f"❌ Connection with cookies failed: {str(e)}")
        return None

def main():
    """Main debug function"""
    # First try without cookies
    league = debug_league_connection()
    
    if league is None:
        print("\n" + "=" * 70)
        print("🔧 TROUBLESHOOTING GUIDE")
        print("=" * 70)
        
        print("\n1. 📋 Check your league information:")
        print(f"   • League ID: {LEAGUE_ID}")
        print(f"   • Season: {SEASON_YEAR}")
        print(f"   • URL: https://fantasy.espn.com/football/league/settings?leagueId={LEAGUE_ID}&seasonId={SEASON_YEAR}")
        
        print("\n2. 🔒 Your league is likely private. You need authentication cookies:")
        print("   • espn_s2: Your ESPN session cookie")
        print("   • swid: Your ESPN SWID cookie")
        
        print("\n3. 🍪 How to get your cookies:")
        print("   a) Go to your ESPN Fantasy Football league in your browser")
        print("   b) Open Developer Tools (F12)")
        print("   c) Go to Application/Storage tab")
        print("   d) Find 'Cookies' section")
        print("   e) Look for 'espn_s2' and 'SWID' cookies")
        print("   f) Copy their values")
        
        print("\n4. 🔧 Next steps:")
        print("   • Update the cookies in this script")
        print("   • Or create a config file with your credentials")
        print("   • Or use environment variables for security")
        
        # Try with cookies (will show placeholder message)
        test_with_cookies()
    
    else:
        print("\n🎉 Success! Your league connection is working!")
        print("   You can now proceed with building your fantasy dashboard.")

if __name__ == "__main__":
    main()
