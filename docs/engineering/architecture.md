# System Architecture

**TL;DR** — React frontend with FastAPI backend, Supabase database, and ESPN API integration for real-time fantasy football league enhancement.

## System Overview

### Architecture Pattern
Modern web application with React frontend, FastAPI backend, and Supabase database with real-time subscriptions.

### Core Components
- **Frontend** — React.js SPA with mobile-first responsive design
- **Backend** — FastAPI REST API with WebSocket support
- **Database** — Supabase PostgreSQL with real-time subscriptions
- **Integrations** — ESPN API, The Odds API, Monte Carlo simulations

## Data Flow

### Request Flow
1. **User Action** — User interacts with React frontend
2. **API Call** — Frontend makes request to FastAPI backend
3. **Data Processing** — Backend processes request and queries database
4. **Response** — Backend returns data to frontend
5. **UI Update** — Frontend updates user interface

### Data Storage
- **Primary Database** — Supabase PostgreSQL for user data, bets, and analytics
- **Cache Layer** — Redis for session storage and API response caching
- **File Storage** — Supabase Storage for user avatars and assets

## Technology Stack

### Frontend
- **Framework** — React.js 18+ with TypeScript
- **Build Tools** — Vite for fast development and building
- **Deployment** — Vercel with automatic deployments and previews

### Backend
- **Runtime** — Python 3.11+
- **Framework** — FastAPI for high-performance API with automatic documentation
- **API Design** — RESTful API with WebSocket support for real-time updates

### Infrastructure
- **Hosting** — Vercel (frontend) + Railway/Render (backend)
- **CDN** — Vercel Edge Network for global content delivery
- **Monitoring** — Built-in Vercel analytics and error tracking

## Security

### Authentication
Supabase Auth with JWT tokens, email/password and social login options

### Authorization
Row Level Security (RLS) in Supabase for data access control

### Data Protection
HTTPS/TLS encryption, input validation, and secure API key management

## Performance

### Optimization Strategies
- **Frontend** — Code splitting, lazy loading, and React optimization
- **Backend** — Database indexing, query optimization, and caching
- **Real-Time** — WebSocket connections with fallback to polling

### Scalability Considerations
- **Database** — Supabase auto-scaling PostgreSQL with connection pooling
- **API** — FastAPI async support for high concurrency
- **Frontend** — CDN distribution and edge caching

## Deployment

### Environment Strategy
- **Development** — Local development with hot reloading
- **Staging** — Vercel preview deployments for testing
- **Production** — Vercel production deployment with custom domain

### CI/CD Pipeline
GitHub Actions for automated testing, building, and deployment

## Integration Architecture

### ESPN API Integration
- **Library** — espn-api Python library (unofficial)
- **Authentication** — Cookie-based authentication (espn_s2 and SWID)
- **Data Access** — Read-only access to league data
- **Rate Limiting** — Respectful API usage with caching

### The Odds API Integration
- **API** — The Odds API for sports betting odds
- **Authentication** — API key authentication
- **Free Tier** — 500 requests/month
- **Data Types** — Moneyline odds, point spreads, over/under totals

### Monte Carlo Simulations
- **Library** — NumPy/SciPy for statistical simulations
- **Purpose** — Win probability calculations for matchups
- **Implementation** — Server-side calculations with caching

Last Updated: 2024-01-15


