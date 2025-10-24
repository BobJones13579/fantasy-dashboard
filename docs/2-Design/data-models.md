# Data Models

## TLDR

Data models, schemas, and relationships for the Fantasy Football Companion App, defining how data is structured and stored.

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
  season: number;                // Season year
  settings: LeagueSettings;      // League configuration
  created_at: Date;              // League creation timestamp
}

interface LeagueSettings {
  scoring_type: 'standard' | 'ppr' | 'half_ppr';
  roster_size: number;
  bench_size: number;
  faab_budget: number;
  trade_deadline: Date;
}
```

### Team Management

#### Team Model
```typescript
interface Team {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  espn_team_id: string;          // ESPN team identifier
  name: string;                  // Team name
  owner_id: string;              // Foreign key to User
  roster: Player[];              // Current roster
  created_at: Date;              // Team creation timestamp
}

interface Player {
  id: string;                    // UUID primary key
  espn_player_id: string;        // ESPN player identifier
  name: string;                  // Player name
  position: string;              // Player position
  team: string;                  // NFL team
  status: 'active' | 'injured' | 'suspended';
}
```

### Betting System

#### Token Balance Model
```typescript
interface TokenBalance {
  id: string;                    // UUID primary key
  team_id: string;               // Foreign key to Team
  week: number;                  // Week number
  starting_balance: number;      // Starting balance (1000)
  current_balance: number;       // Current balance
  weekly_used: number;           // Tokens used this week
  created_at: Date;              // Balance creation timestamp
  updated_at: Date;              // Last update timestamp
}
```

#### Bet Model
```typescript
interface Bet {
  id: string;                    // UUID primary key
  team_id: string;               // Foreign key to Team
  matchup_id: string;            // Foreign key to Matchup
  bet_type: 'moneyline' | 'spread' | 'total' | 'prop';
  bet_amount: number;            // Tokens wagered
  odds: number;                  // Betting odds
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  created_at: Date;              // Bet placement timestamp
  settled_at?: Date;             // Bet settlement timestamp
}
```

### Matchup System

#### Matchup Model
```typescript
interface Matchup {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  week: number;                  // Week number
  home_team_id: string;          // Foreign key to Team
  away_team_id: string;          // Foreign key to Team
  home_score?: number;           // Home team score
  away_score?: number;           // Away team score
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: Date;              // Matchup creation timestamp
  updated_at: Date;              // Last update timestamp
}
```

#### Odds Model
```typescript
interface Odds {
  id: string;                    // UUID primary key
  matchup_id: string;            // Foreign key to Matchup
  home_odds: number;             // Home team odds
  away_odds: number;             // Away team odds
  home_probability: number;      // Home team win probability
  away_probability: number;      // Away team win probability
  last_updated: Date;            // Last odds update timestamp
}
```

### FAAB Analysis

#### FAAB Bid Model
```typescript
interface FAABBid {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  team_id: string;               // Foreign key to Team
  player_id: string;             // Foreign key to Player
  bid_amount: number;            // Bid amount
  week: number;                  // Week of bid
  status: 'pending' | 'won' | 'lost';
  created_at: Date;              // Bid timestamp
}
```

### Trade Analysis

#### Trade Model
```typescript
interface Trade {
  id: string;                    // UUID primary key
  league_id: string;             // Foreign key to League
  team1_id: string;              // Foreign key to Team
  team2_id: string;              // Foreign key to Team
  team1_players: string[];       // Array of player IDs
  team2_players: string[];       // Array of player IDs
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;              // Trade creation timestamp
  approved_at?: Date;            // Trade approval timestamp
}
```

## Database Relationships

### Primary Relationships
- **User** → **Team** (1:1) - Each user owns one team per league
- **League** → **Team** (1:many) - Each league has multiple teams
- **Team** → **TokenBalance** (1:many) - Each team has weekly token balances
- **Team** → **Bet** (1:many) - Each team can place multiple bets
- **Matchup** → **Odds** (1:1) - Each matchup has current odds
- **Matchup** → **Bet** (1:many) - Each matchup can have multiple bets

### Indexing Strategy
- **Primary Keys**: All tables use UUID primary keys
- **Foreign Keys**: Indexed for join performance
- **Frequent Queries**: Index on week, status, created_at
- **Real-time Updates**: Index on last_updated for odds

## Data Validation

### Input Validation
- **Email**: Valid email format required
- **Token Amounts**: Positive integers only
- **Odds**: Decimal format with reasonable ranges
- **Dates**: ISO 8601 format with timezone

### Business Rules
- **Token Balance**: Cannot go negative
- **Bet Amount**: Must be ≤ current token balance
- **Odds**: Must be positive and reasonable
- **Matchup**: Teams cannot play themselves