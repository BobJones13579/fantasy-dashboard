# System Architecture

## Purpose

This document provides a detailed technical architecture for the Fantasy Football Companion App, including system components, data flow, integration patterns, and scalability considerations.

## Context

The Fantasy Football Companion App is built as a modern, real-time web application that enhances fantasy football leagues with betting-style odds and strategic analytics. The architecture prioritizes mobile-first design, real-time updates, and seamless integration with existing fantasy platforms.

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   React.js  │  │  Tailwind   │  │   PWA       │            │
│  │ Components  │  │    CSS      │  │ Features    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   FastAPI   │  │  WebSocket  │  │  Auth       │            │
│  │   REST      │  │   Real-time │  │  Service    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Odds      │  │   FAAB      │  │   Trade     │            │
│  │   Engine    │  │  Analyzer   │  │  Tracker    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Supabase   │  │   Redis     │  │   ESPN      │            │
│  │ PostgreSQL  │  │   Cache     │  │    API      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Query for server state, Context API for client state
- **Real-Time**: Supabase real-time subscriptions
- **PWA**: Service workers for offline functionality
- **Deployment**: Vercel with automatic deployments

### Component Architecture

```
src/
├── components/
│   ├── common/                 # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── features/               # Feature-specific components
│   │   ├── OddsBoard/
│   │   │   ├── MatchupCard/
│   │   │   ├── OddsDisplay/
│   │   │   └── MarketIntelligence/
│   │   ├── FAABPredictor/
│   │   │   ├── BidRecommendation/
│   │   │   ├── MarketAnalysis/
│   │   │   └── EfficiencyMetrics/
│   │   └── TradeTracker/
│   │       ├── TradeTree/
│   │       ├── ValueAnalysis/
│   │       └── HistoricalView/
│   └── layout/                 # Layout components
│       ├── Header/
│       ├── Navigation/
│       └── Footer/
├── hooks/                      # Custom React hooks
│   ├── useOdds/
│   ├── useFAAB/
│   ├── useTrades/
│   └── useRealTime/
├── services/                   # API services
│   ├── api/
│   ├── websocket/
│   └── auth/
├── utils/                      # Utility functions
├── types/                      # TypeScript definitions
└── constants/                  # Application constants
```

### State Management Strategy

**Server State (React Query)**
```typescript
// API data with caching and real-time updates
const { data: matchups, isLoading } = useQuery({
  queryKey: ['matchups', week],
  queryFn: () => fetchMatchups(week),
  staleTime: 30000, // 30 seconds
  refetchInterval: 30000, // Real-time updates
});
```

**Client State (Context API)**
```typescript
// User preferences and UI state
const AppContext = createContext<AppState>({
  user: null,
  preferences: defaultPreferences,
  theme: 'light',
});
```

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI (Python 3.11+)
- **Database**: Supabase (PostgreSQL 15+)
- **Cache**: Redis for session storage and caching
- **Real-Time**: Supabase real-time subscriptions
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Railway/Render with auto-scaling

### Service Architecture

```
backend/
├── app/
│   ├── api/                    # API route handlers
│   │   ├── v1/
│   │   │   ├── odds/
│   │   │   ├── faab/
│   │   │   ├── trades/
│   │   │   └── users/
│   │   └── dependencies.py
│   ├── core/                   # Core application logic
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── database.py
│   │   └── cache.py
│   ├── models/                 # Database models
│   │   ├── user.py
│   │   ├── league.py
│   │   ├── matchup.py
│   │   └── bet.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── odds.py
│   │   ├── faab.py
│   │   └── trades.py
│   ├── services/               # Business logic services
│   │   ├── odds_engine.py
│   │   ├── faab_analyzer.py
│   │   ├── trade_tracker.py
│   │   └── espn_integration.py
│   ├── utils/                  # Utility functions
│   │   ├── calculations.py
│   │   ├── validators.py
│   │   └── formatters.py
│   └── main.py                 # Application entry point
├── tests/                      # Test files
└── requirements.txt            # Python dependencies
```

### Core Services

**Odds Engine Service**
```python
class OddsEngine:
    def __init__(self):
        self.monte_carlo = MonteCarloSimulator()
        self.market_intelligence = MarketIntelligence()
    
    async def calculate_matchup_odds(self, team1: Team, team2: Team) -> OddsResult:
        # Monte Carlo simulation
        simulation_result = await self.monte_carlo.simulate(team1, team2)
        
        # Market intelligence analysis
        market_data = await self.market_intelligence.analyze(team1, team2)
        
        # Calculate final odds
        return self._calculate_odds(simulation_result, market_data)
```

**FAAB Analyzer Service**
```python
class FAABAnalyzer:
    def __init__(self):
        self.bid_analyzer = BidAnalyzer()
        self.market_tracker = MarketTracker()
    
    async def analyze_league_bidding(self, league_id: int) -> LeagueAnalysis:
        # Parse historical bid data
        bid_history = await self._get_bid_history(league_id)
        
        # Analyze bidding patterns
        patterns = await self.bid_analyzer.analyze_patterns(bid_history)
        
        # Track market trends
        trends = await self.market_tracker.track_trends(bid_history)
        
        return LeagueAnalysis(patterns=patterns, trends=trends)
```

