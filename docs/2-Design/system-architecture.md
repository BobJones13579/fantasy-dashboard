# System Architecture

## TLDR

Modern real-time web app with React frontend, FastAPI backend, and Supabase database. Integrates ESPN API for fantasy data and The Odds API for sports betting odds.

## Architecture Overview

```
Frontend (React) ←→ Backend (FastAPI) ←→ Database (Supabase)
     ↓                    ↓                    ↓
Mobile-First UI    ESPN API Integration   Real-Time Subscriptions
```

## Frontend (React + TypeScript)

**Stack:** Tailwind CSS, React Query, Socket.IO, UUI components, Vercel deployment

**Key Components:**
- `MatchupOddsBoard` - Live odds with win probabilities
- `FAABPredictor` - Waiver bid recommendations  
- `TradeTreeTracker` - Trade history analysis
- `TokenBalance` - Virtual betting interface

**Features:**
- 30-second live updates via WebSockets
- Touch-friendly mobile interface
- Offline cached data viewing

## Backend (FastAPI + Python)

**Stack:** Supabase (PostgreSQL + Auth), espn-api, The Odds API, NumPy/SciPy, Redis cache

**Core Services:**
- **Odds Engine** - Monte Carlo simulations, real-time probability calculations
- **FAAB Analysis** - Historical bid analysis, league-specific modeling
- **Trade Analysis** - Trade history parsing, value flow tracking
- **User Management** - Token balances, betting history, authentication

## Data Flow

```
ESPN API → FastAPI → Supabase → React Frontend
```

**Core Tables:** `users`, `leagues`, `teams`, `matchups`, `bets`, `tokens`
**Analytics Tables:** `faab_bids`, `trades`, `odds_history`, `performance_metrics`

**Real-Time:** WebSocket connections, event-driven updates, push notifications

## Integrations

**ESPN API:** Read-only access via espn-api library, 30-second sync, historical data collection
**Supabase:** PostgreSQL + Auth + real-time subscriptions
**Deployment:** Vercel (frontend), Railway/Render (backend), GitHub CI/CD

## Security

- Supabase Auth with JWT tokens
- Token-based system (no real money)
- Read-only fantasy data access
- HTTPS/TLS communication

## Scalability

- Designed for 10 users → multiple leagues
- Database indexing and caching
- Modular architecture for expansion

