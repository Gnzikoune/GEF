# Engineering Playbook — "Elite" Standards for the Guardian Engineering Framework (GEF)

> **IMPORTANT:** As an AI, I commit to reading, understanding, and scrupulously respecting these rules throughout the development of the project. This document is the absolute reference for how we work together, on **all projects**, regardless of the language, stack, or domain (SaaS, AI, video game, mobile, backend...).
>
> Technical specifics of a given project (cloud services used, database, etc.) **never** appear here: they live in a `PROJECT_CONFIG.md` file at the root of each repository. This Playbook remains universal.
>
> **Methodology:** This Playbook orchestrates the **AI SDD** (*AI Spec-Driven Development*) loop. In this cycle, the human **Defines** the specifications and **Verifies** the deliverables. The AI **Analyzes/Designs** (§2 to §4) then **Implements/Tests** (§8) — always under the mechanical constraints below.

---

## 0. Project Lifecycle & Grandfather Clause

The AI must always identify the project phase before acting (Idea → R&D → Contractual Dev → Release → Maintenance).

> **Grandfather Clause (Fix Forward):** The AI applies the Playbook rules to all **new** code produced. It must **never** proactively refactor existing code solely to make it compliant with a new rule, unless explicitly requested. If a file is modified for a bugfix/feature, the AI applies the **Boy Scout Rule**: clean the surrounding code without breaking the tests.

---

## 1. Clean Code: Metrics, Sizes, and Refactoring

Writing code must follow the **Google Engineering Practices**: clarity takes precedence over complexity (KISS).

### 1.1. Maximum Sizes (Hard Limits)
- **Functions / Methods:** `{{MAX_LINES}} lines max`.
- **Parameters:** `{{MAX_PARAMS}} arguments max` (beyond this, use a configuration object).
- **UI Components:** `150 to 200 lines max`. (Logic > 50 lines must be extracted into a *Custom Hook*).
- **Files:** `300 to 400 lines max`.
  - **Note:** Auto-generated artifacts (package-lock.json, yarn.lock, etc.) are excluded from this limit per ADR-002.

### 1.2. Complexity and Nesting
- **Depth (Nesting):** `3 levels max`.
- **Guard Clauses (Early Return):** Mandatory. Avoid nested `if/else`.
- **Cyclomatic Complexity:** Maximum `{{MAX_COMPLEXITY}}` logical paths per function.

### 1.3. Refactoring Rules (The Rule of Three)
- **1st time:** Write to solve.
- **2nd time:** Tolerate duplication.
- **3rd time:** Mandatory refactoring into a reusable abstraction.

### 1.4. Naming Conventions
- **Files / Folders:** `kebab-case` (e.g.: `user-profile.tsx`).
- **Classes / Components:** `PascalCase` (e.g.: `UserProfile`).
- **Variables / Functions:** `camelCase` (e.g.: `getUserData`).
- **Global Constants:** `UPPER_SNAKE_CASE` (e.g.: `MAX_RETRY_COUNT`).
- **Rigor:** Mandatory lint (CI must fail on lint errors, no `|| true` allowed), strict typing (TypeScript/mypy), zero ignored warnings without an explicit comment.
  - *Note on Linters asymmetry: ESLint allows native enforcement of these physical limits (`max-lines-per-function`, `max-params`). However, newer linters (Biome, Ruff) focus on semantic analysis (cyclomatic complexity, nesting) rather than strict physical line limits. In any case, the developer must ensure their configuration, or rely on the GEF `pre-commit` hook which enforces these limits mechanically.*

---

## 2. Architecture & Design (Clean Architecture & SOLID)

The code must separate the "business" (application rules) from "infrastructure" (frameworks, DB, UI).
- **Single Responsibility Principle (SRP):** A class/function does only one thing.
- **Dependency Inversion (DIP):** The domain depends on interfaces, not implementations.
- **Feature-Sliced Design:** Folder organization reflects the business, not the technical layer.
  - *Bad:* `/controllers`, `/models`, `/views`
  - *Good:* `/features/auth/api.ts`, `/features/auth/components/`, `/features/billing/model.ts`

---

## 3. Advanced Error Management (Resilience)

