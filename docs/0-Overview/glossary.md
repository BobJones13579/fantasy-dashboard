# Project Glossary

## Purpose

This document defines project-specific terminology, acronyms, and concepts used throughout the Fantasy Football Companion App documentation and codebase.

## Context

This glossary ensures consistent understanding of domain-specific terms, technical concepts, and business terminology across all team members and AI collaborators.

## Core Domain Terms

### Fantasy Football Terms

**FAAB (Free Agent Acquisition Budget)**
- A system where fantasy football managers bid virtual money to acquire free agents
- Each manager starts with a budget (typically $100-200) and bids on players
- Highest bidder wins the player and pays their bid amount

**League TB12**
- The specific ESPN fantasy football league this app is designed for
- 10-team league with standard scoring settings
- Primary target audience and testing environment

**Matchup**
- Weekly head-to-head competition between two fantasy teams
- Each team plays one opponent per week during the regular season
- Winner determined by total fantasy points scored

**Projected Points**
- Estimated fantasy points a player or team is expected to score
- Based on historical performance, matchups, and other factors
- Used for calculating odds and making predictions

**Roster**
- The collection of players a fantasy team has on their active lineup
- Includes starting players and bench players
- Can be modified through trades, waivers, and free agent pickups

**Trade**
- Exchange of players and/or draft picks between fantasy teams
- Must be agreed upon by both teams and approved by league settings
- Creates a transaction history that can be analyzed

**Waiver Wire**
- Pool of unowned players available for acquisition
- Players become available after being dropped or after games
- FAAB bidding system determines who acquires each player

### Betting and Odds Terms

**Moneyline Odds**
- Betting format showing how much you need to bet to win $100 (negative) or how much you win on a $100 bet (positive)
- Example: -150 means bet $150 to win $100, +200 means bet $100 to win $200

**Point Spread**
- Handicap given to the favored team to make the matchup more even
- Example: Team A -7.5 means Team A must win by 8+ points to cover the spread

**Over/Under (Total)**
- Bet on whether the combined score of both teams will be over or under a set number
- Example: O/U 45.5 means bet on whether total points will be over or under 45.5

**Implied Probability**
- The probability of an outcome as implied by the odds
- Calculated from odds: negative odds = odds/(odds+100), positive odds = 100/(odds+100)

**Token System**
- Virtual currency used for betting within the app
- Each user receives 1000 tokens per week
- No real money involved, purely for engagement and competition

### Technical Terms

**ESPN API**
- Unofficial API for accessing ESPN fantasy football data
- Uses espn-api Python library with browser session cookies
- Provides league data, matchups, player stats, and transaction history

**Monte Carlo Simulation**
- Statistical method using random sampling to model outcomes
- Used to calculate win probabilities by simulating thousands of matchup scenarios
- Accounts for variance and uncertainty in projections

**Real-Time Updates**
- Live data synchronization that updates every 30 seconds
- Includes odds changes, score updates, and market movement
- Powered by Supabase real-time subscriptions

**Supabase**
- Backend-as-a-Service platform providing PostgreSQL database
- Includes real-time subscriptions, authentication, and API generation
- Primary data storage and user management solution

### App-Specific Terms

**Fantasy Command Center**
- The comprehensive dashboard that serves as the main interface
- Combines odds, analytics, and social features in one place
- Inspired by sportsbook interfaces but focused on fantasy football

**League-Specific Intelligence**
- Analytics and predictions tailored to a specific league's behavior
- Includes FAAB bidding patterns, trade tendencies, and manager strategies
- Provides competitive advantage over generic fantasy tools

**Strategic Intelligence Features**
- The three core features that provide competitive advantages:
  1. Live Matchup Odds Board
  2. FAAB/Waiver Bid Predictor  
  3. Trade Tree & Value Flow Tracker

**Upset Alert**
- Notification system that detects when underdogs are outperforming projections
- Triggers when live scores deviate significantly from expected outcomes
- Adds excitement and engagement during live games

## Technical Acronyms

**API** - Application Programming Interface
**CLI** - Command Line Interface
**CRUD** - Create, Read, Update, Delete
**CSS** - Cascading Style Sheets
**DOM** - Document Object Model
**ESPN** - Entertainment and Sports Programming Network
**FAAB** - Free Agent Acquisition Budget
**HTML** - HyperText Markup Language
**HTTP** - HyperText Transfer Protocol
**JSON** - JavaScript Object Notation
**MVP** - Minimum Viable Product
**PWA** - Progressive Web App
**REST** - Representational State Transfer
**SQL** - Structured Query Language
**UI/UX** - User Interface/User Experience
**URL** - Uniform Resource Locator

## Business Terms

**Engagement**
- Level of user interaction and participation with the app
- Measured by session duration, feature usage, and return visits
- Primary success metric for the platform

**Retention**
- Percentage of users who continue using the app over time
- Key indicator of product-market fit and user satisfaction
- Target: 90% weekly participation rate

**Token Economy**
- The virtual currency system that drives user engagement
- Balances competition with accessibility (no real money risk)
- Creates gamification elements without gambling regulations

**User Acquisition**
- Process of gaining new users for the platform
- Initially focused on League TB12, then expansion to other leagues
- Organic growth through word-of-mouth and league referrals

## Development Terms

**Agile Development**
- Iterative development methodology with short sprints
- Focuses on rapid prototyping and user feedback
- 4 development phases over 16 weeks

**Mobile-First Design**
- Design approach that prioritizes mobile devices
- Responsive design that works on phones, tablets, and desktops
- Touch-friendly interface with 44px minimum touch targets

**Real-Time Architecture**
- System design that supports live data updates
- WebSocket connections for instant communication
- Event-driven updates for odds, scores, and notifications

**Token-Based Authentication**
- Secure user authentication using Supabase Auth
- JWT tokens for session management
- Simple login flow without complex OAuth

## Compliance Terms

**No Real Money Policy**
- Core principle that the app never handles actual currency
- Uses virtual tokens to avoid gambling regulations
- Maintains legal compliance while providing betting excitement

**Read-Only Access**
- App can only read fantasy league data, not modify it
- Cannot make lineup changes or submit transactions
- Ensures user control over their fantasy teams

**Social Gaming**
- Category of gaming that emphasizes social interaction
- Legal framework that allows competition without gambling laws
- Focus on engagement and community rather than financial gain

---

## Source of Truth / Version

- **Creation Date:** [Current Date]
- **Last Updated:** [Current Date]
- **Next Review Date:** [Next Review Date]
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
