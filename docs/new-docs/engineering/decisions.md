# Architectural Decision Records (ADRs)

**TL;DR** — Key architectural decisions made during the development of the Fantasy Football Companion App.

## Architecture Decisions

### ADR-001: Technology Stack Selection
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Need technology stack for fantasy football app with real-time data, betting operations, and mobile-first design.

**Decision**: 
- **Frontend**: React.js 18+ with TypeScript
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Deployment**: Vercel (frontend) + Railway/Render (backend)
- **Authentication**: Supabase Auth
- **Caching**: Redis

**Consequences**:
- **Positive**: Excellent mobile-first capabilities, high performance, real-time features, type safety
- **Negative**: Learning curve for unfamiliar team members, vendor lock-in with Supabase

### ADR-002: Free-First Integration Strategy
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Passion project with minimal budget, need to leverage existing solutions.

**Decision**: Prioritize free tiers and open-source solutions over custom implementations.

**Consequences**:
- **Positive**: Reduced development time, improved reliability, community support, cost efficiency
- **Negative**: Limited customization, dependency on external services

### ADR-003: Token-Based Betting System
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Need betting system without real money to avoid gambling regulations.

**Decision**: Implement virtual token system (1000 tokens/week) for all betting activities.

**Consequences**:
- **Positive**: No gambling regulations, social gaming focus, engagement without financial risk
- **Negative**: No real monetary value, potential for reduced engagement

### ADR-004: ESPN API Integration
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Need fantasy football data source for League TB12.

**Decision**: Use ESPN API via unofficial espn-api library for read-only access.

**Consequences**:
- **Positive**: Already working, comprehensive data, no cost
- **Negative**: Unofficial library, potential API changes, single platform dependency

### ADR-005: Real-Time Updates Strategy
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Need real-time odds and score updates for betting interface.

**Decision**: Use Supabase real-time subscriptions with Socket.IO fallback.

**Consequences**:
- **Positive**: Built-in real-time features, automatic reconnection, scalable
- **Negative**: Additional complexity, potential connection issues

### ADR-006: Documentation System Migration
**Status**: Accepted | **Date**: 2024-01-15

**Context**: Current documentation system is too elaborate and convoluted for AI-assisted development.

**Decision**: Migrate to simplified meta-docs-template structure with Product/Engineering/Meta sections.

**Consequences**:
- **Positive**: Simplified navigation, AI-optimized content, easier maintenance
- **Negative**: Migration effort, potential information loss during transition

Last Updated: 2024-01-15
