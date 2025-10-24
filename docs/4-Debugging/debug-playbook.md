# Debug Playbook

## TLDR

Quick reference guide for debugging common issues in the Fantasy Football Companion App.

## Common Issues & Solutions

### Authentication Issues

**Problem:** User cannot log in
**Symptoms:** "Invalid credentials" error, 401 responses, JWT validation fails

**Debug Steps:**
1. Check user credentials in Supabase Auth
2. Verify JWT token format and expiration
3. Check API authentication middleware
4. Validate user session in browser storage

**Solutions:**
- Refresh expired tokens
- Clear browser storage and re-login
- Verify Supabase Auth configuration

### ESPN API Issues

**Problem:** ESPN API authentication fails
**Symptoms:** 401 Unauthorized, league data cannot be fetched

**Debug Steps:**
1. Verify espn_s2 and SWID cookies are valid
2. Check ESPN API rate limiting
3. Validate league ID format
4. Test API endpoints manually

**Solutions:**
- Refresh ESPN cookies
- Implement rate limiting (1 second between requests)
- Validate credentials before API calls

### Data Synchronization Issues

**Problem:** Real-time updates not working
**Symptoms:** Odds don't update, WebSocket connection fails

**Debug Steps:**
1. Check WebSocket connection status
2. Verify Supabase real-time subscriptions
3. Check network connectivity
4. Validate event handlers

**Solutions:**
- Monitor WebSocket connection status
- Implement automatic reconnection
- Check Supabase real-time subscription setup

### Odds Calculation Issues

**Problem:** Odds calculation errors
**Symptoms:** Odds display as "N/A", Monte Carlo simulation fails

**Debug Steps:**
1. Check team statistics availability
2. Verify Monte Carlo simulation parameters
3. Validate odds calculation logic
4. Check for missing data

**Solutions:**
- Ensure team data is complete
- Adjust simulation parameters
- Implement fallback odds calculation

### Database Issues

**Problem:** Database connection failures
**Symptoms:** 500 errors, data not saving, connection timeouts

**Debug Steps:**
1. Check Supabase connection status
2. Verify database credentials
3. Check for connection pool exhaustion
4. Monitor database performance

**Solutions:**
- Restart database connections
- Check Supabase service status
- Optimize database queries
- Implement connection retry logic

### Frontend Issues

**Problem:** UI components not rendering
**Symptoms:** Blank screens, broken layouts, JavaScript errors

**Debug Steps:**
1. Check browser console for errors
2. Verify component props and state
3. Check for missing dependencies
4. Validate API responses

**Solutions:**
- Fix JavaScript errors
- Check component lifecycle
- Verify API data format
- Test in different browsers

## Escalation Path

1. **Level 1:** Check common solutions above
2. **Level 2:** Review error logs and stack traces
3. **Level 3:** Check external service status (ESPN, Supabase)
4. **Level 4:** Contact development team with detailed error information

## Quick Commands

```bash
# Check backend logs
cd backend && uvicorn app.main:app --reload --log-level debug

# Check frontend build
cd frontend && npm run build

# Test API endpoints
curl -X GET http://localhost:8000/health

# Check database connection
psql $DATABASE_URL -c "SELECT 1;"
```