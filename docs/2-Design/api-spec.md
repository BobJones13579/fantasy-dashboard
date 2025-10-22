# API Specification

## TLDR

Comprehensive REST API specification for the Fantasy Football Companion App, defining endpoints, request/response formats, authentication, and error handling for all backend services.

## Purpose

This document defines the REST API specification for the Fantasy Football Companion App, including endpoints, request/response formats, authentication, and error handling.

## Context

The API is built using FastAPI and provides endpoints for odds calculation, betting operations, FAAB analysis, trade tracking, and user management. All endpoints support real-time updates and are designed for mobile-first consumption.

## Base Configuration

### Base URL
```
Production: https://api.fantasy-companion.app/v1
Development: http://localhost:8000/v1
```

### Authentication
All endpoints require authentication using JWT tokens from Supabase Auth.

```http
Authorization: Bearer <jwt_token>
```

### Content Type
All requests and responses use JSON format.

```http
Content-Type: application/json
Accept: application/json
```

### Rate Limiting
- **General endpoints**: 100 requests per minute per user
- **Real-time endpoints**: 200 requests per minute per user
- **Betting endpoints**: 50 requests per minute per user

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "amount",
      "reason": "Must be a positive integer"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **429**: Rate Limited
- **500**: Internal Server Error
- **503**: Service Unavailable

## Core Endpoints

### Authentication

