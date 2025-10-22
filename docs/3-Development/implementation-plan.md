# Implementation Plan

## TLDR

Comprehensive technical implementation plan for the Fantasy Football Companion App, including detailed development phases, technical specifications, and step-by-step implementation guidance over 16 weeks.

## Purpose

This document provides a comprehensive technical implementation plan for the Fantasy Football Companion App, including detailed development phases, technical specifications, and step-by-step implementation guidance.

## Context

The implementation plan follows the 16-week development timeline outlined in the roadmap, with detailed technical specifications for each phase. This plan serves as the primary guide for development execution.

## Development Phases Overview

### Phase 1: Core Infrastructure (Weeks 1-4)
**Goal**: Build the foundation for the betting platform

### Phase 2: Advanced Features (Weeks 5-8)  
**Goal**: Create a beautiful, functional web application with comprehensive odds display

### Phase 3: Strategic Intelligence (Weeks 9-12)
**Goal**: Add advanced analytics and strategic tools for competitive advantage

### Phase 4: Polish & Optimization (Weeks 13-16)
**Goal**: Refine the platform and add final features

## Phase 1: Core Infrastructure Implementation

### Week 1: Token System Foundation

#### 1.1 Database Schema Setup
**Priority**: P0 - Critical
**Effort**: 2 days

**Implementation Steps**:
1. **Set up Supabase Project**
   ```bash
   # Create new Supabase project
   # Configure database settings
   # Set up authentication
   ```

