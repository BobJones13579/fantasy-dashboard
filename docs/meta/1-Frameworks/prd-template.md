# PRD Template

Last Updated: {{CURRENT_DATE}}

Canonical Product Requirements Document format for AI-native development projects.

## TLDR

One-sentence summary of what this feature does and why it's needed

## Overview

High-level summary of the feature or product capability being defined

## Problem Statement

Clear articulation of the problem this feature addresses and why it matters

## Goals & Success Criteria

Technical objectives and implementation criteria (avoid business metrics unless directly relevant to building the app)

## Functional Requirements

Detailed functional specifications and user stories that define what the feature must do

## Dependencies

External systems, components, or other features that this feature depends on

## Risks

Identified risks, constraints, and mitigation strategies

## Implementation Notes

Technical considerations, assumptions, and guidance for implementation teams

## Buy-vs-Build Analysis

### Library-First Evaluation
- **Existing Solutions**: Research and evaluate existing libraries, APIs, or services that could fulfill requirements
- **Cost-Benefit Analysis**: Compare building vs buying vs integrating existing solutions
- **Dependency Assessment**: Evaluate the impact and maintenance burden of external dependencies
- **Integration Complexity**: Assess the effort required to integrate with existing solutions

### Recommended Approach
- **Prefer Proven Solutions**: Use established libraries and services over custom implementations
- **API Integration**: Leverage third-party APIs for complex functionality (ML, data processing, external services)
- **Custom Development**: Only build custom solutions when no suitable existing options are available
- **Hybrid Approach**: Combine existing solutions with custom development as needed

> ⚠️ Manual Step Required: [Library evaluation and selection decisions]
> Responsible: [Name]  
> Verified: [ ]