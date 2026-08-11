# Engineering Playbook — "Elite" Standards for the Guardian Engineering Framework (GEF)

> **IMPORTANT:** As an AI, I commit to reading, understanding, and scrupulously respecting these rules throughout the development of the project. This document is the absolute reference for how we work together, on **all projects**, regardless of the language, stack, or domain (SaaS, AI, video game, mobile, backend...).
>
> Technical specifics of a given project (cloud services used, database, etc.) **never** appear here: they live in a `PROJECT_CONFIG.md` file at the root of each repository. This Playbook remains universal.

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

The code must separate the "business" (application rules) from the "infrastructure" (frameworks, DB, UI).
- **Single Responsibility Principle (SRP):** A class/function does only one thing.
- **Dependency Inversion (DIP):** The domain depends on interfaces, not implementations.
- **Feature-Sliced Design:** Folder organization reflects the business, not the technology.
  - *Bad:* `/controllers`, `/models`, `/views`
  - *Good:* `/features/auth/api.ts`, `/features/auth/components/`, `/features/billing/model.ts`

---

## 3. Advanced Error Handling (Resilience)

- **Information Hiding:** **NEVER** expose stack traces or technical details to the end client. Return a generic error ("Internal Error") with a log ID.
- **Error Typing:** Create exception classes (e.g.: `DomainError`, `InfraError`, `ValidationError`).
- **Result Pattern:** Replace massive `try/catch` blocks with predictable returns of type `Result<Success, Failure>` to force explicit failure handling.

---

## 4. Security: OWASP Secure-by-Design & Hard Limits

*"Complexity is the enemy of security."* The strict Cyclomatic Complexity limit (`{{MAX_COMPLEXITY}}` max) seen in §1 is the first defense against security blind spots.

- **Defense in Depth & Sanitization:** Never trust inputs. Strict validation (e.g.: `Zod`, `Joi`). Parameterized queries mandatory against SQLi and encoding against XSS.
- **Fail-Safe Defaults:** All access is denied by default.

### 4.1. Security Hard Limits (OWASP Standard)
- **Authentication & Sessions:**
  - Lifespan of an **Access Token (JWT): 15 minutes max**.
  - Lifespan of a **Refresh Token: 7 days max** (in `HttpOnly`).
- **Payload Limits:**
  - API Request Body (JSON): **{{MAX_PAYLOAD}} max** (DoS Protection).
  - Image upload: **5 MB max**.
- **Anti-Brute Force (Rate Limiting):**
  - Block an account/IP for 15 minutes after **5 failed login attempts**.
  - Global limit per IP: **100 API requests / minute**.
- **Secrets Management:** Always via environment variables (`.env`). Never hardcoded.
- **SAST Analysis (Static Application Security Testing):** Code scanning via `Semgrep` (OWASP Top 10 rules) is **mandatory** and blocking in CI.

---

## 5. Git Strategy: GitHub Flow (Pull Requests)

The stability of the main branch is paramount. We use the **GitHub Flow**:
- **Locked `main` branch:** Direct pushes to `main` are **strictly forbidden**.
- **Short-lived Branches:** Create branches per feature (`feat/xxx`, `fix/xxx`). Branches should not last more than a few days.
- **Pull Requests (PR) Mandatory:** All code must go through a PR. Continuous Integration (CI) runs on the PR to validate tests and linting.
- **Code Review:** Approval is required before merging. Compliance with the Playbook is verified there.
- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. Every commit must include the Kanban ticket ID (`#XYZ`).

---

## 6. Documentation: Diátaxis & Docs-as-Code

Technical documentation (`docs/` folder) must follow the **Diátaxis** cognitive framework:
1. **Tutorials** (Getting started)
2. **How-to Guides** (Specific tasks)
3. **Reference** (API, DB)
4. **Explanation** (Architecture, ADR)

- **Docs-as-Code & C4 Model:** Architecture must be visual and versioned. Use the **C4 Model** format (Context, Containers, Components) generated via code (e.g.: `Mermaid.js`) to ensure diagrams never become obsolete.
- **ADR & RESEARCH_LOG:**
  - **ADR:** Any major structural change requires an Architecture Decision Record (ADR).
  - **RESEARCH_LOG.md:** Any blocking critical bug must be detailed (Symptom, Experiments, Resolution) for the project's memory.