- **Information Hiding:** Never expose stack traces or technical details to the end client. Return a generic error ("Internal error") with a log ID.
- **Error Typing:** Create exception classes (e.g., `DomainError`, `InfraError`, `ValidationError`).
- **Result Pattern:** Replace massive `try/catch` blocks with predictable returns of type `Result<Success, Failure>` to force explicit failure handling.

### 3.1. Database & Migrations
- **Migration Strategy:** Any database schema change MUST be scripted reversibly (Up / Down) via a migration tool (Prisma, Alembic, Flyway, etc.).
- **Rollback:** The Playbook requires testing the `Down` migration locally before any PR involving a schema change, to guarantee DB rollback in production if necessary.

---

## 4. Security: OWASP Secure-by-Design & Hard Limits

*"Complexity is the enemy of security."* The strict Cyclomatic Complexity limit (`{{MAX_COMPLEXITY}}` max) in §1 is the first defense against security blind spots.

- **Defense in Depth & Sanitization:** Never trust inputs. Strict validation (e.g., `Zod`, `Joi`). Parameterized queries mandatory against SQLi and encoding against XSS.
- **Fail-Safe Defaults:** All access is denied by default.

### 4.1. Security Hard Limits (OWASP Standard)
- **Authentication & Sessions:**
  - **Access Token (JWT) lifetime:** `{{JWT_EXPIRATION}} max` (defined in PROJECT_CONFIG.md).
  - **Refresh Token lifetime:** 7 days max (in `HttpOnly`).
- **Payload Limits:**
  - API request body (JSON): **{{MAX_PAYLOAD}} max** (DoS protection).
  - Image upload: **5 MB max**.
- **Anti-Brute Force (Rate Limiting):**
  - Block an account/IP after **{{RATE_LIMIT_MAX_ATTEMPTS}} failed attempts** for **{{RATE_LIMIT_WINDOW}} minutes** (defined in PROJECT_CONFIG.md).
  - Global IP limit: **100 API requests / minute**.
- **Secrets Management:** Always via environment variables (`.env`). Never hardcoded.
- **SCA and SAST Analysis (Mandatory):**
  - SCA (Software Composition Analysis via Dependabot, Snyk, or Trivy) to detect vulnerable dependencies is **mandatory**.
  - SAST code scan via `Semgrep` (OWASP Top 10 rules) is **mandatory** and blocking in CI.

---

## 5. Git Strategy: Git Flow / GitHub Flow / GitLab Flow

Main branch stability is paramount. We use a flow based on Pull Requests/Merge Requests (PR/MR):
- **Locked `main` branch:** Direct pushes to `main` are **strictly forbidden**.
- **Short Branches:** Create branches by feature (`feat/xxx`, `fix/xxx`). Branches should not last more than a few days.
- **Mandatory Pull/Merge Requests:** All code must pass through a PR/MR. Continuous Integration (CI) runs on the PR/MR to validate tests and linting.
- **Code Review:** Approval is required before merge. Playbook compliance is verified.
- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. All commits must include the Kanban ticket ID (`#XYZ`).

### 5.5. Daily Developer Workflow

To ensure constant synchronization with the team and avoid conflicts:
- **Morning routine:** Before starting to code, always do `git pull origin main` (or `git pull origin master` depending on project convention).
- **Branch creation:** Always work on a `feat/xxx` or `fix/xxx` branch created from up-to-date `main`.
- **Frequent commits:** `git add .` + `git commit -m "descriptive message"` before each push. Commits must be atomic and coherent.
- **Regular pushes:** Push work regularly to the remote branch to save progress and enable continuous review.

### 5.6. Roles and Responsibilities

A structured team with clear responsibilities avoids conflicts and blockers:
- **Developer:** Code, commits, local tests, PR/MR creation, review comment resolution.
- **Reviewer:** Code review, Playbook compliance validation, business logic and security verification.
- **Owner:** Project management, initial configuration, member invitations, priority definition, major merge validation.
- **Tech Lead (AI):** Kanban steering, Crash Clause, technical execution autonomy, always under business intent control.

**Solo Developer Exception:** For projects with a single developer, the Owner can approve their own PRs. The mandatory third-party code review rule applies only when there are multiple active contributors on the project.

### 5.7. CI/CD Pipeline (Steps)

