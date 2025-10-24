# Coding Standards

## TLDR

Standards for React/TypeScript frontend and FastAPI/Python backend. Focus on readability, consistency, and maintainability for a 1-2 developer team.

## General Principles

- **Readability First** - Self-documenting code
- **Consistency** - Follow established patterns
- **Simplicity** - Clear solutions over complex optimizations
- **Test-Driven** - Write tests before features

## Frontend (React + TypeScript)

**Structure:**
```
src/
├── components/     # UI components
├── hooks/         # Custom hooks
├── services/      # API calls
├── utils/         # Helpers
└── types/         # TypeScript types
```

**Naming:**
- Components: PascalCase (`MatchupOddsBoard`)
- Files: kebab-case (`matchup-odds-board.tsx`)
- Props: camelCase (`isLoading`, `onBetPlaced`)

**Component Structure:**
```typescript
interface Props {
  // Props interface
}

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState();
  
  const handleEvent = () => {
    // Handler logic
  };
  
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};
```

**Styling:** Tailwind CSS utility classes, mobile-first responsive design
**State:** React Query for server state, Context API for client state

## Backend (FastAPI + Python)

**Structure:**
```
backend/app/
├── api/v1/        # API routes
├── core/          # Config, security, database
├── models/        # Database models
├── services/      # Business logic
└── utils/         # Helpers
```

**Naming:**
- Functions: snake_case (`calculate_odds`)
- Classes: PascalCase (`OddsCalculator`)
- Constants: UPPER_SNAKE_CASE (`MAX_BET_AMOUNT`)

**API Route:**
```python
@router.get("/matchups/{week}", response_model=List[MatchupResponse])
async def get_week_matchups(
    week: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[MatchupResponse]:
    if week < 1 or week > 18:
        raise HTTPException(status_code=400, detail="Invalid week")
    
    matchups = await matchup_service.get_week_matchups(db, week)
    return [MatchupResponse.from_orm(matchup) for matchup in matchups]
```

## Database (PostgreSQL)

**Naming:** snake_case tables (`users`, `matchups`), foreign keys (`user_id`, `league_id`)
**Migrations:** `YYYY_MM_DD_HHMMSS_descriptive_name.sql`

## Testing

**Structure:** `tests/unit/`, `tests/integration/`, `tests/e2e/`
**Naming:** `test_should_*_when_*` functions, `Test*` classes

## Git Workflow

**Branches:** `feature/description`, `bugfix/description`, `hotfix/description`
**Commits:** `type(scope): description` (feat, fix, docs, style, refactor, test, chore)
