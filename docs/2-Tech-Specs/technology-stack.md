# Technology Stack Specification

## 📊 **QUICK SCAN SUMMARY**
- **Backend**: FastAPI (Python) - Modern, fast, great for APIs
- **Database**: Supabase (PostgreSQL) - Managed database + real-time + auth
- **Frontend**: React.js - Popular, component-based, great ecosystem
- **Real-time**: Supabase subscriptions - Live odds updates
- **Authentication**: Supabase Auth - Built-in user management
- **Deployment**: Vercel (frontend) + Railway/Render (backend)
- **Why This Stack**: Perfect for real-time betting, mobile-first, scalable

## 🎯 **Technology Stack Overview**

**Status**: ✅ **DECIDED** - FastAPI + Supabase + React

This stack was chosen based on:
- **Real-time requirements** (live odds updates)
- **Mobile-first development** (responsive React components)
- **League TB12 focus** (10 users, but scalable)
- **Developer experience** (familiar tools, good documentation)
- **Future-proofing** (can scale to multiple leagues)

## 🛠️ **Backend: FastAPI**

### **Why FastAPI?**
- **Performance**: 3x faster than Flask, comparable to Node.js
- **Real-time**: Built-in WebSocket support for live odds
- **Type Safety**: Automatic validation and documentation
- **Modern**: Async/await support, perfect for API calls
- **Documentation**: Auto-generated Swagger UI

### **Key Features We'll Use**
```python
# Example FastAPI structure
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fantasy Odds API")

# Real-time odds updates
@app.websocket("/ws/odds")
async def websocket_odds(websocket: WebSocket):
    await websocket.accept()
    # Send live odds updates to frontend

# ESPN API integration
@app.get("/api/league/{league_id}/matchups")
async def get_matchups(league_id: int):
    # Fetch from ESPN API and return formatted data
```

### **Dependencies**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `supabase` - Database client
- `espn-api` - ESPN Fantasy Football integration
- `websockets` - Real-time communication
- `python-dotenv` - Environment variables

## 🗄️ **Database: Supabase (PostgreSQL)**

### **Why Supabase?**
- **Managed PostgreSQL**: No database server management
- **Real-time subscriptions**: Perfect for live odds updates
- **Built-in Auth**: User authentication out of the box
- **Dashboard**: Easy database management and monitoring
- **Scalable**: Handles 10 users now, thousands later

### **Database Schema**
```sql
-- Users table (managed by Supabase Auth)
-- We'll extend with custom fields
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id),
    league_id INTEGER,
    team_name TEXT,
    token_balance INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matchups table
CREATE TABLE matchups (
    id SERIAL PRIMARY KEY,
    league_id INTEGER,
    week INTEGER,
    team1_id INTEGER,
    team2_id INTEGER,
    team1_odds INTEGER,
    team2_odds INTEGER,
    game_time TIMESTAMP,
    status TEXT DEFAULT 'upcoming'
);

-- Bets table
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    matchup_id INTEGER REFERENCES matchups(id),
    bet_type TEXT, -- 'moneyline', 'spread', 'total'
    selection TEXT, -- 'team1', 'team2', 'over', 'under'
    amount INTEGER,
    odds INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Real-time Features**
```javascript
// Frontend real-time subscription
const { data, error } = await supabase
  .from('matchups')
  .select('*')
  .eq('league_id', 637913)
  .subscribe((payload) => {
    // Update odds in real-time
    updateOdds(payload.new);
  });
