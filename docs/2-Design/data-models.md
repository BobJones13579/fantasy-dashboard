# Data Models

## TLDR

Comprehensive data models, schemas, and relationships for the Fantasy Football Companion App, defining how data is structured, stored, and accessed across the system.

## Purpose

This document defines the data models, schemas, and relationships used throughout the Fantasy Football Companion App. It provides a comprehensive overview of how data is structured, stored, and accessed across the system.

## Context

The data models support the core functionality of the Fantasy Football Companion App, including user management, league data, odds calculation, betting operations, FAAB analysis, and trade tracking. All models are designed to work with Supabase PostgreSQL and support real-time updates.

## Core Data Models

### User Management

#### User Model
```typescript
interface User {
  id: string;                    // UUID primary key
  email: string;                 // Unique email address
  display_name: string;          // User's display name
  espn_user_id?: string;         // ESPN user identifier
  avatar_url?: string;           // Profile picture URL
  preferences: UserPreferences;  // User settings and preferences
  created_at: Date;              // Account creation timestamp
  updated_at: Date;              // Last update timestamp
}

interface UserPreferences {
  theme: 'light' | 'dark';       // UI theme preference
  notifications: {
    email: boolean;              // Email notifications
    push: boolean;               // Push notifications
    odds_alerts: boolean;        // Odds change alerts
    faab_alerts: boolean;        // FAAB opportunity alerts
  };
  default_view: 'mobile' | 'desktop'; // Default view preference
  favorite_teams: string[];      // Array of favorite team IDs
}
```

#### League Model
```typescript
interface League {
  id: string;                    // UUID primary key
  name: string;                  // League name
  espn_league_id: string;        // ESPN league identifier
  season: number;                // Fantasy season year
  settings: LeagueSettings;      // League configuration
  status: 'active' | 'inactive'; // League status
  created_at: Date;              // League creation timestamp
  updated_at: Date;              // Last update timestamp
}

interface LeagueSettings {
  scoring_type: 'standard' | 'ppr' | 'half_ppr'; // Scoring system
  roster_size: number;           // Number of starting players
  bench_size: number;            // Number of bench players
  faab_budget: number;           // FAAB budget per team
  trade_deadline: number;        // Trade deadline week
  playoff_weeks: number[];       // Playoff weeks
  custom_scoring?: Record<string, number>; // Custom scoring rules
}
```

#### Team Model
```typescript
interface Team {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  espn_team_id: string;          // ESPN team identifier
  name: string;                  // Team name
  owner_id: string;              // Foreign key to User
  logo_url?: string;             // Team logo URL
  record: TeamRecord;            // Season record
  stats: TeamStats;              // Team statistics
  created_at: Date;              // Team creation timestamp
}

interface TeamRecord {
  wins: number;                  // Number of wins
  losses: number;                // Number of losses
  ties: number;                  // Number of ties
  points_for: number;            // Total points scored
  points_against: number;        // Total points allowed
  streak: number;                // Current win/loss streak
}

interface TeamStats {
  average_score: number;         // Average weekly score
  highest_score: number;         // Highest weekly score
  lowest_score: number;          // Lowest weekly score
  consistency_rating: number;    // Score consistency metric
  luck_rating: number;           // Schedule luck metric
}
```

### Betting System

#### Matchup Model
```typescript
interface Matchup {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number (1-18)
  team1_id: string;              // Foreign key to Team
  team2_id: string;              // Foreign key to Team
  team1_score?: number;          // Team 1 final score
  team2_score?: number;          // Team 2 final score
  status: MatchupStatus;         // Matchup status
  odds: OddsData;                // Current odds data
  created_at: Date;              // Matchup creation timestamp
  updated_at: Date;              // Last update timestamp
}

type MatchupStatus = 'scheduled' | 'in_progress' | 'final' | 'postponed';

interface OddsData {
  moneyline: MoneylineOdds;      // Moneyline odds
  spread: SpreadOdds;            // Point spread odds
  total: TotalOdds;              // Over/under odds
  last_updated: Date;            // Last odds update
}

interface MoneylineOdds {
  team1_odds: number;            // Team 1 moneyline odds
  team2_odds: number;            // Team 2 moneyline odds
  team1_probability: number;     // Implied win probability
  team2_probability: number;     // Implied win probability
}

interface SpreadOdds {
  spread: number;                // Point spread
  team1_odds: number;            // Team 1 spread odds
  team2_odds: number;            // Team 2 spread odds
  team1_probability: number;     // Cover probability
  team2_probability: number;     // Cover probability
}

interface TotalOdds {
  total: number;                 // Total points
  over_odds: number;             // Over odds
  under_odds: number;            // Under odds
  over_probability: number;      // Over probability
  under_probability: number;     // Under probability
}
```

