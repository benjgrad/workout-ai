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

---

## D002: Flat monorepo with npm workspaces

**Decision**: Flat monorepo layout with npm workspaces for backend and mobile. Watch app (Monkey C) lives outside workspaces since it uses the Connect IQ toolchain, not npm.

**Alternatives considered**:
- Separate repos: Harder to keep in sync, more overhead for a solo developer
- Nx/Turborepo: Overkill for 2 JS packages + 1 non-JS project
- Watch inside workspaces: Monkey C has no package.json; npm workspaces would add confusion

**Why flat monorepo**: Simplest structure that keeps everything together. npm workspaces handle dependency hoisting for backend and mobile. Watch builds independently via its own build.sh.

**Tradeoff**: No build orchestration across all three projects. Must run watch builds manually.

---

## D003: Programmatic dc.drawText() for watch UI

**Decision**: Use programmatic `dc.drawText()` calls in `onUpdate()` instead of XML layout resources for rendering the watch UI.

**Alternatives considered**:
- XML layouts with Rez.Layouts: Declarative, but static. Cannot update text dynamically during workouts without switching to programmatic drawing anyway.
- Mixed approach: Start with XML, migrate later. Creates throwaway work.

**Why programmatic**: The workout runner will need dynamic, real-time UI updates (current interval, timer, heart rate zones). Starting with dc.drawText() means the same rendering approach scales from "hello world" to full workout execution.

**Tradeoff**: More verbose for simple screens. No visual layout editor support.

---

## D004: Expo blank-typescript template

**Decision**: Use `create-expo-app --template blank-typescript` for the mobile app scaffold.

**Alternatives considered**:
- Expo with navigation template: Adds file-based routing we don't need yet. Can add expo-router later.
- React Native CLI (no Expo): Requires Xcode/Android Studio for builds. We have neither installed.
- Expo with tabs template: Opinionated tab structure that doesn't match our planned UX.

**Why blank-typescript**: Minimal starting point with TypeScript. No assumptions about navigation or structure. Expo Go allows testing on a physical phone without native build tools.

**Tradeoff**: Navigation, state management, and Garmin BLE communication must all be added manually later.
