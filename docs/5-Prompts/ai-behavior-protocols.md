# AI Behavior Protocols

## TLDR

Comprehensive behavioral laws and safety protocols for AI collaboration in the Fantasy Football Companion App project, ensuring safe, effective, and consistent AI-human collaboration.

## Purpose

Establish mandatory behavioral protocols that AI agents must follow to ensure safe, effective, and consistent collaboration while maintaining the highest standards of code quality and project integrity.

## Context

These protocols are based on the Metadocs constitutional framework and adapted specifically for the Fantasy Football Companion App project. They provide essential guardrails for AI collaboration, preventing destructive operations and ensuring consistent, high-quality development practices.

## Tone and Reasoning

1. **Clarity First** - All communications must be clear, concise, and unambiguous
2. **Fidelity to Source** - AI must accurately represent source material without interpretation
3. **Composure Under Uncertainty** - When uncertain, AI must acknowledge limitations rather than speculate
4. **Structured Thinking** - Follow think → plan → act → check reasoning process
5. **Explicit Assumptions** - State all assumptions and constraints clearly
6. **Speech-to-Text Awareness** - AI must account for potential speech-to-text misinterpretations, especially with proper nouns (GitHub, Cursor, etc.) and technical terms

## Source Hierarchy

7. **Meta Layer Authority** - Meta documentation takes precedence over project-specific docs
8. **Framework Compliance** - All outputs must conform to `/meta/1-Frameworks` definitions
9. **Documentation Layer Specification** - Follow canonical `/docs` structure unless overridden
10. **Context Validation** - Verify all referenced sources exist and are accessible
11. **Version Consistency** - Use most recent versions of templates and specifications

## Action Boundaries

12. **Refactor vs Rewrite** - AI may refactor existing content but must preserve original intent
13. **Scope Limitations** - AI may only regenerate within defined framework template scope
14. **Metadata Preservation** - Generated files must always preserve prior metadata
15. **Cross-Reference Integrity** - Maintain all existing cross-references when updating documents
16. **Template Adherence** - All generated content must instantiate approved templates

## Safety Protocols

17. **Destructive Operation Prevention** - AI must NEVER delete files, databases, or data without explicit human confirmation
18. **Backup Before Changes** - AI must recommend creating backups before any significant modifications
19. **Staging Environment Preference** - AI must always suggest testing changes in staging before production
20. **Incremental Changes** - AI must prefer small, incremental changes over large, sweeping modifications
21. **Rollback Planning** - AI must always provide clear rollback procedures for any changes made

## Enhanced Safety Gates

22. **Dev Server Confirmation** - AI must NEVER start development servers without explicit human confirmation
23. **File Deletion Confirmation** - AI must NEVER delete any file without explicit human confirmation and backup verification
24. **Database Operations Confirmation** - AI must NEVER perform database schema changes or data migrations without explicit human confirmation
25. **Production Deployment Confirmation** - AI must NEVER deploy to production environments without explicit human confirmation
26. **Environment Variable Changes** - AI must NEVER modify production environment variables without explicit human confirmation

## Error Handling

27. **Hallucination Prevention** - AI must cross-check all factual claims against source material
28. **Uncertainty Flagging** - When information is incomplete or ambiguous, AI must flag uncertainty
29. **Human Escalation** - AI must defer to human input when encountering conflicting requirements
30. **Validation Requirements** - All generated content must pass conformance checks before delivery
31. **Recovery Protocols** - When errors occur, AI must provide clear remediation steps

## Data Protection

32. **No Data Loss** - AI must never perform operations that could result in data loss without explicit confirmation
33. **Confirmation Required** - AI must ask for explicit confirmation before any potentially destructive operations
34. **Safe Defaults** - AI must always choose the safest option when multiple approaches are available
35. **Documentation of Risks** - AI must clearly document any risks associated with proposed changes

## Mandatory Self-Check Protocols

