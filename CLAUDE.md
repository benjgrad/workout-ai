# CLAUDE.md — Adaptive AI Training Platform for Garmin

## What This Is

Adaptive AI Training Platform that delivers personalized, AI-generated training plans
to Garmin watch users. Executes workouts natively on the watch, collects performance
and physiological data, and continuously adjusts future workouts.

Closed feedback loop: **Plan → Execute → Measure → Adapt → Repeat**

## Tech Stack

- **Backend:** Node.js + TypeScript + Express
- **Database:** PostgreSQL
- **Watch App:** Garmin Connect IQ (Monkey C)
- **Phone App:** React Native (iOS + Android)
- **AI/ML:** Adaptation engine (rules-based initially, ML later)
- **Infrastructure:** AWS/GCP
- **Testing:** Jest (unit + integration)
- **Queue:** SQS/RabbitMQ (for adaptation events)

## Key Files

- `BRIEF.md` — Project brief with requirements, ICP, MVP scope
- `System-Design.md` — Full system architecture (services, APIs, sync protocol, message flows)
- `decision-log.md` — All design decisions with alternatives considered (D001+)
- `docs/plans/` — TDD implementation plans (bite-sized task lists)

## Skills Protocol

Skills are in `.claude/skills/` within this project. Invoke via `superpowers:<skill-name>`.

### Always Active
- `superpowers:using-superpowers` — Check for applicable skills before ANY action

### Implementation Workflow
1. `superpowers:writing-plans` — Convert specs into bite-sized TDD tasks
2. **Execution (choose per phase):**
   - `superpowers:executing-plans` — Batch execution with human review checkpoints. Use for core pipeline work.
   - `superpowers:subagent-driven-development` — Fresh subagent per task with automatic spec + code quality review. Use for mechanical/independent tasks.
3. `superpowers:test-driven-development` — RED-GREEN-REFACTOR for every feature. No exceptions.
4. `superpowers:verification-before-completion` — Run tests before ANY completion claim or commit
5. `superpowers:finishing-a-development-branch` — After all tasks: verify tests, present options

### When Needed
- `superpowers:systematic-debugging` — When tests fail or unexpected behavior occurs
- `superpowers:requesting-code-review` — After major features or before merging

## Development Workflow

### Branch Strategy
Feature branches from main. Clean atomic commits. PRs for review.

### Commit Protocol
1. **Test before commit.** Run `npm test`. All tests must pass.
2. **Build before commit.** Run `npm run build`. Must compile.
3. **Verify before claiming.** Use `superpowers:verification-before-completion`. No "should pass."
4. **Atomic commits.** Each commit does one thing.
5. **Message format:**
   - `feat: <description>` — New functionality
   - `test: <description>` — Test additions
   - `fix: <description>` — Bug fixes
   - `docs: <description>` — Documentation
   - `refactor: <description>` — Code restructuring
   - `chore: <description>` — Infrastructure, config, dependencies

### Testing Strategy
- **TDD is mandatory.** No production code without a failing test first.
- **Backend testing:** API routes, services, adaptation engine, sync protocol
- **Mock strategy:** Mock external services (Garmin Connect IQ SDK, AI providers)
- **OK to skip (note in README):** Frontend polish tests, Garmin simulator edge cases

## Decision Log Protocol

**File:** `decision-log.md`

**When to log:** Any non-trivial choice. If you hesitate between two options, log it.

**Format:**
```
## DXXX: [Decision title]

**Decision**: [What we chose]

**Alternatives considered**:
- [Option B]: [Why not]

**Why [chosen]**: [Reasoning]

**Tradeoff**: [What we give up]
```

**Numbering:** Continue from last entry. Current: D001. Next: D002.

## Quick Commands

```bash
# Commands will be added as infrastructure is set up
# Expected:
# docker compose up -d              # Start Postgres + services
# npm run migrate                   # Run migrations
# npm run dev                       # Start backend
# npm test                          # All tests
# npm run build                     # TypeScript compilation
```

## What NOT to Do

- Do not skip the decision log for "small" choices
- Do not write production code without a failing test first
- Do not claim completion without running verification
- Do not skip code review on major features
- Do not implement beyond MVP scope (see BRIEF.md MVP section)
- Do not optimize prematurely — start with rules-based adaptation, not ML
