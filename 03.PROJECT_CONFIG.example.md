# PROJECT_CONFIG.md — Exemple (BantuVoice)

> Ce fichier contient tout ce qui est **spécifique à ce projet**. Il complète le `ENGINEERING_PLAYBOOK.md` universel, qui ne doit lui jamais contenir ces informations.

---

## Identification

- **Projet :** BantuVoice
- **Porteurs :** Gildas & Aryad (Pôle Technique & Innovation, CSGR-IA)
- **Dernière mise à jour :** Juin 2026

---

## Architecture Cloud-Native (Floci.io / AWS)

Toute donnée persistante (audios, segments, langues, utilisateurs) doit passer par les services AWS simulés localement :

- **Audios bruts** → Amazon S3 (bucket `bantuvoice-audios`)
- **Métadonnées, segments, langues, utilisateurs** → Amazon DynamoDB

## Rôles et Permissions

- **JWT :** Durée de vie 24h.
- Les routes admin (`/admin/*`) vérifient systématiquement le rôle via `Depends(require_admin)`.
- Les linguistes ne doivent jamais pouvoir accéder aux endpoints d'administration.

## Jalons de Release

| Version | Jalon correspondant |
|---------|---------------------|
| `v0.1.0-mvp` | MVP fonctionnel : Pipeline d'ingestion + Annotation + Dashboard Admin |
| `v0.2.0` | Première fonctionnalité majeure post-MVP (export CSV, gestion multi-utilisateurs) |
| `v1.0.0` | Premier corpus publié sur Hugging Face, prêt pour la communauté scientifique |

## Packages GitHub

Non utilisé pour l'instant. À envisager uniquement si les scripts d'export sont publiés comme bibliothèque Python réutilisable (`pip install bantuvoice-tools`).

## Couverture de tests minimale

À définir — non spécifiée à ce jour.
