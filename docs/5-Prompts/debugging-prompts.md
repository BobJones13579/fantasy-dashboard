# Debugging and Troubleshooting Prompts

## TLDR

AI prompts and guidance for debugging and troubleshooting issues in the Fantasy Football Companion App, providing systematic approaches to identify root causes and implement solutions.

## Purpose

This document contains AI prompts and guidance for debugging and troubleshooting issues in the Fantasy Football Companion App.

## Context

These prompts are designed to help AI assistants systematically debug issues, identify root causes, and implement solutions following established debugging procedures.

## General Debugging Prompts

### Issue Investigation
```
You are debugging an issue in the Fantasy Football Companion App.

Context:
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]
- Timeline: [TIMELINE]

Debugging Process:
1. **Gather Information**
   - Collect error logs and stack traces
   - Identify affected components and users
   - Determine issue scope and impact
   - Check system health and performance metrics

2. **Reproduce Issue**
   - Attempt to reproduce the issue
   - Identify steps to reproduce
   - Test in different environments
   - Verify issue consistency

3. **Analyze Root Cause**
   - Review code changes and deployments
   - Check database and API status
   - Analyze error patterns and trends
   - Identify potential causes

4. **Implement Solution**
   - Develop fix or workaround
   - Test solution thoroughly
   - Deploy fix with proper monitoring
   - Verify issue resolution

5. **Document and Learn**
   - Update error log and known issues
   - Document root cause and solution
   - Identify prevention measures
   - Share lessons learned

Please follow this debugging process to resolve the issue.
```

### Error Analysis
```
You are analyzing an error in the Fantasy Football Companion App.

Context:
- Error: [ERROR_DESCRIPTION]
- Stack Trace: [STACK_TRACE]
- Environment: [ENVIRONMENT]
- User Impact: [USER_IMPACT]

Analysis Requirements:
1. **Error Classification**
   - Categorize error type (authentication, database, API, etc.)
   - Determine severity level (critical, high, medium, low)
   - Identify affected components and users
   - Assess business impact

2. **Root Cause Analysis**
   - Analyze error patterns and trends
   - Review recent code changes and deployments
   - Check system dependencies and integrations
   - Identify underlying causes

3. **Impact Assessment**
   - Determine user impact and scope
   - Assess system performance impact
   - Evaluate data integrity concerns
   - Identify security implications

4. **Solution Planning**
   - Develop immediate fix or workaround
   - Plan long-term solution
   - Identify prevention measures
   - Estimate implementation effort

Please analyze the error following these requirements.
```

## Frontend Debugging Prompts

### React Component Issues
```
You are debugging a React component issue in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Component Analysis**
   - Check component props and state
   - Verify component lifecycle and hooks
   - Analyze component rendering and updates
   - Check for memory leaks or performance issues

2. **State Management**
   - Verify state updates and synchronization
   - Check React Query cache and invalidation
   - Analyze context state and updates
   - Verify state persistence and recovery

3. **Event Handling**
   - Check event handlers and callbacks
   - Verify event propagation and bubbling
   - Analyze user interaction handling
   - Check for event listener cleanup

4. **Performance Issues**
   - Analyze component re-renders
   - Check for unnecessary computations
   - Verify memoization and optimization
   - Analyze bundle size and loading

5. **Browser Compatibility**
   - Test in different browsers
   - Check for JavaScript errors
   - Verify CSS compatibility
   - Test responsive design

Please debug the React component following these steps.
```

### API Integration Issues
```
You are debugging API integration issues in the Fantasy Football Companion App.

Context:
- API: [API_NAME]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **API Connection**
   - Verify API endpoint and authentication
   - Check network connectivity and CORS
   - Analyze request/response headers
   - Verify API rate limiting and quotas

2. **Data Handling**
   - Check request/response data format
   - Verify data validation and transformation
   - Analyze error handling and fallbacks
   - Check data caching and synchronization

3. **Error Handling**
   - Analyze error responses and status codes
   - Check error handling and user feedback
   - Verify retry logic and fallbacks
   - Analyze error logging and monitoring

4. **Performance Issues**
   - Check API response times
   - Analyze request batching and optimization
   - Verify caching strategies
   - Check for unnecessary API calls

Please debug the API integration following these steps.
```

## Backend Debugging Prompts

