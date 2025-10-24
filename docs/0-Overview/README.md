# Fantasy Football Companion App - Project Overview

## TLDR

Central navigation and introduction to the Fantasy Football Companion App project documentation, providing overview of the project, goals, and complete documentation ecosystem navigation.

## Project Vision

**What we're building:** A fantasy football companion platform that enhances private leagues with betting-style odds, strategic analytics, and social competition features.

**Who it's for:** Fantasy football enthusiasts, particularly friend groups and dynasty leagues who already play on ESPN, Yahoo, or Sleeper.

**Why it matters:** Transforms static fantasy leagues into dynamic, engaging experiences with strategic depth and social competition.

## Core Features

- **Live Matchup Odds Board** - Real-time win probabilities and betting-style odds
- **FAAB/Waiver Bid Predictor** - Strategic intelligence for waiver wire decisions
- **Trade Tree & Value Flow Tracker** - Historical trade analysis and value tracking
- **Token-Based Betting System** - Virtual currency for engagement without real money

## Technology Stack

- **Frontend**: React.js 18+ with TypeScript, Tailwind CSS, mobile-first design
- **Backend**: Python FastAPI with Supabase (PostgreSQL + Auth + Real-time)
- **Integrations**: ESPN API, The Odds API, NumPy/SciPy for Monte Carlo simulations
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## Development Philosophy

- **Free-First**: Prioritize free tiers and open-source solutions
- **Use, Don't Build**: Leverage existing solutions over custom implementations
- **Mobile-First**: Touch-friendly interface optimized for mobile devices
- **Real-Time**: Live updates and data synchronization

## Documentation Structure

### 0. Overview
- **[Architecture Overview](architecture-overview.md)** - High-level system architecture and components
- **[Coding Standards](coding-standards.md)** - Development standards and best practices
- **[Glossary](glossary.md)** - Key terms and definitions
- **[AI Documentation Standards](ai-documentation-standards.md)** - AI documentation principles
- **[Development Workflow](development-workflow.md)** - Testing, building, committing, pushing requirements

### 1. Product
- **[Roadmap](1-Product/roadmap.md)** - 16-week development roadmap with phases and milestones
- **[Features](1-Product/features/)**
  - [FAAB Waiver Bid Predictor PRD](1-Product/features/faab-waiver-bid-predictor-prd.md)
  - [Live Matchup Odds Board PRD](1-Product/features/live-matchup-odds-board-prd.md)
  - [Trade Tree Value Flow Tracker PRD](1-Product/features/trade-tree-value-flow-tracker-prd.md)

### 2. Design
- **[API Specification](2-Design/api-spec.md)** - Complete REST API documentation
- **[Backend Design](2-Design/backend.md)** - Backend architecture and services
- **[Data Models](2-Design/data-models.md)** - Database schema and data structures
- **[Frontend Design](2-Design/frontend.md)** - Frontend architecture and components
- **[Integrations](2-Design/integrations.md)** - External service integrations
- **[System Architecture](2-Design/system-architecture.md)** - Detailed technical architecture
- **[Third-Party Integrations](2-Design/third-party-integrations.md)** - Comprehensive third-party solution research

### 3. Development
- **[Architecture Decisions](3-Development/architecture-decisions.md)** - Key architectural choices and rationale
- **[Backlog](3-Development/backlog.md)** - Development backlog and task tracking
- **[Changelog](3-Development/changelog.md)** - Version history and changes
- **[Implementation Plan](3-Development/implementation-plan.md)** - Detailed implementation strategy
- **[Implementation Status](3-Development/implementation-status.md)** - Current implementation status
- **[Milestones](3-Development/milestones.md)** - Project milestones and deliverables
- **[Quick Start Guide](3-Development/quick-start-guide.md)** - Getting started with development
- **[Release Checklist](3-Development/release-checklist.md)** - Pre-release verification steps
- **[Sprint Log](3-Development/sprint-log.md)** - Sprint planning and execution

### 4. Debugging
- **[Debug Playbook](4-Debugging/debug-playbook.md)** - Guide for debugging issues
- **[Error Log](4-Debugging/error-log.md)** - Error tracking and resolution
- **[Known Issues](4-Debugging/known-issues.md)** - Tracking of known issues and workarounds

### 5. Prompts
- **[Backend Development Prompts](5-Prompts/backend-prompts.md)** - AI prompts for backend tasks
- **[Frontend Development Prompts](5-Prompts/frontend-prompts.md)** - AI prompts for frontend tasks

## Success Metrics

**Engagement**: 80% of league members use weekly
**Bets Per Week**: 5+ bets per user
**Session Duration**: 15+ minutes per session
**User Satisfaction**: 4.5+ stars

## Contributing

This is a passion project for League TB12. Documentation follows the metadocs template structure and emphasizes:

- **Concise Coverage** - Essential information documented clearly
- **AI-Optimized** - Structured for AI agent consumption
- **Free Solutions** - Prioritizing free tiers and open-source solutions
- **Existing Products** - Leveraging proven solutions over custom implementations
- **Clear Cross-References** - Easy navigation between related documents

## Documentation Maintenance

- **Last Updated**: 2024-01-15 (Refactored for conciseness)
- **Next Review**: 2024-01-22
- **Maintainer**: Development Team
- **Version**: 1.1.0

---

*This documentation serves as the single source of truth for the Fantasy Football Companion App project.*