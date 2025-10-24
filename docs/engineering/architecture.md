# System Architecture

**TL;DR** — Advanced React frontend with comprehensive FastAPI backend, Supabase database, and ESPN API integration. All core features implemented and ready for testing.

## System Overview

### Architecture Pattern
Modern web application with React frontend, FastAPI backend, and Supabase database with real-time subscriptions.

### Core Components
- **Frontend** — React.js SPA with mobile-first responsive design
- **Backend** — FastAPI REST API with WebSocket support
- **Database** — Supabase PostgreSQL with real-time subscriptions
- **Integrations** — ESPN API, The Odds API, Monte Carlo simulations

## Data Flow

### Request Flow
1. **User Action** — User interacts with React frontend
2. **API Call** — Frontend makes request to FastAPI backend
3. **Data Processing** — Backend processes request and queries database
4. **Response** — Backend returns data to frontend
5. **UI Update** — Frontend updates user interface

### Data Storage
- **Primary Database** — Supabase PostgreSQL for user data, bets, and analytics
- **Cache Layer** — Redis for session storage and API response caching
- **File Storage** — Supabase Storage for user avatars and assets

## Technology Stack

### Frontend
- **Framework** — React.js 18+ with TypeScript
- **Styling** — Tailwind CSS for utility-first styling
- **State Management** — React Query for server state, Context API for client state
- **Components** — 37+ components covering all features
- **Deployment** — Vercel with automatic deployments

### Backend
- **Runtime** — Python 3.11+
- **Framework** — FastAPI for high-performance API
- **Database** — Supabase (PostgreSQL + Auth + Real-time)
- **Cache** — Redis for session storage and API caching
- **Services** — 13+ specialized services for different features

### Integrations
- **Fantasy Data** — ESPN API via espn-api library (read-only)
- **Sports Odds** — The Odds API (500 requests/month free tier)
- **Simulations** — NumPy/SciPy for Monte Carlo calculations
- **Real-Time** — Socket.IO for WebSocket connections

## API Architecture

### Endpoint Structure
```
/api/v1/
├── tokens/           # Token management and allocation
├── betting/          # Bet placement and settlement
├── odds/             # Odds calculation and display
├── matchup-odds/     # Matchup-specific odds
├── faab/             # FAAB bid management
├── faab-predictor/   # Bid recommendations
├── trades/           # Trade history and analysis
├── trade-tree/       # Trade visualization
├── advanced-markets/ # Player props and custom matchups
├── social/           # Leaderboards and competitions
├── enhanced-betting/ # Advanced betting analytics
├── free-odds/        # External odds integration
├── espn/             # ESPN API integration
└── league/           # League configuration
```

### Service Layer
- **BettingService** — Bet placement, settlement, and analytics
- **TokenService** — Token allocation and management
- **OddsService** — Odds calculation and display
- **FAABService** — FAAB bid management and analysis
- **TradeService** — Trade history and value tracking
- **ESPNService** — ESPN API integration
- **MonteCarloService** — Statistical simulations
- **WebSocketService** — Real-time updates
- **CacheService** — Redis caching and optimization

## Database Schema

### Core Tables
- **users** — User profiles and authentication
- **leagues** — League information and settings
- **teams** — Team data and statistics
- **matchups** — Weekly matchup data
- **bets** — Betting history and results
- **tokens** — Token balances and transactions

### Analytics Tables
- **faab_bids** — FAAB bid history and analysis
- **trades** — Trade history and value tracking
- **odds_history** — Historical odds data
- **performance_metrics** — User and system performance

## Real-Time Features

### WebSocket Implementation
- **Connection Management** — Automatic reconnection and error handling
- **Event Types** — odds_update, bet_settled, upset_alert
- **Data Synchronization** — Real-time updates every 30 seconds
- **Performance** — Optimized for mobile devices

### Real-Time Updates
- **Odds Updates** — Live odds changes during games
- **Score Updates** — Real-time score updates
- **Bet Settlement** — Automatic bet settlement
- **Leaderboard Updates** — Real-time leaderboard changes

## Security Architecture

### Authentication
- **Supabase Auth** — JWT token-based authentication
- **User Management** — Secure user registration and login
- **Session Management** — Secure session handling
- **API Security** — Rate limiting and request validation

### Data Protection
- **Input Validation** — Comprehensive input validation
- **SQL Injection Prevention** — Parameterized queries
- **XSS Protection** — Frontend input sanitization
- **CORS Configuration** — Proper CORS setup

## Performance Optimization

### Caching Strategy
- **Redis Caching** — API response caching
- **Database Optimization** — Query optimization and indexing
- **Frontend Caching** — React Query for data caching
- **CDN Integration** — Vercel CDN for static assets

### Scalability
- **Database Indexing** — Optimized database queries
- **Connection Pooling** — Efficient database connections
- **Load Balancing** — Ready for horizontal scaling
- **Monitoring** — Performance monitoring and alerting

## Deployment Architecture

### Frontend Deployment
- **Platform** — Vercel
- **Build Process** — Automatic builds on Git push
- **CDN** — Global CDN for fast loading
- **Environment** — Production and staging environments

### Backend Deployment
- **Platform** — Railway/Render
- **Containerization** — Docker containers
- **Database** — Supabase managed database
- **Monitoring** — Application performance monitoring

## Integration Architecture

### ESPN API Integration
- **Authentication** — Cookie-based authentication
- **Data Sync** — 30-second sync intervals
- **Error Handling** — Robust error handling and retry logic
- **Rate Limiting** — Respectful API usage

### The Odds API Integration
- **Authentication** — API key-based authentication
- **Data Processing** — Real-time odds processing
- **Fallback Strategy** — Multiple data sources
- **Cost Management** — Free tier optimization

## Monitoring & Logging

### Application Monitoring
- **Health Checks** — Comprehensive health check endpoints
- **Performance Metrics** — API response times and throughput
- **Error Tracking** — Comprehensive error logging
- **User Analytics** — User engagement and feature usage

### System Monitoring
- **Database Performance** — Query performance monitoring
- **Cache Performance** — Redis cache hit rates
- **API Usage** — External API usage tracking
- **System Resources** — CPU, memory, and disk usage

## Development Environment

### Local Development
- **Backend** — FastAPI with hot reload
- **Frontend** — React with hot reload
- **Database** — Local Supabase instance
- **Cache** — Local Redis instance

### Testing
- **Unit Tests** — Comprehensive unit test coverage
- **Integration Tests** — API integration testing
- **End-to-End Tests** — Full user workflow testing
- **Performance Tests** — Load and stress testing

Last Updated: 2024-01-15