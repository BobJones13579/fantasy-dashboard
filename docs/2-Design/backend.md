# Backend Architecture

## Purpose

This document outlines the backend architecture for the Fantasy Football Companion App, including service structure, API design, and infrastructure components.

## Context

The backend is built using FastAPI (Python) with Supabase for database and real-time features, designed to handle fantasy football league data, betting operations, and strategic intelligence features.

## Technology Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: Supabase (PostgreSQL 15+)
- **Cache**: Redis for session storage and caching
- **Real-Time**: Supabase real-time subscriptions
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Railway/Render with auto-scaling

## Service Architecture

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

## Core Services

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

## API Design Principles

- **RESTful Design**: Standard HTTP methods and status codes
- **Versioning**: API versioning for backward compatibility
- **Documentation**: Auto-generated OpenAPI documentation
- **Validation**: Request/response validation with Pydantic
- **Error Handling**: Consistent error responses and logging

## Database Design

- **PostgreSQL**: Relational database with JSON support
- **Real-Time**: Supabase real-time subscriptions
- **Indexing**: Optimized indexes for query performance
- **Migrations**: Version-controlled schema changes
- **Backups**: Automated backup and recovery procedures

## Security Architecture

- **Authentication**: JWT-based authentication with Supabase
- **Authorization**: Role-based access control
- **Data Validation**: Input sanitization and validation
- **Rate Limiting**: API rate limiting and abuse prevention
- **HTTPS**: Secure communication protocols

## Performance Optimization

- **Caching**: Redis caching for frequently accessed data
- **Connection Pooling**: Database connection optimization
- **Async Operations**: Non-blocking I/O operations
- **Load Balancing**: Horizontal scaling capabilities
- **Monitoring**: Performance metrics and alerting

## Integration Points

- **ESPN API**: Fantasy football league data integration
- **Supabase**: Database and real-time features
- **Redis**: Caching and session management
- **External APIs**: Player data and projections

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
