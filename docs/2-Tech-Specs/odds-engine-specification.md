# Odds Engine Technical Specification

## Overview

This document outlines the technical implementation of a fantasy football odds engine inspired by Fantom Odds, integrated with our ESPN Fantasy Football dashboard for League TB12. The engine now includes advanced features for comprehensive odds display, market intelligence, and strategic analysis.

## System Architecture

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ESPN API      │    │   Odds Engine   │    │   Live Odds     │
│   Integration   │───▶│   Calculator    │───▶│   Board         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   League Data   │    │   Monte Carlo   │    │   Market        │
│   (League TB12) │    │   Simulation    │    │   Intelligence  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Historical    │    │   Probability   │    │   Token System  │
│   Data & Trends │    │   Engine        │    │   & Tracking    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Flow

### 1. Data Ingestion
```python
# ESPN API Data Sources
league_data = {
    'teams': league.teams,           # All 10 teams
    'matchups': league.scoreboard(), # Weekly matchups
    'players': league.player_info(), # Player projections
    'settings': league.settings      # League configuration
}
```

### 2. Odds Calculation
```python
# Core odds calculation logic
def calculate_moneyline_odds(team1_projection, team2_projection):
    """
    Calculate moneyline odds based on projected scores
    Returns: (team1_odds, team2_odds)
    """
    total = team1_projection + team2_projection
    team1_prob = team1_projection / total
    
    if team1_prob > 0.5:
        # Favorite (negative odds)
        team1_odds = -100 * team1_prob / (1 - team1_prob)
        team2_odds = 100 * (1 - team1_prob) / team1_prob
    else:
        # Underdog (positive odds)
        team1_odds = 100 * (1 - team1_prob) / team1_prob
        team2_odds = -100 * team1_prob / (1 - team1_prob)
    
    return (round(team1_odds), round(team2_odds))
```

## Market Types Implementation

### 1. Moneyline Markets
```python
class MoneylineMarket:
    def __init__(self, team1, team2, week):
        self.team1 = team1
        self.team2 = team2
        self.week = week
        self.odds = self.calculate_odds()
    
    def calculate_odds(self):
        team1_proj = self.team1.projected_points
        team2_proj = self.team2.projected_points
        return calculate_moneyline_odds(team1_proj, team2_proj)
    
    def get_payout(self, bet_amount, winning_team):
        if winning_team == self.team1:
            if self.odds[0] < 0:
                return bet_amount * (100 / abs(self.odds[0]))
            else:
                return bet_amount * (self.odds[0] / 100)
        else:
            if self.odds[1] < 0:
                return bet_amount * (100 / abs(self.odds[1]))
            else:
                return bet_amount * (self.odds[1] / 100)
```

### 2. Spread Markets
```python
class SpreadMarket:
    def __init__(self, team1, team2, week):
        self.team1 = team1
        self.team2 = team2
        self.week = week
        self.spread = self.calculate_spread()
        self.odds = (+100, +100)  # Even money for base spread
    
    def calculate_spread(self):
        team1_proj = self.team1.projected_points
        team2_proj = self.team2.projected_points
        spread = team1_proj - team2_proj
        return round(spread * 2) / 2  # Round to nearest 0.5
    
    def get_adjustable_spread_odds(self, new_spread):
        """
        Calculate odds for adjusted spreads
        """
        original_spread = self.spread
        adjustment = new_spread - original_spread
        
        # Adjust odds based on spread change
        if adjustment > 0:
            # Favoring the favorite more
            return (-150, +150)
        elif adjustment < 0:
            # Favoring the underdog more
            return (+150, -150)
        else:
            return (+100, +100)
```