```

## ⚛️ **Frontend: React.js**

### **Why React?**
- **Component-based**: Perfect for betting cards, leaderboards
- **Real-time**: Great with Supabase subscriptions
- **Mobile-first**: Responsive design built-in
- **Ecosystem**: Huge library of components and tools
- **TypeScript**: Type safety for better development

### **Project Structure**
```
frontend/
├── src/
│   ├── components/
│   │   ├── BettingCard.jsx
│   │   ├── TokenBalance.jsx
│   │   ├── Leaderboard.jsx
│   │   └── MatchupList.jsx
│   ├── hooks/
│   │   ├── useSupabase.js
│   │   ├── useOdds.js
│   │   └── useBets.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── PickEm.jsx
│   │   └── FantomBank.jsx
│   └── utils/
│       ├── supabase.js
│       └── espn.js
```

### **Key Dependencies**
- `react` - UI framework
- `@supabase/supabase-js` - Database client
- `react-router-dom` - Navigation
- `tailwindcss` - Styling
- `react-query` - Data fetching and caching
- `framer-motion` - Animations

## 🔄 **Real-time: Supabase Subscriptions**

### **Live Odds Updates**
```javascript
// Subscribe to odds changes
useEffect(() => {
  const subscription = supabase
    .from('matchups')
    .on('UPDATE', (payload) => {
      // Update odds in UI
      setOdds(payload.new);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### **Bet Notifications**
```javascript
// Subscribe to bet settlements
useEffect(() => {
  const subscription = supabase
    .from('bets')
    .on('UPDATE', (payload) => {
      if (payload.new.status === 'won' || payload.new.status === 'lost') {
        // Show notification
        showBetResult(payload.new);
      }
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## 🔐 **Authentication: Supabase Auth**

### **User Management**
- **Sign up/Sign in**: Built-in forms and flows
- **League association**: Link users to League TB12
- **Token management**: Track user token balances
- **Profile management**: Team names, preferences

### **Implementation**
```javascript
// Sign up new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      league_id: 637913,
      team_name: 'Drake Maye Start'
    }
  }
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## 🚀 **Deployment Strategy**

### **Frontend: Vercel**
- **Automatic deployments** from GitHub
- **Edge functions** for API routes if needed
- **CDN** for fast global loading
- **Free tier** perfect for development

### **Backend: Railway/Render**
- **Railway**: Great for FastAPI, automatic deployments
- **Render**: Alternative, good free tier
- **Environment variables** for API keys
- **Automatic scaling** based on usage

### **Database: Supabase**
- **Managed hosting** - no server management
- **Automatic backups** and monitoring
- **Free tier** includes 500MB database
- **Easy scaling** as usage grows

## 📱 **Mobile-First Development**

### **Responsive Design**
- **Tailwind CSS** for mobile-first styling
- **Touch-friendly** buttons (44px minimum)
- **Swipe gestures** for navigation
- **Progressive Web App** capabilities

### **Performance**
- **Code splitting** for faster loading
- **Image optimization** for mobile networks
- **Caching strategies** for offline functionality
- **Lazy loading** for non-critical components

## 🔧 **Development Environment**

### **Local Setup**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start

# Database
# Supabase CLI for local development
supabase start
```

### **Environment Variables**
```bash
# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ESPN_S2=your_espn_s2_cookie
ESPN_SWID=your_espn_swid_cookie

# Frontend (.env.local)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 **Why This Stack is Perfect**

### **For League TB12 (10 users)**
- **Supabase free tier** handles 10 users easily
- **Real-time updates** keep everyone engaged
- **Mobile-first** design works on phones
- **Fast development** with familiar tools

### **For Future Growth**
- **PostgreSQL** scales to thousands of users
- **FastAPI** handles high concurrency
- **React** ecosystem supports complex features
- **Supabase** provides enterprise features

### **For Development Experience**
- **Type safety** with TypeScript
- **Auto-generated docs** with FastAPI
- **Real-time debugging** with Supabase dashboard
- **Hot reloading** for fast iteration

## 🎯 **Next Steps**

1. **Set up Supabase project** and get API keys
2. **Create database schema** for users, matchups, bets
3. **Set up FastAPI backend** with ESPN integration
4. **Create React frontend** with Supabase client
5. **Implement real-time subscriptions** for live updates
6. **Deploy to production** with Vercel + Railway

---

**Status**: ✅ **TECHNOLOGY STACK DECIDED** - Ready for implementation
**Timeline**: Can start development immediately
**Complexity**: Medium (good balance of power and simplicity)
**Scalability**: High (can grow from 10 to 1000+ users)