#### Bet Model
```typescript
interface Bet {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to User
  matchup_id: string;            // Foreign key to Matchup
  market_type: MarketType;       // Type of bet
  selection: string;             // Bet selection
  odds: number;                  // Odds at time of bet
  amount: number;                // Token amount wagered
  potential_payout: number;      // Potential token payout
  status: BetStatus;             // Bet status
  result?: BetResult;            // Bet result
  created_at: Date;              // Bet placement timestamp
  settled_at?: Date;             // Bet settlement timestamp
}

type MarketType = 'moneyline' | 'spread' | 'total' | 'player_prop';
type BetStatus = 'pending' | 'won' | 'lost' | 'pushed' | 'cancelled';

interface BetResult {
  outcome: 'win' | 'loss' | 'push';
  payout: number;                // Actual token payout
  profit_loss: number;           // Net profit/loss
}
```

#### Token Model
```typescript
interface TokenBalance {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to User
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  balance: number;               // Current token balance
  weekly_allocation: number;     // Weekly token allocation (1000)
  spent_this_week: number;       // Tokens spent this week
  won_this_week: number;         // Tokens won this week
  created_at: Date;              // Balance creation timestamp
  updated_at: Date;              // Last update timestamp
}

interface TokenTransaction {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to User
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  type: TransactionType;         // Transaction type
  amount: number;                // Token amount
  description: string;           // Transaction description
  bet_id?: string;               // Associated bet ID
  created_at: Date;              // Transaction timestamp
}

type TransactionType = 'weekly_allocation' | 'bet_placed' | 'bet_won' | 'bet_lost' | 'bonus' | 'penalty';
```

### FAAB Analysis

#### FAAB Bid Model
```typescript
interface FAABBid {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  player_name: string;           // Player name
  position: string;              // Player position
  bid_amount: number;            // Bid amount
  winning_bid: boolean;          // Whether bid won
  bidder_id: string;             // Foreign key to User
  player_value: number;          // Estimated player value
  market_average: number;        // Market average bid
  created_at: Date;              // Bid timestamp
}

interface FAABAnalysis {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  player_name: string;           // Player name
  position: string;              // Player position
  recommended_bid: BidRecommendation; // Bid recommendation
  market_intelligence: MarketIntelligence; // Market analysis
  created_at: Date;              // Analysis timestamp
}

interface BidRecommendation {
  conservative: number;          // Conservative bid amount
  recommended: number;           // Recommended bid amount
  aggressive: number;            // Aggressive bid amount
  confidence: number;            // Confidence level (0-1)
  reasoning: string;             // Recommendation reasoning
}

interface MarketIntelligence {
  total_bids: number;            // Total number of bids
  average_bid: number;           // Average bid amount
  highest_bid: number;           // Highest bid amount
  market_inflation: number;      // Market inflation factor
  position_demand: number;       // Position demand level
  similar_player_comparison: SimilarPlayerComparison[]; // Similar players
}

interface SimilarPlayerComparison {
  player_name: string;           // Similar player name
  week: number;                  // Week of comparison
  winning_bid: number;           // Winning bid amount
  market_average: number;        // Market average bid
  performance_after: number;     // Performance after acquisition
}
```

### Trade Analysis

#### Trade Model
```typescript
interface Trade {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  team1_id: string;              // Foreign key to Team
  team2_id: string;              // Foreign key to Team
  team1_assets: TradeAsset[];    // Team 1 assets
  team2_assets: TradeAsset[];    // Team 2 assets
  status: TradeStatus;           // Trade status
  value_analysis?: TradeValueAnalysis; // Value analysis
  created_at: Date;              // Trade creation timestamp
  approved_at?: Date;            // Trade approval timestamp
}

type TradeStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface TradeAsset {
  type: 'player' | 'draft_pick'; // Asset type
  name: string;                  // Player name or pick description
  position?: string;             // Player position (if applicable)
  value: number;                 // Estimated value
  espn_id?: string;              // ESPN identifier
}

interface TradeValueAnalysis {
  team1_total_value: number;     // Team 1 total value
  team2_total_value: number;     // Team 2 total value
  value_difference: number;      // Value difference
  fairness_rating: number;       // Fairness rating (0-1)
  analysis: string;              // Analysis text
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';
}
```

