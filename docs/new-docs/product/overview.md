# Product Overview

**TL;DR** — React frontend with FastAPI backend, Supabase database, and ESPN API integration for fantasy football league enhancement.

## System Modules

### Core Features
- **Live Matchup Odds Board** — Real-time win probabilities with Monte Carlo simulations
- **FAAB/Waiver Bid Predictor** — Strategic intelligence for waiver wire decisions
- **Trade Tree & Value Flow Tracker** — Historical trade analysis and value tracking
- **Token-Based Betting System** — Virtual currency for engagement without real money

### Supporting Systems
- **User Authentication** — Supabase Auth with JWT tokens
- **Real-Time Updates** — WebSocket connections for live data
- **Data Integration** — ESPN API for fantasy data, The Odds API for sports odds
- **Mobile Interface** — Touch-friendly responsive design

## Technology Stack

### Frontend
- **Framework** — React.js 18+ with TypeScript
- **Styling** — Tailwind CSS for utility-first styling
- **State Management** — React Query for server state, Context API for client state
- **Deployment** — Vercel with automatic deployments

### Backend
- **Runtime** — Python 3.11+
- **Framework** — FastAPI for high-performance API
- **Database** — Supabase (PostgreSQL + Auth + Real-time)
- **Cache** — Redis for session storage and API caching

### Integrations
- **Fantasy Data** — ESPN API via espn-api library (read-only)
- **Sports Odds** — The Odds API (500 requests/month free tier)
- **Simulations** — NumPy/SciPy for Monte Carlo calculations
- **Real-Time** — Socket.IO for WebSocket connections

## Development Philosophy

- **Free-First** — Prioritize free tiers and open-source solutions
- **Use, Don't Build** — Leverage existing solutions over custom implementations
- **Mobile-First** — Touch-friendly interface optimized for mobile devices
- **Real-Time** — Live updates and data synchronization

## Project Context

- **Target League** — League TB12 (10 teams, standard scoring)
- **User Base** — 10 league members initially, scalable to multiple leagues
- **Budget** — Minimal infrastructure costs, leveraging free tiers
- **Timeline** — 16-week development plan across 4 phases

Last Updated: 2024-01-15
