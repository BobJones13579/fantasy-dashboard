# Fantasy Football Companion App - Project Overview

## TLDR

Central navigation and introduction to the Fantasy Football Companion App project documentation, providing overview of the project, goals, and complete documentation ecosystem navigation.

## Purpose

This document serves as the central navigation and introduction to the Fantasy Football Companion App project documentation. It provides an overview of the project, its goals, and how to navigate the complete documentation ecosystem.

## Context

The Fantasy Football Companion App is a passion project designed to enhance private fantasy football leagues with betting-style odds, strategic analytics, and social competition features. The app connects to existing fantasy platforms (ESPN, Yahoo, Sleeper) to generate custom odds, FAAB predictions, and trade analysis - all without handling real money.

## Project Vision

**What we're building:** A fantasy football companion platform that enhances private leagues with betting-style odds, strategic analytics, and social competition features.

**Who it's for:** Fantasy football enthusiasts, particularly friend groups and dynasty leagues who already play on ESPN, Yahoo, or Sleeper.

**Why it matters:** ESPN's built-in analytics are limited, engagement drops mid-season, and there's no unified analytics dashboard for FAAB trends, trades, and league history.

## Key Features

### Core Features (Must Have)
1. **Live Matchup Odds Board** - Comprehensive odds display with win probabilities, spreads, and totals
2. **FAAB/Waiver Bid Predictor** - Strategic waiver wire bidding with league-specific intelligence
3. **Trade Tree & Value Flow Tracker** - Historical trade analysis and value tracking
4. **Token-Based Betting System** - 1000 tokens per week for friendly competition
5. **Real-Time Updates** - Live odds and score updates every 30 seconds

### Important Features (Should Have)
1. **Player Props** - Individual player over/under betting
2. **Custom Matchups** - Any team vs any team competitions
3. **League Management** - Member profiles and league statistics
4. **Mobile Optimization** - Touch-friendly, responsive design

## Technical Stack

- **Frontend:** React.js (mobile-first responsive design)
- **Backend:** Python (FastAPI)
- **Database:** Supabase (PostgreSQL with real-time subscriptions)
- **Deployment:** Vercel (frontend) + Railway/Render (backend)
- **Authentication:** Supabase Auth (simple user management)

## Project Scale

**Target Scale:** MVP (3-6 months, 1-3 developers)
**Timeline:** 16 weeks to full launch
**Team Size:** 1-2 developers (solo passion project with potential for collaboration)
**Budget:** Open source (minimal infrastructure costs, free tiers where possible)

## Success Metrics

- **User Engagement:** 80% of League TB12 members (8/10) use the app weekly
- **Activity:** 5+ bets placed per user per week
- **Session Duration:** 15+ minutes average session duration
- **Participation:** 90% weekly participation rate
- **Satisfaction:** 4.5+ user satisfaction rating

## Documentation Navigation

### 0-Overview
- **[README.md](README.md)** - This document (project introduction and navigation)
- **[glossary.md](glossary.md)** - Project-specific terminology and definitions
- **[architecture-overview.md](architecture-overview.md)** - High-level system architecture
- **[coding-standards.md](coding-standards.md)** - Development standards and conventions

### 1-Product
- **[roadmap.md](../1-Product/roadmap.md)** - Product roadmap and milestones
- **[prds/](../1-Product/prds/)** - Product Requirements Documents for each feature

### 2-Design
- **[system-architecture.md](../2-Design/system-architecture.md)** - Detailed system design
- **[data-models.md](../2-Design/data-models.md)** - Data structures and schemas
- **[api-spec.md](../2-Design/api-spec.md)** - API specifications and contracts
- **[frontend.md](../2-Design/frontend.md)** - Frontend architecture and components
- **[backend.md](../2-Design/backend.md)** - Backend services and infrastructure
- **[integrations.md](../2-Design/integrations.md)** - External integrations and APIs

### 3-Development
- **[changelog.md](../3-Development/changelog.md)** - Version history and changes
- **[sprint-log.md](../3-Development/sprint-log.md)** - Sprint planning and retrospectives
- **[architecture-decisions.md](../3-Development/architecture-decisions.md)** - ADRs and technical decisions
- **[backlog.md](../3-Development/backlog.md)** - Feature backlog and prioritization
- **[milestones.md](../3-Development/milestones.md)** - Project milestones and deadlines
- **[release-checklist.md](../3-Development/release-checklist.md)** - Release process and validation

### 4-Debugging
- **[error-log.md](../4-Debugging/error-log.md)** - Error tracking and resolution
- **[known-issues.md](../4-Debugging/known-issues.md)** - Known issues and workarounds
- **[debug-playbook.md](../4-Debugging/debug-playbook.md)** - Debugging procedures and tools

### 5-Prompts
- **[frontend-prompts.md](../5-Prompts/frontend-prompts.md)** - Frontend development prompts
- **[backend-prompts.md](../5-Prompts/backend-prompts.md)** - Backend development prompts
- **[debugging-prompts.md](../5-Prompts/debugging-prompts.md)** - Debugging and troubleshooting prompts
- **[refactor-prompts.md](../5-Prompts/refactor-prompts.md)** - Code refactoring prompts
- **[session-notes/](../5-Prompts/session-notes/)** - AI collaboration session notes

## Getting Started

1. **Read the Project Context:** Start with the [project-context.md](../../meta-docs-template/project-context-template.md) for comprehensive project information
2. **Review Architecture:** Check [architecture-overview.md](architecture-overview.md) for system design
3. **Understand Features:** Browse [prds/](../1-Product/prds/) for detailed feature requirements
4. **Follow Development:** Track progress in [changelog.md](../3-Development/changelog.md) and [milestones.md](../3-Development/milestones.md)

## Project Status

**Current Phase:** Documentation and Planning
**Next Milestone:** Complete documentation structure and begin Phase 1 development
**Last Updated:** [Current Date]
**Status:** Active Development

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0