#### Trade Tree Model
```typescript
interface TradeTree {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  root_asset: TradeAsset;        // Root asset (original trade)
  nodes: TradeTreeNode[];        // Tree nodes
  depth: number;                 // Tree depth
  total_trades: number;          // Total number of trades
  created_at: Date;              // Tree creation timestamp
  updated_at: Date;              // Last update timestamp
}

interface TradeTreeNode {
  id: string;                    // Node ID
  asset: TradeAsset;             // Asset at this node
  trade_id: string;              // Associated trade ID
  parent_id?: string;            // Parent node ID
  children: string[];            // Child node IDs
  level: number;                 // Tree level
  value_at_time: number;         // Value at time of trade
  current_value: number;         // Current estimated value
}
```

### Analytics and Intelligence

#### Market Intelligence Model
```typescript
interface MarketIntelligence {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  type: IntelligenceType;        // Intelligence type
  data: IntelligenceData;        // Intelligence data
  confidence: number;            // Confidence level (0-1)
  created_at: Date;              // Intelligence timestamp
}

type IntelligenceType = 'odds_movement' | 'faab_trends' | 'trade_patterns' | 'market_efficiency';

interface IntelligenceData {
  title: string;                 // Intelligence title
  description: string;           // Intelligence description
  metrics: Record<string, number>; // Key metrics
  insights: string[];            // Key insights
  recommendations: string[];     // Recommendations
  visualizations?: VisualizationData[]; // Chart data
}

interface VisualizationData {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: any[];                   // Chart data
  x_axis?: string;               // X-axis label
  y_axis?: string;               // Y-axis label
}
```

#### Performance Metrics Model
```typescript
interface PerformanceMetrics {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to User
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  metrics: UserMetrics;          // User performance metrics
  rankings: UserRankings;        // User rankings
  created_at: Date;              // Metrics timestamp
}

interface UserMetrics {
  total_bets: number;            // Total bets placed
  winning_bets: number;          // Winning bets
  win_percentage: number;        // Win percentage
  total_wagered: number;         // Total tokens wagered
  total_won: number;             // Total tokens won
  net_profit: number;            // Net profit/loss
  roi: number;                   // Return on investment
  faab_efficiency: number;       // FAAB efficiency score
  trade_roi: number;             // Trade ROI
}

interface UserRankings {
  overall_rank: number;          // Overall league ranking
  betting_rank: number;          // Betting performance ranking
  faab_rank: number;             // FAAB efficiency ranking
  trade_rank: number;            // Trade performance ranking
  total_rankings: number;        // Total number of users
}
```

## Data Relationships

### Entity Relationship Diagram

```
Users (1) ←→ (M) Teams
Users (1) ←→ (M) TokenBalances
Users (1) ←→ (M) Bets
Users (1) ←→ (M) FAABBids
Users (1) ←→ (M) PerformanceMetrics

Leagues (1) ←→ (M) Teams
Leagues (1) ←→ (M) Matchups
Leagues (1) ←→ (M) FAABBids
Leagues (1) ←→ (M) Trades
Leagues (1) ←→ (M) MarketIntelligence

Teams (1) ←→ (M) Matchups (as team1)
Teams (1) ←→ (M) Matchups (as team2)
Teams (1) ←→ (M) Trades (as team1)
Teams (1) ←→ (M) Trades (as team2)

Matchups (1) ←→ (M) Odds
Matchups (1) ←→ (M) Bets

Bets (1) ←→ (1) TokenTransactions
```

### Key Relationships

**User-League Relationship**
- Users can be members of multiple leagues
- Each league has multiple users
- Users have different roles in different leagues

**Team-Matchup Relationship**
- Each matchup involves exactly two teams
- Teams can have multiple matchups per season
- Matchups are specific to a week and league

**Bet-Matchup Relationship**
- Users can place multiple bets on the same matchup
- Each bet is associated with exactly one matchup
- Bets can be on different market types for the same matchup