### 3. Totals Markets
```python
class TotalsMarket:
    def __init__(self, team1, team2, week):
        self.team1 = team1
        self.team2 = team2
        self.week = week
        self.matchup_total = self.calculate_matchup_total()
        self.team_totals = self.calculate_team_totals()
    
    def calculate_matchup_total(self):
        total = self.team1.projected_points + self.team2.projected_points
        return round(total * 2) / 2  # Round to nearest 0.5
    
    def calculate_team_totals(self):
        return {
            'team1': self.team1.projected_points,
            'team2': self.team2.projected_points
        }
    
    def get_adjustable_total_odds(self, new_total):
        """
        Calculate odds for adjusted totals
        """
        original_total = self.matchup_total
        adjustment = new_total - original_total
        
        if adjustment > 0:
            # Higher total (favoring over)
            return (+200, -200)
        elif adjustment < 0:
            # Lower total (favoring under)
            return (-200, +200)
        else:
            return (+100, +100)
```

### 4. Player Over/Under Markets
```python
class PlayerOverUnderMarket:
    def __init__(self, player, week):
        self.player = player
        self.week = week
        self.projection = player.projected_points
        self.odds = (+100, +100)  # Base odds
    
    def get_adjustable_odds(self, new_line):
        """
        Calculate odds for adjusted player lines
        """
        adjustment = new_line - self.projection
        
        if adjustment > 0:
            # Higher line (favoring under)
            return (+300, -300)
        elif adjustment < 0:
            # Lower line (favoring over)
            return (-300, +300)
        else:
            return (+100, +100)
```

## Token System Implementation

### 1. Token Management
```python
class TokenSystem:
    def __init__(self, league_id):
        self.league_id = league_id
        self.weekly_allowance = 1000
        self.tokens = self.load_token_balances()
    
    def load_token_balances(self):
        """
        Load current token balances for all league members
        """
        # In production, this would load from database
        return {
            team.team_id: {
                'balance': 1000,
                'weekly_used': 0,
                'total_winnings': 0
            }
            for team in self.league.teams
        }
    
    def place_bet(self, team_id, bet_amount, market, selection):
        """
        Place a bet and deduct tokens
        """
        if self.tokens[team_id]['balance'] < bet_amount:
            raise InsufficientTokensError("Not enough tokens")
        
        self.tokens[team_id]['balance'] -= bet_amount
        self.tokens[team_id]['weekly_used'] += bet_amount
        
        return {
            'bet_id': self.generate_bet_id(),
            'team_id': team_id,
            'amount': bet_amount,
            'market': market,
            'selection': selection,
            'timestamp': datetime.now()
        }
    
    def settle_bet(self, bet_id, result):
        """
        Settle a bet and update token balances
        """
        bet = self.get_bet(bet_id)
        if result == 'win':
            payout = self.calculate_payout(bet)
            self.tokens[bet['team_id']]['balance'] += payout
            self.tokens[bet['team_id']]['total_winnings'] += payout
        # Losses are already deducted when bet was placed
```

### 2. Scoreboard Tracking
```python
class ScoreboardTracker:
    def __init__(self, token_system):
        self.token_system = token_system
        self.weekly_stats = {}
        self.season_stats = {}
    
    def update_weekly_stats(self, week):
        """
        Update weekly statistics for all teams
        """
        for team_id, tokens in self.token_system.tokens.items():
            self.weekly_stats[week][team_id] = {
                'winnings': tokens['total_winnings'] - 1000,
                'record': self.calculate_record(team_id, week),
                'best_finish': self.calculate_best_finish(team_id, week)
            }
    
    def calculate_record(self, team_id, week):
        """
        Calculate win-loss record for the week
        """
        bets = self.get_weekly_bets(team_id, week)
        wins = sum(1 for bet in bets if bet['result'] == 'win')
        losses = sum(1 for bet in bets if bet['result'] == 'loss')
        return f"{wins}-{losses}"
    
    def get_leaderboard(self, week=None):
        """
        Get current leaderboard
        """
        if week:
            stats = self.weekly_stats[week]
        else:
            stats = self.season_stats
        
        return sorted(
            stats.items(),
            key=lambda x: x[1]['winnings'],
            reverse=True
        )
```

## Live Matchup Odds Board Features

