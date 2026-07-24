# Feature Development Prompt — GEF

> This prompt is to be used when requesting the development of a new feature.

You must implement the requested feature by respecting the `ENGINEERING_PLAYBOOK.md`:

1. **Branch and workflow (Ref. Playbook §5)**
   - Never work directly on `main`. We must be on a `feat/<feature-name>` branch.

2. **Traceability (Ref. Playbook §5)**
   - Implement the feature in small logical increments.
   - Make frequent micro-commits with messages in the *Conventional Commits* format (e.g., `feat: add button`, `test: button unit tests`).
   - No massive uncommitted modifications.

3. **Continuous Documentation (Ref. Playbook §6)**
   - Update `README.md` **only** if this feature changes the installation, public APIs, prerequisites, architecture, or visible features.

4. **Kanban Steering and TDD (Ref. Playbook §7 and §8)**
   - Use `gh issue create` to create a ticket corresponding to the feature.
   - All your commits must include the ticket reference (e.g., `feat: ... (#12)`).
   - Before writing code, write the E2E/Playwright test describing the behavior (TDD).

5. **Auto-Documentation (Ref. Playbook §6)**
   - If you introduce an architectural novelty, write an ADR in `docs/adr/`.

6. **Validation and Pull Request (Ref. Playbook §5)**
   - Once finished and tested, never try to merge to `main`.
   - Use `gh pr create` to open the Pull Request (with "Closes #XYZ").
   - Explicitly ask the user: "I have created the PR, can you review and merge it?"

7. **Clean Code & Security (Hard Limits) (Ref. Playbook §1 and §4)**
   - Imperatively respect the **Hard Limits**:
     - **Functions:** {{MAX_LINES}} lines max, {{MAX_PARAMS}} parameters max.
     - **Cyclomatic Complexity:** <= {{MAX_COMPLEXITY}}.
     - **Nesting:** 3 levels max.
     - **UI Components:** 200 lines max (extract logic if > 50 lines into a Hook).
     - **Rule of 3:** If you duplicate a piece of code for the 3rd time, you must refactor it (abstraction).
     - **Security:** Do not generate any flaws. Always validate inputs, limit JSON payloads to {{MAX_PAYLOAD}}, and respect token expiration (JWT < 15 mins).
