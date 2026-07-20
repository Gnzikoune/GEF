#!/bin/bash
# GEF Project Generator (Linux/Mac/GitBash)

if [ -z "$1" ]; then
  echo "Usage: ./gef-new.sh <nom-du-projet> [--lang python|node|other]"
  exit 1
fi

PROJECT_NAME=$1
LANG="other"

if [ "$2" == "--lang" ] && [ -n "$3" ]; then
  LANG=$3
fi

# Répertoire source de GEF (on suppose que le script est dans GEF/generator)
GEF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Initialisation du projet $PROJECT_NAME (Lang: $LANG)..."

if [ -d "$PROJECT_NAME" ]; then
  echo -e "\033[33mLe dossier $PROJECT_NAME existe déjà.\033[0m"
  read -p "Voulez-vous écraser/fusionner ? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Annulé."
    exit 1
  fi
else
  mkdir -p "$PROJECT_NAME"
fi

cd "$PROJECT_NAME" || exit 1

# 1. Arborescence
echo "📁 Création de l'arborescence standard..."
mkdir -p docs/adr docs/research src tests scripts .github/workflows assets infra docker database

# 2. README.md
echo "📝 Génération du README.md..."
cat > README.md <<EOF
# $PROJECT_NAME

## Fonctionnalités
<À COMPLÉTER>

## Installation
<À COMPLÉTER>

## Architecture
<À COMPLÉTER>
EOF

# 3. PROJECT_CONFIG.md
echo "⚙️  Génération de PROJECT_CONFIG.md..."
if [ -f "$GEF_DIR/PROJECT_CONFIG.template.md" ]; then
  cp "$GEF_DIR/PROJECT_CONFIG.template.md" PROJECT_CONFIG.md
else
  cat > PROJECT_CONFIG.md <<EOF
# PROJECT_CONFIG.md
- Projet : $PROJECT_NAME
- Langage : $LANG
<À COMPLÉTER avec les spécificités du projet>
EOF
fi

# 4. RESEARCH_LOG.md
echo "🔬 Génération de RESEARCH_LOG.md..."
cat > docs/research/RESEARCH_LOG.md <<EOF
# Research Log — Journal de bord scientifique
> Documentez ici la résolution des bugs bloquants et problèmes critiques.

## 1. <Titre du premier problème>
- **Contexte :** 
- **Cause :** 
- **Résolution :** 
EOF

# 5. .gitignore
echo "🙈 Génération de .gitignore..."
cat > .gitignore <<EOF
# Standard
.env
.DS_Store

# Dépendances locales et caches
node_modules/
__pycache__/
venv/
.venv/
.pytest_cache/
coverage/
dist/
build/
EOF

# 6. Initialisation Git et Hooks
echo "🔗 Initialisation Git et installation des hooks..."
git init
if [ -d "$GEF_DIR/hooks" ]; then
  cp -r "$GEF_DIR/hooks/." .git/hooks/
  chmod +x .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push
fi

# 7. CI/CD Template
echo "🤖 Copie du template CI/CD..."
if [ -d "$GEF_DIR/ci-templates" ]; then
  cp "$GEF_DIR/ci-templates/main.yml" .github/workflows/ 2>/dev/null || true
fi

# Fichiers vides supplémentaires
touch CHANGELOG.md LICENSE

echo -e "\033[32m✅ Projet $PROJECT_NAME initialisé avec succès conforme au GEF !\033[0m"
echo "Actions requises :"
echo "1. Éditer PROJECT_CONFIG.md avec vos spécificités."
echo "2. Effectuer le premier commit."