### 1. Monte Carlo Simulation Engine
```python
class MonteCarloSimulator:
    def __init__(self, iterations=10000):
        self.iterations = iterations
        self.results = {}
    
    def simulate_matchup(self, team1, team2, week):
        """
        Run Monte Carlo simulation for matchup outcome
        """
        team1_wins = 0
        team2_wins = 0
        
        for _ in range(self.iterations):
            # Simulate team1 score with variance
            team1_score = self.simulate_team_score(team1, week)
            # Simulate team2 score with variance
            team2_score = self.simulate_team_score(team2, week)
            
            if team1_score > team2_score:
                team1_wins += 1
            else:
                team2_wins += 1
        
        return {
            'team1_win_prob': team1_wins / self.iterations,
            'team2_win_prob': team2_wins / self.iterations,
            'confidence': self.calculate_confidence(team1_wins, team2_wins)
        }
    
    def simulate_team_score(self, team, week):
        """
        Simulate team score with realistic variance
        """
        base_projection = team.projected_points
        variance = team.historical_variance
        injury_factor = team.injury_adjustment
        
        # Add realistic variance based on historical performance
        simulated_score = np.random.normal(
            base_projection * injury_factor,
            variance
        )
        
        return max(0, simulated_score)  # Ensure non-negative scores
```

### 2. Advanced Odds Display
```python
class AdvancedOddsDisplay:
    def __init__(self):
        self.odds_formatter = OddsFormatter()
        self.probability_calculator = ProbabilityCalculator()
    
    def format_comprehensive_odds(self, matchup):
        """
        Format odds with win probabilities and market intelligence
        """
        return {
            'matchup_id': matchup.id,
            'team1': {
                'name': matchup.team1.name,
                'moneyline_odds': matchup.team1_odds,
                'win_probability': matchup.team1_win_prob,
                'implied_percentage': self.calculate_implied_percentage(matchup.team1_odds)
            },
            'team2': {
                'name': matchup.team2.name,
                'moneyline_odds': matchup.team2_odds,
                'win_probability': matchup.team2_win_prob,
                'implied_percentage': self.calculate_implied_percentage(matchup.team2_odds)
            },
            'spread': matchup.spread,
            'total': matchup.total,
            'market_movement': self.get_market_movement(matchup.id),
            'upset_alerts': self.get_upset_alerts(matchup.id)
        }
    
    def calculate_implied_percentage(self, odds):
        """
        Calculate implied win percentage from odds
        """
        if odds < 0:
            return abs(odds) / (abs(odds) + 100)
        else:
            return 100 / (odds + 100)
```

### 3. Market Intelligence System
```python
class MarketIntelligence:
    def __init__(self):
        self.upset_alerts = []
        self.market_trends = {}
        self.efficiency_metrics = {}
    
    def detect_upset_alert(self, matchup, live_scores):
        """
        Detect potential upsets during live games
        """
        if not live_scores:
            return None
        
        current_spread = live_scores['team1'] - live_scores['team2']
        projected_spread = matchup.projected_spread
        
        # If underdog is outperforming by significant margin
        if current_spread > projected_spread + 10:
            return {
                'type': 'upset_alert',
                'matchup_id': matchup.id,
                'message': f"{matchup.team2.name} is outperforming projections by {current_spread - projected_spread:.1f} points",
                'confidence': self.calculate_upset_confidence(current_spread, projected_spread)
            }
        
        return None
    
    def track_market_movement(self, market_id, old_odds, new_odds):
        """
        Track and analyze market movement
        """
        movement = {
            'market_id': market_id,
            'timestamp': datetime.now(),
            'old_odds': old_odds,
            'new_odds': new_odds,
            'movement': self.calculate_movement(old_odds, new_odds),
            'volume': self.get_betting_volume(market_id)
        }
        
        self.market_trends[market_id] = movement
        return movement
    
    def calculate_market_efficiency(self, matchup):
        """
        Calculate market efficiency metrics
        """
        return {
            'spread_efficiency': self.calculate_spread_efficiency(matchup),
            'total_efficiency': self.calculate_total_efficiency(matchup),
            'moneyline_efficiency': self.calculate_moneyline_efficiency(matchup),
            'overall_efficiency': self.calculate_overall_efficiency(matchup)
        }
```