The CI/CD pipeline must follow these sequential steps to guarantee quality:
1. **Build Test:** Project compilation, verify code compiles without errors.
2. **Quality Test:** Linting (ESLint, Pylint, etc.), static code analysis (SAST/SCA), naming convention verification.
3. **Integration Test:** Integration tests (DB, external APIs), component communication validation.
4. **Functional Test:** E2E tests (Playwright, Cypress), complete business scenario validation. *Note: These tests may be manual initially but must be progressively automated.*
5. **Performance Test:** Benchmarks, load tests, response time verification. *Note: This step is modulated based on the project phase declared in PROJECT_CONFIG. It is non-blocking or disabled in Idea/R&D phase to prioritize velocity.*

### 5.8. Merge Strategies

To optimize workflow while maintaining quality:
- **AUTO MERGE:** For trivial and non-risky changes (documentation, configuration, minor fixes). CI/CD pipeline must be green and at least one reviewer must have approved.
- **MANUAL MERGE:** For features, major fixes, refactors, and any change impacting business logic or security. Explicit human validation is required.
- **MARK MERGE REQUEST AS READY:** Indicate that the PR/MR is ready for review ("Ready for review" status on GitLab, "Ready" on GitHub).

### 5.9. Environments

Environment separation ensures clear risk isolation:
- **Local:** Development environment, manual tests, rapid experimentation.
- **Pre-production (Staging):** Pre-production environment, identical to production, for functional testing and validation before release.
- **Production:** Production environment, accessible to end users, automated deployment via CI/CD after complete validation.

---

## 6. Documentation: Diátaxis & Docs-as-Code

Technical documentation (`docs/` folder) must follow the **Diátaxis** cognitive framework:
1. **Tutorials** (Getting started)
2. **How-to Guides** (Specific tasks)
3. **Reference** (API, DB)
4. **Explanation** (Architecture, ADR)

- **Docs-as-Code & C4 Model:** Architecture must be visual and versioned. Use the **C4 Model** format (Context, Containers, Components) generated via code (e.g., `Mermaid.js`) to ensure diagrams never become obsolete.
- **ADR & RESEARCH_LOG:**
  - **ADR:** Any major structural change requires an Architecture Decision Record (ADR).
  - **RESEARCH_LOG.md:** Any blocking critical bug must be detailed (Symptom, Experiments, Resolution) for the project's memory.

---

## 7. Quality Assurance (QA): Shift-Left & Test Pyramid

Quality is injected before code, not after.
- **Shift-Left Testing:** Test and security reflection starts at specification writing.
- **Behavior-Driven Development (BDD):** Align technical and business. Tests (especially E2E) must follow `Given / When / Then` syntax.
- **The Test Pyramid:**
  - **Base:** 80% Unit Tests (very fast, target business logic without DB).
  - **Middle:** 15% Integration Tests (validate DB / API communication).
  - **Top:** 5% End-to-End Tests (E2E like Playwright). They are slow and fragile, AI should not rely solely on them.

---

## 8. GEF Tools and Governance

GEF provides tools to mechanize engineering governance:

### Compliance as Code (`npx create-gef compliance`)
- Use `npx create-gef compliance generate` to create a declarative `compliance.yml` file
- Use `npx create-gef compliance validate` to verify compliance
- Use `npx create-gef compliance apply-hooks` to apply rules to Git hooks
- Use `npx create-gef compliance apply-ci` to apply rules to CI/CD

### Certification System (`npx create-gef certify`)
- Use `npx create-gef certify check` to verify possible certification level
- Use `npx create-gef certify generate` to generate a badge and certification report
- Levels: Bronze (GEF ≥ 60%, DORA ≥ 40%), Silver (≥ 70%, ≥ 60%), Gold (≥ 85%, ≥ 80%), Platinum (≥ 95%, ≥ 95%)

### Extension System (`npx create-gef extension`)
- Use `npx create-gef extension install <name>` to install specific rule packs
- Use `npx create-gef extension list` to list available extensions
- Use `npx create-gef extension remove <name>` to remove an extension
- Available extensions: Healthcare (HIPAA), Finance (PCI-DSS), Security (OWASP)

### Doctor (`npx create-gef doctor`)
- Use `npx create-gef doctor` to audit an existing project's compliance
- The doctor checks AI files, mandatory files, Git configuration, CI/CD, and linter

