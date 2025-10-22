# Coding Standards and Conventions

## TLDR

Comprehensive coding standards, conventions, and best practices for the Fantasy Football Companion App development team, ensuring code consistency, maintainability, and quality across the entire codebase.

## Purpose

This document establishes coding standards, conventions, and best practices for the Fantasy Football Companion App development team. These standards ensure code consistency, maintainability, and quality across the entire codebase.

## Context

These standards apply to all code written for the Fantasy Football Companion App, including frontend (React.js), backend (FastAPI/Python), database (PostgreSQL), and configuration files. They are designed to support a small development team (1-2 developers) while maintaining professional code quality.

## General Principles

### Code Quality
- **Readability First** - Code should be self-documenting and easy to understand
- **Consistency** - Follow established patterns and conventions throughout the codebase
- **Simplicity** - Prefer simple, clear solutions over complex optimizations
- **Maintainability** - Write code that is easy to modify and extend
- **Documentation** - Include clear comments and documentation for complex logic

### Development Practices
- **Test-Driven Development** - Write tests before implementing features
- **Incremental Development** - Make small, focused changes with frequent commits
- **Code Reviews** - All code changes must be reviewed before merging
- **Continuous Integration** - Automated testing and deployment on every commit
- **Version Control** - Use conventional commit format with descriptive messages

## Frontend Standards (React.js)

### File and Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── hooks/               # Custom React hooks
├── services/            # API calls and external services
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── styles/              # Global styles and themes
```

### Component Standards

**Component Structure**
```typescript
// Component imports
import React from 'react';
import { ComponentProps } from './types';

// Component definition
interface Props {
  // Props interface
}

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

**Naming Conventions**
- Components: PascalCase (e.g., `MatchupOddsBoard`)
- Files: kebab-case (e.g., `matchup-odds-board.tsx`)
- Props: camelCase (e.g., `isLoading`, `onBetPlaced`)
- State variables: camelCase (e.g., `userBalance`, `currentOdds`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_BET_AMOUNT`)

**Component Guidelines**
- Use functional components with hooks
- Keep components small and focused (max 200 lines)
- Extract complex logic into custom hooks
- Use TypeScript for all components
- Include PropTypes or TypeScript interfaces
- Use meaningful component and prop names

### Styling Standards

**Tailwind CSS Guidelines**
- Use Tailwind utility classes for styling
- Create custom components for repeated patterns
- Use responsive design utilities (sm:, md:, lg:)
- Follow mobile-first approach
- Use consistent spacing and color schemes

**CSS Class Naming**
```css
/* Component-specific classes */
.matchup-odds-board { }
.matchup-odds-board__header { }
.matchup-odds-board__content { }
.matchup-odds-board--loading { }

/* Utility classes */
.text-primary { }
.bg-secondary { }
.mobile-only { }
.desktop-only { }
```

### State Management

**React Query for Server State**
```typescript
// API calls with React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['matchups', week],
  queryFn: () => fetchMatchups(week),
  staleTime: 30000, // 30 seconds
});
```

**Context API for Client State**
```typescript
// Global state with Context
const AppContext = createContext<AppState | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

## Backend Standards (FastAPI/Python)

### File and Folder Structure

```
backend/
├── app/
│   ├── api/             # API route handlers
│   │   ├── v1/          # API version 1
│   │   └── dependencies.py
│   ├── core/            # Core application logic
│   │   ├── config.py    # Configuration settings
│   │   ├── security.py  # Authentication and security
│   │   └── database.py  # Database connection
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── main.py          # Application entry point
├── tests/               # Test files
└── requirements.txt     # Python dependencies
```

### Code Standards

