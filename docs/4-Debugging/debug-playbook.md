# Debug Playbook

## Purpose

This document provides a comprehensive guide for debugging issues, troubleshooting problems, and resolving common errors in the Fantasy Football Companion App.

## Context

The debug playbook serves as a reference for developers, support staff, and users to quickly identify, diagnose, and resolve issues. It covers common problems, debugging procedures, and escalation paths for complex issues.

## Common Issues and Solutions

### Authentication Issues

#### Problem: User cannot log in
**Symptoms:**
- Login form shows "Invalid credentials" error
- User receives 401 Unauthorized responses
- JWT token validation fails

**Debugging Steps:**
1. Check user credentials in Supabase Auth
2. Verify JWT token format and expiration
3. Check API endpoint authentication middleware
4. Validate user session in browser storage

**Solutions:**
```typescript
// Check JWT token validity
const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Refresh token if expired
const refreshToken = async (refreshToken: string) => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  return response.json();
};
```

#### Problem: ESPN API authentication fails
**Symptoms:**
- ESPN API returns 401 Unauthorized
- League data cannot be fetched
- User receives "Invalid ESPN credentials" error

**Debugging Steps:**
1. Verify espn_s2 and SWID cookies are valid
2. Check ESPN API rate limiting
3. Validate league ID format
4. Test API endpoints manually

**Solutions:**
```python
# Validate ESPN credentials
def validate_espn_credentials(espn_s2: str, swid: str) -> bool:
    try:
        response = requests.get(
            'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2024',
            cookies={'espn_s2': espn_s2, 'SWID': swid}
        )
        return response.status_code == 200
    except Exception as e:
        logger.error(f"ESPN API validation failed: {e}")
        return False

# Handle rate limiting
def handle_espn_rate_limit():
    time.sleep(1)  # Wait 1 second between requests
    return True
```

### Data Synchronization Issues

#### Problem: Real-time updates not working
**Symptoms:**
- Odds don't update in real-time
- WebSocket connection fails
- Users don't receive live updates

**Debugging Steps:**
1. Check WebSocket connection status
2. Verify Supabase real-time subscriptions
3. Check network connectivity
4. Validate event handlers

**Solutions:**
```typescript
// WebSocket connection monitoring
const monitorWebSocketConnection = () => {
  const ws = new WebSocket('wss://api.fantasy-companion.app/ws');
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    setConnectionStatus('connected');
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    setConnectionStatus('disconnected');
    // Attempt reconnection
    setTimeout(monitorWebSocketConnection, 5000);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setConnectionStatus('error');
  };
};

// Supabase real-time subscription
const subscribeToOddsUpdates = (matchupId: string) => {
  const subscription = supabase
    .channel('odds-updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'odds',
      filter: `matchup_id=eq.${matchupId}`
    }, (payload) => {
      updateOddsDisplay(payload.new);
    })
    .subscribe();
    
  return subscription;
};
```

#### Problem: Odds calculation errors
**Symptoms:**
- Odds display as "N/A" or invalid values
- Monte Carlo simulation fails
- Market intelligence data is missing

**Debugging Steps:**
1. Check team projection data
2. Verify Monte Carlo simulation parameters
3. Validate odds calculation algorithms
4. Check market intelligence data

**Solutions:**
```python
# Odds calculation debugging
def debug_odds_calculation(team1: Team, team2: Team):
    logger.info(f"Calculating odds for {team1.name} vs {team2.name}")
    
    # Check team data
    if not team1.projected_points or not team2.projected_points:
        logger.error("Missing team projection data")
        return None
    
    # Run Monte Carlo simulation
    try:
        simulation_result = monte_carlo_simulate(team1, team2, iterations=10000)
        logger.info(f"Simulation completed: {simulation_result}")
        
        # Calculate odds
        odds = calculate_moneyline_odds(simulation_result)
        logger.info(f"Calculated odds: {odds}")
        
        return odds
    except Exception as e:
        logger.error(f"Odds calculation failed: {e}")
        return None

# Monte Carlo simulation debugging
def monte_carlo_simulate(team1: Team, team2: Team, iterations: int = 10000):
    team1_wins = 0
    team2_wins = 0
    
    for i in range(iterations):
        try:
            team1_score = simulate_team_score(team1)
            team2_score = simulate_team_score(team2)
            
            if team1_score > team2_score:
                team1_wins += 1
            else:
                team2_wins += 1
        except Exception as e:
            logger.error(f"Simulation iteration {i} failed: {e}")
            continue
    
    return {
        'team1_wins': team1_wins,
        'team2_wins': team2_wins,
        'team1_probability': team1_wins / iterations,
        'team2_probability': team2_wins / iterations
    }
```

