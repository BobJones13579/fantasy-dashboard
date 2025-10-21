# Project Context: Fantasy Football Companion App

## Project Overview

**Project Name:** Fantasy Football Companion App (Fantom Odds-Inspired)
**Project Type:** Web App / Mobile App
**Domain/Industry:** Sports / Fantasy Sports / Social Gaming
**Target Scale:** MVP (3-6 months, 1-3 developers)

## Core Purpose & Vision

**What are you building?**
A fantasy football companion platform that enhances private leagues with betting-style odds, strategic analytics, and social competition features. The app connects to existing fantasy platforms (ESPN, Yahoo, Sleeper) to generate custom odds, FAAB predictions, and trade analysis - all without handling real money.

**Who is this for?**
Fantasy football enthusiasts, particularly friend groups and dynasty leagues who already play on ESPN, Yahoo, or Sleeper. Target users are power users and commissioners who want deeper engagement, strategic insights, and fun social competition within their existing leagues.

**What problem does this solve?**
- ESPN's built-in analytics and customization are limited
- Engagement drops mid-season when teams fall out of contention  
- Side bets and friendly wagers are handled manually
- No unified "analytics dashboard" for FAAB trends, trades, and league history
- Fantasy leagues lack the excitement and engagement of sports betting without the legal/financial risks

**What makes this unique?**
Combines the excitement of sports betting with fantasy football strategy, using token-based competition instead of real money. Provides league-specific intelligence that can't be found elsewhere, including FAAB market analysis, trade value tracking, and comprehensive odds modeling.

## Technical Requirements

**Frontend Technology:** React.js (mobile-first responsive design)
**Backend Technology:** Python (FastAPI)
**Database:** Supabase (PostgreSQL with real-time subscriptions)
**Deployment Platform:** Vercel (frontend) + Railway/Render (backend)
**Authentication:** Supabase Auth (simple user management)
**Payment Processing:** None (token-based system only)

## Key Features & Functionality

**Core Features (Must Have):**
1. **Live Matchup Odds Board** - Comprehensive odds display with win probabilities, spreads, and totals
2. **FAAB/Waiver Bid Predictor** - Strategic waiver wire bidding with league-specific intelligence
3. **Trade Tree & Value Flow Tracker** - Historical trade analysis and value tracking
4. **Token-Based Betting System** - 1000 tokens per week for friendly competition
5. **Real-Time Updates** - Live odds and score updates every 30 seconds

**Important Features (Should Have):**
1. **Player Props** - Individual player over/under betting
2. **Custom Matchups** - Any team vs any team competitions
3. **League Management** - Member profiles and league statistics
4. **Mobile Optimization** - Touch-friendly, responsive design

**Nice-to-Have Features:**
1. **League Power Rankings** - Advanced analytics and efficiency metrics
2. **Weekly Challenges** - Auto-generated props and competitions
3. **Cross-Platform Support** - ESPN, Yahoo, and Sleeper integration
4. **Auto Newsletter Generator** - Weekly league recaps and analysis

## User Experience & Interface

**Primary User Flow:**
1. User connects their ESPN league (League TB12)
2. View comprehensive odds board with all weekly matchups
3. Place token-based bets on matchups, spreads, and totals
4. Track FAAB recommendations and waiver wire strategy
5. Analyze trade history and value flow over time
6. Compete with league members for weekly token leaderboard

**Key User Interactions:**
- Connect ESPN league with simple authentication
- View real-time odds updates and market movement
- Place bets using token system with confirmation flow
- Access FAAB bid recommendations and market analysis
- Explore interactive trade trees and historical data
- Track personal performance and league standings

**Design Preferences:**
- Mobile-first responsive design (most users on phones)
- Clean, sportsbook-style interface inspired by Fantom Odds
- Real-time updates with smooth animations
- Touch-friendly buttons and intuitive navigation
- Color-coded odds and clear visual hierarchy