### API Endpoint Issues
```
You are debugging an API endpoint issue in the Fantasy Football Companion App.

Context:
- Endpoint: [ENDPOINT_NAME]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Request Analysis**
   - Verify request format and validation
   - Check authentication and authorization
   - Analyze request parameters and body
   - Verify rate limiting and quotas

2. **Business Logic**
   - Check business logic and validation
   - Verify data processing and transformation
   - Analyze error handling and recovery
   - Check for race conditions and concurrency

3. **Database Operations**
   - Verify database connections and queries
   - Check data integrity and constraints
   - Analyze query performance and optimization
   - Verify transaction handling and rollbacks

4. **External Integrations**
   - Check external API calls and responses
   - Verify integration error handling
   - Analyze data synchronization and consistency
   - Check for integration failures and timeouts

5. **Performance Issues**
   - Analyze response times and throughput
   - Check for memory leaks and resource usage
   - Verify caching and optimization
   - Analyze system load and scalability

Please debug the API endpoint following these steps.
```

### Database Issues
```
You are debugging database issues in the Fantasy Football Companion App.

Context:
- Database: [DATABASE_NAME]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Connection Issues**
   - Verify database connectivity and configuration
   - Check connection pooling and limits
   - Analyze connection timeouts and retries
   - Verify database server status and health

2. **Query Performance**
   - Analyze slow queries and execution plans
   - Check indexing and query optimization
   - Verify query caching and performance
   - Analyze database load and resource usage

3. **Data Integrity**
   - Check data consistency and constraints
   - Verify transaction handling and isolation
   - Analyze data corruption and recovery
   - Check for data synchronization issues

4. **Migration Issues**
   - Verify migration scripts and execution
   - Check schema changes and compatibility
   - Analyze data migration and transformation
   - Verify rollback procedures and testing

Please debug the database issues following these steps.
```

## Real-Time Debugging Prompts

### WebSocket Issues
```
You are debugging WebSocket issues in the Fantasy Football Companion App.

Context:
- WebSocket: [WEBSOCKET_NAME]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Connection Management**
   - Verify WebSocket connection establishment
   - Check connection state and lifecycle
   - Analyze connection drops and reconnection
   - Verify connection cleanup and resource management

2. **Message Handling**
   - Check message format and validation
   - Verify message routing and delivery
   - Analyze message queuing and buffering
   - Check for message loss and duplication

3. **Error Handling**
   - Analyze connection errors and recovery
   - Check error handling and user feedback
   - Verify fallback mechanisms and polling
   - Analyze error logging and monitoring

4. **Performance Issues**
   - Check connection limits and scalability
   - Analyze message throughput and latency
   - Verify resource usage and optimization
   - Check for memory leaks and performance

Please debug the WebSocket issues following these steps.
```

### Real-Time Data Issues
```
You are debugging real-time data issues in the Fantasy Football Companion App.

Context:
- Data Type: [DATA_TYPE]
- Issue: [ISSUE_DESCRIPTION]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Data Synchronization**
   - Verify data source and updates
   - Check data transformation and validation
   - Analyze data consistency and integrity
   - Verify data caching and synchronization

2. **Update Mechanisms**
   - Check real-time update triggers
   - Verify update frequency and timing
   - Analyze update batching and optimization
   - Check for update conflicts and resolution

3. **Client-Side Handling**
   - Verify client-side data processing
   - Check state updates and synchronization
   - Analyze UI updates and rendering
   - Verify error handling and fallbacks

4. **Performance Issues**
   - Check update frequency and load
   - Analyze data processing and optimization
   - Verify resource usage and scalability
   - Check for performance bottlenecks

Please debug the real-time data issues following these steps.
```

## Performance Debugging Prompts

### Performance Analysis
```
You are debugging performance issues in the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Issue: [PERFORMANCE_ISSUE]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]

Debugging Steps:
1. **Performance Profiling**
   - Analyze performance metrics and benchmarks
   - Check response times and throughput
   - Verify resource usage and optimization
   - Analyze performance trends and patterns

2. **Bottleneck Identification**
   - Identify performance bottlenecks and hotspots
   - Check database queries and optimization
   - Analyze API calls and network performance
   - Verify client-side performance and rendering

3. **Optimization Strategies**
   - Implement caching and optimization
   - Check database indexing and query optimization
   - Analyze code optimization and refactoring
   - Verify resource management and cleanup

4. **Monitoring and Alerting**
   - Set up performance monitoring and alerting
   - Check performance metrics and thresholds
   - Analyze performance trends and anomalies
   - Verify performance testing and validation

Please debug the performance issues following these steps.
```