### Betting System Issues

#### Problem: Bet placement fails
**Symptoms:**
- Bet submission returns error
- Token balance not updated
- Bet status remains "pending"

**Debugging Steps:**
1. Check user token balance
2. Validate bet parameters
3. Verify market status
4. Check bet validation rules

**Solutions:**
```typescript
// Bet validation debugging
const validateBet = (bet: BetRequest) => {
  const errors: string[] = [];
  
  // Check token balance
  if (bet.amount > userTokenBalance) {
    errors.push('Insufficient token balance');
  }
  
  // Check bet amount limits
  if (bet.amount <= 0 || bet.amount > 1000) {
    errors.push('Invalid bet amount');
  }
  
  // Check market status
  if (market.status !== 'active') {
    errors.push('Market is not active');
  }
  
  // Check bet deadline
  if (new Date() > market.deadline) {
    errors.push('Bet deadline has passed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Bet placement debugging
const placeBet = async (bet: BetRequest) => {
  try {
    // Validate bet
    const validation = validateBet(bet);
    if (!validation.isValid) {
      throw new Error(`Bet validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Check token balance
    const balance = await getUserTokenBalance(bet.userId);
    if (balance < bet.amount) {
      throw new Error('Insufficient token balance');
    }
    
    // Place bet
    const result = await betService.placeBet(bet);
    
    // Update token balance
    await updateTokenBalance(bet.userId, -bet.amount);
    
    return result;
  } catch (error) {
    logger.error(`Bet placement failed: ${error.message}`);
    throw error;
  }
};
```

#### Problem: Bet settlement errors
**Symptoms:**
- Bets remain in "pending" status after games end
- Incorrect payouts calculated
- Token balances not updated

**Debugging Steps:**
1. Check game status and final scores
2. Verify bet settlement logic
3. Check payout calculations
4. Validate token balance updates

**Solutions:**
```python
# Bet settlement debugging
def debug_bet_settlement(matchup_id: str):
    logger.info(f"Settling bets for matchup {matchup_id}")
    
    # Get matchup data
    matchup = get_matchup(matchup_id)
    if not matchup:
        logger.error(f"Matchup {matchup_id} not found")
        return
    
    # Check if game is final
    if matchup.status != 'final':
        logger.error(f"Matchup {matchup_id} is not final")
        return
    
    # Get all pending bets
    pending_bets = get_pending_bets(matchup_id)
    logger.info(f"Found {len(pending_bets)} pending bets")
    
    # Settle each bet
    for bet in pending_bets:
        try:
            result = settle_bet(bet, matchup)
            logger.info(f"Bet {bet.id} settled: {result}")
        except Exception as e:
            logger.error(f"Failed to settle bet {bet.id}: {e}")

# Bet settlement logic
def settle_bet(bet: Bet, matchup: Matchup) -> BetResult:
    if bet.market_type == 'moneyline':
        return settle_moneyline_bet(bet, matchup)
    elif bet.market_type == 'spread':
        return settle_spread_bet(bet, matchup)
    elif bet.market_type == 'total':
        return settle_total_bet(bet, matchup)
    else:
        raise ValueError(f"Unknown market type: {bet.market_type}")