#### POST /auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "display_name": "John Doe"
  }
}
```

#### POST /auth/refresh
Refresh JWT token.

**Request:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "access_token": "new_jwt_token_here",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### League Management

#### GET /leagues
Get all leagues for the authenticated user.

**Response:**
```json
{
  "leagues": [
    {
      "id": "league_123",
      "name": "League TB12",
      "espn_league_id": "637913",
      "season": 2024,
      "status": "active",
      "member_count": 10,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /leagues/{league_id}
Get specific league details.

**Response:**
```json
{
  "id": "league_123",
  "name": "League TB12",
  "espn_league_id": "637913",
  "season": 2024,
  "settings": {
    "scoring_type": "ppr",
    "roster_size": 9,
    "bench_size": 7,
    "faab_budget": 200
  },
  "teams": [
    {
      "id": "team_123",
      "name": "Team Alpha",
      "owner": {
        "id": "user_123",
        "display_name": "John Doe"
      },
      "record": {
        "wins": 8,
        "losses": 4,
        "points_for": 1250.5
      }
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Matchups and Odds

#### GET /leagues/{league_id}/matchups
Get all matchups for a league.

**Query Parameters:**
- `week` (optional): Week number (1-18)
- `status` (optional): Matchup status filter

**Response:**
```json
{
  "matchups": [
    {
      "id": "matchup_123",
      "week": 5,
      "team1": {
        "id": "team_123",
        "name": "Team Alpha",
        "score": 125.5,
        "projected_score": 128.2
      },
      "team2": {
        "id": "team_456",
        "name": "Team Beta",
        "score": 118.3,
        "projected_score": 115.8
      },
      "status": "in_progress",
      "odds": {
        "moneyline": {
          "team1_odds": -150,
          "team2_odds": +130,
          "team1_probability": 0.60,
          "team2_probability": 0.40
        },
        "spread": {
          "spread": -3.5,
          "team1_odds": -110,
          "team2_odds": -110
        },
        "total": {
          "total": 244.0,
          "over_odds": -110,
          "under_odds": -110
        }
      },
      "last_updated": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /matchups/{matchup_id}/odds
Get detailed odds for a specific matchup.

**Response:**
```json
{
  "matchup_id": "matchup_123",
  "odds": {
    "moneyline": {
      "team1_odds": -150,
      "team2_odds": +130,
      "team1_probability": 0.60,
      "team2_probability": 0.40,
      "confidence": 0.85
    },
    "spread": {
      "spread": -3.5,
      "team1_odds": -110,
      "team2_odds": -110,
      "team1_probability": 0.52,
      "team2_probability": 0.48
    },
    "total": {
      "total": 244.0,
      "over_odds": -110,
      "under_odds": -110,
      "over_probability": 0.51,
      "under_probability": 0.49
    }
  },
  "market_intelligence": {
    "upset_alert": false,
    "market_efficiency": 0.92,
    "volume": "high",
    "movement": "stable"
  },
  "last_updated": "2024-01-15T10:30:00Z"
}
```

#### GET /matchups/{matchup_id}/odds/history
Get odds history for a matchup.

**Query Parameters:**
- `hours` (optional): Number of hours of history (default: 24)

**Response:**
```json
{
  "matchup_id": "matchup_123",
  "history": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "moneyline": {
        "team1_odds": -140,
        "team2_odds": +120
      },
      "spread": {
        "spread": -3.0,
        "team1_odds": -110,
        "team2_odds": -110
      },
      "total": {
        "total": 242.5,
        "over_odds": -110,
        "under_odds": -110
      }
    }
  ]
}
```

### Betting Operations

#### GET /users/{user_id}/bets
Get user's betting history.

**Query Parameters:**
- `league_id` (optional): Filter by league
- `week` (optional): Filter by week
- `status` (optional): Filter by bet status
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "bets": [
    {
      "id": "bet_123",
      "matchup_id": "matchup_123",
      "market_type": "moneyline",
      "selection": "team1",
      "odds": -150,
      "amount": 100,
      "potential_payout": 166,
      "status": "pending",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

#### POST /bets
Place a new bet.

**Request:**
```json
{
  "matchup_id": "matchup_123",
  "market_type": "moneyline",
  "selection": "team1",
  "amount": 100
}
```

**Response:**
```json
{
  "id": "bet_123",
  "matchup_id": "matchup_123",
  "market_type": "moneyline",
  "selection": "team1",
  "odds": -150,
  "amount": 100,
  "potential_payout": 166,
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### GET /users/{user_id}/token-balance
Get user's token balance.

**Response:**
```json
{
  "user_id": "user_123",
  "league_id": "league_123",
  "week": 5,
  "balance": 850,
  "weekly_allocation": 1000,
  "spent_this_week": 150,
  "won_this_week": 0,
  "transactions": [
    {
      "id": "txn_123",
      "type": "weekly_allocation",
      "amount": 1000,
      "description": "Weekly token allocation",
      "created_at": "2024-01-15T00:00:00Z"
    },
    {
      "id": "txn_124",
      "type": "bet_placed",
      "amount": -100,
      "description": "Bet placed on Team Alpha moneyline",
      "bet_id": "bet_123",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### FAAB Analysis

#### GET /leagues/{league_id}/faab/analysis
Get FAAB analysis for a league.

**Query Parameters:**
- `week` (optional): Week number (default: current week)

**Response:**
```json
{
  "league_id": "league_123",
  "week": 5,
  "market_analysis": {
    "total_faab_spent": 1250,
    "average_bid": 45.2,
    "highest_bid": 95,
    "market_inflation": 1.15,
    "position_demand": {
      "RB": "high",
      "WR": "medium",
      "QB": "low",
      "TE": "low"
    }
  },
  "recommendations": [
    {
      "player_name": "Tyler Boyd",
      "position": "WR",
      "recommended_bid": {
        "conservative": 15,
        "recommended": 22,
        "aggressive": 35,
        "confidence": 0.85
      },
      "market_intelligence": {
        "similar_players": [
          {
            "name": "Brandin Cooks",
            "week": 3,
            "winning_bid": 18,
            "performance_after": 12.5
          }
        ],
        "position_trends": "WR market is heating up due to injuries"
      }
    }
  ],
  "efficiency_metrics": [
    {
      "user_id": "user_123",
      "display_name": "John Doe",
      "efficiency_score": 0.78,
      "total_spent": 150,
      "value_received": 117,
      "rank": 3
    }
  ]
}
```

#### GET /leagues/{league_id}/faab/history
Get FAAB bid history for a league.

**Query Parameters:**
- `weeks` (optional): Number of weeks of history (default: 8)
- `position` (optional): Filter by position

**Response:**
```json
{
  "league_id": "league_123",
  "history": [
    {
      "week": 5,
      "bids": [
        {
          "player_name": "Tyler Boyd",
          "position": "WR",
          "bid_amount": 45,
          "winning_bid": true,
          "bidder": "John Doe",
          "market_average": 38,
          "created_at": "2024-01-15T10:00:00Z"
        }
      ],
      "market_summary": {
        "total_bids": 15,
        "total_faab_spent": 650,
        "average_bid": 43.3
      }
    }
  ]
}
```

### Trade Analysis

#### GET /leagues/{league_id}/trades
Get trade history for a league.

**Query Parameters:**
- `weeks` (optional): Number of weeks of history (default: 8)
- `team_id` (optional): Filter by team

**Response:**
```json
{
  "league_id": "league_123",
  "trades": [
    {
      "id": "trade_123",
      "week": 5,
      "team1": {
        "id": "team_123",
        "name": "Team Alpha",
        "assets": [
          {
            "type": "player",
            "name": "Deebo Samuel",
            "position": "WR",
            "value": 45
          }
        ]
      },
      "team2": {
        "id": "team_456",
        "name": "Team Beta",
        "assets": [
          {
            "type": "player",
            "name": "Justin Fields",
            "position": "QB",
            "value": 42
          },
          {
            "type": "draft_pick",
            "name": "2024 3rd Round Pick",
            "value": 8
          }
        ]
      },
      "status": "approved",
      "value_analysis": {
        "team1_total_value": 45,
        "team2_total_value": 50,
        "value_difference": 5,
        "fairness_rating": 0.90,
        "grade": "A-"
      },
      "created_at": "2024-01-15T10:00:00Z",
      "approved_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

#### GET /leagues/{league_id}/trade-trees
Get trade tree visualization data.

**Response:**
```json
{
  "league_id": "league_123",
  "trees": [
    {
      "id": "tree_123",
      "root_asset": {
        "type": "draft_pick",
        "name": "2023 1st Round Pick",
        "value": 25
      },
      "nodes": [
        {
          "id": "node_1",
          "asset": {
            "type": "draft_pick",
            "name": "2023 1st Round Pick",
            "value": 25
          },
          "trade_id": "trade_123",
          "level": 0,
          "value_at_time": 25,
          "current_value": 25
        },
        {
          "id": "node_2",
          "asset": {
            "type": "player",
            "name": "Deebo Samuel",
            "position": "WR",
            "value": 45
          },
          "trade_id": "trade_124",
          "parent_id": "node_1",
          "level": 1,
          "value_at_time": 45,
          "current_value": 42
        }
      ],
      "depth": 2,
      "total_trades": 2
    }
  ]
}
```

### Real-Time Updates

#### WebSocket Connection
Connect to real-time updates via WebSocket.

**Connection URL:**
```
wss://api.fantasy-companion.app/ws?token=<jwt_token>
```

**Message Types:**

**Odds Update:**
```json
{
  "type": "odds_update",
  "data": {
    "matchup_id": "matchup_123",
    "odds": {
      "moneyline": {
        "team1_odds": -155,
        "team2_odds": +135
      }
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Bet Settlement:**
```json
{
  "type": "bet_settled",
  "data": {
    "bet_id": "bet_123",
    "user_id": "user_123",
    "outcome": "win",
    "payout": 166,
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

**Upset Alert:**
```json
{
  "type": "upset_alert",
  "data": {
    "matchup_id": "matchup_123",
    "message": "Team Beta is outperforming projections by 15.2 points",
    "confidence": 0.85,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Response Formats

### Pagination
All list endpoints support pagination.

```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "has_more": true,
    "next_offset": 50
  }
}
```

### Timestamps
All timestamps are in ISO 8601 format with UTC timezone.

```
2024-01-15T10:30:00Z
```

### Currency and Numbers
- Token amounts are integers (no decimals)
- Odds are integers (e.g., -150, +130)
- Probabilities are decimals (0.0 to 1.0)
- Scores and projections are decimals with 1 decimal place

## Rate Limiting

### Headers
Rate limiting information is included in response headers.

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Exceeded Limit Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "retry_after": 60
  }
}
```

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
