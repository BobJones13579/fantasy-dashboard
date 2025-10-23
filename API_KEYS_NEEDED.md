# API Keys Required for Fantasy Football Companion App

## TLDR

Comprehensive list of all API keys and credentials needed for the Fantasy Football Companion App, including setup instructions and usage.

## Purpose

This document lists all the API keys and credentials required to run the Fantasy Football Companion App with full functionality.

## Required API Keys

### 🆓 **FREE Odds Services** (RECOMMENDED - NO COST!)

#### TheSportsDB (100% Free)
- **API Key**: `123` (public free key) or get your own
- **Purpose**: Comprehensive sports data, live scores, team info
- **Cost**: **Completely free with unlimited requests**
- **Usage**: Team data, live scores, player stats, league information
- **Status**: ✅ Ready to use (no setup required)

#### API-American-Football (Free Tier)
- **API Key**: RapidAPI key (free tier available)
- **Purpose**: NFL-specific odds and betting data
- **Cost**: **100 requests/day free**
- **Usage**: NFL odds, betting markets, game data
- **Status**: ⏳ Optional setup (free tier available)

### ✅ **The Odds API** (BACKUP - Limited Free)
- **API Key**: `c80c884ccf5838362cbf7c3a3792710b`
- **Purpose**: Real-time sports betting odds data (backup option)
- **Free Tier**: 500 requests/month
- **Usage**: Live odds updates, moneyline, spreads, totals (fallback)
- **Status**: ✅ Configured but only used when free services are exhausted

### ⏳ **Supabase** (NEEDED)
- **Project URL**: `https://your-project-ref.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (public key)
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (secret key)
- **Purpose**: Database, authentication, real-time subscriptions
- **Free Tier**: 500MB database, 50,000 monthly active users
- **Usage**: User authentication, data storage, real-time updates
- **Status**: ⏳ Needs setup

### ⏳ **Redis** (OPTIONAL - Free Tier Available)
- **Redis URL**: `redis://localhost:6379` (local) or Redis Cloud URL
- **Purpose**: Caching for performance optimization
- **Free Tier**: Redis Cloud offers 30MB free tier
- **Usage**: Session caching, API response caching, odds data caching
- **Status**: ⏳ Optional (can run without Redis)

## Setup Instructions

### 1. The Odds API ✅ (Already Configured)
```bash
export THE_ODDS_API_KEY=c80c884ccf5838362cbf7c3a3792710b
```

### 2. Supabase Setup (Required)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys from Settings > API
4. Set environment variables:
```bash
export SUPABASE_URL=https://your-project-ref.supabase.co
export SUPABASE_ANON_KEY=your_anon_key_here
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Redis Setup (Optional)
#### Option A: Local Redis
```bash
# Install Redis locally
brew install redis  # macOS
# or
sudo apt-get install redis-server  # Ubuntu

# Start Redis
redis-server

# Set environment variable
export REDIS_URL=redis://localhost:6379
```

#### Option B: Redis Cloud (Free Tier)
1. Go to [redis.com](https://redis.com)
2. Sign up for free tier (30MB)
3. Create a database
4. Get connection URL
5. Set environment variable:
```bash
export REDIS_URL=redis://username:password@host:port
```

## Environment Variables Summary

Create a `.env` file in the backend directory:

```env
# The Odds API (CONFIGURED)
THE_ODDS_API_KEY=c80c884ccf5838362cbf7c3a3792710b

# Supabase (NEEDED)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Redis (OPTIONAL)
REDIS_URL=redis://localhost:6379

# ESPN API (Already working - no key needed)
# Uses unofficial espn-api library
```

## Cost Analysis

### Free Tier Sufficiency
| Service | Free Limit | MVP Usage | Sufficient? |
|---------|------------|-----------|-------------|
| The Odds API | 500 req/month | ~200 req/month | ✅ Yes |
| Supabase | 500MB DB, 50k MAU | ~50MB, 10 users | ✅ Yes |
| Redis Cloud | 30MB | ~10MB | ✅ Yes |
| ESPN API | No limits | League data only | ✅ Yes |

### Total Monthly Cost: $0 (using free tiers only)

## Testing Status

- ✅ **The Odds API**: Ready to test with provided key
- ⏳ **Supabase**: Needs project setup
- ⏳ **Redis**: Optional, can run without it
- ✅ **ESPN API**: Already working

## Next Steps

1. **Set up Supabase project** (required for authentication and database)
2. **Test The Odds API** with provided key
3. **Optional: Set up Redis** for performance optimization
4. **Run integration tests** to verify all services

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage to stay within free tier limits

---

*Last Updated: 2024-01-15*
*Status: The Odds API configured, Supabase setup needed*
