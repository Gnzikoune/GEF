# Spec — GEF Cloud SaaS

**Issue:** #85
**Date:** 2026-08-11
**Auteur:** IA Devin

---

## 1. Intent (Intention Métier)

Transformer le GEF d'un package npm open-source en une plateforme SaaS de gouvernance d'ingénierie, en commençant par un dashboard de métriques DORA pour évoluer vers une gouvernance centralisée multi-projets à l'échelle entreprise.

## 2. Contexte

### Situation actuelle
- Le GEF est un package npm open-source installé localement via `npx create-gef`
- Pas de vision centralisée de la conformité à l'échelle entreprise
- Les organisations ont besoin de surveiller la qualité d'ingénierie de tous leurs projets
- Les métriques DORA sont partiellement couvertes mais pas visualisées

### Problème à résoudre
Les entreprises manquent d'outils pour :
- Visualiser les métriques DORA en temps réel
- Surveiller la conformité du GEF sur plusieurs projets
- Générer des rapports pour la direction
- Configurer et mettre à jour le GEF de manière centralisée

### Opportunité
Le marché des outils de gouvernance d'ingénierie est en croissance (SonarQube, Linear, GitHub Advanced Security). Le GEF a un avantage unique : il est conçu pour l'ère des agents IA autonomes.

## 3. Requirements (Exigences Fonctionnelles)

### 3.1. Phase 1 (MVP) — Dashboard DORA pour un seul projet

#### A. Authentification & Onboarding
- [ ] Inscription via email/password ou OAuth (GitHub, Google)
- [ ] Connexion d'un dépôt GitHub/GitLab via OAuth
- [ ] Scan initial du dépôt pour établir la baseline

#### B. Dashboard DORA
- [ ] **Deployment Frequency** : Nombre de déploiements par jour/semaine
- [ ] **Lead Time for Changes** : Temps moyen entre le commit et le déploiement
- [ ] **Change Failure Rate** : Pourcentage de déploiements qui échouent ou nécessitent un hotfix
- [ ] **Time to Restore** : Temps moyen pour réparer une défaillance en production

#### C. Visualisation
- [ ] Graphiques de tendance (ligne, bar)
- [ ] Comparaison avec benchmarks industry (Elite, High, Medium, Low)
- [ ] Score global de conformité GEF (0-100%)
- [ ] Alertes visuelles (vert/jaune/rouge) selon les seuils

#### D. Intégration avec le GEF existant
- [ ] Utiliser la commande `npx create-gef doctor` pour les audits
- [ ] Parser les résultats du doctor pour le dashboard
- [ ] Stocker l'historique des audits

### 3.2. Phase 2 (Growth) — Gouvernance multi-projets

#### A. Gestion multi-projets
- [ ] Ajouter plusieurs dépôts GitHub/GitLab
- [ ] Organiser par équipes/organisations
- [ ] Vue d'ensemble de tous les projets
- [ ] Filtres par équipe, stack, conformité

#### B. Rapports & Analytics
- [ ] Rapports PDF/CSV exportables
- [ ] Comparaison entre projets
- [ ] Tendance dans le temps (30j, 90j, 1an)
- [ ] Alertes email sur les seuils critiques

#### C. Configuration centralisée
- [ ] Interface web pour configurer les règles GEF
- [ ] Application automatique des configs sur les dépôts
- [ ] Gestion des templates de configuration
- [ ] Historique des changements de config

### 3.3. Phase 3 (Enterprise) — Features enterprise

#### A. SSO & RBAC
- [ ] SSO via Okta, Auth0, Azure AD
- [ ] Role-Based Access Control (Admin, Viewer, Contributor)
- [ ] Audit logs des actions utilisateurs
- [ ] Compliance SOC2 Type II

#### B. API & Intégrations
- [ ] API REST pour l'intégration avec d'autres outils
- [ ] Webhooks pour les événements (audit échoué, seuil critique)
- [ ] Intégration Slack/Teams pour les notifications
- [ ] Intégration Jira/Linear pour les tickets

