# Task Management

Structured approach to breaking down complex features into manageable, verifiable tasks for AI-assisted development.

## Purpose

This document defines how to decompose complex features into hierarchical, verifiable tasks that AI agents can execute systematically while maintaining quality and safety standards.

## Task Breakdown Structure

### Hierarchical Task Format
```markdown
## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description with specific deliverable]
  - [ ] 1.2 [Sub-task description with specific deliverable]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description with specific deliverable]
```

### Task Requirements
1. **Specific Deliverables** - Each task must have a clear, testable outcome
2. **Verification Criteria** - Each task must include how to validate completion
3. **Dependencies** - Tasks must be ordered to respect dependencies
4. **Atomic Operations** - Each task should be completable in a single session

## AI Task Execution Protocol

### Pre-Task Validation
- [ ] **Context Loading** - AI must read all relevant project context
- [ ] **Task Understanding** - AI must confirm understanding of the specific task
- [ ] **Dependency Check** - AI must verify all prerequisites are met
- [ ] **Safety Assessment** - AI must validate task against risk management protocols

### During Task Execution
- [ ] **Incremental Progress** - AI must make small, testable changes
- [ ] **Validation Gates** - AI must test changes before proceeding
- [ ] **Documentation Updates** - AI must update relevant documentation
- [ ] **Commit Standards** - AI must use conventional commit format

### Post-Task Verification
- [ ] **Functionality Test** - AI must verify the task works as expected
- [ ] **Integration Test** - AI must ensure changes don't break existing functionality
- [ ] **Documentation Review** - AI must update any affected documentation
- [ ] **Changelog Update** - AI must automatically update project changelog with changes made
- [ ] **Session Notes** - AI must document the task completion in session notes
- [ ] **Commit and Push** - AI must commit with descriptive message and push to GitHub
- [ ] **Safety Backup** - AI must ensure all work is safely backed up to GitHub

## Conventional Commit Format

### Required Format
```bash
git commit -m "feat: [brief description]" -m "- [specific change 1]" -m "- [specific change 2]" -m "Related to [task reference]"
```

### Examples
```bash
git commit -m "feat: add payment validation logic" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to task 1.2 in feature-payment.md"
```

## Task Validation Checklist

### Before Starting Any Task
- [ ] **Context Verification** - All relevant files and documentation loaded
- [ ] **Task Clarity** - Task requirements are unambiguous
- [ ] **Safety Check** - Task doesn't violate risk management protocols
- [ ] **Dependency Resolution** - All prerequisites are satisfied

### During Task Execution
- [ ] **Incremental Changes** - Making small, testable modifications
- [ ] **Continuous Testing** - Running tests after each significant change
- [ ] **Documentation Sync** - Keeping documentation current with changes
- [ ] **Error Handling** - Proper error handling and logging implemented

### After Task Completion
- [ ] **Functionality Verification** - Task delivers expected outcome
- [ ] **Integration Testing** - Changes work with existing system
- [ ] **Performance Validation** - No performance regressions introduced
- [ ] **Security Review** - Changes don't introduce security vulnerabilities

## Error Recovery Protocol

### When Tasks Fail
1. **Immediate Assessment** - Identify the specific failure point
2. **Context Preservation** - Document what was attempted and why it failed
3. **Rollback Decision** - Determine if rollback is necessary
4. **Root Cause Analysis** - Understand why the task failed
5. **Task Revision** - Update task requirements based on learnings
6. **Retry with Modifications** - Attempt task again with improved approach

### Rollback Procedures
```bash
# For recent changes
git reset --hard HEAD~1

# For specific commit
git reset --hard <commit-hash>

# For staged changes only
git reset HEAD
```

## Automatic Session Documentation

### Session Notes Creation
AI must automatically create session notes in `/docs/5-Prompts/session-notes/[date]-session.md` containing:
- **Session Summary** - Overview of work completed
- **Changes Made** - Detailed list of all modifications
- **Files Modified** - Complete list of files changed
- **Tasks Completed** - Which tasks were finished
- **Next Steps** - What should be done next
- **Issues Encountered** - Any problems and their resolutions

### Changelog Updates
AI must automatically update `/docs/3-Development/changelog.md` with:
- **Date and Time** - When changes were made
- **Change Type** - Feature, bug fix, refactor, etc.
- **Description** - What was changed and why
- **Impact** - How changes affect the system
- **Files Affected** - Which files were modified

### Progress Tracking
AI must update progress documentation to reflect:
- **Current Project State** - What's been completed
- **Remaining Work** - What still needs to be done
- **Blockers** - Any issues preventing progress
- **Timeline Updates** - Revised estimates if needed

### Git Safety Protocols
AI must follow these Git safety protocols:
- **Staging Strategy** - Stage changes frequently to track progress, but do not commit until "green state"
- **Green State Gate** - Only commit after successful testing, validation, and functionality verification
- **Commit Frequency Control** - Avoid committing during debugging phases; batch related changes into logical commits
- **Push Gate** - Only push to GitHub after confirmed stability, not during active debugging or incomplete features
- **Conventional Commits** - Use standard commit message format (feat:, fix:, docs:, etc.) with task references
- **No Uncommitted Work** - Never leave significant uncommitted changes at session end
- **Safety Backups** - Ensure all work is safely backed up to GitHub before ending sessions

## Integration with Meta System

### Task Generation
- Tasks should be generated from PRDs using established templates
- Each task must reference relevant meta system protocols
- Tasks must include appropriate safety and validation checkpoints

### Documentation Integration
- Task completion must update relevant documentation
- Architecture documents must be updated for significant changes
- Progress tracking must be maintained in project documentation
- Session notes and changelog must be automatically maintained

### Governance Compliance
- All tasks must comply with meta system behavioral protocols
- Risk management protocols must be applied to all task execution
- Governance procedures must be followed for any meta system changes
