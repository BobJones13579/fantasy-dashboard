# Product Overview

**TL;DR** — Advanced React frontend with comprehensive FastAPI backend, Supabase database, and ESPN API integration. Most core features are implemented and functional.

## System Modules

### ✅ **IMPLEMENTED Core Features**
- **Live Matchup Odds Board** — Real-time win probabilities with Monte Carlo simulations
- **FAAB/Waiver Bid Predictor** — Strategic intelligence for waiver wire decisions  
- **Trade Tree & Value Flow Tracker** — Historical trade analysis and value tracking
- **Token-Based Betting System** — Virtual currency for engagement without real money
- **Advanced Markets** — Player props, custom matchups, team totals
- **Social Features** — Leaderboards, competitions, achievements, member profiles
- **Enhanced Betting Interface** — Comprehensive betting analytics and risk management

### ✅ **IMPLEMENTED Supporting Systems**
- **User Authentication** — Supabase Auth with JWT tokens
- **Real-Time Updates** — WebSocket connections for live data
- **Data Integration** — ESPN API for fantasy data, The Odds API for sports odds
- **Mobile Interface** — Touch-friendly responsive design
- **Caching System** — Redis integration for performance optimization
- **Monte Carlo Engine** — Statistical simulation for odds calculations

## Technology Stack

### Frontend
- **Framework** — React.js 18+ with TypeScript
- **Styling** — Tailwind CSS for utility-first styling
- **State Management** — React Query for server state, Context API for client state
- **Components** — Comprehensive component library with 37+ components
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

## Current Implementation Status

### ✅ **FULLY IMPLEMENTED**
- **Backend API** — 15+ API endpoints across all major features
- **Frontend Components** — Complete UI for all core features
- **Database Models** — User, team, league, bet, token models
- **ESPN Integration** — Working connection to League TB12
- **Token System** — 1000 tokens/week allocation and tracking
- **Betting System** — Bet placement, settlement, and analytics
- **FAAB Predictor** — Bid recommendations and market intelligence
- **Trade Analysis** — Historical trade parsing and value tracking
- **Social Features** — Leaderboards, competitions, achievements
- **Advanced Markets** — Player props, custom matchups, team totals

### 🔄 **IN PROGRESS**
- **Supabase Setup** — Database project creation needed
- **API Keys Configuration** — The Odds API configured, Supabase setup required
- **Real-Time Integration** — WebSocket service implemented, needs testing
- **Mobile Optimization** — Responsive design implemented, needs testing

### ⏳ **PENDING**
- **Production Deployment** — Development environment ready
- **User Testing** — Ready for League TB12 testing
- **Performance Optimization** — Redis caching implemented, needs tuning

## Development Philosophy

- **Free-First** — Prioritize free tiers and open-source solutions
- **Use, Don't Build** — Leverage existing solutions over custom implementations
- **Mobile-First** — Touch-friendly interface optimized for mobile devices
- **Real-Time** — Live updates and data synchronization

## Project Context

- **Target League** — League TB12 (10 teams, standard scoring)
- **User Base** — 10 league members initially, scalable to multiple leagues
- **Budget** — Minimal infrastructure costs, leveraging free tiers
- **Timeline** — Ready for testing and deployment
- **Current Phase** — Implementation complete, ready for testing and optimization

## API Endpoints Implemented

### Core Features
- `/api/v1/tokens` — Token management and allocation
- `/api/v1/betting` — Bet placement and settlement
- `/api/v1/odds` — Odds calculation and display
- `/api/v1/matchup-odds` — Matchup-specific odds
- `/api/v1/faab` — FAAB bid management
- `/api/v1/faab-predictor` — Bid recommendations
- `/api/v1/trades` — Trade history and analysis
- `/api/v1/trade-tree` — Trade visualization

### Advanced Features
- `/api/v1/advanced-markets` — Player props and custom matchups
- `/api/v1/social` — Leaderboards and competitions
- `/api/v1/enhanced-betting` — Advanced betting analytics
- `/api/v1/free-odds` — External odds integration

### System
- `/api/v1/espn` — ESPN API integration
- `/api/v1/league` — League configuration
- `/health` — System health checks
- `/health/integrations` — Integration status

Last Updated: 2024-01-15