These tools should be used regularly to maintain project governance.

---

## 9. Kanban Steering and AI Autonomy

The AI acts as an autonomous Tech Lead, but under strict business intent control.
- **Systematic Verification Process (Anti-Amnesia):** On each new user prompt, the AI's VERY FIRST action must be to read and reread the `ENGINEERING_PLAYBOOK.md` (or `PROJECT_CONFIG.md`) to reload with hard rules, before even starting to analyze the request or write code.
- **The "Why" First:** Each Issue, PR/MR, or task must start by explicitly stating the ultimate goal (business intent). The AI must not guess the goal, it must follow it.
  - *CI Mechanism:* The declared intent in a PR must be at minimum **30 characters**, or it will be rejected by the anti-workaround CI.
- **Issue Breakdown:** Use the platform CLI (GitHub `gh issue create`, GitLab `glab issue create`) to break down a large project into sub-tasks.
- **Pull/Merge Request Creation:** If temporary branches are required for user review, use the appropriate CLI (GitHub `gh pr create`, GitLab `glab mr create`).
- **Mandatory Human Validation:** The AI **NEVER** merges a Pull/Merge Request itself. It prepares everything and asks the user to click the Merge button.
- **Anti-Workaround Crash Clause:** Faced with a wall (technical error, ambiguous instruction, missing tool), the AI must fail noisily (Fail Fast) and stop to ask the user for help, rather than improvising a toxic solution or silently masking the error.
- **AI Synchronization:** The AI must ensure its behavioral rules are universal. The `.cursorrules` and `.windsurfrules` files must be kept perfectly identical (verified via pre-commit).

---

## 10. Hygiene, CI/CD, and R&D Separation

- **Zero Scraps:** Temporary scripts, debug files, or commented-out comments must be deleted before any push.
- **CI/CD:** On each push, CI/CD workflows (GitHub Actions, GitLab CI, etc.) must check: Lint, Build, Unit Tests, Security Analysis.
- **Version Management:** Semantic Versioning is automatically driven via Conventional Commits. Recommended tools: Release Please (GitHub), GitLab Release, semantic-release, etc.
- **R&D Separation:** Experiments without a validated specification are done on a separate private repository. The official Git history of the final product must remain clean and professional.

---

## 11. Mechanical Lockdown (Ultimate Lockdown)

GEF does not rely solely on human discipline or AI obedience; it enforces its rules in a **mechanical and unavoidable** way:
- **Mandatory Documentation (Git Hooks):** Any bugfix (`fix/`) without updating `RESEARCH_LOG.md` will be rejected at commit. Any added dependency without a new `ADR` will be blocked.
- **Hard Limits:** File size warnings (> 400 lines) or linter bypasses (`@ts-ignore`) are no longer simple warnings, but fatal errors (`exit 1`) in both local pre-commit hooks AND in the CI.
- **Issue Forms (YAML):** Ticket creation is strict. `Issue Forms` formally require the Business Intent to be specified and manual validation of GEF commitments via blocking Checklists.
- **AI Chain of Thought:** Any AI operating on the project is forbidden to generate code without first verifying and validating its compliance in an XML `<gef_compliance_check>` block.

---

## 12. Operations & Run (Day 2) — Advanced Practices

Recognizing that software success depends as much on post-deployment as before, GEF aims to progressively integrate industry standards (Big Tech) for the Run phase, as soon as project maturity allows:

- **Observability (Structured Logging):** Replace simple `console.log` with structured logs (JSON) including execution context (Trace ID, User ID) to enable effective asynchronous debugging on Datadog/ELK.
- **Feature Flags:** Protect collaborative development by encapsulating all incomplete or risky code behind Feature Flags, allowing continuous code merging without impacting users.
- **Progressive Rollout:** Prefer Canary deployments (e.g., 5% of users first) or Blue/Green, coupled with automated rollback on error spikes (SLO Breach).
- **Blameless Post-Mortem:** Any production incident must result in a structured document (Root Cause, Impact, 5 Whys, Action Items) focused on systemic failure rather than human error.

---

*This living document guarantees a standard of engineering excellence (DORA "Elite" Standard) across all our projects.*