# Dependency Fingerprint Template

Last Updated: {{CURRENT_DATE}}

Template for tracking tool and framework versions to prevent documentation drift.

## TLDR

Automated version tracking for all project dependencies to ensure documentation stays current with tool evolution.

## Purpose

This template creates a dependency fingerprint that tracks versions of tools, frameworks, and services used in the project. AI agents can use this to detect when documentation references outdated versions and suggest updates.

## Project Dependencies

### Core Framework Versions
```json
{
  "frontend": {
    "framework": "React",
    "version": "18.2.0",
    "last_checked": "2024-12-19",
    "docs_version": "18.2.0"
  },
  "backend": {
    "framework": "Node.js",
    "version": "20.10.0",
    "last_checked": "2024-12-19",
    "docs_version": "20.10.0"
  },
  "database": {
    "service": "Supabase",
    "version": "2.4.0",
    "last_checked": "2024-12-19",
    "docs_version": "2.1.0"
  }
}
```

### Development Tools
```json
{
  "build_tools": {
    "bundler": "Vite",
    "version": "5.0.0",
    "last_checked": "2024-12-19"
  },
  "deployment": {
    "platform": "Vercel",
    "version": "latest",
    "last_checked": "2024-12-19"
  },
  "testing": {
    "framework": "Jest",
    "version": "29.7.0",
    "last_checked": "2024-12-19"
  }
}
```

### External Services
```json
{
  "apis": {
    "payment": "Stripe",
    "version": "2023-10-16",
    "last_checked": "2024-12-19"
  },
  "auth": {
    "provider": "Auth0",
    "version": "2.0.0",
    "last_checked": "2024-12-19"
  }
}
```

## Version Drift Detection

### Automated Checks
- [ ] **Weekly Version Check** - AI checks for new versions of tracked dependencies
- [ ] **Documentation Sync** - AI verifies docs reference current versions
- [ ] **Breaking Change Detection** - AI identifies when version updates require doc changes
- [ ] **Migration Guidance** - AI suggests documentation updates for version upgrades

### Manual Review Triggers
- [ ] **Major Version Updates** - Human review required for major version changes
- [ ] **Breaking Changes** - Human review required for breaking API changes
- [ ] **Security Updates** - Human review required for security-related updates

## Update Protocol

### When New Versions Detected
1. **Version Check** - AI identifies new versions available
2. **Impact Assessment** - AI determines if docs need updates
3. **Update Suggestion** - AI suggests specific documentation changes
4. **Human Approval** - Human reviews and approves updates
5. **Documentation Update** - AI updates relevant documentation sections
6. **Fingerprint Update** - AI updates version tracking

### Documentation Update Triggers
- API endpoint changes
- Configuration format changes
- New features or capabilities
- Deprecated functionality
- Security updates

## Maintenance Schedule

### Automated Tasks
- **Daily**: Check for critical security updates
- **Weekly**: Check for minor version updates
- **Monthly**: Comprehensive version audit
- **Quarterly**: Full dependency review and cleanup

### Manual Tasks
- **As Needed**: Review and approve major version updates
- **Quarterly**: Review overall dependency strategy
- **Annually**: Evaluate dependency necessity and alternatives

---

**Usage**: AI agents should automatically maintain this fingerprint and use it to ensure documentation stays current with tool evolution. This prevents silent documentation drift and ensures accuracy.
