# External Integrations

## TLDR

External integrations for the Fantasy Football Companion App, including APIs, services, and third-party dependencies.

## Primary Integrations

### ESPN Fantasy Football API

**Purpose**: Primary data source for league information, matchups, and player data

**Integration Details**:
- **Library**: `espn-api` Python library (unofficial)
- **Authentication**: Manual cookie-based authentication (espn_s2 and SWID)
- **Data Access**: Read-only access to league data
- **Rate Limits**: Respectful API usage with caching

**Supported Data Types**:
- League settings and member information
- Weekly matchups and scores
- Player statistics and projections
- Transaction history (trades, waivers, FAAB bids)
- Roster information and lineup data

**Implementation**:
```python
class ESPNIntegration:
    def __init__(self):
        self.session = requests.Session()
        self.cache = RedisCache()
    
    async def get_league_data(self, league_id: str, week: int) -> LeagueData:
        # Check cache first
        cached_data = await self.cache.get(f"league:{league_id}:week:{week}")
        if cached_data:
            return cached_data
        
        # Fetch from ESPN API
        data = await self._fetch_from_espn(league_id, week)
        
        # Cache for 30 seconds
        await self.cache.set(f"league:{league_id}:week:{week}", data, ttl=30)
        return data
```

### The Odds API

**Purpose**: Real-time sports betting odds and market data

**Integration Details**:
- **API**: The Odds API (the-odds-api.com)
- **Authentication**: API key required
- **Free Tier**: 500 requests/month
- **Data Access**: Real-time odds, historical data

**Supported Data Types**:
- Moneyline odds
- Point spreads
- Over/under totals
- Player props
- Live odds updates

**Implementation**:
```python
class OddsAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.the-odds-api.com/v4"
    
    async def get_matchup_odds(self, matchup_id: str) -> OddsData:
        response = await self._make_request(f"/sports/americanfootball_nfl/odds")
        return self._parse_odds_response(response)
```

### Supabase

**Purpose**: Database, authentication, and real-time features

**Integration Details**:
- **Service**: Supabase (supabase.com)
- **Database**: PostgreSQL 15+
- **Authentication**: Built-in auth with JWT
- **Real-time**: WebSocket subscriptions
- **Free Tier**: 500MB database, 50,000 MAU

**Features**:
- PostgreSQL database with real-time subscriptions
- Built-in authentication and user management
- Row Level Security (RLS) for data protection
- Auto-generated API endpoints
- Real-time data synchronization

### Redis

**Purpose**: Caching and session storage

**Integration Details**:
- **Service**: Redis (via Railway/Render)
- **Use Cases**: Session storage, API response caching
- **Free Tier**: Available on Railway/Render
- **Features**: In-memory storage, TTL support

## Integration Architecture

### Data Flow
```
ESPN API → FastAPI → Supabase → React Frontend
    ↓           ↓         ↓
Redis Cache  Real-time  WebSocket
```

### Error Handling
- **Retry Logic**: Exponential backoff for failed requests
- **Circuit Breaker**: Prevent cascading failures
- **Fallback Data**: Use cached data when APIs are unavailable
- **Monitoring**: Track API health and response times

### Security
- **API Keys**: Stored in environment variables
- **Rate Limiting**: Respect API rate limits
- **Data Validation**: Validate all incoming data
- **Authentication**: Secure API key management

## Integration Testing

### Test Strategy
- **Unit Tests**: Test individual integration functions
- **Integration Tests**: Test API connections and data flow
- **Mock Tests**: Use mocks for external API calls
- **End-to-End Tests**: Test complete user workflows

### Test Data
- **Mock Responses**: Use realistic mock data for testing
- **Test Accounts**: Use test accounts for external services
- **Sandbox Environments**: Use sandbox APIs when available
- **Data Validation**: Test with various data scenarios

## Monitoring and Maintenance

### Health Checks
- **API Status**: Monitor external API health
- **Response Times**: Track API response times
- **Error Rates**: Monitor error rates and patterns
- **Data Quality**: Validate data integrity

### Maintenance Tasks
- **API Key Rotation**: Regular rotation of API keys
- **Rate Limit Monitoring**: Monitor API usage
- **Data Backup**: Regular backup of critical data
- **Documentation Updates**: Keep integration docs current