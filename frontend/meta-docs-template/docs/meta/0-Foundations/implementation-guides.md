# Implementation Guides

Scale-specific guidance for applying the meta documentation system across different project sizes and complexities.

## Purpose

This guide helps AI agents and human operators understand how to appropriately apply the meta system framework based on project scale, ensuring optimal documentation without overwhelming smaller projects or under-serving larger ones.

## Scale Classification

### MVP Scale (3-6 months, 1-3 developers)
**Characteristics:**
- Single feature or simple application
- Small team, rapid iteration
- Limited resources and timeline
- Focus on core functionality

**Meta Components to Use:**
- Basic PRD template (Overview, Problem, Goals, Requirements)
- Simple design template (Architecture, Data Models, APIs)
- Essential AI behavior protocols
- Minimal governance (basic changelog)

**Meta Components to Skip:**
- Complex governance procedures
- Advanced chain prompts
- Detailed maintenance checklists
- Comprehensive adaptation procedures

### Startup Scale (6-18 months, 3-10 developers)
**Characteristics:**
- Multiple features, growing complexity
- Medium team, structured development
- Some process maturity
- Focus on growth and scaling

**Meta Components to Use:**
- Standard PRD template (all sections)
- Complete design template
- Core AI behavior protocols
- Basic governance (evolution guide, maintenance)
- Essential chain prompts
- Project adaptation procedures

**Meta Components to Skip:**
- Advanced governance procedures
- Complex orchestration workflows
- Detailed maintenance schedules
- Enterprise-level adaptations

### Enterprise Scale (18+ months, 10+ developers)
**Characteristics:**
- Complex system with multiple components
- Large team, formal processes
- High process maturity
- Focus on compliance and scalability

**Meta Components to Use:**
- Full meta system framework
- All governance procedures
- Complete operations layer
- All chain prompts and orchestration
- Comprehensive adaptation procedures
- Full maintenance and evolution protocols

## AI Decision Framework

### Project Scale Detection
AI should analyze these indicators to determine scale:

**Team Indicators:**
- Team size (1-3 = MVP, 4-10 = Startup, 10+ = Enterprise)
- Development timeline (3-6mo = MVP, 6-18mo = Startup, 18+mo = Enterprise)
- Process maturity (ad-hoc = MVP, some structure = Startup, formal = Enterprise)

**Complexity Indicators:**
- Feature count (1-3 = MVP, 4-10 = Startup, 10+ = Enterprise)
- Integration requirements (minimal = MVP, moderate = Startup, extensive = Enterprise)
- Compliance needs (none = MVP, basic = Startup, extensive = Enterprise)

### Component Selection Logic

**Always Include (All Scales):**
- Core philosophical principles
- Basic document templates
- Essential AI behavior protocols
- Documentation layer specification

**Scale-Dependent Selection:**
- Governance complexity (minimal → basic → comprehensive)
- Operations detail (essential → standard → advanced)
- Chain prompt usage (none → selective → comprehensive)
- Adaptation procedures (basic → standard → advanced)

## Implementation Examples

### MVP Implementation
```markdown
## Project: Simple Task Manager MVP
**Scale:** MVP (3 months, 2 developers)
**Selected Components:**
- PRD template (simplified to 4 sections)
- Basic design template (architecture + data models)
- Essential AI protocols (clarity, fidelity, error handling)
- Simple changelog maintenance

**Generated Structure:**
/docs/
├── 0-Overview/ (README, architecture)
├── 1-Product/ (PRD)
└── 2-Design/ (system design, data models)
```

### Startup Implementation
```markdown
## Project: SaaS Platform
**Scale:** Startup (12 months, 6 developers)
**Selected Components:**
- Full PRD template
- Complete design template
- Core AI behavior protocols
- Basic governance (evolution guide, maintenance)
- Essential chain prompts (generate-docs-skeleton, update-design-doc)

**Generated Structure:**
/docs/
├── 0-Overview/ (complete)
├── 1-Product/ (PRDs, roadmap)
├── 2-Design/ (complete)
├── 3-Development/ (changelog, milestones)
└── 5-Prompts/ (essential prompts)
```

