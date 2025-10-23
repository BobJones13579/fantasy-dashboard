"""
The Odds API Service for real-time sports betting odds
Integrates with The Odds API (free tier: 500 requests/month)
"""

import requests
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import logging
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

@dataclass
class OddsData:
    """Data structure for odds information"""
    matchup_id: str
    team1: str
    team2: str
    moneyline_team1: Optional[int]
    moneyline_team2: Optional[int]
    spread_team1: Optional[float]
    spread_team2: Optional[float]
    spread_odds_team1: Optional[int]
    spread_odds_team2: Optional[int]
    total_over: Optional[float]
    total_under: Optional[float]
    total_odds_over: Optional[int]
    total_odds_under: Optional[int]
    timestamp: datetime
    bookmaker: str

class OddsAPIService:
    """Service for integrating with The Odds API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('THE_ODDS_API_KEY')
        self.base_url = "https://api.the-odds-api.com/v4"
        self.session = None
        
        if not self.api_key:
            logger.warning("The Odds API key not provided. Set THE_ODDS_API_KEY environment variable.")
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        return {
            'Accept': 'application/json',
            'User-Agent': 'Fantasy-Football-Companion/1.0'
        }
    
    def _build_url(self, endpoint: str, params: Dict[str, Any]) -> str:
        """Build URL with parameters"""
        if not self.api_key:
            raise ValueError("The Odds API key is required")
        
        params['apiKey'] = self.api_key
        param_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{self.base_url}{endpoint}?{param_string}"
    
    async def get_nfl_odds(self, markets: List[str] = None) -> List[OddsData]:
        """
        Get NFL odds from The Odds API
        
        Args:
            markets: List of markets to retrieve (default: ['h2h', 'spreads', 'totals'])
            
        Returns:
            List of OddsData objects
        """
        if not self.api_key:
            logger.error("The Odds API key not available")
            return []
        
        if markets is None:
            markets = ['h2h', 'spreads', 'totals']
        
        try:
            params = {
                'regions': 'us',
                'markets': ','.join(markets),
                'oddsFormat': 'american',
                'dateFormat': 'iso'
            }
            
            url = self._build_url('/sports/americanfootball_nfl/odds/', params)
            
            if self.session:
                async with self.session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_odds_data(data)
                    else:
                        logger.error(f"The Odds API error: {response.status}")
                        return []
            else:
                # Fallback to requests for synchronous calls
                response = requests.get(url, headers=self._get_headers())
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_odds_data(data)
                else:
                    logger.error(f"The Odds API error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching NFL odds: {e}")
            return []
    
    async def get_historical_odds(self, sport: str, days_back: int = 7) -> List[Dict[str, Any]]:
        """
        Get historical odds data
        
        Args:
            sport: Sport key (e.g., 'americanfootball_nfl')
            days_back: Number of days to look back
            
        Returns:
            List of historical odds data
        """
        if not self.api_key:
            logger.error("The Odds API key not available")
            return []
        
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            
            params = {
                'regions': 'us',
                'markets': 'h2h',
                'oddsFormat': 'american',
                'dateFormat': 'iso',
                'commenceTimeFrom': start_date.isoformat(),
                'commenceTimeTo': end_date.isoformat()
            }
            
            url = self._build_url(f'/sports/{sport}/odds-history/', params)
            
            if self.session:
                async with self.session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"The Odds API historical error: {response.status}")
                        return []
            else:
                response = requests.get(url, headers=self._get_headers())
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"The Odds API historical error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching historical odds: {e}")
            return []
    
    def _parse_odds_data(self, data: List[Dict[str, Any]]) -> List[OddsData]:
        """Parse raw odds data from The Odds API"""
        odds_list = []
        
        try:
            for game in data:
                game_id = game.get('id', '')
                home_team = game.get('home_team', '')
                away_team = game.get('away_team', '')
                commence_time = game.get('commence_time', '')
                
                # Parse timestamp
                try:
                    timestamp = datetime.fromisoformat(commence_time.replace('Z', '+00:00'))
                except:
                    timestamp = datetime.now()
                
                # Process bookmakers
                for bookmaker in game.get('bookmakers', []):
                    bookmaker_name = bookmaker.get('title', 'Unknown')
                    
                    # Initialize odds data
                    odds_data = OddsData(
                        matchup_id=game_id,
                        team1=away_team,
                        team2=home_team,
                        moneyline_team1=None,
                        moneyline_team2=None,
                        spread_team1=None,
                        spread_team2=None,
                        spread_odds_team1=None,
                        spread_odds_team2=None,
                        total_over=None,
                        total_under=None,
                        total_odds_over=None,
                        total_odds_under=None,
                        timestamp=timestamp,
                        bookmaker=bookmaker_name
                    )
                    
                    # Parse markets
                    for market in bookmaker.get('markets', []):
                        market_key = market.get('key', '')
                        outcomes = market.get('outcomes', [])
                        
                        if market_key == 'h2h':  # Moneyline
                            for outcome in outcomes:
                                if outcome.get('name') == away_team:
                                    odds_data.moneyline_team1 = outcome.get('price')
                                elif outcome.get('name') == home_team:
                                    odds_data.moneyline_team2 = outcome.get('price')
                        
                        elif market_key == 'spreads':  # Point spreads
                            for outcome in outcomes:
                                if outcome.get('name') == away_team:
                                    odds_data.spread_team1 = outcome.get('point')
                                    odds_data.spread_odds_team1 = outcome.get('price')
                                elif outcome.get('name') == home_team:
                                    odds_data.spread_team2 = outcome.get('point')
                                    odds_data.spread_odds_team2 = outcome.get('price')
                        
                        elif market_key == 'totals':  # Over/Under
                            for outcome in outcomes:
                                if outcome.get('name') == 'Over':
                                    odds_data.total_over = outcome.get('point')
                                    odds_data.total_odds_over = outcome.get('price')
                                elif outcome.get('name') == 'Under':
                                    odds_data.total_under = outcome.get('point')
                                    odds_data.total_odds_under = outcome.get('price')
                    
                    odds_list.append(odds_data)
            
            return odds_list
            
        except Exception as e:
            logger.error(f"Error parsing odds data: {e}")
            return []
    
    def convert_american_to_decimal(self, american_odds: int) -> float:
        """Convert American odds to decimal odds"""
        if american_odds > 0:
            return (american_odds / 100) + 1
        else:
            return (100 / abs(american_odds)) + 1
    
    def convert_american_to_implied_probability(self, american_odds: int) -> float:
        """Convert American odds to implied probability"""
        if american_odds > 0:
            return 100 / (american_odds + 100)
        else:
            return abs(american_odds) / (abs(american_odds) + 100)
    
    def calculate_win_probability(self, team1_odds: int, team2_odds: int) -> Dict[str, float]:
        """Calculate win probabilities from moneyline odds"""
        team1_prob = self.convert_american_to_implied_probability(team1_odds)
        team2_prob = self.convert_american_to_implied_probability(team2_odds)
        
        # Normalize probabilities (account for bookmaker margin)
        total_prob = team1_prob + team2_prob
        normalized_team1_prob = team1_prob / total_prob
        normalized_team2_prob = team2_prob / total_prob
        
        return {
            'team1_probability': normalized_team1_prob,
            'team2_probability': normalized_team2_prob,
            'bookmaker_margin': total_prob - 1.0
        }
    
    async def test_connection(self) -> Dict[str, Any]:
        """Test connection to The Odds API"""
        try:
            if not self.api_key:
                return {
                    'success': False,
                    'message': 'The Odds API key not provided',
                    'recommendation': 'Set THE_ODDS_API_KEY environment variable'
                }
            
            # Test with a simple request
            params = {
                'regions': 'us',
                'markets': 'h2h',
                'oddsFormat': 'american',
                'dateFormat': 'iso'
            }
            
            url = self._build_url('/sports/americanfootball_nfl/odds/', params)
            
            if self.session:
                async with self.session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            'success': True,
                            'message': 'The Odds API connection successful',
                            'games_available': len(data),
                            'api_key_status': 'Valid',
                            'rate_limit_info': {
                                'remaining_requests': response.headers.get('X-RateLimit-Remaining', 'Unknown'),
                                'reset_time': response.headers.get('X-RateLimit-Reset', 'Unknown')
                            }
                        }
                    else:
                        return {
                            'success': False,
                            'message': f'The Odds API error: {response.status}',
                            'api_key_status': 'Invalid or rate limited'
                        }
            else:
                response = requests.get(url, headers=self._get_headers())
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'success': True,
                        'message': 'The Odds API connection successful',
                        'games_available': len(data),
                        'api_key_status': 'Valid',
                        'rate_limit_info': {
                            'remaining_requests': response.headers.get('X-RateLimit-Remaining', 'Unknown'),
                            'reset_time': response.headers.get('X-RateLimit-Reset', 'Unknown')
                        }
                    }
                else:
                    return {
                        'success': False,
                        'message': f'The Odds API error: {response.status_code}',
                        'api_key_status': 'Invalid or rate limited'
                    }
                    
        except Exception as e:
            logger.error(f"Error testing The Odds API connection: {e}")
            return {
                'success': False,
                'message': f'Connection test failed: {str(e)}',
                'api_key_status': 'Error'
            }
    
    def get_api_usage_info(self) -> Dict[str, Any]:
        """Get information about API usage and limits"""
        return {
            'free_tier_limits': {
                'monthly_requests': 500,
                'description': '500 requests per month on free tier'
            },
            'recommended_usage': {
                'odds_update_frequency': 'Every 30 seconds during games',
                'estimated_monthly_usage': '~200 requests for MVP',
                'sufficient_for_mvp': True
            },
            'upgrade_options': {
                'paid_tier': 'Available for higher usage',
                'contact': 'Visit the-odds-api.com for pricing'
            }
        }
