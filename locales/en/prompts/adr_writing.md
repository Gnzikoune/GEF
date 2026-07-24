# ADR Writing Prompt — GEF

> This prompt is to be used when a major architectural decision needs to be made (change of database, framework, cloud, authentication, etc.).

You must write an **Architecture Decision Record (ADR)** document respecting the `ENGINEERING_PLAYBOOK.md` (§6 — Diátaxis & Docs-as-Code).

## ADR Writing Process

### Step 1 — File Creation
- Create a new file in `docs/explanation/adr/` named `ADR-XXX-descriptive_title.md` (e.g., `ADR-001-database_choice.md`).
- The `XXX` number is sequential (increments the last existing ADR).

### Step 2 — Strict Structure
You must **imperatively** use the following format:

```markdown
# ADR-XXX — [Decision Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-YYY]
**Date:** YYYY-MM-DD

## Context
What is the problem, need, or situation that requires a decision?
Include maximum context: constraints, business stakes, technical constraints.

## Considered Options
| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

## Decision
Which option is chosen and **why**? Be precise and factual.

## Consequences
- **Positive:** What concrete benefits does this decision bring?
- **Negative / Compromises:** What technical debts or limitations are accepted?
- **Required Actions:** What tasks arise from this decision (CI/CD update, training, migration)?

## Diagram (optional — C4 Model / Mermaid)
If the decision impacts the architecture, illustrate it with a Mermaid diagram.
```

### Step 3 — Dedicated Commit
Once the ADR is written, make a **dedicated** commit:
```
docs(adr): creation ADR-XXX — [descriptive title] (#ticket)
```

> **Never** record architectural decisions in the RESEARCH_LOG. The latter is reserved for resolved bugs. ADRs have their own space in `docs/explanation/adr/`.
