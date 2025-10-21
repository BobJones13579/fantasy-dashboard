# Technical Implementation Plan

## 🏗️ Architecture Overview

### **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ESPN API      │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   Integration   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   Database      │    │   Real-time     │
│   Client        │    │   (PostgreSQL)  │    │   Updates       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Schema

### **Core Tables**

```sql
-- Users and Teams
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    espn_user_id VARCHAR(50) UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    espn_team_id INTEGER UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    league_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Token System
CREATE TABLE token_balances (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    week INTEGER NOT NULL,
    starting_balance INTEGER DEFAULT 1000,
    current_balance INTEGER NOT NULL,
    weekly_used INTEGER DEFAULT 0,
    total_winnings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, week)
);

-- Markets and Odds
CREATE TABLE markets (
    id SERIAL PRIMARY KEY,
    market_type VARCHAR(50) NOT NULL,
    week INTEGER NOT NULL,
    team1_id INTEGER REFERENCES teams(id),
    team2_id INTEGER REFERENCES teams(id),
    player_id INTEGER,
    base_line DECIMAL(5,1),
    current_odds_team1 INTEGER,
    current_odds_team2 INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bets and Transactions
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    market_id INTEGER REFERENCES markets(id),
    selection VARCHAR(100) NOT NULL,
    bet_amount INTEGER NOT NULL,
    odds INTEGER NOT NULL,
    potential_payout INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    result VARCHAR(20),
    lineup_snapshot JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    settled_at TIMESTAMP
);

-- League Settings
CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    espn_league_id INTEGER UNIQUE,
    league_name VARCHAR(100) NOT NULL,
    season_year INTEGER NOT NULL,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Backend Implementation

### **FastAPI Application Structure**

```python
# main.py
from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.database import init_db
from app.routers import markets, bets, tokens, leagues
from app.websocket import websocket_manager
from app.odds_engine import OddsEngine
from app.espn_client import ESPNClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    app.state.odds_engine = OddsEngine()
    app.state.espn_client = ESPNClient()
    
    # Start background tasks
    asyncio.create_task(update_odds_continuously())
    
    yield
    
    # Shutdown
    await websocket_manager.disconnect_all()

