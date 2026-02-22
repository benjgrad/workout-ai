# Decision Log

Decisions made during planning and implementation of the Adaptive AI Training Platform for Garmin. Each entry captures what we decided, what we considered, and why.

---

## D001: Adopt development workflow skills from gently-extract project

**Decision**: Copy 9 of 10 Claude Code skills from gently-extract, adapting references to non-existent skills (using-git-worktrees, brainstorming) and excluding receiving-code-review.

**Skills adopted:**
1. using-superpowers (meta skill router)
2. writing-plans (spec to TDD plan conversion)
3. executing-plans (batch execution with review checkpoints)
4. test-driven-development (strict RED-GREEN-REFACTOR)
5. verification-before-completion (evidence before claims)
6. finishing-a-development-branch (verify/present options/cleanup)
7. systematic-debugging (root cause investigation)
8. subagent-driven-development (fresh subagent per task)
9. requesting-code-review (dispatch review subagent)

**Excluded:** receiving-code-review — not needed for solo MVP development.

**Alternatives considered**:
- Write skills from scratch: Would take significant time and produce inferior results. The gently-extract skills are battle-tested and well-structured.
- Copy all 10: receiving-code-review adds complexity for a workflow that doesn't involve external reviews yet.
- No skills: Loses the disciplined development workflow that prevents common AI assistant failure modes.

**Why adopt**: These are generic development process skills (TDD, debugging, verification) not tied to any specific project. They enforce discipline that prevents common failure modes: untested code, unverified completion claims, symptom-level debugging.

**Adaptations made:**
- Removed references to `superpowers:using-git-worktrees` (non-existent skill) from executing-plans, subagent-driven-development, and finishing-a-development-branch
- Removed "brainstorming skill" and "dedicated worktree" references from writing-plans
- All other content copied verbatim (generic process, not project-specific)

**Tradeoff**: Skills reference patterns (Jest, npm) that match our chosen backend stack but not the Garmin watch (Monkey C). Watch-specific testing skills may need to be added later.
