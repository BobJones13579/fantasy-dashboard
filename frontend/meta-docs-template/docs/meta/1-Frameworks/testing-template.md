# Testing Template

Last Updated: {{CURRENT_DATE}}

Minimal template for QA and verification documents across codebases and prompt systems.

## Purpose

Define the scope and objectives of testing activities

## Test Scope

What is being tested and what is explicitly out of scope

## Test Cases

Specific test scenarios, inputs, expected outputs, and validation criteria

## Results Summary

Test execution results, pass/fail status, and key findings

## Next Steps

Follow-up actions, remediation plans, and recommendations based on test results

## Testing Hierarchy

### Autonomous Testing (AI Handles)
- **Unit Tests**: Automated code validation and function testing
- **Linting**: Code style and syntax validation
- **Basic Integration**: API endpoint validation and data flow testing
- **Security Scanning**: Basic vulnerability checks (credentials, injection, CORS)
- **Performance Validation**: Basic performance metrics and regression checks

### Manual Testing (Human Required)
- **User Experience Testing**: UI/UX validation and user journey testing
- **End-to-End Testing**: Complete workflow validation
- **Production Deployment**: Live environment testing and validation
- **Security Review**: Comprehensive security assessment
- **Business Logic Validation**: Complex business rule verification

> ⚠️ Manual Step Required: [Specific manual testing tasks]
> Responsible: [Name]  
> Verified: [ ]

## Manual Triage Test Checklist

### Feature-Phase Unblock Testing
Use this checklist when manually testing to unblock feature development:

- [ ] **Core Functionality**: Does the main feature work as expected?
- [ ] **User Interface**: Are all UI elements rendering correctly?
- [ ] **Data Flow**: Is data being passed correctly between components?
- [ ] **Error Handling**: Are errors being caught and displayed appropriately?
- [ ] **Performance**: Is the feature performing within acceptable limits?
- [ ] **Integration**: Does the feature integrate properly with existing systems?
- [ ] **Edge Cases**: Do edge cases and error conditions work as expected?

### Quick Validation Protocol
- [ ] **Smoke Test**: Basic functionality works end-to-end
- [ ] **Regression Check**: Existing features still work
- [ ] **Performance Check**: No significant performance degradation
- [ ] **Security Check**: No obvious security vulnerabilities
- [ ] **Documentation Check**: Feature is properly documented

**Result**: [ ] Ready for next phase [ ] Needs fixes [ ] Blocked