## Business & Success Metrics

**Success Criteria:**
- 80% of League TB12 members (8/10) use the app weekly
- 5+ bets placed per user per week
- 15+ minutes average session duration
- 90% weekly participation rate
- 4.5+ user satisfaction rating

**Revenue Model:** Free (passion project, no monetization planned)

**Key Performance Indicators:**
- Daily active users (target: 80% of league members)
- Bets placed per week (target: 5+ per user)
- Feature adoption rate (target: 70% of users try new features)
- System uptime (target: 99.9%)
- API response time (target: <200ms)

## Constraints & Requirements

**Timeline:** 16 weeks to full launch (extended from 12 weeks)
**Team Size:** 1-2 developers (solo passion project with potential for collaboration)
**Budget:** Open source (minimal infrastructure costs, free tiers where possible)
**Technical Constraints:** 
- ESPN API is unofficial (espn-api library)
- Read-only access (cannot make lineup changes)
- Manual authentication (users provide espn_s2 and SWID cookies)
**Compliance Requirements:** No real money handling (token-based only)

## Integration Requirements

**External APIs/Services:**
- ESPN Fantasy Football API (via espn-api Python library)
- Supabase (database, real-time subscriptions, authentication)
- FastAPI (backend framework)
- React.js (frontend framework)

**Third-Party Integrations:**
- ESPN league data synchronization
- Real-time odds calculation and updates
- Token balance tracking and management
- Historical data storage and analysis

## Development Approach

**Development Methodology:** Agile with 4 development phases
**Testing Strategy:** Unit tests, integration tests, user acceptance testing with League TB12
**Code Quality Standards:** Clean, modular code with comprehensive documentation
**Version Control:** Git with conventional commit format, automatic GitHub pushes

## Deployment & Operations

**Environment Strategy:** Development → Staging → Production
**Monitoring & Logging:** System uptime, API performance, user engagement metrics
**Backup & Recovery:** Supabase automatic backups, GitHub version control
**Security Considerations:** No real money handling, secure API key management

## Future Considerations

**Planned Enhancements:**
- Cross-platform support (Yahoo, Sleeper)
- Advanced analytics and machine learning
- Mobile app (React Native or PWA)
- League expansion beyond League TB12

**Scalability Requirements:** Designed to scale from 10 users (League TB12) to multiple leagues
**Maintenance Strategy:** Self-maintaining with automated documentation and monitoring

## Additional Context

**Special Requirements:** 
- Must work seamlessly with existing ESPN fantasy leagues
- Token-based system to avoid gambling regulations
- Mobile-optimized for phone usage
- Real-time updates for live game excitement

**Known Challenges:**
- ESPN API is unofficial and could break
- Manual authentication process for users
- Real-time data synchronization complexity
- Mobile performance optimization

**Inspiration/References:** 
- Fantom Odds (primary inspiration)
- ESPN Fantasy Football platform
- Sports betting interfaces (for UI/UX)
- Fantasy analytics tools (FantasyPros, KeepTradeCut)

**Notes:** 
This is a passion project for friends who enjoy sports betting and fantasy football. The goal is to create a fun, engaging platform that enhances their existing fantasy league experience without the complexity or legal issues of real money betting. The focus is on social competition, strategic insights, and maintaining engagement throughout the season.

## AI Processing Instructions

**Project Scale Determination:** MVP Scale (3-6 months, 1-3 developers)
**Documentation Structure:** Full meta system framework with all 5 layers
**Key Focus Areas:** 
- Mobile-first development
- Real-time data synchronization
- Token-based betting system
- League-specific intelligence features
- User engagement and social competition

**Success Metrics Priority:**
1. User engagement and retention
2. Feature adoption and usage
3. System performance and reliability
4. User satisfaction and feedback

---

*This project context serves as the foundational document for the Fantasy Football Companion App, providing comprehensive information for AI-assisted documentation generation and development planning.*
