# Code Refactoring Prompts

## TLDR

AI prompts and guidance for code refactoring tasks in the Fantasy Football Companion App, covering refactoring principles, opportunity identification, and implementation while maintaining code quality.

## Purpose

This document contains AI prompts and guidance for code refactoring tasks in the Fantasy Football Companion App.

## Context

These prompts are designed to help AI assistants understand refactoring principles, identify refactoring opportunities, and implement improvements while maintaining code quality and functionality.

## General Refactoring Prompts

### Code Quality Assessment
```
You are assessing code quality for refactoring in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Location: [FILE_PATH]
- Current State: [CURRENT_STATE]

Assessment Requirements:
1. **Code Analysis**
   - Analyze code structure and organization
   - Check for code smells and anti-patterns
   - Verify adherence to coding standards
   - Assess maintainability and readability

2. **Performance Analysis**
   - Check for performance bottlenecks
   - Analyze resource usage and optimization
   - Verify efficient algorithms and data structures
   - Assess scalability and efficiency

3. **Maintainability Analysis**
   - Check for code duplication and redundancy
   - Analyze complexity and coupling
   - Verify proper abstraction and modularity
   - Assess testability and documentation

4. **Refactoring Opportunities**
   - Identify specific refactoring opportunities
   - Prioritize refactoring based on impact and effort
   - Develop refactoring plan and strategy
   - Estimate refactoring effort and risk

Please assess the code quality following these requirements.
```

### Refactoring Planning
```
You are planning a refactoring effort for the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Refactoring Goals: [REFACTORING_GOALS]
- Constraints: [CONSTRAINTS]

Planning Requirements:
1. **Refactoring Strategy**
   - Define refactoring objectives and goals
   - Identify refactoring techniques and approaches
   - Plan refactoring sequence and dependencies
   - Assess refactoring risk and mitigation

2. **Impact Analysis**
   - Analyze impact on existing functionality
   - Check dependencies and integration points
   - Verify backward compatibility requirements
   - Assess testing and validation needs

3. **Implementation Plan**
   - Define refactoring steps and milestones
   - Plan testing and validation strategy
   - Schedule refactoring execution and deployment
   - Identify rollback and recovery procedures

4. **Success Criteria**
   - Define refactoring success metrics
   - Establish quality and performance benchmarks
   - Plan validation and acceptance criteria
   - Set up monitoring and feedback mechanisms

Please plan the refactoring effort following these requirements.
```

## Frontend Refactoring Prompts

### React Component Refactoring
```
You are refactoring a React component in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **Component Structure**
   - Improve component organization and structure
   - Reduce component complexity and size
   - Enhance component reusability and modularity
   - Improve component testing and maintainability

2. **State Management**
   - Optimize state management and updates
   - Reduce unnecessary re-renders and computations
   - Improve state synchronization and consistency
   - Enhance state persistence and recovery

3. **Performance Optimization**
   - Implement React optimization techniques
   - Add proper memoization and caching
   - Optimize component rendering and updates
   - Improve bundle size and loading performance

4. **Code Quality**
   - Improve code readability and documentation
   - Enhance error handling and validation
   - Add proper TypeScript types and interfaces
   - Improve accessibility and user experience

Refactoring Techniques:
- Component extraction and composition
- State management optimization
- Performance optimization (memo, useMemo, useCallback)
- Code organization and modularity
- Error handling and validation
- TypeScript improvements

Please refactor the React component following these requirements.
```

### State Management Refactoring
```
You are refactoring state management in the Fantasy Football Companion App.

Context:
- State Type: [STATE_TYPE]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **State Architecture**
   - Improve state organization and structure
   - Reduce state complexity and coupling
   - Enhance state reusability and modularity
   - Improve state testing and maintainability

2. **State Updates**
   - Optimize state update patterns and performance
   - Reduce unnecessary state updates and re-renders
   - Improve state synchronization and consistency
   - Enhance state validation and error handling

3. **State Persistence**
   - Improve state persistence and recovery
   - Enhance state synchronization across components
   - Optimize state caching and performance
   - Improve state security and validation

4. **State Management Tools**
   - Optimize React Query usage and configuration
   - Improve Context API implementation
   - Enhance state management patterns and practices
   - Improve state management testing and validation

Refactoring Techniques:
- State extraction and composition
- State update optimization
- State persistence and synchronization
- State management tool optimization
- State validation and error handling
- State testing and validation

Please refactor the state management following these requirements.
```