---

## 7. Quality Assurance (QA): Shift-Left & Test Pyramid

Quality is injected before the code, not after.
- **Shift-Left Testing:** Thinking about tests and security starts as soon as specifications are written (SDD).
- **Acceptance Criteria:** Specifications must define clear criteria. The AI must prioritize **Unit and Integration Tests** to prove the code respects the spec.
- **The Test Pyramid:**
  - **Base:** 80% Unit Tests (very fast, target business logic, deterministic for AI).
  - **Middle:** 15% Integration Tests (validate DB / API communication).
  - **Top:** 5% End-to-End Tests (E2E like Playwright). They are slow, fragile, and complex for an AI to imagine without a visual interface. They are therefore written **after** the implementation is stable (or by a dedicated QA agent), and not strictly before code.

---

## 8. Agentic Spec-Driven Development (SDD) & AI Autonomy

The AI acts as an Agentic Software Engineer, driven by specifications.
- **Mandatory SDD Process:**
  1. **Intent:** The human expresses the need.
  2. **Specification:** The AI writes the specifications (`specs/spec.md`).
  3. **Design & Tasks:** The AI plans the architecture (`specs/plan.md`) and tasks (`specs/tasks.md`).
  4. **Human Validation:** The human approves the SDD artifacts. The AI must **NEVER** code before this validation.
  5. **Implementation & Tests:** The AI executes tasks, writes unit/integration tests, then the code.
- **Systematic Verification Process (Anti-Amnesia):** At each new prompt, the VERY FIRST action of the AI must be to read the Playbook, then read the project context (e.g., `specs/spec.md` and `CONTEXT.md`), before analyzing or coding.
- **The "Why" first and foremost:** The business intent defined in the spec guides everything.
  - *CI Mechanic:* The intention declared in a PR must be at least **30 characters** long, otherwise it will be rejected by the CI.
- **Breakdown into Issues:** Use the GitHub CLI (`gh issue create`) to break down a large undertaking into sub-tasks.
- **Pull Request (PR) Creation:** If temporary branches are required for a user review, use `gh pr create`.
- **Mandatory Human Validation:** The AI **NEVER** merges a Pull Request itself. It prepares everything and asks the user to click the Merge button.
- **Anti-Workaround Crash Clause:** Faced with a wall (technical error, ambiguous instruction, missing tool), the AI must fail noisily (Fail Fast) and stop to ask the user for help, rather than improvising a toxic solution or silently masking the error.
- **AI Synchronization:** The AI must ensure its behavioral rules are universal. The `.cursorrules` and `.windsurfrules` files must be kept perfectly identical (verified via pre-commit).

---

## 9. Hygiene, CI/CD, and R&D Separation

- **Zero Scraps:** Temporary scripts, debug files, or commented-out comments must be deleted before any push.
- **CI/CD:** On each push, GitHub Actions workflows must check: Lint, Build, Unit Tests, Security Analysis.
- **Release Please:** Version management (Semantic Versioning) is automatically driven via Conventional Commits and the Release Please tool.
- **R&D Separation:** Experiments without a validated specification are done on a separate private repository. The official Git history of the final product must remain clean and professional.

---

## 10. Mechanical Lockdown (Ultimate Lockdown)

The GEF does not rely solely on human discipline or AI obedience; it enforces its rules in a **mechanical and unavoidable** way:
- **Mandatory Documentation (Git Hooks):** Any bugfix (`fix/`) without updating the `RESEARCH_LOG.md` will be rejected at commit. Any added dependency without a new `ADR` will be blocked.
- **Hard Limits:** File size warnings (> 400 lines) or linter bypasses (`@ts-ignore`) are no longer simple warnings, but fatal errors (`exit 1`) in both local pre-commit hooks AND in the CI.
- **Issue Forms (YAML):** Ticket creation is strict. `Issue Forms` formally require the Business Intent and manual validation of GEF commitments via blocking Checklists.
- **AI Chain of Thought:** Any AI operating on the project is forbidden to generate code without first verifying and validating its compliance in an XML `<gef_compliance_check>` block.

---

*This living document guarantees a standard of engineering excellence (DORA "Elite" Standard) across all our projects.*