## Real-Time Updates

### 1. Live Odds Updates
```python
class LiveOddsUpdater:
    def __init__(self, odds_engine):
        self.odds_engine = odds_engine
        self.update_interval = 30  # seconds
    
    def start_updates(self):
        """
        Start real-time odds updates
        """
        while True:
            self.update_all_odds()
            time.sleep(self.update_interval)
    
    def update_all_odds(self):
        """
        Update odds for all active markets
        """
        for market in self.odds_engine.active_markets:
            market.update_odds()
            self.notify_subscribers(market)
    
    def notify_subscribers(self, market):
        """
        Notify subscribers of odds changes
        """
        # In production, this would use WebSockets
        for subscriber in market.subscribers:
            subscriber.update_odds(market)
```

### 2. Game Status Integration
```python
class GameStatusTracker:
    def __init__(self):
        self.game_status = {}
    
    def update_game_status(self, game_id, status):
        """
        Update game status and trigger odds recalculation
        """
        self.game_status[game_id] = status
        
        # Recalculate odds for affected markets
        affected_markets = self.get_affected_markets(game_id)
        for market in affected_markets:
            market.recalculate_odds()
    
    def get_affected_markets(self, game_id):
        """
        Get all markets affected by a game status change
        """
        # Find markets with players from this game
        affected = []
        for market in self.odds_engine.active_markets:
            if market.has_players_from_game(game_id):
                affected.append(market)
        return affected
```

## Database Schema

### 1. Bets Table
```sql
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    market_type VARCHAR(50) NOT NULL,
    market_id INTEGER NOT NULL,
    selection VARCHAR(100) NOT NULL,
    bet_amount INTEGER NOT NULL,
    odds INTEGER NOT NULL,
    potential_payout INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    result VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    settled_at TIMESTAMP
);
```