**Trade-Tree Relationship**
- Trades can be part of larger trade trees
- Trade trees track asset movement over time
- Each trade tree has a root asset and multiple nodes

## Data Validation and Constraints

### Database Constraints
```sql
-- User constraints
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT users_display_name_not_empty CHECK (length(display_name) > 0);

-- League constraints
ALTER TABLE leagues ADD CONSTRAINT leagues_espn_id_unique UNIQUE (espn_league_id);
ALTER TABLE leagues ADD CONSTRAINT leagues_season_positive CHECK (season > 0);

-- Team constraints
ALTER TABLE teams ADD CONSTRAINT teams_league_espn_unique UNIQUE (league_id, espn_team_id);
ALTER TABLE teams ADD CONSTRAINT teams_name_not_empty CHECK (length(name) > 0);

-- Matchup constraints
ALTER TABLE matchups ADD CONSTRAINT matchups_week_range CHECK (week >= 1 AND week <= 18);
ALTER TABLE matchups ADD CONSTRAINT matchups_different_teams CHECK (team1_id != team2_id);

-- Bet constraints
ALTER TABLE bets ADD CONSTRAINT bets_amount_positive CHECK (amount > 0);
ALTER TABLE bets ADD CONSTRAINT bets_odds_valid CHECK (odds != 0);

-- FAAB constraints
ALTER TABLE faab_bids ADD CONSTRAINT faab_bid_amount_positive CHECK (bid_amount > 0);
ALTER TABLE faab_bids ADD CONSTRAINT faab_week_range CHECK (week >= 1 AND week <= 18);
```

### Application-Level Validation
```typescript
// Bet validation
const validateBet = (bet: CreateBetRequest): ValidationResult => {
  const errors: string[] = [];
  
  if (bet.amount <= 0) {
    errors.push('Bet amount must be positive');
  }
  
  if (bet.amount > 1000) {
    errors.push('Bet amount cannot exceed 1000 tokens');
  }
  
  if (!['moneyline', 'spread', 'total'].includes(bet.market_type)) {
    errors.push('Invalid market type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// FAAB bid validation
const validateFAABBid = (bid: CreateFAABBidRequest): ValidationResult => {
  const errors: string[] = [];
  
  if (bid.bid_amount <= 0) {
    errors.push('Bid amount must be positive');
  }
  
  if (bid.bid_amount > 200) {
    errors.push('Bid amount cannot exceed 200 FAAB');
  }
  
  if (!bid.player_name || bid.player_name.trim().length === 0) {
    errors.push('Player name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Data Access Patterns

### Query Optimization
```sql
-- Indexes for common queries
CREATE INDEX idx_matchups_league_week ON matchups(league_id, week);
CREATE INDEX idx_bets_user_week ON bets(user_id, created_at);
CREATE INDEX idx_faab_bids_league_week ON faab_bids(league_id, week);
CREATE INDEX idx_trades_league_week ON trades(league_id, week);

-- Composite indexes for complex queries
CREATE INDEX idx_matchups_teams_week ON matchups(team1_id, team2_id, week);
CREATE INDEX idx_bets_matchup_market ON bets(matchup_id, market_type);
```

### Caching Strategy
```typescript
// Redis cache keys
const CACHE_KEYS = {
  LEAGUE_DATA: (leagueId: string, week: number) => `league:${leagueId}:week:${week}`,
  MATCHUP_ODDS: (matchupId: string) => `odds:${matchupId}`,
  USER_BALANCE: (userId: string, leagueId: string) => `balance:${userId}:${leagueId}`,
  FAAB_ANALYSIS: (leagueId: string, week: number) => `faab:${leagueId}:week:${week}`,
  TRADE_TREE: (leagueId: string) => `trades:${leagueId}`,
};

// Cache TTL values
const CACHE_TTL = {
  LEAGUE_DATA: 30,      // 30 seconds
  MATCHUP_ODDS: 30,     // 30 seconds
  USER_BALANCE: 60,     // 1 minute
  FAAB_ANALYSIS: 300,   // 5 minutes
  TRADE_TREE: 3600,     // 1 hour
};
```

---

## Source of Truth / Version

- **Creation Date:** [Current Date]
- **Last Updated:** [Current Date]
- **Next Review Date:** [Next Review Date]
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
