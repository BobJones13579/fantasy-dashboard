---
title: "Meta Documentation System"
purpose: "Main entry point and navigation for the AI-native documentation meta system."
audience: "AI + human"
status: "draft"
version: "0.1.0"
last_updated: "2024-12-19"
---

# Meta Documentation System

The "Constitution" for AI-native, vibe-coding projects that governs how documentation is written, generated, and maintained by AI and humans.

## ⚠️ CRITICAL: AI Safety Protocols

**Before using this meta system with AI agents, you MUST read:**
- **[AI Behavior Protocols](./2-Operations/ai-behavior-protocols.md)** - Mandatory behavioral laws and safety protocols
- **[Risk Management](./2-Operations/risk-management.md)** - Essential guardrails for preventing catastrophes

These documents contain **constitutional requirements** that AI agents must follow to ensure safe, reliable development practices.

## Overview

This meta system provides a reusable framework for creating and maintaining documentation in AI-native development environments. It establishes standards, templates, and processes that enable effective collaboration between AI agents and human developers.

**Key Features:**
- **Tool-agnostic** - Works with any documentation tool or AI platform
- **Markdown-based** - Pure Markdown for universal compatibility
- **Version-controlled** - Docs-as-code approach with full traceability
- **AI-readable** - Structured for reliable AI parsing and generation
- **Modular** - Lean, focused documents with clear cross-references

## Folder Map

- **0-Foundations/** - Core principles & philosophy (system kernel) - defines the laws of documentation and collaboration
- **1-Frameworks/** - Document templates & blueprints - provides reusable blueprints for new documents
- **2-Operations/** - AI automation & orchestration logic - executes generation, orchestration, and AI behavior logic
- **3-Governance/** - System self-maintenance & evolution - maintains and evolves the meta system over time
- **4-Adaptations/** - Project-specific overrides (local configs) - applies project-specific customizations and overrides

## How to Use This Meta System

1. **Start with Foundations** - Understand the core principles and laws of documentation
2. **Use Frameworks** - Apply document templates and blueprints for consistent structure
3. **Follow Operations** - Execute automated documentation workflows and AI behaviors
4. **Maintain with Governance** - Evolve and maintain the meta system over time
5. **Adapt Locally** - Apply project-specific customizations and overrides

## Boot Order

The meta system can be used to generate a complete documentation layer:

**Foundations → Frameworks → Operations**

1. **Read the specification** - Start with [Documentation Layer Specification](./0-Foundations/docs-layer-spec.md)
2. **Use the templates** - Apply templates from [Frameworks](./1-Frameworks/) to your project
3. **Generate automatically** - Run [Generate Docs Skeleton](./2-Operations/chain-prompts/generate-docs-skeleton.md) chain prompt

## Quick Start for New Repos

1. Copy the entire `/meta` folder to your new repository
2. Review and adapt files in `/meta/4-Adaptations/` for your project
3. Begin using templates from `/meta/1-Frameworks/` for new documentation
4. Set up AI agents to follow the patterns in `/meta/2-Operations/`

## Constitutional Flow

This meta system follows a logical progression from universal laws to local customizations:

**Constitution → Laws → Execution → Oversight → Local Customization**

## References

- [Document Template](./1-Frameworks/document-template.md) - Universal structure and standards
- [Definitions](./0-Foundations/definitions.md) - File types, formats, and conceptual definitions
- [AI Behavior Protocols](./2-Operations/ai-behavior-protocols.md) - AI collaboration behavioral laws
- [Glossary of Meta Terms](./0-Foundations/glossary-of-meta-terms.md) - Key terminology definitions
- [Philosophy](./0-Foundations/philosophy.md) - Core principles and rationale
- [Documentation Layer Specification](./0-Foundations/docs-layer-spec.md) - Canonical /docs structure and requirements
- [Frameworks](./1-Frameworks/) - Template library and document blueprints
- [Generate Docs Skeleton](./2-Operations/chain-prompts/generate-docs-skeleton.md) - Automated /docs generation

## Update & Review

- Last updated: 2024-12-19
- Next review: 2025-01-19
- Maintained by: AI Documentation Architect

## Change Log Pointer

See [/meta/3-Governance/meta-changelog.md](./3-Governance/meta-changelog.md) for version history and changes to the meta system itself.
