# Backend Development Prompts

## TLDR

AI prompts and guidance for backend development tasks in the Fantasy Football Companion App.

## FastAPI Development Prompts

### API Development

#### Creating New API Endpoints
```
You are developing a FastAPI endpoint for the Fantasy Football Companion App.

Context:
- Use FastAPI with Python 3.11+
- Follow RESTful API design principles
- Use Pydantic for request/response validation
- Follow the API architecture in /docs/2-Design/backend.md

Requirements:
- Create a [ENDPOINT_NAME] endpoint that [FUNCTIONALITY]
- Use proper HTTP methods and status codes
- Implement request/response validation with Pydantic
- Add proper error handling and logging
- Include API documentation with OpenAPI
- Implement proper authentication and authorization
- Add rate limiting and validation

Please create the endpoint following these guidelines.
```

#### Updating Existing Endpoints
```
You are updating an existing FastAPI endpoint in the Fantasy Football Companion App.

Context:
- Endpoint is located at [ENDPOINT_PATH]
- Current functionality: [CURRENT_FUNCTIONALITY]
- Update requirements: [UPDATE_REQUIREMENTS]

Requirements:
- Maintain existing functionality while adding new features
- Follow established API patterns and conventions
- Update Pydantic schemas as needed
- Ensure proper error handling for new functionality
- Update API documentation
- Maintain backward compatibility where possible

Please update the endpoint following these guidelines.
```

### Database Operations

#### Database Model Development
```
You are developing a database model for the Fantasy Football Companion App.

Context:
- Use Supabase (PostgreSQL) for database
- Follow the database schema in /docs/2-Design/data-models.md
- Use SQLAlchemy for ORM operations

Requirements:
- Create a [MODEL_NAME] model that [FUNCTIONALITY]
- Use proper SQLAlchemy model definition
- Implement proper relationships and constraints
- Add proper validation and constraints
- Include proper indexing for performance
- Add proper documentation and comments

Please create the model following these guidelines.
```

#### Database Query Optimization
```
You are optimizing database queries for the Fantasy Football Companion App.

Context:
- Optimize query performance for [QUERY_TYPE]
- Use proper indexing and query patterns
- Follow the database optimization guidelines in /docs/2-Design/backend.md

Requirements:
- Optimize [QUERY_NAME] for performance
- Implement proper indexing strategies
- Use efficient query patterns
- Add proper caching where appropriate
- Implement query monitoring and logging
- Add proper error handling

Please optimize the query following these guidelines.
```

### Service Layer Development

#### Business Logic Services
```
You are developing a business logic service for the Fantasy Football Companion App.

Context:
- Implement business logic in service layer
- Follow the service architecture in /docs/2-Design/backend.md
- Use proper dependency injection and testing

Requirements:
- Create a [SERVICE_NAME] service that [FUNCTIONALITY]
- Implement proper business logic and validation
- Add proper error handling and logging
- Include proper dependency injection
- Add comprehensive unit tests
- Follow established service patterns

Please create the service following these guidelines.
```

#### Integration Services
```
You are developing an integration service for the Fantasy Football Companion App.

Context:
- Integrate with external APIs (ESPN, Supabase, etc.)
- Follow the integration architecture in /docs/2-Design/integrations.md
- Implement proper error handling and retry logic

Requirements:
- Create an [INTEGRATION_NAME] service that [FUNCTIONALITY]
- Implement proper API integration and error handling
- Add retry logic and circuit breaker patterns
- Include proper authentication and rate limiting
- Add comprehensive logging and monitoring
- Implement proper data validation and transformation

Please create the integration service following these guidelines.
```

### Authentication & Authorization

#### Authentication Implementation
```
You are implementing authentication for the Fantasy Football Companion App.

Context:
- Use Supabase Auth with JWT tokens
- Follow the authentication architecture in /docs/2-Design/backend.md
- Implement proper security measures

Requirements:
- Implement authentication for [FEATURE]
- Use JWT token validation and management
- Add proper user session management
- Implement proper security measures
- Add comprehensive logging and monitoring
- Include proper error handling

Please implement the authentication following these guidelines.
```

#### Authorization Implementation
```
You are implementing authorization for the Fantasy Football Companion App.

Context:
- Implement role-based access control
- Follow the authorization architecture in /docs/2-Design/backend.md
- Ensure proper data access controls

Requirements:
- Implement authorization for [FEATURE]
- Use role-based access control (RBAC)
- Add proper data access controls
- Implement league-based authorization
- Add comprehensive logging and monitoring
- Include proper error handling

Please implement the authorization following these guidelines.
```

### Real-Time Features