### Enterprise Implementation
```markdown
## Project: Enterprise Integration Platform
**Scale:** Enterprise (24 months, 15 developers)
**Selected Components:**
- Full meta system framework
- All governance procedures
- Complete operations layer
- All chain prompts and orchestration
- Comprehensive adaptation procedures

**Generated Structure:**
/docs/ (complete 0-5 structure)
/meta/ (full meta system)
```

## Context Window Optimization

### For AI Agents
- **Load full meta system** initially to understand framework
- **Identify project scale** using classification criteria
- **Select relevant components** based on scale
- **Generate appropriate documentation** using selected components
- **Maintain constitutional compliance** regardless of scale

### For Human Operators
- **Start with MVP approach** for new projects
- **Scale up gradually** as project complexity increases
- **Use adaptation procedures** to customize for specific needs
- **Follow governance processes** for any meta system modifications

## Scaling Guidelines

### When to Scale Up
- Team size increases significantly
- Project timeline extends beyond original scope
- Compliance requirements emerge
- Process maturity improves
- Integration complexity grows

### When to Scale Down
- Project scope reduces
- Team size decreases
- Timeline becomes more aggressive
- Resources become constrained
- Simplicity becomes priority

## Validation Criteria

### MVP Scale Validation
- [ ] Core functionality documented
- [ ] Basic architecture defined
- [ ] Essential AI protocols followed
- [ ] Simple maintenance procedures in place

### Startup Scale Validation
- [ ] Complete feature documentation
- [ ] Comprehensive design coverage
- [ ] Standard AI protocols implemented
- [ ] Basic governance procedures active

### Enterprise Scale Validation
- [ ] Full meta system compliance
- [ ] Complete governance framework
- [ ] Advanced operations implemented
- [ ] Comprehensive adaptation procedures

## Documentation Lifecycle Management

### Document Status Categories
- **Active**: Currently being developed, updated, or actively referenced
- **Completed**: Feature implemented and tested, documentation finalized
- **Archived**: Feature removed or superseded, documentation preserved for historical context
- **Reference**: Static documentation (glossary, standards, templates) that rarely changes

### Working Set vs Archive Policy
- **High-Touch Documents**: Frequently accessed/updated files (changelog, session notes, active PRDs)
- **Medium-Touch Documents**: Periodically updated files (architecture docs, API specs, testing docs)
- **Low-Touch Documents**: Static reference files (glossary, standards, historical records)

### Documentation Pruning Rules
- **Feature Completion**: Move completed features to archived status, don't delete
- **Feature Removal**: Cross out removed features with strikethrough, add archive note
- **Version Cleanup**: Archive old versions when new versions are stable
- **Reference Maintenance**: Keep reference docs current but don't over-document

### Usage Index Maintenance
AI tools may automatically maintain a simple usage index for user clarity:
- Track which documents are frequently opened or updated
- Categorize documents by usage frequency (High/Medium/Low-touch)
- Provide quick navigation manifest for active project documentation
- Update index when document status changes (Active → Completed → Archived)

## Scalability Edge Cases

### Ultra-Lean Mode (Micro Projects)
For projects with <3 contributors or <5 modules:
- **Simplified Layout**: Merge design, development, and debugging sections into one "Core" folder
- **Minimal Documentation**: Essential docs only (README, basic architecture, core features)
- **Streamlined Templates**: Use simplified versions of PRD and design templates
- **Reduced Governance**: Basic changelog and session notes only

### Progressive Enhancement
As projects grow, gradually add complexity:
- **Phase 1**: Core folder with essential docs
- **Phase 2**: Separate design and development sections
- **Phase 3**: Add debugging and prompts sections
- **Phase 4**: Full meta system implementation

### Conditional Rules
- **If <5 modules**: Use simplified layout
- **If <3 contributors**: Reduce governance overhead
- **If <6 months timeline**: Focus on MVP documentation only
- **If >10 contributors**: Full meta system implementation required
