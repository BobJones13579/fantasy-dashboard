# Quick Start Guide

## TLDR

Step-by-step guide to get started with development of the Fantasy Football Companion App, covering prerequisites, setup, and initial development steps.

## Purpose

This document provides a step-by-step guide to get started with development of the Fantasy Football Companion App.

## Context

This guide assumes you have the documentation structure set up and are ready to begin Phase 1 development. Follow these steps in order to start building the application.

## Prerequisites

- [ ] Documentation structure is set up (✅ Complete)
- [ ] Meta-docs template is understood
- [ ] Project context is reviewed
- [ ] Development environment is ready

## 🚀 **START HERE: Phase 1, Week 1, Day 1**

### **Step 1: Set Up Development Environment**

#### 1.1 Backend Setup
```bash
# Navigate to project directory
cd /Users/jimingxu/Dev/fantasy-dashboard

# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn supabase python-dotenv pydantic

# Create basic project structure
mkdir -p app/{api/v1,core,models,services,utils}
touch app/__init__.py
touch app/main.py
touch app/core/config.py
touch app/core/database.py
```

#### 1.2 Frontend Setup
```bash
# Navigate to project root
cd /Users/jimingxu/Dev/fantasy-dashboard

# Create frontend directory
npx create-react-app frontend --template typescript
cd frontend

# Install additional dependencies
npm install @supabase/supabase-js @tanstack/react-query tailwindcss
npm install @types/node

# Set up Tailwind CSS
npx tailwindcss init -p
```

### **Step 2: Configure Supabase**

#### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key
4. Create `.env` files:

**Backend `.env`:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Frontend `.env.local`:**
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Step 3: Create Database Schema**

#### 3.1 Run Database Setup
```sql
-- Execute in Supabase SQL Editor
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

### **Step 4: Create Basic Backend**

#### 4.1 Main Application File
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fantasy Football Companion API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Fantasy Football Companion API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

#### 4.2 Database Configuration
```python
# backend/app/core/database.py
from supabase import create_client
import os

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(supabase_url, supabase_key)
```

### **Step 5: Create Basic Frontend**

#### 5.1 Supabase Client
```typescript
// frontend/src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 5.2 Basic App Component
```typescript
// frontend/src/App.tsx
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Fantasy Football Companion</h1>
      </header>
      <main className="p-4">
        <p>Welcome to the Fantasy Football Companion App!</p>
      </main>
    </div>
  );
}

export default App;
```

### **Step 6: Test the Setup**

#### 6.1 Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```

#### 6.2 Start Frontend
```bash
cd frontend
npm start
```

#### 6.3 Verify Setup
1. Backend should be running on `http://localhost:8000`
2. Frontend should be running on `http://localhost:3000`
3. Visit `http://localhost:8000/docs` to see API documentation
4. Visit `http://localhost:3000` to see the frontend

## 🎯 **Next Steps**

Once the basic setup is working, proceed with:

### **Day 2-3: Token Management System**
- Implement token service
- Create token API endpoints
- Add token balance tracking

### **Day 4-5: Basic Betting System**
- Create bet models
- Implement bet placement
- Add bet validation

### **Week 2: Betting Engine**
- Odds calculation
- Bet settlement
- Market types

### **Week 3: Core API**
- REST API endpoints
- Real-time updates
- Authentication

### **Week 4: Basic Frontend**
- React components
- User interface
- Mobile optimization

## 📚 **Reference Documents**

- **Implementation Plan**: `docs/3-Development/implementation-plan.md`
- **Roadmap**: `docs/1-Product/roadmap.md`
- **Backlog**: `docs/3-Development/backlog.md`
- **Sprint Log**: `docs/3-Development/sprint-log.md`
- **Architecture**: `docs/2-Design/system-architecture.md`
- **API Spec**: `docs/2-Design/api-spec.md`
- **Data Models**: `docs/2-Design/data-models.md`

## 🆘 **Getting Help**

If you encounter issues:

1. **Check the documentation** in the `/docs` folder
2. **Review the implementation plan** for detailed steps
3. **Check the backlog** for task priorities
4. **Use the prompts** in `docs/5-Prompts/` for AI assistance
5. **Check known issues** in `docs/4-Debugging/known-issues.md`

## ✅ **Success Criteria**

You'll know you're ready to continue when:

- [ ] Backend server starts without errors
- [ ] Frontend loads in browser
- [ ] Supabase connection is working
- [ ] Database tables are created
- [ ] Basic API endpoints respond
- [ ] Frontend can connect to backend

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
