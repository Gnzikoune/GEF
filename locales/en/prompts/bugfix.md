# Bug Resolution Prompt — GEF

> This prompt is to be used for diagnosing and fixing a bug.

Your mission is to fix a bug in a rigorous and trackable manner, respecting the `ENGINEERING_PLAYBOOK.md`.

## Resolution Process (Shift-Left Debugging)

### Step 1 — Diagnosis (before any code)
1. **Reproduce** the bug in isolation. Do not modify anything until you understand the root cause.
2. **Identify the root cause**: is it a problem of logic, state, security (e.g. missing validation), or a regression linked to another PR?
3. **Measure the impact**: could this bug have security implications (e.g. data leak, bypass)? If yes, treat it as an absolute priority.

### Step 2 — Correction (Clean Code)
1. Propose the correction respecting the Playbook's **Hard Limits**:
   - Correction function: **{{MAX_LINES}} lines max**, **{{MAX_PARAMS}} params max**.
   - No duplication: apply the **Rule of 3** if necessary.
   - Use *Early Return* to avoid deep nesting.
2. Make a `fix:` commit with the Kanban ticket reference.
   - E.g.: `fix(auth): fix JWT token validation (#42)`

### Step 3 — Regression & Validation (Shift-Left)
1. **Write or update a test** covering the bug scenario to avoid any future regression. This test must follow the **BDD** syntax (`Given / When / Then`) if it is an integration or E2E test.
2. Verify that all existing tests still pass.

### Step 4 — Documentation (RESEARCH_LOG mandatory)
**Never** consider a critical or blocking bug as resolved without adding a new numbered entry in `docs/research/RESEARCH_LOG.md`:
- **Symptom:** Description of what was observed.
- **Root Cause:** The precise technical explanation of the origin of the bug.
- **Resolution:** What was modified to fix the problem.
- **Lesson learned:** What could have prevented this bug (e.g. missing validation, missing test).
