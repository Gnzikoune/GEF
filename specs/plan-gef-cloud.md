# Plan d'Implémentation — GEF Cloud SaaS

**Issue:** #85
**Spec:** specs/spec-gef-cloud.md
**Date:** 2026-08-11

---

## 1. Design Architecture

### 1.1. Structure du Projet

```
gef-cloud/
├── apps/
│   ├── web/                 ← Frontend Next.js (Dashboard, Configuration)
│   └── api/                 ← Backend Node.js (API, Webhooks, Workers)
├── packages/
│   ├── database/            ← Shared database schemas & migrations
│   ├── shared/              ← Shared utilities (types, constants)
│   └── ui/                  ← Shared UI components (shadcn/ui)
├── workers/
│   └── scanner/             ← Worker pour exécuter les scans doctor
└── docs/
    └── adr/                 ← Architecture Decision Records
```

### 1.2. Flux d'Architecture

```
User (Dashboard)
    ↓
Frontend (Next.js)
    ↓
Backend API (Node.js)
    ↓
GitHub/GitLab API (OAuth)
    ↓
Worker (scan doctor)
    ↓
Database (PostgreSQL + Redis)
    ↓
Frontend (visualisation)
```

### 1.3. Stack Technique

- **Frontend** : Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Recharts
- **Backend** : Node.js, Express ou Next.js API Routes
- **Database** : PostgreSQL (Prisma ORM), Redis (cache)
- **Auth** : NextAuth.js (GitHub, Google OAuth)
- **Hosting** : Vercel (frontend) + Railway/Render (backend + database)
- **Monitoring** : Sentry, LogRocket
- **CI/CD** : GitHub Actions

---

## 2. Phase 1 (MVP) — Dashboard DORA pour un seul projet

### 2.1. Tâches Détaillées

#### Lot A — Infrastructure de base
- [ ] Créer le monorepo (Turborepo ou Nx)
- [ ] Configurer Next.js 14 avec App Router
- [ ] Configurer shadcn/ui pour les composants
- [ ] Configurer Prisma + PostgreSQL
- [ ] Configurer Redis pour le cache
- [ ] Configurer NextAuth.js avec GitHub OAuth

#### Lot B — Authentification & Onboarding
- [ ] Page d'inscription (email/password)
- [ ] Page de connexion (email/password, GitHub OAuth)
- [ ] Page de connexion de dépôt GitHub (OAuth)
- [ ] Scan initial du dépôt (baseline)
- [ ] Page de bienvenue (first-run experience)

#### Lot C — Dashboard DORA
- [ ] Page Dashboard avec layout responsive
- [ ] Widget Deployment Frequency (graphique ligne)
- [ ] Widget Lead Time for Changes (graphique bar)
- [ ] Widget Change Failure Rate (gauge/pie)
- [ ] Widget Time to Restore (graphique ligne)
- [ ] Score global de conformité GEF (radial progress)
- [ ] Comparaison avec benchmarks industry (tableau de comparaison)

#### Lot D — Intégration avec le GEF existant
- [ ] Worker pour exécuter `npx create-gef doctor`
- [ ] Parser les résultats du doctor (STDOUT → JSON)
- [ ] Stocker les résultats en PostgreSQL
- [ ] Cache les résultats dans Redis (TTL 1h)
- [ ] Scheduled task (cron) pour scans automatiques (quotidiens)