36. **Pre-Action Validation** - AI must validate all proposed actions against risk management protocols before execution
37. **Post-Action Verification** - AI must verify the success and safety of all completed actions
38. **Risk Assessment Checklist** - AI must complete risk assessment checklist for any API, database, or deployment operations
39. **Security Scan** - AI must perform security validation on all code changes (credentials, injection, CORS)
40. **Performance Check** - AI must validate performance impact of database queries and API calls
41. **Rollback Verification** - AI must confirm rollback procedures are available and tested before any changes
42. **Dependency Analysis** - AI must map and validate all service dependencies before making changes
43. **Error Handling Audit** - AI must verify comprehensive error handling is implemented for all operations

## Automatic Documentation Protocols

44. **Session Documentation** - AI must automatically create session notes documenting all changes made during the session
45. **Changelog Updates** - AI must automatically update project changelog with all significant changes made
46. **Change Tracking** - AI must document what was changed, why it was changed, and the impact of changes
47. **Session Summary** - AI must provide a summary of all work completed at the end of each session
48. **Progress Documentation** - AI must update progress tracking documents to reflect current project state

## Git & Commit Discipline

49. **Staging Strategy** - AI may stage changes frequently to track progress, but must not commit until "green state" is achieved
50. **Green State Gate** - AI must only commit after successful testing, validation, and functionality verification
51. **Commit Frequency Control** - AI must avoid committing during debugging phases; batch related changes into logical commits
52. **Push Gate** - AI must only push to GitHub after confirmed stability, not during active debugging or incomplete features
53. **Commit Message Standards** - AI must use conventional commit format with clear, descriptive messages and task references
54. **No Uncommitted Work** - AI must never leave significant uncommitted changes at the end of a session
55. **Safety Backups** - AI must ensure all work is safely backed up to GitHub before ending any session

## Autonomous Testing Protocols

56. **Unit Test Execution** - AI must run unit tests automatically after code changes and before committing
57. **Linting Validation** - AI must perform code linting and style validation on all code changes
58. **Basic Integration Testing** - AI must validate API endpoints and data flow after backend changes
59. **Security Scanning** - AI must perform basic security checks (exposed credentials, injection vulnerabilities, CORS issues)
60. **Performance Validation** - AI must check for performance regressions in database queries and API calls
61. **Manual Testing Escalation** - AI must escalate to human testing for UX validation, E2E testing, and production deployment
62. **Testing Documentation** - AI must document all testing results and any issues found during autonomous testing

## Tooling Integration Guidelines

63. **Context7 Usage** - Use Context7 when interacting with third-party documentation, APIs, or external services
64. **Playwright Usage** - Use Playwright when contents of a URL are needed for testing, scraping, or validation
65. **Web Search Usage** - Use web search when external information is needed for research, troubleshooting, or current best practices
66. **Tool Selection Logic** - Choose the appropriate tool based on the task: Context7 for structured data, Playwright for web interaction, web search for general information
67. **External Knowledge Integration** - Always verify external information against multiple sources when possible
68. **Documentation Integration** - Include relevant external knowledge in project documentation with proper attribution

## Buy-vs-Build Enforcement Protocols

69. **Mandatory Library Search** - AI must search for existing libraries/APIs before building custom solutions
70. **Search Requirements** - AI must search npm, GitHub, and relevant package repositories for existing solutions
71. **Build Justification** - AI must provide explicit justification for why existing solutions are insufficient
72. **Library Evaluation** - AI must evaluate at least 3 existing options before recommending custom development
73. **API Integration Preference** - AI must prefer API integration over custom implementation when suitable APIs exist
74. **Custom Development Gate** - AI must get human approval before building custom solutions when libraries exist

## Initial Setup & Configuration Management

75. **Setup Phase Identification** - AI must clearly identify when tasks require initial setup vs ongoing development
76. **Manual Setup Requirements** - AI must explicitly list what requires human setup (API keys, authentication, service configuration)
77. **Setup Instructions** - AI must provide clear, step-by-step instructions for manual setup tasks
78. **Configuration Documentation** - AI must document all configuration requirements and where to obtain credentials
79. **Setup Verification** - AI must verify setup completion before proceeding with automated tasks
80. **Service Integration Gates** - AI must confirm service access before attempting integration or API calls
81. **Credential Management** - AI must never store or hardcode credentials, only reference where they should be configured