#### WebSocket Implementation
```
You are implementing WebSocket functionality for the Fantasy Football Companion App.

Context:
- Use Supabase real-time subscriptions
- Follow the real-time architecture in /docs/2-Design/backend.md
- Implement proper connection management

Requirements:
- Implement WebSocket for [FEATURE]
- Use Supabase real-time subscriptions
- Add proper connection management and monitoring
- Implement proper error handling and reconnection
- Add comprehensive logging and monitoring
- Include proper data validation and security

Please implement the WebSocket functionality following these guidelines.
```

### Caching & Performance

#### Caching Implementation
```
You are implementing caching for the Fantasy Football Companion App.

Context:
- Use Redis for caching and session storage
- Follow the caching architecture in /docs/2-Design/backend.md
- Implement proper cache invalidation strategies

Requirements:
- Implement caching for [FEATURE]
- Use Redis for caching and session storage
- Add proper cache invalidation strategies
- Implement proper cache key management
- Add comprehensive monitoring and logging
- Include proper error handling and fallbacks

Please implement the caching following these guidelines.
```

#### Performance Optimization
```
You are optimizing backend performance for the Fantasy Football Companion App.

Context:
- Optimize API performance and response times
- Follow the performance guidelines in /docs/2-Design/backend.md
- Implement proper monitoring and profiling

Requirements:
- Optimize [FEATURE] for performance
- Implement proper database query optimization
- Add proper caching strategies
- Implement proper connection pooling
- Add comprehensive monitoring and profiling
- Include proper error handling and logging

Please optimize the performance following these guidelines.
```

### Testing

#### Unit Testing
```
You are writing unit tests for the Fantasy Football Companion App backend.

Context:
- Use pytest for testing framework
- Follow the testing guidelines in /docs/2-Design/backend.md
- Test business logic and service methods

Requirements:
- Write unit tests for [COMPONENT_NAME]
- Test business logic and service methods
- Test error handling and edge cases
- Test data validation and transformation
- Add proper test coverage and documentation
- Include proper test fixtures and mocking

Please write the unit tests following these guidelines.
```

#### Integration Testing
```
You are writing integration tests for the Fantasy Football Companion App backend.

Context:
- Test API endpoints and database integration
- Use pytest for testing framework
- Follow the testing guidelines in /docs/2-Design/backend.md

Requirements:
- Write integration tests for [FEATURE]
- Test API endpoints and database integration
- Test external API integrations
- Test authentication and authorization
- Add proper test coverage and documentation
- Include proper test fixtures and mocking

Please write the integration tests following these guidelines.
```

### Error Handling & Logging

#### Error Handling Implementation
```
You are implementing error handling for the Fantasy Football Companion App backend.

Context:
- Implement comprehensive error handling and logging
- Follow the error handling guidelines in /docs/2-Design/backend.md
- Use structured logging with correlation IDs

Requirements:
- Implement error handling for [FEATURE]
- Use structured logging with correlation IDs
- Add proper error classification and handling
- Implement proper error recovery mechanisms
- Add comprehensive monitoring and alerting
- Include proper user-friendly error messages

Please implement the error handling following these guidelines.
```

#### Logging Implementation
```
You are implementing logging for the Fantasy Football Companion App backend.

Context:
- Use structured logging with correlation IDs
- Follow the logging guidelines in /docs/2-Design/backend.md
- Implement proper log levels and formatting

Requirements:
- Implement logging for [FEATURE]
- Use structured logging with correlation IDs
- Add proper log levels and formatting
- Implement proper log aggregation and analysis
- Add comprehensive monitoring and alerting
- Include proper log retention and archival

Please implement the logging following these guidelines.
```

### Security

#### Security Implementation
```
You are implementing security measures for the Fantasy Football Companion App backend.

Context:
- Implement comprehensive security measures
- Follow the security guidelines in /docs/2-Design/backend.md
- Ensure proper data protection and validation

Requirements:
- Implement security for [FEATURE]
- Add proper input validation and sanitization
- Implement proper authentication and authorization
- Add comprehensive security monitoring and logging
- Include proper error handling and recovery
- Implement proper data protection measures

Please implement the security measures following these guidelines.
```

## Development Workflow

### Code Review Checklist
- [ ] API follows RESTful design principles
- [ ] Proper error handling and logging implemented
- [ ] Authentication and authorization properly implemented
- [ ] Database queries optimized and secure
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Performance considerations addressed

### Testing Checklist
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] API tests written and passing
- [ ] Database tests written and passing
- [ ] Security tests written and passing
- [ ] Performance tests written and passing

### Deployment Checklist
- [ ] Code review completed
- [ ] Tests passing
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Ready for deployment
