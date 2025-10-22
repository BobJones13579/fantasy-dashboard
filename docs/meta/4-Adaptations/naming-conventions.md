# Naming Conventions

Naming rules for documents, prompts, and folders with override mechanisms for project-specific customization.

## General Rules

1. **Lowercase Only** - All file and folder names must use lowercase letters
2. **Kebab-Case** - Use hyphens to separate words in multi-word names
3. **Numeric Prefixes** - Use numbered prefixes for hierarchical organization (0-Overview, 1-Product, etc.)
4. **Descriptive Names** - Names must clearly indicate content and purpose
5. **No Special Characters** - Avoid spaces, underscores, or special characters except hyphens

## Project-Level Namespace Conventions

**Documentation Files:**
- `/docs/3-Development/feature-[name].md` - Feature-specific development docs
- `/docs/1-Product/prds/[feature-name]-prd.md` - Product requirements documents
- `/docs/2-Design/[component]-design.md` - Component-specific design docs
- `/docs/4-Debugging/[issue-type]-debug.md` - Issue-specific debugging guides

**AI-Generated Files:**
- `/docs/5-Prompts/[task-type]-prompts.md` - Task-specific prompt collections
- `/docs/3-Development/[date]-session.md` - Session documentation
- `/docs/3-Development/release-notes/v[version]-notes.md` - Version-specific release notes

## AI Naming Behavior

**Automated Generation Rules:**
1. AI must follow established naming conventions when generating new files
2. Generated names must be descriptive and indicate content purpose
3. AI must use consistent naming patterns within the same project
4. Generated files must include appropriate prefixes and suffixes
5. AI must validate naming against project-specific conventions

**Naming Validation:**
- Check against project adaptation declarations
- Verify compliance with meta system standards
- Ensure uniqueness within project namespace
- Validate against existing file patterns

## Override Example

Projects may extend naming rules locally without violating hierarchy:

**Standard Convention:**
- `/docs/2-Design/api-spec.md`

**Project Override:**
- `/docs/2-Design/api-spec-internal.md` - Internal API specification
- `/docs/2-Design/api-spec-beta.md` - Beta version specification
- `/docs/2-Design/api-spec-v2.md` - Version-specific specification

**Override Declaration Required:**
```markdown
## Naming Convention Override
**Project:** [Project Name]
**Override:** Added version and environment suffixes
**Pattern:** [base-name]-[suffix].md
**Justification:** Multiple API versions and environments require distinction
**Approved By:** [Approver/Date]
```