## Security Debugging Prompts

### Security Issues
```
You are debugging security issues in the Fantasy Football Companion App.

Context:
- Issue: [SECURITY_ISSUE]
- Symptoms: [SYMPTOMS]
- Environment: [ENVIRONMENT]
- Impact: [SECURITY_IMPACT]

Debugging Steps:
1. **Security Assessment**
   - Analyze security vulnerability and impact
   - Check authentication and authorization
   - Verify data protection and encryption
   - Analyze access controls and permissions

2. **Attack Vector Analysis**
   - Identify potential attack vectors and methods
   - Check for security vulnerabilities and exploits
   - Analyze security logs and monitoring
   - Verify security controls and measures

3. **Incident Response**
   - Implement immediate security measures
   - Check for data breaches and exposure
   - Analyze security impact and scope
   - Verify security recovery and remediation

4. **Prevention Measures**
   - Implement security fixes and patches
   - Check security testing and validation
   - Analyze security monitoring and alerting
   - Verify security best practices and compliance

Please debug the security issues following these steps.
```

## Debugging Tools and Techniques

### Log Analysis
```
You are analyzing logs to debug an issue in the Fantasy Football Companion App.

Context:
- Issue: [ISSUE_DESCRIPTION]
- Logs: [LOG_DATA]
- Environment: [ENVIRONMENT]

Analysis Requirements:
1. **Log Parsing**
   - Parse and structure log data
   - Identify error patterns and trends
   - Check log levels and severity
   - Analyze log correlation and timing

2. **Error Identification**
   - Identify specific errors and exceptions
   - Check error frequency and patterns
   - Analyze error context and environment
   - Verify error impact and scope

3. **Root Cause Analysis**
   - Analyze error sequences and dependencies
   - Check system state and configuration
   - Verify error triggers and conditions
   - Identify underlying causes

4. **Solution Development**
   - Develop fixes based on log analysis
   - Check solution testing and validation
   - Analyze solution impact and scope
   - Verify solution deployment and monitoring

Please analyze the logs following these requirements.
```

### Monitoring and Alerting
```
You are setting up monitoring and alerting for the Fantasy Football Companion App.

Context:
- Component: [COMPONENT_NAME]
- Metrics: [METRICS_TO_MONITOR]
- Environment: [ENVIRONMENT]

Setup Requirements:
1. **Metric Collection**
   - Set up performance and health metrics
   - Check system and application metrics
   - Verify custom metrics and logging
   - Analyze metric aggregation and storage

2. **Alerting Configuration**
   - Configure alert thresholds and conditions
   - Check alert routing and notification
   - Verify alert escalation and response
   - Analyze alert frequency and noise

3. **Dashboard Setup**
   - Create monitoring dashboards and views
   - Check metric visualization and analysis
   - Verify dashboard accessibility and sharing
   - Analyze dashboard performance and usability

4. **Response Procedures**
   - Set up incident response procedures
   - Check alert handling and resolution
   - Verify escalation and communication
   - Analyze response time and effectiveness

Please set up monitoring and alerting following these requirements.
```

## Debugging Best Practices

### Systematic Approach
1. **Gather Information**: Collect all relevant data and context
2. **Reproduce Issue**: Attempt to reproduce the issue consistently
3. **Analyze Root Cause**: Identify the underlying cause of the issue
4. **Develop Solution**: Create a fix or workaround for the issue
5. **Test Solution**: Thoroughly test the solution before deployment
6. **Deploy and Monitor**: Deploy the solution with proper monitoring
7. **Document and Learn**: Document the issue and lessons learned

### Prevention Strategies
1. **Comprehensive Testing**: Implement thorough testing at all levels
2. **Monitoring and Alerting**: Set up proactive monitoring and alerting
3. **Code Quality**: Maintain high code quality and standards
4. **Documentation**: Keep documentation up to date and comprehensive
5. **Knowledge Sharing**: Share debugging knowledge and best practices
6. **Continuous Improvement**: Continuously improve debugging processes

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
