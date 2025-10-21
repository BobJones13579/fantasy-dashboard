#!/usr/bin/env python3
"""
Helper script to guide you through getting ESPN Fantasy Football authentication cookies.

This script will help you extract the required cookies from your browser
so you can access your private ESPN Fantasy Football league.
"""

def print_cookie_instructions():
    """Print detailed instructions for getting ESPN cookies"""
    print("🍪 ESPN Fantasy Football Cookie Extraction Guide")
    print("=" * 60)
    
    print("\n📋 What you need:")
    print("   • Two cookies: 'espn_s2' and 'SWID'")
    print("   • Access to your ESPN Fantasy Football league")
    print("   • A web browser with developer tools")
    
    print("\n🔧 Step-by-step instructions:")
    print("\n1. 🌐 Open your ESPN Fantasy Football league:")
    print("   • Go to: https://fantasy.espn.com/football/league/settings?leagueId=637913&seasonId=2025")
    print("   • Make sure you're logged in and can see your league")
    
    print("\n2. 🛠️ Open Developer Tools:")
    print("   • Press F12 (or right-click → Inspect)")
    print("   • Click on the 'Application' tab (Chrome) or 'Storage' tab (Firefox)")
    
    print("\n3. 🍪 Find the Cookies:")
    print("   • In the left sidebar, expand 'Cookies'")
    print("   • Click on 'fantasy.espn.com' (or similar ESPN domain)")
    print("   • Look for these two cookies:")
    print("     - espn_s2")
    print("     - SWID")
    
    print("\n4. 📋 Copy the Values:")
    print("   • Click on each cookie name")
    print("   • Copy the entire 'Value' field")
    print("   • The SWID value should include curly braces: {12345678-1234-1234-1234-123456789012}")
    
    print("\n5. 🔒 Security Note:")
    print("   • These cookies are sensitive - don't share them")
    print("   • They expire periodically, so you may need to refresh them")
    print("   • Never commit them to version control")
    
    print("\n6. 💾 Save Your Cookies:")
    print("   • Create a .env file in your project root")
    print("   • Add your cookies like this:")
    print("     ESPN_S2=your_espn_s2_value_here")
    print("     SWID={your_swid_value_here}")
    
    print("\n7. 🧪 Test Your Setup:")
    print("   • Run: python src/main.py")
    print("   • If successful, you'll see your league data!")

def create_env_template():
    """Create a template .env file for the user"""
    env_content = """# ESPN Fantasy Football API Authentication
# Replace the placeholder values with your actual cookies

# Your ESPN Fantasy Football authentication cookies
# Get these from your browser's developer tools when logged into ESPN
ESPN_S2=your_espn_s2_cookie_value_here
SWID={your_swid_cookie_value_here}

# League information
LEAGUE_ID=637913
SEASON_YEAR=2025
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("\n✅ Created .env template file!")
        print("   • Edit .env with your actual cookie values")
        print("   • The .env file is already in .gitignore for security")
    except Exception as e:
        print(f"\n❌ Could not create .env file: {e}")
        print("   • You can create it manually with the content above")

def main():
    """Main function"""
    print_cookie_instructions()
    create_env_template()
    
    print("\n" + "=" * 60)
    print("🎯 Next Steps:")
    print("1. Follow the instructions above to get your cookies")
    print("2. Update the .env file with your actual cookie values")
    print("3. Run: python src/main.py")
    print("4. If successful, you'll see your league data!")
    print("=" * 60)

if __name__ == "__main__":
    main()