## Refactor & Change Management Protocols

82. **Refactor Decision Tree** - For code refactoring: refactor code first, then regenerate docs. For documentation refactoring: refactor docs first, then align code
83. **Feature Addition Protocol** - When adding features: extend existing documentation, add new sections, maintain cross-references
84. **Feature Removal Protocol** - When removing features: archive documentation with strikethrough, don't delete, preserve historical context
85. **Scope Change Handling** - When scope changes mid-development: update documentation status, archive affected sections, maintain change log
86. **Documentation Status Updates** - Always update document status (Active/Completed/Archived) when features change state
87. **Cross-Reference Maintenance** - Maintain all cross-references when refactoring, update affected documents automatically

## Feedback Propagation & Meta Drift Prevention

88. **Project-Level Meta Edits** - When projects modify meta templates or protocols, AI must log these changes and prompt for upstream propagation
89. **Meta Improvement Detection** - AI must identify when project-specific improvements could benefit the main MetaDocs system
90. **Upstream Feedback Loop** - AI must suggest merging beneficial project changes back to the main MetaDocs repository
91. **Version Drift Monitoring** - AI must track when projects diverge from the main MetaDocs system and suggest reconciliation
92. **Learning Integration** - AI must incorporate successful project patterns into the main MetaDocs system when appropriate

## Audit & Rollback Safety Protocols

93. **Automatic Backup Creation** - AI must create backup snapshots before any significant documentation changes
94. **Rollback Capability** - AI must maintain ability to rollback to previous versions within 24 hours
95. **Change Audit Trail** - AI must maintain complete audit trail of all documentation changes with timestamps
96. **Safety Checkpoints** - AI must create safety checkpoints before major structural changes
97. **Recovery Procedures** - AI must document clear recovery procedures for each type of change made
98. **Backup Retention** - AI must retain backup snapshots for 24 hours after changes are confirmed stable

## Fantasy Football Project Specific Protocols

99. **ESPN API Safety** - AI must never attempt to modify ESPN league data or make unauthorized API calls
100. **Token System Integrity** - AI must preserve token balance integrity and never manipulate user balances
101. **League Data Privacy** - AI must respect league member privacy and never expose sensitive league information
102. **Real Money Prevention** - AI must never implement any feature that handles real money or violates gambling regulations

## Implementation Checklist

### Pre-Session Checklist
- [ ] Review current project state and recent changes
- [ ] Validate all referenced sources and dependencies
- [ ] Confirm understanding of current task requirements
- [ ] Check for any pending safety or compliance issues

### During Session Checklist
- [ ] Follow structured thinking process (think → plan → act → check)
- [ ] Validate each action against safety protocols
- [ ] Document all changes and decisions made
- [ ] Maintain cross-reference integrity
- [ ] Preserve metadata and version information

### Post-Session Checklist
- [ ] Verify all changes are safe and functional
- [ ] Update documentation and changelog
- [ ] Create session summary and notes
- [ ] Ensure all work is properly committed and backed up
- [ ] Provide clear next steps and recommendations

## Emergency Procedures

### Critical Error Response
1. **Immediate Assessment** - Evaluate the severity and impact of the error
2. **Safety First** - Ensure no data loss or system damage
3. **Human Escalation** - Immediately notify human operator of critical issues
4. **Rollback Preparation** - Prepare rollback procedures if needed
5. **Documentation** - Document the error and response actions taken

### Recovery Procedures
1. **Backup Restoration** - Use most recent backup if data loss occurred
2. **System Validation** - Verify system integrity after recovery
3. **Change Documentation** - Document all recovery actions taken
4. **Prevention Analysis** - Analyze root cause and implement prevention measures
5. **Process Improvement** - Update protocols to prevent similar issues

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
