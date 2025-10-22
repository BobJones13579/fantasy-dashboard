# Generation Rules

Deterministic generation logic, naming conventions, and overwrite policies for AI documentation operations.

## File Generation Rules

1. **Template Compliance** - All generated files must conform to `/meta/1-Frameworks` definitions
2. **Metadata Preservation** - Generated files must always preserve prior metadata and version information
3. **Scope Limitations** - AI may only regenerate within the defined scope of a framework template
4. **Naming Conventions** - Follow established naming patterns: kebab-case for files, numbered prefixes for folders
5. **Cross-Reference Integrity** - Maintain all existing cross-references when updating documents

## Versioning and Overwrite Policies

6. **Version Tracking** - All generated content must include creation and update timestamps
7. **Incremental Updates** - Prefer incremental updates over complete rewrites when possible
8. **Backup Preservation** - Create backup copies before major structural changes
9. **Change Documentation** - Document all changes in changelog and version history
10. **Rollback Capability** - Maintain ability to rollback to previous versions

## Content Generation Standards

11. **Source Attribution** - All generated content must trace back to source materials
12. **Template Instantiation** - Every document must instantiate an approved template
13. **Validation Requirements** - All outputs must pass conformance checks before delivery
14. **Quality Gates** - Generated content must meet minimum quality standards
15. **Completeness Verification** - Ensure all required sections and cross-references are present

## Safety and Risk Management

16. **Destructive Operation Prevention** - AI must NEVER delete files, databases, or data without explicit human confirmation
17. **Backup Requirements** - AI must recommend creating backups before any significant modifications
18. **Staging First** - AI must always suggest testing changes in staging before production deployment
19. **Incremental Approach** - AI must prefer small, incremental changes over large, sweeping modifications
20. **Confirmation Gates** - AI must ask for explicit confirmation before any potentially destructive operations

## Error Handling and Recovery

21. **Failure Detection** - Identify and flag incomplete or invalid generated content
22. **Recovery Procedures** - Provide clear steps for addressing generation failures
23. **Partial Success Handling** - Handle cases where only some outputs are successfully generated
24. **Human Escalation** - Defer to human input when automated generation cannot proceed
25. **Audit Trail** - Maintain complete audit trail of all generation attempts and outcomes

## Date and Metadata Insertion Rules

26. **Automatic Date Stamping** - All new or regenerated documentation must include a `Last Updated:` line filled with the current system date
27. **Date Source** - AI must run `date` command to get current date—NEVER use training data dates or guess dates
28. **Existing Date Preservation** - Check for existing `Last Updated:` lines before inserting; update existing dates rather than duplicating
29. **Meta Layer Exclusion** - Do not apply automatic date stamping to meta-layer files (those under `/meta/`)
30. **Date Format** - Use consistent date format (YYYY-MM-DD) across all generated documentation

## Manual Step Callout Convention

31. **Callout Preservation** - AI must preserve any block beginning with "> ⚠️ Manual Step Required:" and never modify or remove these blocks automatically
32. **Human-Only Tasks** - These callouts designate human-verified tasks only and must not be automated
33. **Callout Format** - Follow the established format: description, responsible person, verification checkbox
34. **Callout Placement** - Place manual step callouts in appropriate sections (deployment, testing, validation, etc.)

## File Organization and Naming Rules

35. **Numbered File Naming** - All generated documentation files must use numbered prefixes (01-, 02-, etc.) for logical ordering
36. **Usage-Based Ordering** - Files should be ordered by frequency of use (most-used files first)
37. **Folder Structure Compliance** - All generated documentation must follow the enhanced folder structure with numbered files
38. **TLDR Requirement** - Every generated document must include a TLDR section for quick understanding
39. **Phase-Based Approach** - Use phases and feature rollouts instead of timelines in all documentation
40. **Conciseness Enforcement** - Keep documentation focused on building the app, avoid business metrics unless directly relevant

## Context Window Discipline

41. **Minimal Context Loading** - AI must load only the minimal subset of meta + docs necessary for each operation, not the entire tree
42. **Operation-Specific Context** - Different operations should load different context sets (e.g., testing operations don't need design docs)
43. **Context Relevance Validation** - AI must validate that loaded context is directly relevant to the current task
44. **Context Size Monitoring** - AI must monitor context window usage and optimize when approaching limits
45. **Lazy Loading Strategy** - Load additional context only when needed, not preemptively

## Temporary File Lifecycle Management

46. **Temporary File Identification** - AI must clearly mark temporary files (debug logs, partial builds, test outputs) with appropriate naming
47. **Auto-Archive Protocol** - AI must automatically archive temporary files older than 7 days to `/docs/_temp-archive/`
48. **Cleanup Schedule** - AI must perform daily cleanup of temporary files and weekly archive maintenance
49. **Temporary File Types** - Include debug logs, partial builds, test outputs, temporary documentation drafts
50. **Archive Retention** - Maintain archived temporary files for 30 days before permanent deletion

## Setup & Configuration Documentation

51. **Setup Phase Documentation** - AI must clearly document what requires manual setup vs automated configuration
52. **Manual Setup Instructions** - AI must provide step-by-step instructions for all manual setup requirements
53. **Configuration Requirements** - AI must list all API keys, credentials, and configuration needed
54. **Service Integration Setup** - AI must document setup requirements for external services (databases, APIs, deployment platforms)
55. **Setup Verification Steps** - AI must include verification steps to confirm setup completion