**Function and Variable Naming**
- Functions: snake_case (e.g., `calculate_odds`, `fetch_league_data`)
- Variables: snake_case (e.g., `user_balance`, `current_week`)
- Classes: PascalCase (e.g., `OddsCalculator`, `FAABAnalyzer`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_BET_AMOUNT`, `DEFAULT_TOKENS`)

**Function Structure**
```python
def calculate_matchup_odds(team1: Team, team2: Team, week: int) -> OddsResult:
    """
    Calculate moneyline odds for a fantasy football matchup.
    
    Args:
        team1: First team in the matchup
        team2: Second team in the matchup
        week: Current week number
        
    Returns:
        OddsResult containing moneyline odds and probabilities
        
    Raises:
        ValueError: If team data is invalid
        APIError: If ESPN API call fails
    """
    # Input validation
    if not team1 or not team2:
        raise ValueError("Both teams must be provided")
    
    # Business logic
    team1_projection = team1.get_projected_points(week)
    team2_projection = team2.get_projected_points(week)
    
    # Calculate odds
    odds = calculate_moneyline_odds(team1_projection, team2_projection)
    
    return OddsResult(
        team1_odds=odds.team1,
        team2_odds=odds.team2,
        team1_probability=odds.team1_prob,
        team2_probability=odds.team2_prob
    )
```

### API Standards

**FastAPI Route Structure**
```python
@router.get("/matchups/{week}", response_model=List[MatchupResponse])
async def get_week_matchups(
    week: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[MatchupResponse]:
    """
    Get all matchups for a specific week.
    
    Args:
        week: Week number (1-18)
        current_user: Authenticated user
        db: Database session
        
    Returns:
        List of matchup data with odds
        
    Raises:
        HTTPException: If week is invalid or data not found
    """
    # Input validation
    if week < 1 or week > 18:
        raise HTTPException(
            status_code=400,
            detail="Week must be between 1 and 18"
        )
    
    # Business logic
    matchups = await matchup_service.get_week_matchups(db, week)
    
    return [MatchupResponse.from_orm(matchup) for matchup in matchups]
```

**Error Handling**
```python
# Custom exception classes
class FantasyAPIError(Exception):
    """Base exception for fantasy API errors"""
    pass

class ESPNAPIError(FantasyAPIError):
    """ESPN API specific errors"""
    pass

# Error handling in routes
@router.exception_handler(ESPNAPIError)
async def espn_api_error_handler(request: Request, exc: ESPNAPIError):
    return JSONResponse(
        status_code=503,
        content={"detail": "ESPN API temporarily unavailable"}
    )
```

## Database Standards (PostgreSQL)

### Schema Naming Conventions

**Tables**
- Use snake_case with descriptive names
- Use plural nouns (e.g., `users`, `matchups`, `bets`)
- Include table prefixes for related data (e.g., `faab_bids`, `trade_history`)

**Columns**
- Use snake_case with descriptive names
- Include foreign key suffixes (e.g., `user_id`, `league_id`)
- Use consistent naming for common fields (e.g., `created_at`, `updated_at`)

**Indexes**
- Use descriptive names with table prefix
- Include column names in index name (e.g., `idx_users_email`, `idx_bets_user_week`)

### Migration Standards

**Migration File Naming**
```
YYYY_MM_DD_HHMMSS_descriptive_name.sql
```

**Migration Structure**
```sql
-- Migration: Add user token balance tracking
-- Created: 2024-01-15 10:30:00
-- Description: Add token_balance column to users table

BEGIN;

-- Add new column
ALTER TABLE users ADD COLUMN token_balance INTEGER DEFAULT 1000;

-- Add index for performance
CREATE INDEX idx_users_token_balance ON users(token_balance);

-- Update existing users
UPDATE users SET token_balance = 1000 WHERE token_balance IS NULL;

COMMIT;
```

## Testing Standards

### Test Structure

**Test File Organization**
```
tests/
├── unit/                # Unit tests
│   ├── test_odds_calculator.py
│   └── test_faab_analyzer.py
├── integration/         # Integration tests
│   ├── test_api_endpoints.py
│   └── test_database_operations.py
└── e2e/                 # End-to-end tests
    └── test_user_flows.py
```

**Test Naming**
- Test files: `test_*.py`
- Test functions: `test_should_*_when_*` (e.g., `test_should_calculate_odds_when_teams_provided`)
- Test classes: `Test*` (e.g., `TestOddsCalculator`)

**Test Structure**
```python
def test_should_calculate_odds_when_teams_provided():
    """Test that odds are calculated correctly for valid team data."""
    # Arrange
    team1 = Team(projected_points=120.0)
    team2 = Team(projected_points=100.0)
    
    # Act
    result = calculate_matchup_odds(team1, team2, week=1)
    
    # Assert
    assert result.team1_odds < 0  # Favorite has negative odds
    assert result.team2_odds > 0  # Underdog has positive odds
    assert result.team1_probability > 0.5  # Favorite has >50% chance
```

## Documentation Standards

### Code Documentation

**Function Documentation**
```python
def calculate_faab_recommendation(
    player: Player, 
    league_id: int, 
    week: int
) -> FAABRecommendation:
    """
    Calculate FAAB bid recommendation for a player.
    
    This function analyzes historical bid data and league behavior
    to provide optimal bid recommendations for waiver wire pickups.
    
    Args:
        player: Player object with position and projection data
        league_id: Unique identifier for the fantasy league
        week: Current week number for context
        
    Returns:
        FAABRecommendation containing:
        - recommended_bid: Suggested bid amount
        - aggressive_bid: Higher bid for guaranteed win
        - value_bid: Lower bid for potential value
        - confidence: Confidence level (0.0-1.0)
        
    Raises:
        ValueError: If player data is invalid
        LeagueNotFoundError: If league_id doesn't exist
        InsufficientDataError: If not enough historical data
        
    Example:
        >>> player = Player(name="Tyler Boyd", position="WR", projection=12.5)
        >>> rec = calculate_faab_recommendation(player, 637913, 5)
        >>> print(f"Recommended bid: ${rec.recommended_bid}")
        Recommended bid: $18
    """
```

### README Standards

**Project README Structure**
```markdown
# Project Name

Brief description of what the project does.

## Quick Start

1. Installation steps
2. Configuration
3. Running the application

## Development

- Setup instructions
- Testing
- Contributing guidelines

## API Documentation

- Endpoint documentation
- Authentication
- Rate limiting

## Deployment

- Environment setup
- Production deployment
- Monitoring
```

## Version Control Standards

### Git Workflow

**Branch Naming**
- Feature branches: `feature/description` (e.g., `feature/odds-calculator`)
- Bug fixes: `bugfix/description` (e.g., `bugfix/token-balance-sync`)
- Hotfixes: `hotfix/description` (e.g., `hotfix/api-timeout`)

**Commit Message Format**
```
type(scope): description

[optional body]

[optional footer]
```

**Commit Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

**Commit Examples**
```
feat(odds): add Monte Carlo simulation for matchup odds

- Implement 10,000 iteration simulation
- Add confidence interval calculations
- Include historical variance modeling

Closes #123
```

```
fix(api): resolve ESPN API timeout issues

- Increase timeout to 30 seconds
- Add retry logic with exponential backoff
- Improve error handling for network issues

Fixes #456
```

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
