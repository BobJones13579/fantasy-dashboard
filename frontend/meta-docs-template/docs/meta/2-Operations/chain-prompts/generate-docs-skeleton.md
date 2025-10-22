# Generate Docs Skeleton

Chain prompt for generating a compliant `/docs` layer structure from the documentation skeleton.

## Purpose

Generate a complete, compliant `/docs` layer structure by copying the skeleton, populating front-matter, and establishing required cross-links according to the documentation layer specification.

## Trigger Condition

- New project initialization
- Documentation structure migration
- Compliance remediation for existing projects

## Input/Output Schema

**Inputs:**
- Project context (name, description, basic information)
- Target directory path
- Documentation layer specification reference
- Skeleton source reference

**Outputs:**
- Complete `/docs` directory structure
- Populated files with proper front-matter and titles
- Required cross-references between documents
- Compliance verification report

## Example Usage

```
Generate a compliant /docs layer for project "user-auth-service" with the following context:
- Project: User Authentication Service
- Description: Microservice for user authentication and authorization
- Target: /projects/user-auth-service/docs
- Requirements: Full compliance with documentation layer specification
```