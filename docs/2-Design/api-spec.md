# API Specification

## TLDR

FastAPI REST API with JWT authentication, real-time WebSocket support, and integration with ESPN API and The Odds API.

## Base Configuration

**Base URL:** `https://api.fantasy-companion.app/v1`
**Authentication:** JWT tokens from Supabase Auth
**Content Type:** JSON
**Rate Limiting:** 100 requests/minute (general), 200/minute (real-time), 50/minute (betting)

## Core Endpoints

**Authentication:**
- `POST /auth/login` - User login with JWT token
- `POST /auth/refresh` - Refresh JWT token

**League Management:**
- `GET /leagues` - List user's leagues
- `GET /leagues/{id}` - Get league details
- `GET /leagues/{id}/teams` - Get league teams

**Matchups & Odds:**
- `GET /matchups/{week}` - Get week matchups with odds
- `GET /odds/{matchup_id}` - Get matchup odds
- `POST /odds/calculate` - Calculate custom odds

**Betting:**
- `POST /bets` - Place bet with tokens
- `GET /bets` - Get user's betting history
- `GET /bets/{id}` - Get bet details

**FAAB Analysis:**
- `GET /faab/recommendations` - Get bid recommendations
- `GET /faab/analysis` - Get league bidding analysis
- `GET /faab/efficiency` - Get manager efficiency scores

**Trade Analysis:**
- `GET /trades` - Get trade history
- `GET /trades/analysis` - Get trade value analysis
- `GET /trades/tree` - Get trade tree visualization

**User Management:**
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/tokens` - Get token balance

## Real-Time Updates

**WebSocket:** `wss://api.fantasy-companion.app/ws?token=<jwt_token>`
**Message Types:** odds_update, bet_settled, upset_alert

## Response Formats

**Pagination:** All list endpoints support limit/offset pagination
**Timestamps:** ISO 8601 format with UTC timezone
**Numbers:** Tokens (integers), odds (integers), probabilities (0.0-1.0)