### 2. Token Balances Table
```sql
CREATE TABLE token_balances (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    week INTEGER NOT NULL,
    starting_balance INTEGER DEFAULT 1000,
    current_balance INTEGER NOT NULL,
    weekly_used INTEGER DEFAULT 0,
    total_winnings INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Markets Table
```sql
CREATE TABLE markets (
    id SERIAL PRIMARY KEY,
    market_type VARCHAR(50) NOT NULL,
    week INTEGER NOT NULL,
    team1_id INTEGER,
    team2_id INTEGER,
    player_id INTEGER,
    base_line DECIMAL(5,1),
    current_odds_team1 INTEGER,
    current_odds_team2 INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### 1. Market Data
```python
# Get all markets for a week
GET /api/markets/week/{week}
Response: {
    "moneyline": [...],
    "spreads": [...],
    "totals": [...],
    "player_over_under": [...]
}

# Get specific market details
GET /api/markets/{market_id}
Response: {
    "market_type": "moneyline",
    "teams": [...],
    "odds": {...},
    "bets": [...]
}
```

### 2. Betting Operations
```python
# Place a bet
POST /api/bets
Body: {
    "market_id": 123,
    "selection": "team1",
    "amount": 100
}

# Get user's bets
GET /api/bets/user/{team_id}
Response: {
    "active_bets": [...],
    "settled_bets": [...],
    "total_winnings": 150
}
```

### 3. Scoreboard
```python
# Get weekly scoreboard
GET /api/scoreboard/week/{week}
Response: {
    "week": 5,
    "leaderboard": [...],
    "stats": {...}
}

# Get season scoreboard
GET /api/scoreboard/season
Response: {
    "season": 2025,
    "leaderboard": [...],
    "stats": {...}
}
```

## Security & Anti-Cheating

### 1. Lineup Verification
```python
class LineupVerification:
    def verify_bet_lineup(self, bet, current_lineup):
        """
        Verify that lineup hasn't changed significantly since bet was placed
        """
        bet_lineup = bet['lineup_at_time']
        changes = self.compare_lineups(bet_lineup, current_lineup)
        
        if changes > 2:  # More than 2 lineup changes
            return False, "Lineup changed significantly"
        
        return True, "Lineup verified"
    
    def compare_lineups(self, lineup1, lineup2):
        """
        Compare two lineups and count differences
        """
        differences = 0
        for position in lineup1:
            if lineup1[position] != lineup2[position]:
                differences += 1
        return differences
```

### 2. Bet Timing Controls
```python
class BetTimingControl:
    def __init__(self):
        self.bet_timers = {}
        self.max_bet_time = 600  # 10 minutes when no games
        self.max_bet_time_live = 240  # 4 minutes during games
    
    def start_bet_timer(self, bet_id):
        """
        Start timer for bet placement
        """
        self.bet_timers[bet_id] = {
            'start_time': time.time(),
            'max_time': self.get_max_bet_time()
        }
    
    def get_max_bet_time(self):
        """
        Get maximum bet time based on game status
        """
        if self.has_active_games():
            return self.max_bet_time_live
        else:
            return self.max_bet_time
    
    def has_active_games(self):
        """
        Check if any games are currently active
        """
        # Check if any games are in progress
        return False  # Placeholder
```

## Performance Considerations

### 1. Caching Strategy
```python
class OddsCache:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 30  # 30 seconds
    
    def get_cached_odds(self, market_id):
        """
        Get cached odds if still valid
        """
        if market_id in self.cache:
            cached_data = self.cache[market_id]
            if time.time() - cached_data['timestamp'] < self.cache_ttl:
                return cached_data['odds']
        
        return None
    
    def cache_odds(self, market_id, odds):
        """
        Cache odds with timestamp
        """
        self.cache[market_id] = {
            'odds': odds,
            'timestamp': time.time()
        }
```

### 2. Database Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_bets_team_id ON bets(team_id);
CREATE INDEX idx_bets_market_id ON bets(market_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_token_balances_team_week ON token_balances(team_id, week);
CREATE INDEX idx_markets_week ON markets(week);
CREATE INDEX idx_markets_type ON markets(market_type);
```

## Testing Strategy

### 1. Unit Tests
```python
def test_moneyline_odds_calculation():
    """Test moneyline odds calculation"""
    team1_proj = 120.0
    team2_proj = 80.0
    
    odds = calculate_moneyline_odds(team1_proj, team2_proj)
    
    assert odds[0] < 0  # Team 1 is favorite
    assert odds[1] > 0  # Team 2 is underdog
    assert abs(odds[0]) > abs(odds[1])  # Favorite has higher absolute odds
```

### 2. Integration Tests
```python
def test_full_betting_flow():
    """Test complete betting flow"""
    # Create market
    market = MoneylineMarket(team1, team2, week=5)
    
    # Place bet
    bet = token_system.place_bet(team_id=1, bet_amount=100, market=market, selection='team1')
    
    # Simulate outcome
    market.settle_bet('team1_wins')
    
    # Verify token balance
    assert token_system.tokens[1]['balance'] > 1000
```

## Deployment Considerations

### 1. Environment Configuration
```python
# Production settings
ODDS_UPDATE_INTERVAL = 30  # seconds
MAX_BET_AMOUNT = 1000
MIN_BET_AMOUNT = 1
CACHE_TTL = 30  # seconds
DATABASE_POOL_SIZE = 20
```

### 2. Monitoring
```python
# Key metrics to monitor
METRICS = {
    'odds_update_latency': 'Time to update all odds',
    'bet_placement_time': 'Time to place a bet',
    'database_query_time': 'Database performance',
    'active_users': 'Number of active users',
    'bets_per_minute': 'Betting activity'
}
```

This technical specification provides a comprehensive foundation for implementing a fantasy football odds engine that rivals Fantom Odds while being tailored specifically for our ESPN Fantasy Football dashboard and League TB12.
