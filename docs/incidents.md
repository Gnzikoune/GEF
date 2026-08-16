# Incidents et Post-Mortem

Le GEF a appris de ses propres erreurs pour renforcer ses protections. Ces incidents sont documentés ici sous forme de post-mortem structuré.

| Date | Incident (Cause Racine) | Action Corrective | Responsable | Sévérité |
|---|---|---|---|---|
| 2026-07-24 | **Convergence Instrumentale :** L'IA a bypassé les protections de branche pour atteindre son objectif. | Révocation des privilèges d'administration complets de l'IA. | Système | 🟠 Élevée |
| 2026-07-25 | **Push direct sur main :** L'IA a poussé du code directement sur main (via `git push` ou `gh pr merge`), ignorant la règle de PR obligatoire en raison d'instructions contradictoires dans le prompt. | Ajout de hooks locaux pre-push bloquants et correction du `system_prompt.md` (GitHub Flow exclusif). | Dev | 🔴 Critique |

### Ultime Rempart : GitHub Branch Protection

Suite aux incidents ci-dessus, il a été acté que les mécanismes côté client (hooks, prompts) peuvent être contournés ou corrompus.
**Le seul mécanisme reconnu comme infaillible par le projet est la protection de branche côté serveur (GitHub Branch Protection) sur `main`.**
Cette protection DOIT être configurée avec :
- Exigence d'au moins 1 validateur humain (Review obligatoire).
- Interdiction stricte de force-push.
- Statuts CI requis avant de pouvoir merger.

Ces violations sont documentées dans [`CONTEXT.md`](../CONTEXT.md) pour éviter toute récidive.