## Data Architecture

### Database Schema (Supabase PostgreSQL)

**Core Tables**
```sql
-- Users and authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    espn_user_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Leagues
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    espn_league_id VARCHAR(50) UNIQUE NOT NULL,
    season INTEGER NOT NULL,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    espn_team_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matchups
CREATE TABLE matchups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    week INTEGER NOT NULL,
    team1_id UUID REFERENCES teams(id),
    team2_id UUID REFERENCES teams(id),
    team1_score DECIMAL(6,2),
    team2_score DECIMAL(6,2),
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Odds
CREATE TABLE odds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matchup_id UUID REFERENCES matchups(id),
    market_type VARCHAR(20) NOT NULL, -- 'moneyline', 'spread', 'total'
    team1_odds INTEGER,
    team2_odds INTEGER,
    spread DECIMAL(4,1),
    total DECIMAL(4,1),
    calculated_at TIMESTAMP DEFAULT NOW()
);

-- Bets
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    matchup_id UUID REFERENCES matchups(id),
    market_type VARCHAR(20) NOT NULL,
    selection VARCHAR(20) NOT NULL, -- 'team1', 'team2', 'over', 'under'
    odds INTEGER NOT NULL,
    amount INTEGER NOT NULL, -- Token amount
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- FAAB Bids
CREATE TABLE faab_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    week INTEGER NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    bid_amount INTEGER NOT NULL,
    winning_bid BOOLEAN,
    bidder_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trades
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    week INTEGER NOT NULL,
    team1_id UUID REFERENCES teams(id),
    team2_id UUID REFERENCES teams(id),
    team1_assets JSONB NOT NULL, -- Players and picks
    team2_assets JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Real-Time Data Flow

**Data Synchronization**
```
ESPN API → FastAPI → Supabase → React Frontend
    ↓         ↓         ↓           ↓
League Data → Processing → Storage → Real-Time Updates
```

**Real-Time Updates**
- WebSocket connections for live data
- Event-driven updates for odds changes
- Push notifications for alerts
- Automatic token balance synchronization

## Integration Architecture

### ESPN API Integration

**Data Access Pattern**
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

**Supported Data Types**
- League settings and member information
- Weekly matchups and scores
- Player statistics and projections
- Transaction history (trades, waivers, FAAB bids)
- Roster information and lineup data

### External Services Integration

**Supabase Services**
- PostgreSQL database with real-time subscriptions
- Built-in authentication and user management
- Automatic API generation and documentation
- Real-time data synchronization

**Deployment Services**
- Vercel for frontend hosting and CDN
- Railway/Render for backend API hosting
- GitHub for version control and CI/CD
- Automatic deployments on code changes

## Security Architecture

### Authentication & Authorization
```python
# JWT token validation
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user(user_id)
    if user is None:
        raise credentials_exception
    return user
```

### Data Protection
- No real money handling (token-based only)
- Read-only access to fantasy league data
- Secure API endpoints with rate limiting
- Input validation and sanitization
- HTTPS/TLS for all communications

### Compliance
- No gambling regulations (virtual tokens only)
- User data privacy and protection
- Secure communication protocols
- Regular security audits and updates

## Scalability Considerations

### Performance Optimization
- Database query optimization and indexing
- Redis caching for frequently accessed data
- CDN for static assets and global distribution
- Efficient real-time update mechanisms
- Connection pooling and resource management

### Growth Planning
- Designed to scale from 10 users (League TB12) to multiple leagues
- Modular architecture for easy feature expansion
- Horizontal scaling capabilities for backend services
- Database partitioning for large datasets
- Load balancing for high availability

### Monitoring & Observability
```python
# Application monitoring
import structlog

logger = structlog.get_logger()

async def calculate_odds_with_monitoring(team1: Team, team2: Team):
    start_time = time.time()
    try:
        result = await odds_engine.calculate(team1, team2)
        logger.info("odds_calculated", 
                   duration=time.time() - start_time,
                   team1=team1.id, 
                   team2=team2.id)
        return result
    except Exception as e:
        logger.error("odds_calculation_failed", 
                    error=str(e),
                    team1=team1.id, 
                    team2=team2.id)
        raise
```

## Development Architecture

### Development Workflow
- Git-based version control with conventional commits
- Automated testing and deployment pipelines
- Feature branch development with pull requests
- Continuous integration and deployment
- Code quality gates and automated testing

### Code Organization
- Modular component architecture
- Separation of concerns between frontend and backend
- Reusable utility functions and services
- Comprehensive documentation and comments
- Type safety with TypeScript and Python type hints

### Quality Assurance
- Unit testing for core business logic
- Integration testing for API endpoints
- User acceptance testing with League TB12
- Performance testing and optimization
- Security testing and vulnerability scanning

---

## Source of Truth / Version

- **Creation Date:** [Current Date]
- **Last Updated:** [Current Date]
- **Next Review Date:** [Next Review Date]
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