### API Integration Refactoring
```
You are refactoring API integration in the Fantasy Football Companion App.

Context:
- API: [API_NAME]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **API Service Layer**
   - Improve API service organization and structure
   - Reduce API service complexity and coupling
   - Enhance API service reusability and modularity
   - Improve API service testing and maintainability

2. **Data Handling**
   - Optimize data transformation and validation
   - Improve data caching and synchronization
   - Enhance data error handling and recovery
   - Improve data security and validation

3. **Error Handling**
   - Improve API error handling and user feedback
   - Enhance error recovery and fallback mechanisms
   - Optimize error logging and monitoring
   - Improve error testing and validation

4. **Performance Optimization**
   - Optimize API call patterns and performance
   - Improve request batching and optimization
   - Enhance caching strategies and implementation
   - Improve API response handling and processing

Refactoring Techniques:
- API service extraction and composition
- Data handling optimization
- Error handling improvement
- Performance optimization
- Caching and synchronization
- Testing and validation

Please refactor the API integration following these requirements.
```

## Backend Refactoring Prompts

### API Endpoint Refactoring
```
You are refactoring an API endpoint in the Fantasy Football Companion App.

Context:
- Endpoint: [ENDPOINT_NAME]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **Endpoint Structure**
   - Improve endpoint organization and structure
   - Reduce endpoint complexity and coupling
   - Enhance endpoint reusability and modularity
   - Improve endpoint testing and maintainability

2. **Business Logic**
   - Optimize business logic and validation
   - Improve business logic organization and structure
   - Enhance business logic testing and maintainability
   - Improve business logic error handling and recovery

3. **Data Processing**
   - Optimize data processing and transformation
   - Improve data validation and security
   - Enhance data error handling and recovery
   - Improve data performance and efficiency

4. **Error Handling**
   - Improve error handling and user feedback
   - Enhance error recovery and fallback mechanisms
   - Optimize error logging and monitoring
   - Improve error testing and validation

Refactoring Techniques:
- Endpoint extraction and composition
- Business logic optimization
- Data processing improvement
- Error handling enhancement
- Performance optimization
- Testing and validation

Please refactor the API endpoint following these requirements.
```

### Database Layer Refactoring
```
You are refactoring the database layer in the Fantasy Football Companion App.

Context:
- Database: [DATABASE_NAME]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **Database Models**
   - Improve model organization and structure
   - Reduce model complexity and coupling
   - Enhance model reusability and modularity
   - Improve model testing and maintainability

2. **Query Optimization**
   - Optimize database queries and performance
   - Improve query organization and structure
   - Enhance query caching and optimization
   - Improve query testing and validation

3. **Data Access**
   - Optimize data access patterns and performance
   - Improve data access organization and structure
   - Enhance data access security and validation
   - Improve data access testing and maintainability

4. **Transaction Management**
   - Improve transaction handling and management
   - Enhance transaction performance and optimization
   - Optimize transaction error handling and recovery
   - Improve transaction testing and validation

Refactoring Techniques:
- Model extraction and composition
- Query optimization
- Data access improvement
- Transaction management enhancement
- Performance optimization
- Testing and validation

Please refactor the database layer following these requirements.
```

### Service Layer Refactoring
```
You are refactoring a service layer in the Fantasy Football Companion App.

Context:
- Service: [SERVICE_NAME]
- Current Issues: [CURRENT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **Service Architecture**
   - Improve service organization and structure
   - Reduce service complexity and coupling
   - Enhance service reusability and modularity
   - Improve service testing and maintainability

2. **Business Logic**
   - Optimize business logic and validation
   - Improve business logic organization and structure
   - Enhance business logic testing and maintainability
   - Improve business logic error handling and recovery

3. **Integration Management**
   - Optimize external integration handling
   - Improve integration error handling and recovery
   - Enhance integration testing and validation
   - Improve integration performance and efficiency

4. **Dependency Management**
   - Optimize dependency injection and management
   - Improve dependency organization and structure
   - Enhance dependency testing and validation
   - Improve dependency performance and efficiency

Refactoring Techniques:
- Service extraction and composition
- Business logic optimization
- Integration management improvement
- Dependency management enhancement
- Performance optimization
- Testing and validation

Please refactor the service layer following these requirements.
```

## Performance Refactoring Prompts

