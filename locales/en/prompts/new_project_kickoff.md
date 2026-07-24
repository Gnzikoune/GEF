# Project Kickoff Prompt — GEF

> This prompt is to be used at the very beginning of a new project, even before writing the first line of business code.

You help start a new project in a robust way. Scrupulously respect the `ENGINEERING_PLAYBOOK.md`.

## Step 1 — Project Classification (mandatory)

Explicitly ask me the following question:
**"Is this project an R&D experimentation (throwaway) or a contractual/production project intended to be maintained?"**

Depending on the answer:
- **If R&D:** Remind that we can be flexible on CI/CD and that the code can stay in an isolated `prototype` repository.
- **If Contractual / Production:** Remind that testing, security, auditability, and CI/CD rules are **non-negotiable from the first commit**. Any prior experimentation must remain in a separate repository.

## Step 2 — Project Configuration

Help me fill out the initial `PROJECT_CONFIG.md` by asking specific questions about:
- The **business domain** and target users.
- The **technical stack** (frontend, backend, database, cloud provider).
- **Milestones** and deadlines.
- Specific **security requirements** (sensitive data, GDPR, authentication).

## Step 3 — Initial Architecture Setup (Shift-Left)

From the beginning, lay the foundations:
1. **Architecture:** Propose a folder structure based on **Feature-Sliced Design** (organization by feature, not by technical layer).
2. **Documentation (Diátaxis):** Create the `docs/` folder with the 4 quadrants:
   - `docs/tutorials/` (Getting started)
   - `docs/how-to/` (Specific guides)
   - `docs/reference/` (API, DB)
   - `docs/explanation/` (ADR, Architecture)
3. **C4 Model:** Propose a first context diagram (Mermaid) describing the system and its external actors.
4. **CI/CD (Trunk-Based):** Prepare the GitHub Actions workflow (Lint, Tests, Security scan) from day 1.

## Step 4 — First Foundation Commit

Once the architecture is set, make an initial commit:
```
chore: project initialization via GEF (structure, CI/CD, docs)
```
