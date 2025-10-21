#!/usr/bin/env python3
"""
Demo script showing how to configure your ESPN league
This demonstrates the API calls needed to set up your league
"""

import requests
import json

def demo_league_setup():
    """Demonstrate league setup process"""
    print("🏈 Fantasy Football Companion - League Setup Demo")
    print("=" * 60)
    
    # Your ESPN credentials
    espn_s2 = 'AEBhPR9cLPaEZz7Ql8PBKJxddtevPLnTyHqE2%2FsYhCL4p5zQf3dlYwkgMeZcxZN9FZveLlGZaz5xPwv7wuvAR7UWkQU7jZlgkLWo63RZdvOOdEWcFsCa0hHOuAYxZv6dxxKAe4wE2Eq0a2YBBvaG6qPN2%2FTHZJgMIRVEixfVDHkjaQfxYTt6kRo4EbpDfSjq0rvasg6aSFssw%2BqtZZDpWEMn2DlKmwUOKMVq2%2F2X6iCQMKUYVexOFv9fy8K7TLDzJGaw6lWYz5MknrQU0KLoIfZF'
    swid = '{E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}'
    
    print("📋 Your ESPN credentials:")
    print(f"   ESPN S2: {espn_s2[:30]}...")
    print(f"   SWID: {swid}")
    print()
    
    print("🔧 To configure your league, you need:")
    print("1. Your ESPN League ID (from the URL)")
    print("2. The current season year")
    print()
    print("Example URL: https://fantasy.espn.com/football/league/settings?leagueId=YOUR_LEAGUE_ID&seasonId=2024")
    print()
    
    # Example configuration (replace with your actual values)
    example_config = {
        "league_id": 123456,  # Replace with your actual league ID
        "year": 2024,
        "espn_s2": espn_s2,
        "swid": swid
    }
    
    print("📝 Example configuration request:")
    print(json.dumps(example_config, indent=2))
    print()
    
    print("🚀 API Endpoints available:")
    print("   POST /api/v1/league/configure - Configure your league")
    print("   GET  /api/v1/league/test-connection - Test connection")
    print("   GET  /api/v1/league/league-info - Get league info")
    print("   GET  /api/v1/league/teams - Get all teams")
    print("   GET  /api/v1/league/matchups - Get matchups")
    print("   GET  /api/v1/league/standings - Get standings")
    print()
    
    print("💡 How to configure your league:")
    print("1. Run: python configure_league.py")
    print("2. Enter your ESPN League ID when prompted")
    print("3. Enter the season year (e.g., 2024)")
    print("4. The script will configure your league automatically")
    print()
    
    print("🧪 Or use curl directly:")
    print("curl -X POST http://localhost:8000/api/v1/league/configure \\")
    print("  -H 'Content-Type: application/json' \\")
    print("  -d '{")
    print('    "league_id": YOUR_LEAGUE_ID,')
    print('    "year": 2024,')
    print(f'    "espn_s2": "{espn_s2}",')
    print(f'    "swid": "{swid}"')
    print("  }'")
    print()
    
    print("📊 After configuration, you can test with:")
    print("curl http://localhost:8000/api/v1/league/teams")
    print("curl http://localhost:8000/api/v1/league/matchups")
    print("curl http://localhost:8000/api/v1/league/standings")
    print()
    
    print("🎯 Next Steps:")
    print("1. Configure your league using the script or API")
    print("2. Test the endpoints to verify your data")
    print("3. Start building frontend features with real data")
    print("4. Implement the odds engine and betting interface")

if __name__ == "__main__":
    demo_league_setup()
