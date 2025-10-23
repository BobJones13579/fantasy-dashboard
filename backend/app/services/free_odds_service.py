"""
Free Odds Service - Combines multiple free APIs to provide comprehensive odds data
Uses TheSportsDB, ESPN API, and The Odds API free tier strategically
"""

import os
import httpx
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import asyncio

logger = logging.getLogger(__name__)

class FreeOddsService:
    """Service that combines multiple free APIs to provide comprehensive odds data"""

    def __init__(self):
        # TheSportsDB (completely free)
        self.sportsdb_api_key = "123"  # Free API key
        self.sportsdb_base_url = "https://www.thesportsdb.com/api/v1/json"
        
        # The Odds API (500 requests/month free)
        self.odds_api_key = os.getenv("THE_ODDS_API_KEY")
        self.odds_api_base_url = "https://api.the-odds-api.com/v4/sports"
        
        # API-American-Football (free tier with rate limits)
        self.api_sports_key = os.getenv("API_SPORTS_KEY")  # RapidAPI key
        self.api_sports_base_url = "https://v1.american-football.api-sports.io"
        
        self.session = httpx.AsyncClient(timeout=10.0)  # 10 second timeout for all requests
        self.request_counts = {
            'odds_api': 0,
            'api_sports': 0,
            'sportsdb': 0
        }
        self.last_reset = datetime.now()

    async def get_nfl_odds(self, week: int = None) -> Dict[str, Any]:
        """
        Get NFL odds using the most appropriate free service
        Priority: TheSportsDB (unlimited) -> API-American-Football (limited) -> The Odds API (500/month)
        """
        try:
            # Reset counters if it's a new month
            if (datetime.now() - self.last_reset).days >= 30:
                self.request_counts = {'odds_api': 0, 'api_sports': 0, 'sportsdb': 0}
                self.last_reset = datetime.now()

            # Try TheSportsDB first (completely free, unlimited)
            sportsdb_odds = await self._get_sportsdb_nfl_data(week)
            if sportsdb_odds:
                return {
                    'source': 'thesportsdb',
                    'data': sportsdb_odds,
                    'cost': 'free',
                    'requests_used': self.request_counts['sportsdb']
                }

            # Try API-American-Football if under rate limit
            if self.request_counts['api_sports'] < 100:  # Daily limit
                api_sports_odds = await self._get_api_sports_nfl_odds(week)
                if api_sports_odds:
                    return {
                        'source': 'api_sports',
                        'data': api_sports_odds,
                        'cost': 'free',
                        'requests_used': self.request_counts['api_sports']
                    }

            # Use The Odds API as last resort (500/month limit)
            if self.request_counts['odds_api'] < 500:
                odds_api_data = await self._get_odds_api_nfl_data()
                if odds_api_data:
                    return {
                        'source': 'odds_api',
                        'data': odds_api_data,
                        'cost': 'free',
                        'requests_used': self.request_counts['odds_api']
                    }

            # Fallback to mock data if all APIs are exhausted
            return self._get_mock_odds_data(week)

        except Exception as e:
            logger.error(f"Error getting NFL odds: {e}")
            return self._get_mock_odds_data(week)

    async def _get_sportsdb_nfl_data(self, week: int = None) -> Optional[Dict[str, Any]]:
        """Get NFL data from TheSportsDB (completely free)"""
        try:
            # Get NFL league info
            response = await self.session.get(
                f"{self.sportsdb_base_url}/{self.sportsdb_api_key}/search_all_leagues.php",
                params={"s": "American Football"}
            )
            response.raise_for_status()
            leagues = response.json()
            
            # Find NFL league
            nfl_league = None
            for league in leagues.get('leagues', []):
                if 'NFL' in league.get('strLeague', ''):
                    nfl_league = league
                    break
            
            if not nfl_league:
                return None

            # Get NFL teams
            teams_response = await self.session.get(
                f"{self.sportsdb_base_url}/{self.sportsdb_api_key}/search_all_teams.php",
                params={"l": nfl_league['strLeague']}
            )
            teams_response.raise_for_status()
            teams_data = teams_response.json()

            # Get live scores (if available)
            livescores_response = await self.session.get(
                f"{self.sportsdb_base_url}/{self.sportsdb_api_key}/livescore.php",
                params={"s": "American Football"}
            )
            livescores_response.raise_for_status()
            livescores = livescores_response.json()

            self.request_counts['sportsdb'] += 3

            return {
                'league': nfl_league,
                'teams': teams_data.get('teams', []),
                'live_scores': livescores.get('events', []),
                'week': week,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting TheSportsDB data: {e}")
            return None

    async def _get_api_sports_nfl_odds(self, week: int = None) -> Optional[Dict[str, Any]]:
        """Get NFL odds from API-American-Football (free tier with limits)"""
        if not self.api_sports_key:
            return None

        try:
            headers = {
                'x-rapidapi-host': 'v1.american-football.api-sports.io',
                'x-rapidapi-key': self.api_sports_key
            }

            # Get NFL games
            response = await self.session.get(
                f"{self.api_sports_base_url}/games",
                headers=headers,
                params={"league": 1, "season": 2024}  # NFL league ID
            )
            response.raise_for_status()
            games = response.json()

            # Get odds for first few games (to stay under rate limit)
            odds_data = []
            for game in games.get('response', [])[:5]:  # Limit to 5 games
                odds_response = await self.session.get(
                    f"{self.api_sports_base_url}/odds",
                    headers=headers,
                    params={"game": game['id']}
                )
                if odds_response.status_code == 200:
                    odds_data.append({
                        'game': game,
                        'odds': odds_response.json()
                    })
                    self.request_counts['api_sports'] += 1

            return {
                'games': games.get('response', []),
                'odds': odds_data,
                'week': week,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting API-Sports data: {e}")
            return None

    async def _get_odds_api_nfl_data(self) -> Optional[Dict[str, Any]]:
        """Get NFL odds from The Odds API (500 requests/month free)"""
        if not self.odds_api_key:
            return None

        try:
            response = await self.session.get(
                f"{self.odds_api_base_url}/americanfootball_nfl/odds",
                params={
                    "apiKey": self.odds_api_key,
                    "regions": "us",
                    "markets": "h2h,spreads,totals",
                    "oddsFormat": "american"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            self.request_counts['odds_api'] += 1
            
            return {
                'odds': data,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting Odds API data: {e}")
            return None

    def _get_mock_odds_data(self, week: int = None) -> Dict[str, Any]:
        """Generate mock odds data when all APIs are exhausted"""
        mock_games = [
            {
                "id": "mock-1",
                "home_team": "Kansas City Chiefs",
                "away_team": "Buffalo Bills",
                "home_odds": -150,
                "away_odds": +130,
                "spread": -3.5,
                "total": 51.5,
                "status": "upcoming"
            },
            {
                "id": "mock-2", 
                "home_team": "Los Angeles Rams",
                "away_team": "San Francisco 49ers",
                "home_odds": +110,
                "away_odds": -130,
                "spread": 2.5,
                "total": 47.0,
                "status": "upcoming"
            },
            {
                "id": "mock-3",
                "home_team": "Dallas Cowboys", 
                "away_team": "Philadelphia Eagles",
                "home_odds": -120,
                "away_odds": +100,
                "spread": -1.5,
                "total": 49.5,
                "status": "upcoming"
            }
        ]

        return {
            'source': 'mock_data',
            'data': {
                'games': mock_games,
                'week': week or 1,
                'timestamp': datetime.now().isoformat()
            },
            'cost': 'free',
            'requests_used': 0,
            'note': 'Using mock data - all free APIs exhausted'
        }

    async def get_usage_stats(self) -> Dict[str, Any]:
        """Get current usage statistics for all free APIs"""
        return {
            'thesportsdb': {
                'requests_used': self.request_counts['sportsdb'],
                'limit': 'unlimited',
                'cost': 'free',
                'status': 'available'
            },
            'api_sports': {
                'requests_used': self.request_counts['api_sports'],
                'limit': 100,  # Daily limit
                'cost': 'free',
                'status': 'available' if self.request_counts['api_sports'] < 100 else 'rate_limited'
            },
            'odds_api': {
                'requests_used': self.request_counts['odds_api'],
                'limit': 500,  # Monthly limit
                'cost': 'free',
                'status': 'available' if self.request_counts['odds_api'] < 500 else 'exhausted'
            },
            'last_reset': self.last_reset.isoformat(),
            'next_reset': (self.last_reset + timedelta(days=30)).isoformat()
        }

    async def test_all_services(self) -> Dict[str, Any]:
        """Test all free services to see which ones are working"""
        results = {}
        
        # Test TheSportsDB with timeout
        try:
            sportsdb_data = await asyncio.wait_for(
                self._get_sportsdb_nfl_data(), 
                timeout=10.0  # 10 second timeout
            )
            results['thesportsdb'] = {
                'status': 'working',
                'data_available': bool(sportsdb_data),
                'note': 'Completely free, unlimited requests'
            }
        except asyncio.TimeoutError:
            results['thesportsdb'] = {
                'status': 'timeout',
                'error': 'Request timed out after 10 seconds',
                'note': 'Completely free, unlimited requests'
            }
        except Exception as e:
            results['thesportsdb'] = {
                'status': 'error',
                'error': str(e),
                'note': 'Completely free, unlimited requests'
            }

        # Test API-Sports (if key available) with timeout
        if self.api_sports_key:
            try:
                api_sports_data = await asyncio.wait_for(
                    self._get_api_sports_nfl_odds(), 
                    timeout=10.0  # 10 second timeout
                )
                results['api_sports'] = {
                    'status': 'working',
                    'data_available': bool(api_sports_data),
                    'note': 'Free tier: 100 requests/day limited'
                }
            except asyncio.TimeoutError:
                results['api_sports'] = {
                    'status': 'timeout',
                    'error': 'Request timed out after 10 seconds',
                    'note': 'Free tier: 100 requests/day limited'
                }
            except Exception as e:
                results['api_sports'] = {
                    'status': 'error',
                    'error': str(e),
                    'note': 'Free tier: 100 requests/day limited'
                }
        else:
            results['api_sports'] = {
                'status': 'no_key',
                'note': 'Requires RapidAPI key (free tier available)'
            }

        # Test The Odds API (if key available) with timeout
        if self.odds_api_key:
            try:
                odds_api_data = await asyncio.wait_for(
                    self._get_odds_api_nfl_data(), 
                    timeout=10.0  # 10 second timeout
                )
                results['odds_api'] = {
                    'status': 'working',
                    'data_available': bool(odds_api_data),
                    'note': 'Free tier: 500 requests/month'
                }
            except asyncio.TimeoutError:
                results['odds_api'] = {
                    'status': 'timeout',
                    'error': 'Request timed out after 10 seconds',
                    'note': 'Free tier: 500 requests/month'
                }
            except Exception as e:
                results['odds_api'] = {
                    'status': 'error',
                    'error': str(e),
                    'note': 'Free tier: 500 requests/month'
                }
        else:
            results['odds_api'] = {
                'status': 'no_key',
                'note': 'API key not provided'
            }

        return results

# Initialize the service
free_odds_service = FreeOddsService()