#### Lot E — Tests & Déploiement
- [ ] Tests unitaires (Jest/Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Setup CI/CD GitHub Actions
- [ ] Déploiement sur Vercel (frontend)
- [ ] Déploiement sur Railway (backend + database)

**Estimation Phase 1 :** 3-4 mois

---

## 3. Phase 2 (Growth) — Gouvernance multi-projets

### 3.1. Tâches Détaillées

#### Lot A — Gestion multi-projets
- [ ] Page "Mes Projets" (liste des dépôts connectés)
- [ ] Formulaire d'ajout de dépôt (GitHub/GitLab)
- [ ] Organisation par équipes/organisations
- [ ] Tags et filtres (team, stack, conformité)
- [ ] Vue d'ensemble de tous les projets (tableau de bord)

#### Lot B — Rapports & Analytics
- [ ] Page "Rapports" avec générateur de rapports
- [ ] Export PDF (Puppeteer ou jsPDF)
- [ ] Export CSV
- [ ] Comparaison entre projets (graphique comparatif)
- [ ] Tendance dans le temps (30j, 90j, 1an)
- [ ] Alertes email (SendGrid ou AWS SES)
- [ ] Configuration des seuils d'alerte

#### Lot C — Configuration centralisée
- [ ] Page "Configuration" pour les règles GEF
- [ ] Wizard de configuration (step-by-step)
- [ ] Templates de configuration (pré-configurés par industrie)
- [ ] Application automatique des configs (GitHub API)
- [ ] Historique des changements de config
- [ ] Rollback des configs

#### Lot D — Business & Monetization
- [ ] Page "Pricing" (Freemium tiers)
- [ ] Intégration Stripe pour les paiements
- [ ] Gestion des abonnements (Pro, Enterprise)
- [ ] Page de facturation
- [ ] Usage analytics (mixpanel ou amplitude)

**Estimation Phase 2 :** 4-6 mois

---

## 4. Phase 3 (Enterprise) — Features enterprise

### 4.1. Tâches Détaillées

#### Lot A — SSO & RBAC
- [ ] Intégration Okta OAuth
- [ ] Intégration Auth0 OAuth
- [ ] Intégration Azure AD OAuth
- [ ] Page "Gestion des utilisateurs" (admin)
- [ ] Page "Rôles & Permissions" (RBAC)
- [ ] Audit logs des actions utilisateurs
- [ ] Compliance SOC2 Type II (documentation + processus)

#### Lot B — API & Intégrations
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Endpoint GET /api/metrics (métriques DORA)
- [ ] Endpoint POST /api/scans (déclencher scan manuel)
- [ ] Webhooks sur événements (audit échoué, seuil critique)
- [ ] Intégration Slack (notifications)
- [ ] Intégration Microsoft Teams (notifications)
- [ ] Intégration Jira (création de tickets automatique)
- [ ] Intégration Linear (création de tickets automatique)

#### Lot C — Support Premium
- [ ] Page "Support" (tickets, chat)
- [ ] Intégration Intercom ou Zendesk
- [ ] SLA monitoring (Uptime Robot ou Pingdom)
- [ ] Documentation onboarding entreprise
- [ ] Services de consulting (configuration personnalisée)

**Estimation Phase 3 :** 6-8 mois

---

## 5. Roadmap & Milestones

### Milestone 1 : MVP Public (Month 4)
- Dashboard DORA fonctionnel
- Authentification GitHub OAuth
- 1 projet par utilisateur
- Pricing Freemium basique

### Milestone 2 : Growth (Month 10)
- Gouvernance multi-projets
- Rapports PDF/CSV
- Configuration centralisée
- Stripe payments

### Milestone 3 : Enterprise (Month 18)
- SSO & RBAC
- API REST complète
- Intégrations Slack/Teams/Jira
- SOC2 Type II compliance

---

## 6. Critères de Validation

### Phase 1 (MVP)
- [V1] Un utilisateur peut s'inscrire et connecter un dépôt GitHub
- [V2] Le dashboard affiche les 4 métriques DORA en temps réel
- [V3] Les métriques sont comparées aux benchmarks industry
- [V4] Le score de conformité GEF est calculé et affiché
- [V5] L'historique des audits est stocké et visualisable

### Phase 2 (Growth)
- [V6] Un utilisateur peut ajouter plusieurs dépôts
- [V7] Les rapports PDF/CSV sont générables et exportables
- [V8] Les alertes email sont configurables et fonctionnelles
- [V9] La configuration centralisée s'applique sur les dépôts

### Phase 3 (Enterprise)
- [V10] Le SSO fonctionne avec Okta/Auth0/Azure AD
- [V11] Le RBAC contrôle les accès correctement
- [V12] L'API REST est documentée et fonctionnelle
- [V13] Les webhooks et intégrations Slack/Teams fonctionnent

---

## 7. Risques & Mitigations Techniques

| Risque Technique | Mitigation |
|-----------------|------------|
| Rate limits GitHub/GitLab API | Queue system, exponential backoff, cache agressif |
| Performance scans (1000+ dépôts) | Workers horizontaux, partitioning par équipe |
| Sécurité (OAuth tokens) | Encryption at rest, secrets manager (AWS Secrets Manager) |
| Database scalability | Read replicas, connection pooling, indexing optimisé |
| Frontend performance (dashboard lourd) | Server-side rendering, pagination, lazy loading |

---

## 8. Coût & Infrastructure

### Estimation mensuelle (Phase 1)
- **Vercel (frontend)** : $20 (Pro)
- **Railway (backend + database)** : $50 (Starter)
- **Redis (Upstash)** : $10 (Basic)
- **GitHub Actions CI/CD** : $0 (gratuit pour public repo)
- **SendGrid (email)** : $0 (Free tier 100 emails/jour)
- **Sentry (monitoring)** : $26 (Developer)
- **Total** : ~$106/mois

### Estimation mensuelle (Phase 2-3)
- **Vercel (frontend)** : $20-100 (Pro → Business)
- **Railway (backend + database)** : $50-500 (Starter → Pro)
- **Redis (Upstash)** : $10-50 (Basic → Growth)
- **GitHub Actions CI/CD** : $0-50 (gratuit → paid)
- **SendGrid (email)** : $0-100 (Free → Essentials)
- **Sentry (monitoring)** : $26-80 (Developer → Team)
- **Total** : ~$106-880/mois

---

## 9. Go-to-Market Strategy

### Phase 1 (Lancement)
- **Beta closed** : 10-20 utilisateurs sélectionnés (communauté GEF)
- **Feedback loops** : Interviews, surveys, usage analytics
- **Product Hunt launch** : Présentation comme "Dashboard DORA pour les équipes IA-first"

### Phase 2 (Growth)
- **Content marketing** : Blog posts, tutorials, case studies
- **Community building** : Discord/Slack, webinars, workshops
- **Partnerships** : Intégrations avec des outils populaires (Vercel, Railway)

### Phase 3 (Enterprise)
- **Sales outbound** : Cibles entreprises tech (50-500 devs)
- **Enterprise features** : SSO, RBAC, SLA, compliance
- **Events & conferences** : Présentations tech meetups, conférences

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*