app = FastAPI(lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(markets.router, prefix="/api/markets", tags=["markets"])
app.include_router(bets.router, prefix="/api/bets", tags=["bets"])
app.include_router(tokens.router, prefix="/api/tokens", tags=["tokens"])
app.include_router(leagues.router, prefix="/api/leagues", tags=["leagues"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages
    except:
        websocket_manager.disconnect(websocket)

async def update_odds_continuously():
    """Background task to update odds every 30 seconds"""
    while True:
        try:
            await app.state.odds_engine.update_all_odds()
            await websocket_manager.broadcast_odds_update()
        except Exception as e:
            print(f"Error updating odds: {e}")
        await asyncio.sleep(30)
```

### **Odds Engine Implementation**

```python
# app/odds_engine.py
from typing import List, Dict, Tuple
import asyncio
from datetime import datetime

class OddsEngine:
    def __init__(self):
        self.markets = {}
        self.update_interval = 30  # seconds
    
    async def update_all_odds(self):
        """Update odds for all active markets"""
        for market_id, market in self.markets.items():
            if market.status == 'active':
                await market.update_odds()
    
    def calculate_moneyline_odds(self, team1_strength: float, team2_strength: float) -> Tuple[int, int]:
        """Calculate moneyline odds based on team strength"""
        total = team1_strength + team2_strength
        team1_prob = team1_strength / total
        
        if team1_prob > 0.5:
            team1_odds = -100 * team1_prob / (1 - team1_prob)
            team2_odds = 100 * (1 - team1_prob) / team1_prob
        else:
            team1_odds = 100 * (1 - team1_prob) / team1_prob
            team2_odds = -100 * team1_prob / (1 - team1_prob)
        
        return (round(team1_odds), round(team2_odds))
    
    def calculate_spread(self, team1_strength: float, team2_strength: float) -> float:
        """Calculate point spread"""
        spread = team1_strength - team2_strength
        return round(spread * 2) / 2  # Round to nearest 0.5
    
    def calculate_total(self, team1_strength: float, team2_strength: float) -> float:
        """Calculate matchup total"""
        total = team1_strength + team2_strength
        return round(total * 2) / 2  # Round to nearest 0.5
```

### **Token System Implementation**

```python
# app/token_system.py
from typing import Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TokenBalance, Bet, Team

class TokenSystem:
    def __init__(self):
        self.weekly_allowance = 1000
        self.reset_day = 3  # Thursday (0=Monday, 3=Thursday)
    
    async def get_token_balance(self, team_id: int, week: int, db: Session) -> int:
        """Get current token balance for a team"""
        balance = db.query(TokenBalance).filter(
            TokenBalance.team_id == team_id,
            TokenBalance.week == week
        ).first()
        
        if not balance:
            # Create new balance for the week
            balance = TokenBalance(
                team_id=team_id,
                week=week,
                starting_balance=self.weekly_allowance,
                current_balance=self.weekly_allowance
            )
            db.add(balance)
            db.commit()
        
        return balance.current_balance
    
    async def place_bet(self, team_id: int, market_id: int, selection: str, 
                       bet_amount: int, odds: int, db: Session) -> Optional[Bet]:
        """Place a bet and deduct tokens"""
        current_week = self.get_current_week()
        balance = await self.get_token_balance(team_id, current_week, db)
        
        if balance < bet_amount:
            raise InsufficientTokensError("Not enough tokens")
        
        # Calculate potential payout
        if odds < 0:
            potential_payout = bet_amount * (100 / abs(odds))
        else:
            potential_payout = bet_amount * (odds / 100)
        
        # Create bet
        bet = Bet(
            team_id=team_id,
            market_id=market_id,
            selection=selection,
            bet_amount=bet_amount,
            odds=odds,
            potential_payout=potential_payout,
            lineup_snapshot=self.get_lineup_snapshot(team_id)
        )
        
        # Deduct tokens
        balance.current_balance -= bet_amount
        balance.weekly_used += bet_amount
        
        db.add(bet)
        db.commit()
        
        return bet
    
    async def settle_bet(self, bet_id: int, result: str, db: Session):
        """Settle a bet and update token balance"""
        bet = db.query(Bet).filter(Bet.id == bet_id).first()
        if not bet:
            raise BetNotFoundError("Bet not found")
        
        bet.result = result
        bet.settled_at = datetime.now()
        
        if result == 'win':
            # Add winnings to balance
            balance = await self.get_token_balance(bet.team_id, self.get_current_week(), db)
            balance.current_balance += bet.potential_payout
            balance.total_winnings += bet.potential_payout
        
        db.commit()
    
    def get_current_week(self) -> int:
        """Get current week of the season"""
        # This would integrate with ESPN API to get current week
        return 12  # Placeholder
    
    def get_lineup_snapshot(self, team_id: int) -> Dict:
        """Get current lineup for anti-cheating verification"""
        # This would get current lineup from ESPN API
        return {"team_id": team_id, "timestamp": datetime.now()}
```

### **WebSocket Manager**

```python
# app/websocket.py
from typing import List
from fastapi import WebSocket
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                self.disconnect(connection)
    
    async def broadcast_odds_update(self):
        """Broadcast odds update to all connected clients"""
        message = {
            "type": "odds_update",
            "timestamp": datetime.now().isoformat(),
            "data": "Odds have been updated"
        }
        await self.broadcast(json.dumps(message))
    
    async def broadcast_bet_settlement(self, bet_id: int, result: str):
        """Broadcast bet settlement to all connected clients"""
        message = {
            "type": "bet_settlement",
            "bet_id": bet_id,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast(json.dumps(message))

websocket_manager = WebSocketManager()
```

## 🎨 Frontend Implementation

### **React Application Structure**

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { WebSocketProvider } from './contexts/WebSocketContext';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Bets from './pages/Bets';
import Scoreboard from './pages/Scoreboard';

function App() {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/bets" element={<Bets />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </WebSocketProvider>
    </Provider>
  );
}

export default App;
```

### **Redux Store Configuration**

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import authSlice from './slices/authSlice';
import marketsSlice from './slices/marketsSlice';
import betsSlice from './slices/betsSlice';
import tokensSlice from './slices/tokensSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice,
    markets: marketsSlice,
    bets: betsSlice,
    tokens: tokensSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### **API Client with RTK Query**

```typescript
// src/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Markets', 'Bets', 'Tokens', 'Leagues'],
  endpoints: (builder) => ({
    // Markets
    getMarkets: builder.query<Market[], number>({
      query: (week) => `markets/week/${week}`,
      providesTags: ['Markets'],
    }),
    
    getMarket: builder.query<Market, number>({
      query: (id) => `markets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Markets', id }],
    }),
    
    // Bets
    placeBet: builder.mutation<Bet, PlaceBetRequest>({
      query: (bet) => ({
        url: 'bets',
        method: 'POST',
        body: bet,
      }),
      invalidatesTags: ['Bets', 'Tokens'],
    }),
    
    getBets: builder.query<Bet[], number>({
      query: (teamId) => `bets/team/${teamId}`,
      providesTags: ['Bets'],
    }),
    
    // Tokens
    getTokenBalance: builder.query<TokenBalance, number>({
      query: (teamId) => `tokens/balance/${teamId}`,
      providesTags: ['Tokens'],
    }),
    
    // Leagues
    getLeague: builder.query<League, number>({
      query: (id) => `leagues/${id}`,
      providesTags: ['Leagues'],
    }),
  }),
});