def settle_moneyline_bet(bet: Bet, matchup: Matchup) -> BetResult:
    # Determine winner
    if matchup.team1_score > matchup.team2_score:
        winner = 'team1'
    elif matchup.team2_score > matchup.team1_score:
        winner = 'team2'
    else:
        return BetResult(outcome='push', payout=bet.amount, profit_loss=0)
    
    # Check if bet won
    if bet.selection == winner:
        payout = calculate_payout(bet.amount, bet.odds)
        return BetResult(outcome='win', payout=payout, profit_loss=payout - bet.amount)
    else:
        return BetResult(outcome='loss', payout=0, profit_loss=-bet.amount)
```

### FAAB Analysis Issues

#### Problem: FAAB recommendations not generated
**Symptoms:**
- FAAB analysis page shows "No data available"
- Bid recommendations are missing
- Market intelligence data is empty

**Debugging Steps:**
1. Check ESPN API transaction data
2. Verify FAAB bid parsing
3. Check recommendation engine
4. Validate market intelligence data

**Solutions:**
```python
# FAAB analysis debugging
def debug_faab_analysis(league_id: str, week: int):
    logger.info(f"Analyzing FAAB data for league {league_id}, week {week}")
    
    # Get transaction data from ESPN
    try:
        transactions = get_espn_transactions(league_id, week)
        logger.info(f"Retrieved {len(transactions)} transactions")
    except Exception as e:
        logger.error(f"Failed to get ESPN transactions: {e}")
        return None
    
    # Parse FAAB bids
    faab_bids = []
    for transaction in transactions:
        if transaction.type == 'FAAB_BID':
            bid = parse_faab_bid(transaction)
            if bid:
                faab_bids.append(bid)
    
    logger.info(f"Parsed {len(faab_bids)} FAAB bids")
    
    # Generate recommendations
    try:
        recommendations = generate_faab_recommendations(faab_bids)
        logger.info(f"Generated {len(recommendations)} recommendations")
        return recommendations
    except Exception as e:
        logger.error(f"Failed to generate recommendations: {e}")
        return None

# FAAB bid parsing debugging
def parse_faab_bid(transaction: dict) -> Optional[FAABBid]:
    try:
        # Extract bid information
        player_name = transaction.get('player', {}).get('fullName')
        bid_amount = transaction.get('bidAmount')
        winning_bid = transaction.get('winningBid', False)
        
        if not player_name or not bid_amount:
            logger.warning(f"Incomplete FAAB bid data: {transaction}")
            return None
        
        return FAABBid(
            player_name=player_name,
            bid_amount=bid_amount,
            winning_bid=winning_bid,
            week=transaction.get('week'),
            bidder_id=transaction.get('bidderId')
        )
    except Exception as e:
        logger.error(f"Failed to parse FAAB bid: {e}")
        return None
```

### Trade Analysis Issues

#### Problem: Trade tree visualization fails
**Symptoms:**
- Trade tree doesn't load
- Visualization shows empty or incorrect data
- Trade analysis is missing

**Debugging Steps:**
1. Check trade data from ESPN API
2. Verify trade tree construction
3. Check visualization rendering
4. Validate trade value calculations

**Solutions:**
```typescript
// Trade tree debugging
const debugTradeTree = async (leagueId: string) => {
  console.log(`Building trade tree for league ${leagueId}`);
  
  try {
    // Get trade data
    const trades = await getTrades(leagueId);
    console.log(`Retrieved ${trades.length} trades`);
    
    // Build trade tree
    const tree = buildTradeTree(trades);
    console.log(`Built trade tree with ${tree.nodes.length} nodes`);
    
    // Validate tree structure
    const validation = validateTradeTree(tree);
    if (!validation.isValid) {
      console.error('Trade tree validation failed:', validation.errors);
      return null;
    }
    
    return tree;
  } catch (error) {
    console.error('Trade tree construction failed:', error);
    return null;
  }
};

