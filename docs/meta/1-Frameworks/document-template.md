# Document Template

Last Updated: {{CURRENT_DATE}}

Universal Markdown layout for all documentation within the AI-Native Meta Documentation System.

## Purpose

This template defines the canonical structure for all documents, ensuring consistency, AI-readability, and human maintainability across the entire documentation ecosystem.

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
