param (
    [Parameter(Mandatory=$false, Position=0)]
    [string]$ProjectName,
    
    [string]$Lang = "other"
)

if (-not $ProjectName) {
    Write-Host "Usage: .\gef-new.ps1 <nom-du-projet> -Lang <python|node|other>"
    exit 1
}

# Répertoire source de GEF
$GefDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$GefDir = Split-Path -Parent $GefDir

Write-Host "🚀 Initialisation du projet $ProjectName (Lang: $Lang)..." -ForegroundColor Cyan

if (Test-Path $ProjectName) {
    Write-Host "Le dossier $ProjectName existe déjà." -ForegroundColor Yellow
    $confirm = Read-Host "Voulez-vous écraser/fusionner ? (O/N)"
    if ($confirm -notmatch '^[OoYy]$') {
        Write-Host "Annulé."
        exit 1
    }
} else {
    New-Item -ItemType Directory -Force -Path $ProjectName | Out-Null
}

Set-Location $ProjectName

# 1. Arborescence
Write-Host "📁 Création de l'arborescence standard..."
$dirs = @("docs/adr", "docs/research", "src", "tests", "scripts", ".github/workflows", "assets", "infra", "docker", "database")
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# 2. README.md
Write-Host "📝 Génération du README.md..."
@"
# $ProjectName

## Fonctionnalités
<À COMPLÉTER>

## Installation
<À COMPLÉTER>

## Architecture
<À COMPLÉTER>
"@ | Set-Content -Path "README.md" -Encoding UTF8

# 3. PROJECT_CONFIG.md
Write-Host "⚙️  Génération de PROJECT_CONFIG.md..."
$configTemplate = Join-Path $GefDir "PROJECT_CONFIG.template.md"
if (Test-Path $configTemplate) {
    Copy-Item -Path $configTemplate -Destination "PROJECT_CONFIG.md"
} else {
@"
# PROJECT_CONFIG.md
- Projet : $ProjectName
- Langage : $Lang
<À COMPLÉTER avec les spécificités du projet>
"@ | Set-Content -Path "PROJECT_CONFIG.md" -Encoding UTF8
}

# 4. RESEARCH_LOG.md
Write-Host "🔬 Génération de RESEARCH_LOG.md..."
@"
# Research Log — Journal de bord scientifique
> Documentez ici la résolution des bugs bloquants et problèmes critiques.

## 1. <Titre du premier problème>
- **Contexte :** 
- **Cause :** 
- **Résolution :** 
"@ | Set-Content -Path "docs/research/RESEARCH_LOG.md" -Encoding UTF8

# 5. .gitignore
Write-Host "🙈 Génération de .gitignore..."
@"
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
"@ | Set-Content -Path ".gitignore" -Encoding UTF8

# 6. Initialisation Git et Hooks
Write-Host "🔗 Initialisation Git et installation des hooks..."
git init
$hooksDir = Join-Path $GefDir "hooks"
if (Test-Path $hooksDir) {
    Copy-Item -Path "$hooksDir\*" -Destination ".git\hooks\" -Recurse -Force
}

# 7. CI/CD Template
Write-Host "🤖 Copie du template CI/CD..."
$ciTemplate = Join-Path $GefDir "ci-templates\main.yml"
if (Test-Path $ciTemplate) {
    Copy-Item -Path $ciTemplate -Destination ".github\workflows\" -Force
}

# Fichiers vides supplémentaires
New-Item -ItemType File -Force -Path "CHANGELOG.md" | Out-Null
New-Item -ItemType File -Force -Path "LICENSE" | Out-Null

Write-Host "✅ Projet $ProjectName initialisé avec succès conforme au GEF !" -ForegroundColor Green
Write-Host "Actions requises :"
Write-Host "1. Éditer PROJECT_CONFIG.md avec vos spécificités."
Write-Host "2. Effectuer le premier commit."