// Trade tree construction
const buildTradeTree = (trades: Trade[]): TradeTree => {
  const nodes: TradeTreeNode[] = [];
  const assetMap = new Map<string, TradeTreeNode>();
  
  // Process trades in chronological order
  const sortedTrades = trades.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  for (const trade of sortedTrades) {
    // Process team1 assets
    for (const asset of trade.team1_assets) {
      const node = createTradeNode(asset, trade, 'team1');
      nodes.push(node);
      assetMap.set(asset.espn_id, node);
    }
    
    // Process team2 assets
    for (const asset of trade.team2_assets) {
      const node = createTradeNode(asset, trade, 'team2');
      nodes.push(node);
      assetMap.set(asset.espn_id, node);
    }
  }
  
  return {
    nodes,
    depth: calculateTreeDepth(nodes),
    total_trades: trades.length
  };
};
```

## Performance Issues

### Problem: Slow page load times
**Symptoms:**
- Pages take more than 3 seconds to load
- User experience is poor
- High bounce rates

**Debugging Steps:**
1. Check network requests and response times
2. Analyze bundle size and loading
3. Check database query performance
4. Verify caching implementation

**Solutions:**
```typescript
// Performance monitoring
const monitorPerformance = () => {
  // Monitor page load times
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime > 3000) {
      console.warn('Slow page load detected');
      // Send performance data to analytics
      sendPerformanceData({ loadTime, url: window.location.href });
    }
  });
  
  // Monitor API response times
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const start = performance.now();
    const response = await originalFetch(...args);
    const end = performance.now();
    
    const responseTime = end - start;
    if (responseTime > 1000) {
      console.warn(`Slow API response: ${responseTime}ms for ${args[0]}`);
    }
    
    return response;
  };
};

// Database query optimization
const optimizeQueries = () => {
  // Use database indexes
  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_matchups_league_week ON matchups(league_id, week);
    CREATE INDEX IF NOT EXISTS idx_bets_user_week ON bets(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_faab_bids_league_week ON faab_bids(league_id, week);
  `;
  
  // Implement query caching
  const cacheQuery = (query: string, params: any[], ttl: number = 300) => {
    const cacheKey = `${query}:${JSON.stringify(params)}`;
    const cached = redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const result = executeQuery(query, params);
    redis.setex(cacheKey, ttl, JSON.stringify(result));
    return result;
  };
};
```

## Error Monitoring and Logging

### Error Tracking Setup
```typescript
// Error boundary for React components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send error to monitoring service
    sendErrorReport({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  sendErrorReport({
    error: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: new Date().toISOString()
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  sendErrorReport({
    error: event.reason.message || 'Unhandled promise rejection',
    stack: event.reason.stack,
    timestamp: new Date().toISOString()
  });
});
```

### Logging Configuration
```python
# Python logging configuration
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Create logger
logger = structlog.get_logger()

# Usage examples
logger.info("User logged in", user_id="user_123", league_id="league_456")
logger.error("API request failed", endpoint="/api/odds", status_code=500, error="Connection timeout")
logger.warning("Slow query detected", query="SELECT * FROM matchups", duration=2.5)
```

## Escalation Procedures

### Level 1: User Support
- **Scope**: Basic user issues, account problems, feature questions
- **Response Time**: 24 hours
- **Resolution Time**: 48 hours
- **Escalation**: If not resolved within 48 hours

### Level 2: Technical Support
- **Scope**: Technical issues, API problems, data synchronization
- **Response Time**: 4 hours
- **Resolution Time**: 24 hours
- **Escalation**: If not resolved within 24 hours

### Level 3: Development Team
- **Scope**: Critical bugs, system failures, security issues
- **Response Time**: 1 hour
- **Resolution Time**: 8 hours
- **Escalation**: If not resolved within 8 hours

### Level 4: Emergency Response
- **Scope**: System outages, data loss, security breaches
- **Response Time**: 15 minutes
- **Resolution Time**: 2 hours
- **Escalation**: Immediate notification to all stakeholders

---

## Source of Truth / Version

- **Creation Date:** [Current Date]
- **Last Updated:** [Current Date]
- **Next Review Date:** [Next Review Date]
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