2. **Create Core Database Tables**
   ```sql
   -- Users and authentication
   CREATE TABLE users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       email VARCHAR(255) UNIQUE NOT NULL,
       display_name VARCHAR(100) NOT NULL,
       espn_user_id VARCHAR(50),
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Leagues
   CREATE TABLE leagues (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name VARCHAR(100) NOT NULL,
       espn_league_id VARCHAR(50) UNIQUE NOT NULL,
       season INTEGER NOT NULL,
       settings JSONB,
       created_at TIMESTAMP DEFAULT NOW()
   );

   -- Teams
   CREATE TABLE teams (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       league_id UUID REFERENCES leagues(id),
       espn_team_id VARCHAR(50) NOT NULL,
       name VARCHAR(100) NOT NULL,
       owner_id UUID REFERENCES users(id),
       created_at TIMESTAMP DEFAULT NOW()
   );

   -- Token balances
   CREATE TABLE token_balances (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       team_id UUID REFERENCES teams(id),
       week INTEGER NOT NULL,
       starting_balance INTEGER DEFAULT 1000,
       current_balance INTEGER NOT NULL,
       weekly_used INTEGER DEFAULT 0,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Set up Database Indexes**
   ```sql
   -- Performance indexes
   CREATE INDEX idx_teams_league_id ON teams(league_id);
   CREATE INDEX idx_token_balances_team_week ON token_balances(team_id, week);
   CREATE INDEX idx_users_espn_id ON users(espn_user_id);
   ```

**Deliverables**:
- [ ] Supabase project configured
- [ ] Core database tables created
- [ ] Database indexes implemented
- [ ] Database connection tested

#### 1.2 Token Management System
**Priority**: P0 - Critical
**Effort**: 3 days

**Implementation Steps**:
1. **Create Token Service**
   ```python
   # backend/app/services/token_service.py
   class TokenService:
       def __init__(self, db: Database):
           self.db = db
       
       async def allocate_weekly_tokens(self, team_id: UUID, week: int) -> TokenBalance:
           """Allocate 1000 tokens for a team for a specific week"""
           # Implementation here
       
       async def deduct_tokens(self, team_id: UUID, amount: int, week: int) -> bool:
           """Deduct tokens from team balance"""
           # Implementation here
       
       async def get_balance(self, team_id: UUID, week: int) -> int:
           """Get current token balance for team"""
           # Implementation here
   ```

2. **Create Token API Endpoints**
   ```python
   # backend/app/api/v1/tokens.py
   @router.get("/balance/{team_id}/{week}")
   async def get_token_balance(team_id: UUID, week: int):
       """Get token balance for team"""
       # Implementation here
   
   @router.post("/allocate/{team_id}/{week}")
   async def allocate_tokens(team_id: UUID, week: int):
       """Allocate weekly tokens"""
       # Implementation here
   ```

3. **Implement Weekly Token Reset**
   ```python
   # backend/app/services/scheduler.py
   async def weekly_token_reset():
       """Reset tokens every Thursday morning"""
       # Implementation here
   ```

**Deliverables**:
- [ ] Token service implemented
- [ ] Token API endpoints created
- [ ] Weekly token allocation system
- [ ] Token balance tracking
- [ ] Weekly reset scheduler

### Week 2: Betting Engine

#### 2.1 Bet Placement System
**Priority**: P0 - Critical
**Effort**: 3 days

**Implementation Steps**:
1. **Create Bet Models**
   ```python
   # backend/app/models/bet.py
   class Bet(BaseModel):
       id: UUID
       user_id: UUID
       matchup_id: UUID
       market_type: str  # 'moneyline', 'spread', 'total'
       selection: str    # 'team1', 'team2', 'over', 'under'
       odds: int
       amount: int
       status: str       # 'pending', 'won', 'lost', 'cancelled'
       created_at: datetime
   ```

2. **Create Betting Service**
   ```python
   # backend/app/services/betting_service.py
   class BettingService:
       async def place_bet(self, bet_data: BetCreate) -> Bet:
           """Place a new bet"""
           # Validate bet
           # Check token balance
           # Deduct tokens
           # Create bet record
       
       async def settle_bet(self, bet_id: UUID, result: str) -> Bet:
           """Settle a bet based on game result"""
           # Update bet status
           # Calculate payout
           # Update token balance
   ```

3. **Create Betting API Endpoints**
   ```python
   # backend/app/api/v1/bets.py
   @router.post("/place")
   async def place_bet(bet: BetCreate):
       """Place a new bet"""
   
   @router.get("/user/{user_id}")
   async def get_user_bets(user_id: UUID):
       """Get user's betting history"""
   
   @router.post("/settle/{bet_id}")
   async def settle_bet(bet_id: UUID, result: str):
       """Settle a bet"""
   ```

**Deliverables**:
- [ ] Bet models and schemas
- [ ] Betting service implemented
- [ ] Bet placement API endpoints
- [ ] Bet settlement system
- [ ] Token deduction integration

#### 2.2 Odds Calculation Engine
**Priority**: P0 - Critical
**Effort**: 2 days

**Implementation Steps**:
1. **Create Odds Models**
   ```python
   # backend/app/models/odds.py
   class Odds(BaseModel):
       id: UUID
       matchup_id: UUID
       market_type: str
       team1_odds: int
       team2_odds: int
       spread: Optional[float]
       total: Optional[float]
       calculated_at: datetime
   ```

2. **Create Odds Calculation Service**
   ```python
   # backend/app/services/odds_service.py
   class OddsService:
       async def calculate_matchup_odds(self, team1: Team, team2: Team) -> Odds:
           """Calculate odds for a matchup"""
           # Get team statistics
           # Calculate win probabilities
           # Convert to American odds
           # Return odds object
   ```

**Deliverables**:
- [ ] Odds models and schemas
- [ ] Odds calculation service
- [ ] Basic odds calculation logic
- [ ] Odds storage and retrieval

### Week 3: Core API

#### 3.1 REST API Implementation
**Priority**: P0 - Critical
**Effort**: 3 days

**Implementation Steps**:
1. **Set up FastAPI Application**
   ```python
   # backend/app/main.py
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   
   app = FastAPI(title="Fantasy Football Companion API")
   
   # CORS middleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Create API Routes**
   ```python
   # backend/app/api/v1/__init__.py
   from fastapi import APIRouter
   
   router = APIRouter()
   
   # Include all route modules
   router.include_router(users.router, prefix="/users", tags=["users"])
   router.include_router(teams.router, prefix="/teams", tags=["teams"])
   router.include_router(matchups.router, prefix="/matchups", tags=["matchups"])
   router.include_router(bets.router, prefix="/bets", tags=["bets"])
   router.include_router(tokens.router, prefix="/tokens", tags=["tokens"])
   ```

