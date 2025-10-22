# Universal Document Template

## TLDR

Standardized template for all documentation within the Fantasy Football Companion App project, ensuring consistency, AI-readability, and human maintainability.

## Purpose

This template defines the canonical structure for all documents, ensuring consistency, AI-readability, and human maintainability across the entire documentation ecosystem.

## Context

All documents in the Fantasy Football Companion App project must follow this template to ensure consistency, proper AI collaboration, and maintainable documentation standards.

## Universal Document Structure

### Title
Single H1 header with clear, descriptive document name

### TLDR
One-sentence summary for quick understanding (required for all documents)

### Purpose
Brief statement of the document's objective and scope

### Context
Background information and dependencies required to understand the document

### Body
Structured sections with clear hierarchical organization:
- Use H2 for major sections
- Use H3 for subsections
- Maintain logical flow from high-level concepts to detailed implementation
- Include code blocks, tables, and examples as needed

### Source of Truth / Version
Document metadata including:
- Creation date
- Last updated date
- Next review date
- Status (Draft/Review/Approved)
- Maintainer information
- Version number

### Manual Step Callouts (Optional)
For human-verified tasks, use this format:
```
> ⚠️ Manual Step Required: [short description]  
> Responsible: [Name]  
> Verified: [ ]
```

Example:
```
> ⚠️ Manual Step Required: Deploy to production environment
> Responsible: Jimmy Xu  
> Verified: [ ]
```

## Usage Rules

**Who writes it**: Document authors (human or AI) following this template structure

**How AI regenerates it**: AI agents use this template to ensure consistent document generation and updates

**Where it lives**: Documents instantiate this template in the appropriate `/docs/X-Y` layer according to the Documentation Layer Specification

## Conciseness Guidelines

**Verbosity Control**: Keep documentation concise and focused on building the app
- Avoid repetitive information across files
- Focus on technical implementation, not business metrics
- Use phases/feature rollouts instead of timelines
- Include only information that helps AI build the application
- Remove unnecessary business context unless directly relevant to implementation

## Human Readability Requirements

**Summary for Humans**: Every AI-generated document must end with a natural-language summary section
- **Purpose**: Provide human-readable overview of the document's key points
- **Format**: 2-3 sentences explaining what the document covers and why it matters
- **Audience**: Written for human developers, not AI agents
- **Placement**: Always at the end of the document, before references
- **Content**: Focus on practical implications and next steps for human readers

## Template Examples

### Example 1: Technical Specification
```markdown
# API Endpoint Specification

## TLDR
Defines the REST API endpoints for the Fantasy Football Companion App backend services.

## Purpose
Provide comprehensive specification for all API endpoints, including request/response formats, authentication, and error handling.

## Context
This specification is used by frontend developers and AI agents to understand how to interact with the backend services.

## Endpoints
[Detailed endpoint specifications]

## Source of Truth / Version
- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
```

### Example 2: Product Requirements
```markdown
# Feature Name - Product Requirements Document

## TLDR
Defines the requirements and specifications for [feature name] in the Fantasy Football Companion App.

## Purpose
Establish clear requirements, success criteria, and implementation guidelines for [feature name].

## Context
This PRD is part of the Phase X development plan and depends on [list dependencies].

## Requirements
[Detailed requirements]

## Source of Truth / Version
- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Draft
- **Maintainer:** Development Team
- **Version:** 1.0.0
```

## Compliance Checklist

### Required Elements
- [ ] H1 title with clear, descriptive name
- [ ] TLDR section with one-sentence summary
- [ ] Purpose section with objective statement
- [ ] Context section with background information
- [ ] Structured body with clear hierarchy
- [ ] Source of Truth / Version metadata
- [ ] Proper cross-references (if applicable)
- [ ] Manual step callouts (if applicable)

### Quality Standards
- [ ] Clear, concise writing
- [ ] Consistent formatting
- [ ] Proper code blocks and examples
- [ ] Accurate cross-references
- [ ] Complete metadata
- [ ] Human-readable summary

## Validation Procedures

### AI Validation
- Check for required sections
- Validate template compliance
- Verify cross-references
- Confirm metadata completeness

### Human Validation
- Review content accuracy
- Check for clarity and completeness
- Validate technical accuracy
- Confirm business requirements

---

## Source of Truth / Version

- **Creation Date:** 2024-01-15
- **Last Updated:** 2024-01-15
- **Next Review Date:** 2024-01-22
- **Status:** Active
- **Maintainer:** Development Team
- **Version:** 1.0.0
