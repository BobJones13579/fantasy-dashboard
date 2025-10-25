# Production Configuration

**TL;DR** — Environment variables and configuration for production deployment.

## Backend Environment Variables (Railway)

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

# Redis (Railway will provide this automatically)
REDIS_URL=redis://redis:6379
```

## Frontend Environment Variables (Vercel)

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://lqlqyasfvyxbbkagnlhk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbHF5YXNmdnl4YmJrYWdubGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ3MzQsImV4cCI6MjA3NjY1MDczNH0.pvCp1_NOhxQU4jLuVaR3Ey7HQ__-4GWgOGtwlnYoU6o

# API Configuration
REACT_APP_API_URL=https://your-railway-url.up.railway.app
```

## Deployment URLs

- **Backend**: `https://your-railway-url.up.railway.app`
- **Frontend**: `https://your-vercel-url.vercel.app`
- **Database**: `https://lqlqyasfvyxbbkagnlhk.supabase.co`

## Testing Endpoints

- **Health Check**: `https://your-railway-url.up.railway.app/health`
- **Integrations**: `https://your-railway-url.up.railway.app/health/integrations`
- **API Docs**: `https://your-railway-url.up.railway.app/docs`

---

*Last Updated: 2024-01-15*
