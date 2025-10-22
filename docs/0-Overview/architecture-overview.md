# System Architecture Overview

## TLDR

High-level overview of the Fantasy Football Companion App system architecture, including key components, data flow, and integration points for the modern web application with real-time capabilities.

## Purpose

This document provides a high-level overview of the Fantasy Football Companion App system architecture, including key components, data flow, and integration points.

## Context

The Fantasy Football Companion App is built as a modern web application with real-time capabilities, designed to enhance fantasy football leagues with betting-style odds and strategic analytics. The architecture prioritizes mobile-first design, real-time updates, and seamless integration with existing fantasy platforms.

## High-Level Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile-First  │    │   ESPN API      │    │   Real-Time     │
│   Responsive    │    │   Integration   │    │   Subscriptions │
│   Design        │    │   (espn-api)    │    │   & Auth        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Architecture Principles

1. **Mobile-First Design** - Optimized for mobile devices with responsive desktop support
2. **Real-Time Updates** - Live data synchronization every 30 seconds
3. **Token-Based System** - Virtual currency for engagement without real money
4. **League-Specific Intelligence** - Tailored analytics for each league's behavior
5. **Modular Components** - Scalable architecture for future feature expansion

## Frontend Architecture

### Technology Stack
- **Framework:** React.js with TypeScript
- **Styling:** Tailwind CSS for mobile-first responsive design
- **State Management:** React Query for server state, Context API for client state
- **Real-Time:** Socket.IO for live updates, Supabase real-time subscriptions
- **UI Components:** UUI component library (free, open source)
- **Deployment:** Vercel with automatic deployments (free tier)

### Key Components

**Dashboard Components**
- `MatchupOddsBoard` - Comprehensive odds display with win probabilities
- `FAABPredictor` - Waiver wire bidding recommendations
- `TradeTreeTracker` - Historical trade analysis and visualization
- `TokenBalance` - User token balance and betting interface
- `Leaderboard` - Weekly and season-long competition standings

**Real-Time Features**
- Live odds updates every 30 seconds
- Market movement tracking and alerts
- Upset alert notifications during games
- Token balance updates after bets

**Mobile Optimization**
- Touch-friendly interface (44px minimum touch targets)
- Swipe gestures for navigation
- Pull-to-refresh for data updates
- Offline functionality for viewing cached data

## Backend Architecture

### Technology Stack
- **Framework:** FastAPI (Python) for high-performance API
- **Database:** Supabase (PostgreSQL) with real-time subscriptions
- **Authentication:** Supabase Auth with JWT tokens
- **ESPN Integration:** espn-api Python library
- **Sports Odds:** The Odds API (free tier) for real-time odds data
- **Fantasy Data:** ESPN API (already working, unofficial espn-api library)
- **Monte Carlo:** NumPy/SciPy (free, open source) for probability calculations
- **Caching:** FastAPI Cache + Redis (free tier available)
- **Deployment:** Railway/Render with automatic scaling (free tier)

### Core Services

**Odds Engine Service**
- Monte Carlo simulation using NumPy/SciPy for matchup outcomes
- Real-time probability calculations with The Odds API integration
- Market intelligence and trend analysis
- Upset alert detection and notifications
- ESPN fantasy data integration (already working)

**FAAB Analysis Service**
- Historical bid data parsing and analysis
- League-specific behavioral modeling
- Bid recommendation engine with confidence levels
- Market efficiency tracking and reporting

**Trade Analysis Service**
- Trade history parsing and graph construction
- Value flow tracking and ROI calculations
- Trade tree visualization and analysis
- Historical performance metrics

**User Management Service**
- Token balance tracking and management
- Betting history and performance analytics
- League member profiles and statistics
- Authentication and session management

## Data Architecture

### Database Schema (Supabase PostgreSQL)

**Core Tables**
- `users` - User profiles and authentication data
- `leagues` - League information and settings
- `teams` - Fantasy team data and statistics
- `matchups` - Weekly matchup data and odds
- `bets` - User betting history and outcomes
- `tokens` - Token balance and transaction history

**Analytics Tables**
- `faab_bids` - Historical FAAB bid data
- `trades` - Trade history and value tracking
- `odds_history` - Historical odds and market movement
- `performance_metrics` - User and league performance data

### Real-Time Data Flow

```
ESPN API → FastAPI → Supabase → React Frontend
    ↓         ↓         ↓           ↓
League Data → Processing → Storage → Real-Time Updates
```

**Data Sources**
- ESPN Fantasy Football API (league data, matchups, player stats)
- User interactions (bets, preferences, settings)
- Calculated analytics (odds, predictions, recommendations)

**Real-Time Updates**
- WebSocket connections for live data
- Event-driven updates for odds changes
- Push notifications for alerts and updates
- Automatic token balance synchronization

## Integration Architecture

### ESPN API Integration

**Data Access**
- Read-only access to league data via espn-api library
- Manual authentication using espn_s2 and SWID cookies
- Real-time data synchronization every 30 seconds
- Historical data collection for analytics

**Supported Data**
- League settings and member information
- Weekly matchups and scores
- Player statistics and projections
- Transaction history (trades, waivers, FAAB bids)
- Roster information and lineup data

### External Services

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
- Supabase Auth with JWT tokens
- Secure session management
- User role-based access control
- API key management for ESPN integration

### Data Protection
- No real money handling (token-based only)
- Read-only access to fantasy league data
- Secure API endpoints with rate limiting
- Input validation and sanitization

### Compliance
- No gambling regulations (virtual tokens only)
- User data privacy and protection
- Secure communication (HTTPS/TLS)
- Regular security audits and updates

## Scalability Considerations

### Performance Optimization
- Database query optimization and indexing
- Caching strategies for frequently accessed data
- CDN for static assets and global distribution
- Efficient real-time update mechanisms

### Growth Planning
- Designed to scale from 10 users (League TB12) to multiple leagues
- Modular architecture for easy feature expansion
- Horizontal scaling capabilities for backend services
- Database partitioning for large datasets

### Monitoring & Observability
- Application performance monitoring
- Error tracking and logging
- User engagement analytics
- System health and uptime monitoring

## Development Architecture

### Development Workflow
- Git-based version control with conventional commits
- Automated testing and deployment pipelines
- Feature branch development with pull requests
- Continuous integration and deployment

### Code Organization
- Modular component architecture
- Separation of concerns between frontend and backend
- Reusable utility functions and services
- Comprehensive documentation and comments

### Quality Assurance
- Unit testing for core business logic
- Integration testing for API endpoints
- User acceptance testing with League TB12
- Performance testing and optimization

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
