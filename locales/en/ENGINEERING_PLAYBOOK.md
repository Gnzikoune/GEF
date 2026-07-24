# Engineering Playbook — "Elite" Standards for the Guardian Engineering Framework (GEF)

> **IMPORTANT:** As an AI, I commit to reading, understanding, and scrupulously respecting these rules throughout the development of the project. This document is the absolute reference for how we work together, on **all projects**, regardless of the language, stack, or domain (SaaS, AI, video game, mobile, backend...).
>
> Technical specifics of a given project (cloud services used, database, etc.) **never** appear here: they live in a `PROJECT_CONFIG.md` file at the root of each repository. This Playbook remains universal.

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
- **Rigor:** Mandatory lint, strict typing (TypeScript/mypy), zero ignored warnings without an explicit comment.

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
- **Shift-Left Testing:** Thinking about tests and security starts as soon as specifications are written.
- **Behavior-Driven Development (BDD):** Align technology and business. Tests (especially E2E) must follow the `Given / When / Then` syntax.
- **The Test Pyramid:**
  - **Base:** 80% Unit Tests (very fast, target business logic without DB).
  - **Middle:** 15% Integration Tests (validate DB / API communication).
  - **Top:** 5% End-to-End Tests (E2E like Playwright). They are slow and fragile, the AI must not rely solely on them.

---

## 8. Kanban Steering and AI Autonomy

The AI acts as an autonomous Tech Lead, but under strict control of the business intent.
- **The "Why" first and foremost:** Each Issue, PR, or task must necessarily begin by explaining the ultimate goal (the business intent). The AI must not guess the goal, it must follow it.
- **Breakdown into Issues:** Use the GitHub CLI (`gh issue create`) to break down a large undertaking into sub-tasks.
- **Pull Request (PR) Creation:** If temporary branches are required for a user review, use `gh pr create`.
- **Mandatory Human Validation:** The AI **NEVER** merges a Pull Request itself. It prepares everything and asks the user to click the Merge button.
- **Anti-Workaround Crash Clause:** Faced with a wall (technical error, ambiguous instruction, missing tool), the AI must fail noisily (Fail Fast) and stop to ask the user for help, rather than improvising a toxic solution or silently masking the error.

---

## 9. Hygiene, CI/CD, and R&D Separation

- **Zero Scraps:** Temporary scripts, debug files, or commented-out comments must be deleted before any push.
- **CI/CD:** On each push, GitHub Actions workflows must check: Lint, Build, Unit Tests, Security Analysis.
- **Release Please:** Version management (Semantic Versioning) is automatically driven via Conventional Commits and the Release Please tool.
- **R&D Separation:** Experiments without a validated specification are done on a separate private repository. The official Git history of the final product must remain clean and professional.

---

*This evolving document guarantees an engineering level of excellence (DORA "Elite" Standard) across all our projects.*
