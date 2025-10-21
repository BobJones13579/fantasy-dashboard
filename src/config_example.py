"""
Example configuration file for ESPN Fantasy Football API authentication.

IMPORTANT: 
- Copy this file to 'config.py' and fill in your actual values
- Never commit 'config.py' to version control
- Add 'config.py' to your .gitignore file
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Your league information
LEAGUE_ID = 637913
SEASON_YEAR = 2025

# ESPN Authentication Cookies
# Option 1: Use environment variables (recommended)
ESPN_S2 = os.getenv('ESPN_S2')
SWID = os.getenv('SWID')

# Option 2: Direct assignment (less secure, for testing only)
# ESPN_S2 = "your_espn_s2_cookie_here"
# SWID = "{your_swid_cookie_here}"

def get_league_config():
    """Get league configuration with authentication"""
    if not ESPN_S2 or not SWID:
        raise ValueError(
            "ESPN authentication cookies not found. "
            "Please set ESPN_S2 and SWID environment variables or update config.py"
        )
    
    return {
        'league_id': LEAGUE_ID,
        'year': SEASON_YEAR,
        'espn_s2': ESPN_S2,
        'swid': SWID
    }

def get_league_config_public():
    """Get league configuration without authentication (for public leagues)"""
    return {
        'league_id': LEAGUE_ID,
        'year': SEASON_YEAR
    }