export const {
  useGetMarketsQuery,
  useGetMarketQuery,
  usePlaceBetMutation,
  useGetBetsQuery,
  useGetTokenBalanceQuery,
  useGetLeagueQuery,
} = api;
```

### **WebSocket Context**

```typescript
// src/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../store/api';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'odds_update':
          // Invalidate markets cache to refetch updated odds
          dispatch(api.util.invalidateTags(['Markets']));
          break;
        case 'bet_settlement':
          // Invalidate bets and tokens cache
          dispatch(api.util.invalidateTags(['Bets', 'Tokens']));
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [dispatch]);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
```

### **Market Component**

```typescript
// src/components/MarketCard.tsx
import React from 'react';
import { Market } from '../types';

interface MarketCardProps {
  market: Market;
  onPlaceBet: (marketId: number, selection: string, amount: number) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, onPlaceBet }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handlePlaceBet = () => {
    if (selectedTeam && betAmount > 0) {
      onPlaceBet(market.id, selectedTeam, betAmount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{market.market_type}</h3>
        <span className="text-sm text-gray-500">Week {market.week}</span>
      </div>
      
      {market.market_type === 'moneyline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="font-medium">{market.team1.name}</div>
              <div className="text-sm text-gray-600">{market.team1.record}</div>
              <div className="text-lg font-bold text-green-600">
                {market.team1.odds > 0 ? '+' : ''}{market.team1.odds}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500">VS</div>
              <div className="text-xs text-gray-400">
                {market.team1.projected_points} - {market.team2.projected_points}
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-medium">{market.team2.name}</div>
              <div className="text-sm text-gray-600">{market.team2.record}</div>
              <div className="text-lg font-bold text-green-600">
                {market.team2.odds > 0 ? '+' : ''}{market.team2.odds}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTeam('team1')}
              className={`flex-1 py-2 px-4 rounded ${
                selectedTeam === 'team1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {market.team1.name}
            </button>
            <button
              onClick={() => setSelectedTeam('team2')}
              className={`flex-1 py-2 px-4 rounded ${
                selectedTeam === 'team2'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {market.team2.name}
            </button>
          </div>
          
          <div className="flex space-x-4">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              placeholder="Bet amount"
              min="1"
            />
            <button
              onClick={handlePlaceBet}
              disabled={!selectedTeam || betAmount <= 0}
              className="px-6 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              Place Bet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketCard;
```

## 🚀 Deployment Configuration

### **Docker Configuration**

```dockerfile
# Dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/fantasy_dashboard
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=fantasy_dashboard
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

volumes:
  postgres_data:
```

### **Nginx Configuration**

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server web:8000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /ws {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 📊 Monitoring and Logging

### **Application Monitoring**

```python
# app/monitoring.py
import logging
import time
from functools import wraps
from prometheus_client import Counter, Histogram, Gauge

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_CONNECTIONS = Gauge('websocket_connections_active', 'Active WebSocket connections')
BETS_PLACED = Counter('bets_placed_total', 'Total bets placed', ['market_type'])

def monitor_requests(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            REQUEST_COUNT.labels(method='GET', endpoint=func.__name__).inc()
            return result
        finally:
            REQUEST_DURATION.observe(time.time() - start_time)
    return wrapper

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

This implementation plan provides a comprehensive foundation for building a fantasy football betting platform that rivals Fantom Odds. The modular architecture allows for incremental development while maintaining scalability and performance.

---

**Next Steps**: Begin with Phase 1 implementation, starting with the database schema and core API endpoints.
