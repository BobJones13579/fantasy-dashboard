# Frameworks

The Frameworks layer defines how documents, prompts, and workflows are structured within the AI-Native Meta Documentation System. This layer serves as the "template law" of the system, providing reusable blueprints that ensure consistency and AI-interpretability across all documentation.

## Purpose

Frameworks contains a small, powerful library of universal templates and blueprints that act as the structural foundation for all future projects. These templates define the canonical formats for documents, prompts, and workflows, enabling AI agents to generate consistent, high-quality documentation while maintaining human readability and maintainability.

## Template Library

- **[Document Template](document-template.md)** - Universal Markdown layout for all documentation
- **[PRD Template](prd-template.md)** - Product Requirements Document structure and format
- **[Design Template](design-template.md)** - Technical design and architecture documentation blueprint
- **[Prompt Template](prompt-template.md)** - Canonical AI prompt structure and format
- **[Testing Template](testing-template.md)** - QA and verification document structure
- **[Roadmap Tracker Template](roadmap-tracker-template.md)** - Central tracking document for project roadmap and progress
- **[Implementation Plan Template](implementation-plan-template.md)** - Detailed step-by-step implementation plan for features and phases
- **[Dependency Fingerprint Template](dependency-fingerprint-template.md)** - Tool and framework version tracking for documentation drift prevention

## Usage Rule

All project documentation and prompts must instantiate one of these templates unless overridden by a local adaptation defined in the 4-Adaptations layer. These templates serve as the authoritative reference for AI agents when generating or updating project documentation.