### Performance Optimization
```
You are refactoring for performance optimization in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Performance Issues: [PERFORMANCE_ISSUES]
- Optimization Goals: [OPTIMIZATION_GOALS]

Optimization Requirements:
1. **Algorithm Optimization**
   - Optimize algorithms and data structures
   - Improve computational efficiency and complexity
   - Enhance algorithm performance and scalability
   - Improve algorithm testing and validation

2. **Resource Management**
   - Optimize resource usage and allocation
   - Improve resource management and cleanup
   - Enhance resource monitoring and optimization
   - Improve resource testing and validation

3. **Caching and Optimization**
   - Optimize caching strategies and implementation
   - Improve cache performance and efficiency
   - Enhance cache management and invalidation
   - Improve cache testing and validation

4. **Database Optimization**
   - Optimize database queries and performance
   - Improve database indexing and optimization
   - Enhance database connection and pooling
   - Improve database testing and validation

Optimization Techniques:
- Algorithm optimization
- Resource management improvement
- Caching and optimization
- Database optimization
- Performance monitoring
- Testing and validation

Please optimize the performance following these requirements.
```

## Code Quality Refactoring Prompts

### Code Organization Refactoring
```
You are refactoring code organization in the Fantasy Football Companion App.

Context:
- Module: [MODULE_NAME]
- Organization Issues: [ORGANIZATION_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **File and Folder Structure**
   - Improve file and folder organization
   - Reduce file complexity and size
   - Enhance file reusability and modularity
   - Improve file testing and maintainability

2. **Code Structure**
   - Improve code organization and structure
   - Reduce code complexity and coupling
   - Enhance code reusability and modularity
   - Improve code testing and maintainability

3. **Naming and Documentation**
   - Improve naming conventions and clarity
   - Enhance code documentation and comments
   - Improve code readability and understanding
   - Enhance code maintainability and support

4. **Dependencies and Imports**
   - Optimize dependency management and organization
   - Improve import organization and structure
   - Enhance dependency testing and validation
   - Improve dependency performance and efficiency

Refactoring Techniques:
- File and folder restructuring
- Code extraction and composition
- Naming and documentation improvement
- Dependency management optimization
- Code organization enhancement
- Testing and validation

Please refactor the code organization following these requirements.
```

### TypeScript Refactoring
```
You are refactoring TypeScript code in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- TypeScript Issues: [TYPESCRIPT_ISSUES]
- Refactoring Goals: [REFACTORING_GOALS]

Refactoring Requirements:
1. **Type Definitions**
   - Improve type definitions and interfaces
   - Reduce type complexity and coupling
   - Enhance type reusability and modularity
   - Improve type testing and maintainability

2. **Type Safety**
   - Improve type safety and validation
   - Enhance type checking and error handling
   - Optimize type performance and efficiency
   - Improve type testing and validation

3. **Generic Types**
   - Optimize generic type usage and implementation
   - Improve generic type organization and structure
   - Enhance generic type testing and validation
   - Improve generic type performance and efficiency

4. **Type Documentation**
   - Improve type documentation and comments
   - Enhance type readability and understanding
   - Improve type maintainability and support
   - Enhance type testing and validation

Refactoring Techniques:
- Type definition improvement
- Type safety enhancement
- Generic type optimization
- Type documentation improvement
- Type organization enhancement
- Testing and validation

Please refactor the TypeScript code following these requirements.
```

## Refactoring Best Practices

### Refactoring Principles
1. **Small Steps**: Make small, incremental changes
2. **Test Coverage**: Maintain comprehensive test coverage
3. **Backward Compatibility**: Preserve existing functionality
4. **Documentation**: Update documentation as you refactor
5. **Code Review**: Get code review for all refactoring changes
6. **Monitoring**: Monitor performance and behavior after refactoring

### Refactoring Safety
1. **Comprehensive Testing**: Test all functionality before and after refactoring
2. **Incremental Changes**: Make small, testable changes
3. **Rollback Plan**: Have a plan to rollback if issues arise
4. **Monitoring**: Monitor system behavior after refactoring
5. **Documentation**: Document all changes and their impact
6. **Communication**: Communicate refactoring changes to the team

### Refactoring Validation
1. **Functionality Testing**: Verify all functionality works correctly
2. **Performance Testing**: Ensure performance is maintained or improved
3. **Integration Testing**: Test integration with other components
4. **User Acceptance Testing**: Validate user experience is maintained
5. **Code Quality Metrics**: Verify code quality metrics are improved
6. **Documentation Review**: Ensure documentation is updated and accurate

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
