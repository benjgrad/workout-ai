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

---

## D005: Watch fetches plan via makeWebRequest() through Garmin Connect Mobile

**Decision**: The watch fetches plan data directly from the backend using `Communications.makeWebRequest()`, routed through Garmin Connect Mobile on the paired phone. No custom phone-to-watch BLE bridge needed.

**Alternatives considered**:
- Connect IQ Mobile SDK: Build a native phone module that pushes data to the watch over BLE. Requires Expo Development Builds and platform-specific code.
- Phone app sends plan via BLE: More control over sync timing, but requires custom BLE protocol implementation now.

**Why makeWebRequest()**: Available since API 1.3.0 (well within FR245M's 3.3.0). Lets the watch make HTTP requests to any HTTPS endpoint through the paired phone's internet connection. No phone app code needed for data sync. Proves end-to-end data flow with minimal complexity.

**Tradeoff**: Requires the phone to have Garmin Connect Mobile running and paired. Response size limited by BLE bandwidth (~50KB practical). Phone app cannot push data proactively to the watch.

---

## D006: Simplified auth — JWT with hardcoded test user

**Decision**: Use JWT Bearer tokens for the mobile app API and a simple API key query parameter for the watch endpoint. Single hardcoded test user for milestone 1.

**Alternatives considered**:
- Full OAuth2/OIDC: Production-grade but massive scope increase for a milestone that proves data flow.
- Session cookies: Don't work well with mobile apps or watch HTTP requests.
- No auth at all: Insecure even for development. Someone scanning ngrok URLs could access the endpoint.

**Why simplified JWT**: Proves the auth flow works (login → token → authenticated request) without registration UI or password reset. The watch uses an API key because Monkey C has limited header management.

**Tradeoff**: No user registration, no token refresh, no proper device-level auth for the watch. Must be replaced before any multi-user scenario.

---

## D007: Raw SQL migrations with pg driver, no ORM

**Decision**: Write database migrations as raw `.sql` files executed by a simple TypeScript runner using the `pg` driver directly.

**Alternatives considered**:
- Prisma: Full ORM with migration generation, type safety, and schema management. Adds significant dependency weight and abstracts away SQL.
- TypeORM/Drizzle: Lighter ORMs but still add abstraction layers and migration frameworks.
- Knex: Query builder with migration system. Middle ground but still an abstraction.

**Why raw SQL + pg**: The schema is simple (4 tables). Raw SQL is transparent, portable, and requires no ORM-specific knowledge. The `pg` driver is the standard PostgreSQL client for Node.js. Migrations are plain files that can be reviewed and understood by anyone.

**Tradeoff**: No automatic TypeScript type generation from schema. Must manually keep `types.ts` in sync with SQL. No query builder safety net for complex queries.

---

## D008: Use ngrok to expose backend over HTTPS for watch development

**Decision**: Use ngrok to create an HTTPS tunnel to the local backend for watch-to-backend communication during development.

**Alternatives considered**:
- Deploy to cloud: Production-like but slow iteration cycle. Overkill for development.
- Cloudflare Tunnel: Free but more setup complexity than ngrok.
- Local network: The watch can't reach local IPs directly — it routes through Garmin Connect Mobile which requires public HTTPS.

**Why ngrok**: One command (`ngrok http 3000`) creates a public HTTPS URL. The watch's `makeWebRequest()` requires HTTPS, and ngrok provides it with zero configuration.

**Tradeoff**: Free ngrok URLs change on restart (must update watch code constant). Paid ngrok offers custom domains. Acceptable for development.

**Future investigation**: A self-hosted dev tunnel (e.g., reverse SSH tunnel or a lightweight proxy like frp/rathole on a personal VPS) could replace ngrok entirely. This would give a stable custom domain, avoid ngrok rate limits, and remove the third-party dependency — worth exploring if ngrok friction becomes a bottleneck.