3. **Implement Authentication**
   ```python
   # backend/app/core/security.py
   from supabase import create_client
   
   async def get_current_user(token: str) -> User:
       """Get current user from JWT token"""
       # Validate token with Supabase
       # Return user object
   ```

**Deliverables**:
- [ ] FastAPI application setup
- [ ] API route structure
- [ ] Authentication middleware
- [ ] CORS configuration
- [ ] API documentation

#### 3.2 Real-Time Updates
**Priority**: P1 - High
**Effort**: 2 days

**Implementation Steps**:
1. **Set up WebSocket Support**
   ```python
   # backend/app/websocket/connection_manager.py
   class ConnectionManager:
       def __init__(self):
           self.active_connections: List[WebSocket] = []
       
       async def connect(self, websocket: WebSocket):
           await websocket.accept()
           self.active_connections.append(websocket)
       
       async def broadcast(self, message: str):
           for connection in self.active_connections:
               await connection.send_text(message)
   ```

2. **Implement Real-Time Odds Updates**
   ```python
   # backend/app/websocket/odds_updates.py
   async def broadcast_odds_update(matchup_id: UUID, new_odds: Odds):
       """Broadcast odds update to connected clients"""
       # Send update to all connected clients
   ```

**Deliverables**:
- [ ] WebSocket connection manager
- [ ] Real-time odds updates
- [ ] Connection management
- [ ] Error handling and reconnection

### Week 4: Basic Frontend

#### 4.1 React Application Setup
**Priority**: P0 - Critical
**Effort**: 2 days

**Implementation Steps**:
1. **Create React Application**
   ```bash
   npx create-react-app frontend --template typescript
   cd frontend
   npm install @supabase/supabase-js
   npm install @tanstack/react-query
   npm install tailwindcss
   ```

2. **Set up Project Structure**
   ```
   frontend/src/
   ├── components/
   │   ├── common/
   │   ├── features/
   │   └── layout/
   ├── hooks/
   ├── services/
   ├── utils/
   ├── types/
   └── constants/
   ```

