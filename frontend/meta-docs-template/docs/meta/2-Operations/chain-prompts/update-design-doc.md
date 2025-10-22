# Update Design Document

Chain prompt for updating design documentation based on new requirements or changes.

## Purpose

Update existing design documentation to reflect new requirements, changes, or clarifications while maintaining consistency and cross-reference integrity.

## Trigger Condition

- PRD updates affecting design
- Technical requirement changes
- Architecture decision modifications
- Integration requirement updates

## Input/Output Schema

**Inputs:**
- Existing design document reference
- Change requirements and scope
- Related document updates
- Validation criteria

**Outputs:**
- Updated design document
- Cross-reference updates
- Impact analysis report
- Validation verification

## Example Usage

```
Update the design document for "user-authentication" feature with the following changes:
- Source: /docs/2-Design/backend.md
- Changes: Add OAuth2 integration, update security requirements
- Dependencies: Update /docs/2-Design/api-spec.md, /docs/2-Design/integrations.md
- Validation: Ensure all cross-references remain valid and complete
```