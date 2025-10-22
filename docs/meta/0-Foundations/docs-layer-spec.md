# Canonical Documentation Layer Specification

The authoritative specification for the `/docs` layer structure, requirements, and compliance criteria in AI-native documentation systems.

## Purpose

Establish a standardized, AI-readable documentation layer that supports the complete development lifecycle from product planning through debugging and maintenance.

## Canonical Folder Structure

```
/docs/
│
├── 0-Overview/                     # Project overview and standards
│   ├── 01-README.md                # Project introduction and navigation
│   ├── 02-glossary.md              # Project-specific terminology
│   ├── 03-architecture-overview.md # High-level system architecture
│   ├── 04-coding-standards.md      # Development standards and conventions
│   └── 05-dependency-fingerprint.md # Tool and framework version tracking
│
├── 1-Product/                      # Product planning and requirements
│   ├── 01-roadmap.md               # Product roadmap and milestones
│   ├── 02-implementation-plan.md   # Detailed step-by-step implementation plan
│   ├── features/                   # Feature-specific documentation
│   │   ├── 01-[feature-name]-prd.md    # Individual feature PRDs
│   │   └── 02-[feature-name]-analysis.md # Feature analysis and UX
│   └── analysis/                   # Product analysis and research
│       ├── 01-user-experience.md   # UX research and design decisions
│       └── 02-user-interface.md    # UI specifications and components
│
├── 2-Design/                       # Technical design and architecture
│   ├── 01-system-architecture.md   # Detailed system design
│   ├── 02-data-models.md           # Data structures and schemas
│   ├── 03-api-spec.md              # API specifications and contracts
│   ├── 04-frontend.md              # Frontend architecture and components
│   ├── 05-backend.md               # Backend services and infrastructure
│   └── 06-integrations.md          # External integrations and APIs
│
├── 3-Development/                  # Development process and tracking
│   ├── 01-changelog.md             # Version history and changes
│   ├── 02-implementation-status.md # Current implementation status
│   ├── 03-architecture-decisions.md # ADRs and technical decisions
│   ├── 04-backlog.md               # Feature backlog and prioritization
│   └── releases/                   # Release documentation
│       ├── 01-release-checklist.md # Release process and validation
│       └── 02-release-notes/       # Release notes by version
│           └── v[version]-notes.md # Individual release notes
│
├── 4-Debugging/                    # Debugging and troubleshooting
│   ├── 01-error-log.md             # Error tracking and resolution
│   ├── 02-known-issues.md          # Known issues and workarounds
│   └── 03-debug-playbook.md        # Debugging procedures and tools
│
├── 5-Prompts/                      # AI prompts and session notes
│   ├── 01-frontend-prompts.md      # Frontend development prompts
│   ├── 02-backend-prompts.md       # Backend development prompts
│   ├── 03-debugging-prompts.md     # Debugging and troubleshooting prompts
│   ├── 04-refactor-prompts.md      # Code refactoring prompts
│   └── session-notes/              # AI collaboration session notes
│       └── [date]-session.md       # Individual session documentation
│
└── _temp-archive/                  # Temporary file archive
    └── [date]-[type]-archive/      # Archived temporary files by date and type
```

## Layer Descriptions

- **0-Overview**: Establishes project context, standards, and navigation
- **1-Product**: Contains product planning, requirements, and roadmap documentation
- **2-Design**: Houses technical architecture, API specifications, and system design
- **3-Development**: Tracks development process, decisions, and release management
- **4-Debugging**: Maintains error logs, known issues, and troubleshooting procedures
- **5-Prompts**: Stores AI prompts and collaboration session documentation

## Compliance Rule

Any project documentation must conform to this layout unless superseded by a local adaptation defined in the 4-Adaptations layer. Deviations from this structure must be explicitly documented and justified.