3. **Configure Supabase Client**
   ```typescript
   // frontend/src/services/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
   const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!
   
   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

**Deliverables**:
- [ ] React application created
- [ ] TypeScript configuration
- [ ] Tailwind CSS setup
- [ ] Supabase client configuration
- [ ] Project structure established

#### 4.2 Core Components
**Priority**: P0 - Critical
**Effort**: 3 days

**Implementation Steps**:
1. **Create Layout Components**
   ```typescript
   // frontend/src/components/layout/Header.tsx
   export const Header: React.FC = () => {
     return (
       <header className="bg-blue-600 text-white p-4">
         <h1>Fantasy Football Companion</h1>
         <nav>
           {/* Navigation items */}
         </nav>
       </header>
     )
   }
   ```

2. **Create Authentication Components**
   ```typescript
   // frontend/src/components/auth/LoginForm.tsx
   export const LoginForm: React.FC = () => {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     
     const handleLogin = async () => {
       // Handle login with Supabase
     }
     
     return (
       <form onSubmit={handleLogin}>
         {/* Login form */}
       </form>
     )
   }
   ```

3. **Create Token Balance Component**
   ```typescript
   // frontend/src/components/features/TokenBalance.tsx
   export const TokenBalance: React.FC<{ teamId: string }> = ({ teamId }) => {
     const { data: balance } = useQuery({
       queryKey: ['tokenBalance', teamId],
       queryFn: () => fetchTokenBalance(teamId)
     })
     
     return (
       <div className="bg-green-100 p-4 rounded">
         <h3>Token Balance</h3>
         <p>{balance?.current_balance || 0} tokens</p>
       </div>
     )
   }
   ```

**Deliverables**:
- [ ] Header and navigation components
- [ ] Authentication components
- [ ] Token balance display
- [ ] Basic routing setup
- [ ] Responsive design foundation

## Phase 2: Advanced Features Implementation

### Week 5: Live Matchup Odds Board

#### 5.1 Monte Carlo Simulation Engine
**Priority**: P0 - Critical
**Effort**: 3 days

**Implementation Steps**:
1. **Create Simulation Service**
   ```python
   # backend/app/services/monte_carlo.py
   class MonteCarloSimulator:
       def __init__(self):
           self.iterations = 10000
       
       async def simulate_matchup(self, team1: Team, team2: Team) -> SimulationResult:
           """Run Monte Carlo simulation for matchup"""
           # Get team statistics
           # Run 10,000 iterations
           # Calculate win probabilities
           # Return results
   ```

2. **Integrate with Odds Calculation**
   ```python
   # backend/app/services/odds_service.py
   class OddsService:
       def __init__(self):
           self.monte_carlo = MonteCarloSimulator()
       
       async def calculate_advanced_odds(self, team1: Team, team2: Team) -> Odds:
           # Run Monte Carlo simulation
           simulation_result = await self.monte_carlo.simulate_matchup(team1, team2)
           
           # Convert probabilities to odds
           odds = self._probability_to_odds(simulation_result.win_probability)
           
           return odds
   ```

**Deliverables**:
- [ ] Monte Carlo simulation engine
- [ ] Integration with odds calculation
- [ ] Performance optimization
- [ ] Simulation result caching

#### 5.2 Odds Board Interface
**Priority**: P0 - Critical
**Effort**: 2 days

**Implementation Steps**:
1. **Create Odds Board Component**
   ```typescript
   // frontend/src/components/features/OddsBoard.tsx
   export const OddsBoard: React.FC = () => {
     const { data: matchups } = useQuery({
       queryKey: ['matchups'],
       queryFn: fetchMatchups,
       refetchInterval: 30000 // 30 seconds
     })
     
     return (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {matchups?.map(matchup => (
           <MatchupCard key={matchup.id} matchup={matchup} />
         ))}
       </div>
     )
   }
   ```

2. **Create Matchup Card Component**
   ```typescript
   // frontend/src/components/features/MatchupCard.tsx
   export const MatchupCard: React.FC<{ matchup: Matchup }> = ({ matchup }) => {
     return (
       <div className="bg-white p-6 rounded-lg shadow">
         <div className="flex justify-between items-center">
           <div>
             <h3>{matchup.team1.name}</h3>
             <p>Odds: {matchup.odds.team1_odds}</p>
           </div>
           <div className="text-center">
             <p>VS</p>
             <p>Spread: {matchup.odds.spread}</p>
           </div>
           <div>
             <h3>{matchup.team2.name}</h3>
             <p>Odds: {matchup.odds.team2_odds}</p>
           </div>
         </div>
       </div>
     )
   }
   ```

**Deliverables**:
- [ ] Odds board interface
- [ ] Matchup card components
- [ ] Real-time updates integration
- [ ] Mobile-responsive design

## Technical Implementation Details

### Database Schema
```sql
-- Complete database schema
-- (See detailed schema in data-models.md)
```

### API Endpoints
```python
# Complete API specification
# (See detailed API spec in api-spec.md)
```

### Frontend Architecture
```typescript
// Complete frontend structure
// (See detailed frontend architecture in frontend.md)
```

## Development Environment Setup

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn supabase python-dotenv

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm start
```

## Testing Strategy

### Unit Tests
- Backend: pytest
- Frontend: Jest + React Testing Library

### Integration Tests
- API endpoint testing
- Database integration testing
- Frontend-backend integration

### End-to-End Tests
- User workflow testing
- Cross-browser testing
- Mobile testing

## Deployment Strategy

### Development
- Local development with hot reload
- Supabase development database

### Staging
- Vercel (frontend)
- Railway (backend)
- Supabase staging database

### Production
- Vercel (frontend)
- Railway (backend)
- Supabase production database

## Success Metrics

### Phase 1 Success Criteria
- [ ] Token system functional
- [ ] Betting engine processes bets correctly
- [ ] API endpoints working
- [ ] Basic frontend responsive

### Phase 2 Success Criteria
- [ ] Odds board displays comprehensive data
- [ ] Betting interface user-friendly
- [ ] Advanced markets functional
- [ ] Social features enhance engagement

### Phase 3 Success Criteria
- [ ] FAAB predictions accurate
- [ ] Trade analysis provides insights
- [ ] Analytics dashboard comprehensive
- [ ] Fair play measures effective

### Phase 4 Success Criteria
- [ ] System performance optimal
- [ ] PWA features work correctly
- [ ] Launch successful
- [ ] Continuous improvement established

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
