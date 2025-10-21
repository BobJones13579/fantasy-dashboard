# Frontend Architecture

## Purpose

This document outlines the frontend architecture for the Fantasy Football Companion App, including component structure, state management, and user interface design patterns.

## Context

The frontend is built as a React.js application with mobile-first design principles, focusing on touch-friendly interfaces and real-time data updates for fantasy football league management and betting features.

## Technology Stack

- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Query for server state, Context API for client state
- **Real-Time**: Supabase real-time subscriptions
- **PWA**: Service workers for offline functionality
- **Deployment**: Vercel with automatic deployments

## Component Architecture

```
src/
├── components/
│   ├── common/                 # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── features/               # Feature-specific components
│   │   ├── OddsBoard/
│   │   │   ├── MatchupCard/
│   │   │   ├── OddsDisplay/
│   │   │   └── MarketIntelligence/
│   │   ├── FAABPredictor/
│   │   │   ├── BidRecommendation/
│   │   │   ├── MarketAnalysis/
│   │   │   └── EfficiencyMetrics/
│   │   └── TradeTracker/
│   │       ├── TradeTree/
│   │       ├── ValueAnalysis/
│   │       └── HistoricalView/
│   └── layout/                 # Layout components
│       ├── Header/
│       ├── Navigation/
│       └── Footer/
├── hooks/                      # Custom React hooks
│   ├── useOdds/
│   ├── useFAAB/
│   ├── useTrades/
│   └── useRealTime/
├── services/                   # API services
│   ├── api/
│   ├── websocket/
│   └── auth/
├── utils/                      # Utility functions
├── types/                      # TypeScript definitions
└── constants/                  # Application constants
```

## State Management Strategy

**Server State (React Query)**
```typescript
// API data with caching and real-time updates
const { data: matchups, isLoading } = useQuery({
  queryKey: ['matchups', week],
  queryFn: () => fetchMatchups(week),
  staleTime: 30000, // 30 seconds
  refetchInterval: 30000, // Real-time updates
});
```

**Client State (Context API)**
```typescript
// User preferences and UI state
const AppContext = createContext<AppState>({
  user: null,
  preferences: defaultPreferences,
  theme: 'light',
});
```

## Mobile-First Design Principles

- **Touch Targets**: Minimum 44px touch targets for all interactive elements
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Performance**: Optimized for mobile devices with efficient rendering
- **Accessibility**: Screen reader support and keyboard navigation

## Real-Time Updates

- **WebSocket Integration**: Supabase real-time subscriptions
- **Optimistic Updates**: Immediate UI feedback with server reconciliation
- **Connection Management**: Automatic reconnection and error handling
- **Data Synchronization**: Conflict resolution and state consistency

## Progressive Web App Features

- **Service Workers**: Offline functionality and caching
- **Push Notifications**: Real-time alerts and updates
- **App Installation**: Native app-like experience
- **Background Sync**: Data synchronization when connection restored

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