#### C. Support Premium
- [ ] Support dédié (email, chat)
- [ ] SLA garantis (99.9% uptime)
- [ ] Formation on-site
- [ ] Services de consulting personnalisés

## 4. Acceptance Criteria (Critères d'Acceptation)

### Phase 1 (MVP)
- [AC1] Un utilisateur peut s'inscrire et connecter un dépôt GitHub
- [AC2] Le dashboard affiche les 4 métriques DORA en temps réel
- [AC3] Les métriques sont comparées aux benchmarks industry
- [AC4] Le score de conformité GEF est calculé et affiché
- [AC5] L'historique des audits est stocké et visualisable

### Phase 2 (Growth)
- [AC6] Un utilisateur peut ajouter plusieurs dépôts
- [AC7] Les rapports PDF/CSV sont générables et exportables
- [AC8] Les alertes email sont configurables et fonctionnelles
- [AC9] La configuration centralisée s'applique sur les dépôts

### Phase 3 (Enterprise)
- [AC10] Le SSO fonctionne avec Okta/Auth0/Azure AD
- [AC11] Le RBAC contrôle les accès correctement
- [AC12] L'API REST est documentée et fonctionnelle
- [AC13] Les webhooks et intégrations Slack/Teams fonctionnent

## 5. Non-Requirements (Hors Périmètre)

- Hébergement des dépôts clients (GEF Cloud ne fait que scanner)
- Modification automatique du code applicatif
- Support de systèmes de CI autres que GitHub Actions et GitLab CI
- Remplacement des outils existants (SonarQube, etc.) — complémentaire

## 6. Technical Notes

### 6.1. Stack technique suggérée
- **Frontend** : Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend** : Node.js/Express ou Next.js API Routes
- **Database** : PostgreSQL (métriques) + Redis (cache)
- **Auth** : NextAuth.js ou Clerk
- **Hosting** : Vercel (frontend) + Railway/Render (backend)
- **Monitoring** : Sentry, LogRocket

### 6.2. Architecture

```
GEF Cloud Architecture
├── Frontend (Next.js)
│   ├── Dashboard DORA
│   ├── Configuration UI
│   └── Rapports
├── Backend (Node.js)
│   ├── API REST
│   ├── GitHub/GitLab Integration
│   └── Webhooks
├── Worker (Node.js)
│   ├── Scheduled scans (doctor)
│   └── Event processing
└── Database
    ├── PostgreSQL (métriques, configs)
    └── Redis (cache, queues)
```

### 6.3. Intégration avec le GEF existant
- Utiliser le package npm `create-gef` comme CLI
- Le worker exécute `npx create-gef doctor` sur les dépôts
- Parser les résultats JSON/STDOUT du doctor
- Stocker les résultats en base de données

## 7. Risques et Mitigations

| Risque | Mitigation |
|--------|------------|
| Adoption faible (les développeurs n'aiment pas être surveillés) | Positionner comme outil d'aide, pas de contrôle. Freemium généreux. |
| Concurrence (GitHub, GitLab peuvent intégrer des features similaires) | Différenciation par l'IA-first et l'holisme (code + sécurité + docs + architecture). |
| Performance (scanner des milliers de dépôts) | Architecture scalable avec workers, queue system, cache Redis. |
| Sécurité (gestion des secrets et données clients) : Utiliser des secrets managers, encryption at rest, compliance SOC2. |
| Pricing difficile à monétiser un produit open-source | Freemium : core gratuit, features entreprise payantes. |

## 8. Modèle Business

### Freemium
- **Free** : Package npm + communauté (1 projet, dashboard basique)
- **Pro ($10/dev/mois)** : Dashboard DORA complet + gouvernance multi-projets (illimité)
- **Enterprise ($500/team/mois)** : SSO, RBAC, API, support dédié, SLA

### Pricing alternatives
- **Usage-based** : Facturation par nombre de dépôts/scans
- **License** : $49/dev/an pour les features enterprise

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*
