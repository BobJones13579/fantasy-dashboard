# Refresh Context Slice

Chain prompt for refreshing a specific slice of documentation context using MCPs.

## Purpose

Refresh and update a specific portion of documentation context to ensure accuracy and completeness across the documentation system.

## Trigger Condition

- Context staleness detected
- Source document updates
- Cross-reference validation failures
- Manual refresh requests

## Input/Output Schema

**Inputs:**
- Context slice identifier
- Source document references
- Refresh scope and requirements
- Validation criteria

**Outputs:**
- Updated context slice
- Validation report
- Cross-reference verification
- Staleness resolution summary

## Example Usage

```
Refresh the context slice for "user-authentication" feature with the following scope:
- Source: /docs/1-Product/prds/user-auth-prd.md
- Dependencies: /docs/2-Design/api-spec.md, /docs/2-Design/backend.md
- Validation: Check cross-references and update timestamps
- Output: Updated context slice with verification report
```