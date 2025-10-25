# Deployment Guide

**TL;DR** — Complete deployment guide for Fantasy Football Companion App to Railway (backend) and Vercel (frontend).

## Overview

This guide covers deploying the Fantasy Football Companion App to production using:
- **Backend**: Railway (FastAPI + Redis)
- **Frontend**: Vercel (React)
- **Database**: Supabase (already configured)

## Prerequisites

- [ ] Supabase project configured (✅ Done)
- [ ] GitHub repository with code
- [ ] Railway account
- [ ] Vercel account
- [ ] Environment variables ready

## Backend Deployment (Railway)

### 1. Prepare Railway Deployment

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `fantasy-dashboard` repository

2. **Configure Build Settings**
   - Railway will auto-detect the `railway.json` configuration
   - Build context: `backend/`
   - Dockerfile: `backend/Dockerfile`

### 2. Set Environment Variables

In Railway dashboard, add these environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://lqlqyasfvyxbbkagnlhk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbHF5YXNmdnl4YmJrYWdubGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ3MzQsImV4cCI6MjA3NjY1MDczNH0.pvCp1_NOhxQU4jLuVaR3Ey7HQ__-4GWgOGtwlnYoU6o
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbHF5YXNmdnl4YmJrYWdubGhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA3NDczNCwiZXhwIjoyMDc2NjUwNzM0fQ.Bqg7VNjLAShSPfUj30DDDjvtDRiWj7JOZaeXPx4Nxqs

# API Keys
THE_ODDS_API_KEY=c80c884ccf5838362cbf7c3a3792710b

# ESPN Configuration
ESPN_S2=AEBhPR9cLPaEZz7Ql8PBKJxddtevPLnTyHqE2%2FsYhCL4p5zQf3dlYwkgMeZcxZN9FZveLlGZaz5xPwv7wuvAR7UWkQU7jZlgkLWo63RZdvOOdEWcFsCa0hHOuAYxZv6dxxKAe4wE2Eq0a2YBBvaG6qPN2%2FTHZJgMIRVEixfVDHkjaQfxYTt6kRo4EbpDfSjq0rvasg6aSFssw%2BqtZZDpWEMn2DlKmwUOKMVq2%2F2X6iCQMKUYVexOFv9fy8K7TLDzJGaw6lWYz5MknrQU0KLoIfZF
SWID={E3A5548E-CE13-4FAD-AF22-88B05F8E30DA}
ESPN_LEAGUE_ID=637913
ESPN_SEASON_YEAR=2024

# Redis (Railway will provide this)
REDIS_URL=redis://redis:6379
```

### 3. Deploy

1. Click "Deploy" in Railway dashboard
2. Wait for build to complete (5-10 minutes)
3. Note the generated URL (e.g., `https://fantasy-dashboard-production.up.railway.app`)

### 4. Test Backend

```bash
# Test health endpoint
curl https://your-railway-url.up.railway.app/health

# Test integrations
curl https://your-railway-url.up.railway.app/health/integrations
```

## Frontend Deployment (Vercel)

### 1. Prepare Vercel Deployment

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `fantasy-dashboard` repository

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2. Set Environment Variables

In Vercel dashboard, add these environment variables:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://lqlqyasfvyxbbkagnlhk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbHF5YXNmdnl4YmJrYWdubGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ3MzQsImV4cCI6MjA3NjY1MDczNH0.pvCp1_NOhxQU4jLuVaR3Ey7HQ__-4GWgOGtwlnYoU6o

# API Configuration
REACT_APP_API_URL=https://your-railway-url.up.railway.app
```

### 3. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (3-5 minutes)
3. Note the generated URL (e.g., `https://fantasy-dashboard.vercel.app`)

### 4. Test Frontend

1. Visit your Vercel URL
2. Check browser console for any errors
3. Test API connectivity

## Post-Deployment

### 1. Update CORS Settings

Update your Railway backend to allow your Vercel frontend:

```python
# In backend/app/main.py, update CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-vercel-url.vercel.app",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Test Full Integration

1. **Backend Health**: `https://your-railway-url.up.railway.app/health`
2. **Frontend**: `https://your-vercel-url.vercel.app`
3. **API Integration**: Test betting, odds, and FAAB features
4. **Database**: Verify Supabase connection

### 3. Set Up Monitoring

1. **Railway**: Monitor logs and metrics in dashboard
2. **Vercel**: Monitor build logs and analytics
3. **Supabase**: Monitor database usage and performance

## Local Development with Docker

### 1. Start All Services

```bash
# Start Redis, backend, and frontend
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Test Local Deployment

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Redis**: localhost:6379

### 3. Stop Services

```bash
docker-compose down
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update CORS origins in backend
   - Check environment variables

2. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity

3. **Build Failures**
   - Check environment variables
   - Verify dependencies in requirements.txt

4. **API Timeouts**
   - Check Railway logs
   - Verify Redis connection

### Debug Commands

```bash
# Test backend locally
cd backend && python -m uvicorn app.main:app --reload

# Test frontend locally
cd frontend && npm start

# Test Redis
redis-cli ping

# Test Supabase
curl -H "apikey: YOUR_ANON_KEY" https://lqlqyasfvyxbbkagnlhk.supabase.co/rest/v1/
```

## Success Criteria

- [ ] Backend deployed to Railway and responding
- [ ] Frontend deployed to Vercel and loading
- [ ] API endpoints working correctly
- [ ] Database connection established
- [ ] Real-time features functioning
- [ ] Mobile interface working
- [ ] Ready for League TB12 testing

## Next Steps

1. **User Testing**: Connect League TB12 for real data testing
2. **Performance Monitoring**: Set up monitoring and alerts
3. **Feature Refinements**: Based on user feedback
4. **Scaling**: Optimize for multiple leagues

---

*Last Updated: 2024-01-15*
*Status: Ready for deployment*
