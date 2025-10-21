# Development Setup Guide

## 📊 **QUICK SCAN SUMMARY**
- **3 Steps**: Supabase setup → FastAPI backend → React frontend
- **Supabase**: Free tier, 500MB database, real-time subscriptions
- **FastAPI**: Python backend with ESPN API integration
- **React**: Frontend with Supabase client and mobile-first design
- **Timeline**: 1-2 days to get everything running locally

## 🚀 **Quick Start (30 minutes)**

### **Step 1: Supabase Setup (10 minutes)**
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project: "fantasy-dashboard"
3. Get your project URL and anon key from Settings → API
4. Save these for later:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

### **Step 2: FastAPI Backend (15 minutes)**
```bash
# Create backend directory
mkdir backend && cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn supabase espn-api python-dotenv

# Create main.py
touch main.py
```

### **Step 3: React Frontend (5 minutes)**
```bash
# Create frontend directory
npx create-react-app frontend --template typescript
cd frontend

# Install Supabase client
npm install @supabase/supabase-js
npm install tailwindcss  # For styling
```

## 🗄️ **Database Schema Setup**

### **Run this in Supabase SQL Editor:**
```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    league_id INTEGER NOT NULL,
    team_name TEXT NOT NULL,
    token_balance INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create matchups table
CREATE TABLE matchups (
    id SERIAL PRIMARY KEY,
    league_id INTEGER NOT NULL,
    week INTEGER NOT NULL,
    team1_id INTEGER NOT NULL,
    team2_id INTEGER NOT NULL,
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    team1_odds INTEGER NOT NULL,
    team2_odds INTEGER NOT NULL,
    game_time TIMESTAMP,
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create bets table
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    matchup_id INTEGER REFERENCES matchups(id) NOT NULL,
    bet_type TEXT NOT NULL, -- 'moneyline', 'spread', 'total'
    selection TEXT NOT NULL, -- 'team1', 'team2', 'over', 'under'
    amount INTEGER NOT NULL,
    odds INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'won', 'lost', 'void'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view all matchups" ON matchups
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own bets" ON bets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bets" ON bets
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🐍 **FastAPI Backend Setup**

### **Create `backend/main.py`:**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Fantasy Odds API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

@app.get("/")
async def root():
    return {"message": "Fantasy Odds API is running!"}

@app.get("/api/league/{league_id}/matchups")
async def get_matchups(league_id: int):
    """Get all matchups for a league"""
    try:
        response = supabase.table("matchups").select("*").eq("league_id", league_id).execute()
        return {"matchups": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bets")
async def create_bet(bet_data: dict):
    """Create a new bet"""
    try:
        response = supabase.table("bets").insert(bet_data).execute()
        return {"bet": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **Create `backend/.env`:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
ESPN_S2=your-espn-s2-cookie
ESPN_SWID=your-espn-swid-cookie
```

### **Create `backend/requirements.txt`:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
supabase==2.0.0
espn-api==0.45.1
python-dotenv==1.0.0
```

## ⚛️ **React Frontend Setup**

### **Create `frontend/src/lib/supabase.js`:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### **Create `frontend/.env.local`:**
```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### **Update `frontend/src/App.js`:**
```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [matchups, setMatchups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchups();
  }, []);

  const fetchMatchups = async () => {
    try {
      const { data, error } = await supabase
        .from('matchups')
        .select('*')
        .eq('league_id', 637913);
      
      if (error) throw error;
      setMatchups(data);
    } catch (error) {
      console.error('Error fetching matchups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>League TB12 - Fantasy Odds</h1>
      <div className="matchups">
        {matchups.map((matchup) => (
          <div key={matchup.id} className="matchup-card">
            <h3>{matchup.team1_name} vs {matchup.team2_name}</h3>
            <p>Week {matchup.week}</p>
            <div className="odds">
              <span>{matchup.team1_name}: {matchup.team1_odds}</span>
              <span>{matchup.team2_name}: {matchup.team2_odds}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

## 🚀 **Running the Application**

### **Start Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```
Backend will run on: http://localhost:8000

### **Start Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### **Test the Setup:**
1. Open http://localhost:3000
2. You should see "League TB12 - Fantasy Odds"
3. Check browser console for any errors
4. Check Supabase dashboard for data

## 🔧 **Development Workflow**

### **Daily Development:**
1. **Start Supabase** (runs in cloud, no local setup needed)
2. **Start FastAPI backend** (`uvicorn main:app --reload`)
3. **Start React frontend** (`npm start`)
4. **Make changes** and see live updates

### **Database Changes:**
1. **Update schema** in Supabase SQL Editor
2. **Update FastAPI models** if needed
3. **Update React components** to match new data

### **Adding New Features:**
1. **Design database schema** first
2. **Create FastAPI endpoints** for data
3. **Build React components** for UI
4. **Test with real data** from ESPN API

## 📱 **Mobile Testing**

### **Test on Mobile:**
1. **Find your computer's IP address** (e.g., 192.168.1.100)
2. **Update CORS settings** in FastAPI to allow your IP
3. **Access from phone**: http://192.168.1.100:3000
4. **Test touch interactions** and responsive design

### **Mobile-First Development:**
- **Use browser dev tools** to simulate mobile devices
- **Test touch targets** (buttons should be 44px+)
- **Check loading performance** on slow networks
- **Verify responsive design** on different screen sizes

## 🎯 **Next Steps**

### **Week 1 Goals:**
- [ ] **Supabase project** created and configured
- [ ] **FastAPI backend** running with basic endpoints
- [ ] **React frontend** displaying league data
- [ ] **Database schema** created with sample data
- [ ] **Mobile-responsive** interface working

### **Week 2 Goals:**
- [ ] **ESPN API integration** for real league data
- [ ] **Real-time odds** updates via Supabase
- [ ] **Betting interface** for placing bets
- [ ] **Token system** for tracking balances
- [ ] **Pick Em system** for weekly picks

---

**Status**: ✅ **SETUP GUIDE COMPLETE** - Ready to start development
**Timeline**: 1-2 days to get everything running
**Complexity**: Low (mostly configuration)
**Next Milestone**: Working prototype with real ESPN data
