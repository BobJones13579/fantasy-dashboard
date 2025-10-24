# Third-Party Integrations

## TLDR

Free and open-source third-party libraries, APIs, and services for the Fantasy Football Companion App, prioritizing existing solutions over custom implementations.

## Core Philosophy

**"Use, Don't Build"** - Leverage proven solutions rather than building from scratch.

## Primary Recommendations (All Free/Open Source)

### **Monte Carlo Simulations**
- **NumPy/SciPy** - Industry standard, replace custom implementation
- **Trust Score**: 8.7/10
- **Implementation**: `numpy.random.default_rng()` for simulations

### **Sports Betting Odds**
- **The Odds API** - Real-time odds data
- **Trust Score**: 7.5/10
- **Free Tier**: 500 requests/month
- **Features**: Multiple bookmakers, historical data

### **Real-Time Communication**
- **Socket.IO** - Real-time updates
- **Trust Score**: 7.5/10
- **Backend**: python-socketio for FastAPI integration
- **Features**: Automatic reconnection, fallback to polling

### **UI Components**
- **UUI (Unified UI)** - Production-ready components
- **Trust Score**: 8.0/10
- **Features**: Mobile-first, accessibility, theming

### **Fantasy Sports Data**
- **ESPN API** - Already working via espn-api library
- **Trust Score**: 7.0/10
- **Status**: Read-only access, 30-second sync

### **Database & Auth**
- **Supabase** - PostgreSQL + Auth + Real-time
- **Trust Score**: 8.5/10
- **Free Tier**: 500MB database, 50,000 monthly active users

### **Caching**
- **Redis** - Session storage and caching
- **Trust Score**: 8.0/10
- **Free Tier**: Available on Railway/Render

## Integration Priority

1. **Phase 1**: NumPy/SciPy, Socket.IO, Supabase
2. **Phase 2**: The Odds API, UUI components
3. **Phase 3**: Redis caching, performance optimization

## Cost Strategy

- **Priority**: Free tiers and open-source solutions
- **Fallback**: Low-cost paid services only when necessary
- **Budget**: Minimal infrastructure costs

## Implementation Notes

- All solutions have generous free tiers sufficient for MVP
- Focus on ESPN API integration (already working)
- Yahoo Fantasy API can be added later for multi-platform support
- Prioritize solutions with active communities and good documentation