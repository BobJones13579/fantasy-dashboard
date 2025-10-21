# 🚀 Fantasy Football Companion - Setup Guide

## 📋 Prerequisites Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Supabase account created
- [ ] ESPN Fantasy Football league access

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a name: `fantasy-football-companion`
4. Set a strong database password
5. Choose a region close to you

### 1.2 Get Supabase Credentials
Once your project is created, go to **Settings > API** and copy:
- **Project URL** (starts with `https://`)
- **anon public** key (starts with `eyJ`)
- **service_role** key (starts with `eyJ`)

### 1.3 Configure Environment Variables

**Backend (.env file):**
```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
```

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

**Frontend (.env.local file):**
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ Step 2: Database Setup

### 2.1 Run Database Setup Script
```bash
cd backend
source venv/bin/activate
python setup_database.py
```

### 2.2 Manual Database Setup (if script fails)
If the automatic setup doesn't work, run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    espn_user_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    espn_league_id VARCHAR(50) UNIQUE NOT NULL,
    season INTEGER NOT NULL,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    espn_team_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Token balances table
CREATE TABLE IF NOT EXISTS token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id),
    week INTEGER NOT NULL,
    starting_balance INTEGER DEFAULT 1000,
    current_balance INTEGER NOT NULL,
    weekly_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Token transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id),
    week INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
CREATE INDEX IF NOT EXISTS idx_token_balances_team_week ON token_balances(team_id, week);
CREATE INDEX IF NOT EXISTS idx_users_espn_id ON users(espn_user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_team_week ON token_transactions(team_id, week);
```

## 🏈 Step 3: ESPN League Setup

### 3.1 Get Your League Information
1. Go to your ESPN Fantasy Football league
2. Copy the **League ID** from the URL: `https://fantasy.espn.com/football/league/settings?leagueId=YOUR_LEAGUE_ID`
3. Note the current **season year** (e.g., 2024)

### 3.2 Get ESPN Authentication (for private leagues)
If your league is private, you'll need authentication cookies:

1. **Open your browser's Developer Tools** (F12)
2. **Go to your ESPN Fantasy league page**
3. **Navigate to Application/Storage tab**
4. **Find Cookies section**
5. **Copy these values:**
   - `espn_s2` (long string starting with `A`)
   - `SWID` (string in format `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}`)

### 3.3 Test ESPN Connection
```bash
cd backend
source venv/bin/activate

# Set environment variables
export ESPN_LEAGUE_ID=your_league_id
export ESPN_YEAR=2024
export ESPN_S2=your_espn_s2_cookie
export ESPN_SWID=your_swid_cookie

# Test the connection
python test_espn_integration.py
```

## 🚀 Step 4: Start the Applications

### 4.1 Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
Backend will be available at: http://localhost:8000

### 4.2 Start Frontend
```bash
cd frontend
npm start
```
Frontend will be available at: http://localhost:3000

## ✅ Step 5: Verify Setup

### 5.1 Test Backend API
Visit: http://localhost:8000/docs
- Should show Swagger UI with all API endpoints
- Test the `/health` endpoint

### 5.2 Test Frontend
Visit: http://localhost:3000
- Should show the Fantasy Football Companion welcome page
- Should be responsive on mobile

### 5.3 Test ESPN Integration
```bash
# Test ESPN API endpoints
curl http://localhost:8000/api/v1/espn/test-connection
```

## 🎯 Step 6: Configure Your League

### 6.1 Connect Your League
1. Go to http://localhost:3000
2. Use the ESPN configuration endpoint to connect your league
3. Test data retrieval

### 6.2 Test Token System
1. Create a test user and team
2. Allocate weekly tokens
3. Test betting functionality

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 8000 is available
- Verify all dependencies are installed
- Check .env file configuration

**Frontend won't start:**
- Check if port 3000 is available
- Run `npm install` to ensure dependencies are installed
- Check .env.local file configuration

**ESPN API errors:**
- Verify league ID is correct
- Check if league is private and requires authentication
- Ensure cookies are valid (they expire periodically)

**Database connection errors:**
- Verify Supabase credentials
- Check if database tables were created
- Ensure network connectivity to Supabase

### Getting Help

1. Check the logs in the terminal
2. Review the API documentation at http://localhost:8000/docs
3. Check the browser console for frontend errors
4. Verify all environment variables are set correctly

## 🎉 Success!

Once everything is working:
- ✅ Backend API running on port 8000
- ✅ Frontend app running on port 3000
- ✅ Supabase database connected
- ✅ ESPN league data accessible
- ✅ Token system functional

You're ready to start building the Fantasy Football Companion features!

## 📚 Next Steps

1. **Week 2**: Implement betting engine and odds calculation
2. **Week 3**: Build live matchup odds board
3. **Week 4**: Add FAAB predictor and trade tracker
4. **Week 5+**: Advanced features and polish

---

**Need help?** Check the documentation in the `/docs` folder or create an issue in the repository.
