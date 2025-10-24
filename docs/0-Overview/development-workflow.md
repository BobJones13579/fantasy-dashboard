# Development Workflow

## TLDR

Development workflow requirements for testing, building, committing, and pushing changes to the Fantasy Football Companion App.

## Testing Requirements

- **Unit Tests**: Write tests for all business logic and services
- **Integration Tests**: Test API endpoints and database operations
- **End-to-End Tests**: Test complete user workflows
- **Manual Testing**: Verify functionality in browser and mobile

## Building Requirements

- **Frontend**: `npm run build` must complete without errors
- **Backend**: `uvicorn app.main:app` must start successfully
- **Database**: All migrations must apply cleanly
- **Dependencies**: All packages must install without conflicts

## Committing Requirements

- **Conventional Commits**: Use `feat:`, `fix:`, `docs:`, `refactor:` prefixes
- **Descriptive Messages**: Clear description of changes made
- **Atomic Commits**: Each commit should represent a single logical change
- **No Broken Code**: Never commit code that breaks the build

## Pushing Requirements

- **All Tests Pass**: Ensure all tests pass before pushing
- **Build Success**: Verify build completes successfully
- **Documentation Updated**: Update relevant documentation
- **Code Review**: Have changes reviewed if working with others

## Workflow Process

1. **Make Changes**: Implement feature or fix
2. **Test Changes**: Run tests and verify functionality
3. **Build Project**: Ensure build completes successfully
4. **Commit Changes**: Use conventional commit format
5. **Push to GitHub**: Push changes to remote repository

## Quality Gates

- **No Linting Errors**: Code must pass all linting checks
- **No Type Errors**: TypeScript must compile without errors
- **No Test Failures**: All tests must pass
- **No Build Errors**: Project must build successfully
