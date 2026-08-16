# Usage Guide - GEF Commands

This document contains detailed examples of GEF command usage.

## Compliance as Code

The GEF Compliance as Code allows you to define engineering rules declaratively via a `compliance.yml` file. This file contains:

- **Hard Limits**: Code limits (max_function_lines, max_params, max_complexity, etc.)
- **Security Rules**: OWASP security rules (jwt_expiry, rate_limit, secret_detection)
- **Git Strategy**: Git workflow configuration (GitHub Flow, Trunk-Based)
- **DORA Targets**: DORA metrics targets (deployment_frequency, lead_time, etc.)
- **Extensions**: Enabled extensions and custom rules

```bash
# Generate compliance.yml file
npx create-gef compliance generate

# Validate compliance.yml file
npx create-gef compliance validate

# Apply rules to Git hooks
npx create-gef compliance apply-hooks

# Apply rules to CI/CD
npx create-gef compliance apply-ci
```

## Certification System

The GEF Certification System allows you to obtain an official certification level based on GEF compliance and DORA metrics. Available levels:

- **Bronze**: GEF ≥ 60%, DORA ≥ 40%
- **Silver**: GEF ≥ 70%, DORA ≥ 60%
- **Gold**: GEF ≥ 85%, DORA ≥ 80%
- **Platinum**: GEF ≥ 95%, DORA ≥ 95%

```bash
# Check possible certification level
npx create-gef certify check

# Generate badge and certification report
npx create-gef certify generate
```

The system generates:
- SVG badge for README.md
- Public certification report (GEF_CERTIFICATION_REPORT.md)
- Audit trail with date and scores

## Extension System

The GEF Extension System allows you to install specific rule packs by industry, framework, or security standard. Available extensions include:

- **Healthcare**: HIPAA rules for health data protection
- **Finance**: PCI-DSS rules for financial compliance
- **Security**: Extended OWASP for enhanced security

```bash
# Install an extension
npx create-gef extension install healthcare

# List installed and available extensions
npx create-gef extension list

# Remove an extension
npx create-gef extension remove healthcare
```

Extensions automatically update the `compliance.yml` file with domain-specific rules.

## DORA Metrics

The GEF DORA Metrics allows you to analyze key DevOps metrics according to DevOps Research and Assessment standards. The 4 key metrics are:

- **Deployment Frequency**: Production deployment frequency
- **Lead Time for Changes**: Time between commit and deployment
- **Change Failure Rate (CFR)**: Percentage of deployments causing incidents
- **Mean Time to Restore (MTTR)**: Average time to restore service

```bash
# Analyze DORA trends over 30 days
npx create-gef dora trends
```

The command generates an analysis report with:
- Weekly data grouping (4 periods)
- Weekly metric calculations
- Mermaid charts for visualization
- Report under `docs/research/DORA_TRENDS.md`

DORA industry benchmarks are integrated:
- **Elite**: On-demand, < 1h lead time, < 15% CFR, < 1h MTTR
- **High**: 1/week-1/month, < 1 week, < 20% CFR, < 1 day MTTR
- **Medium**: 1/month-6/months, < 6 months, < 30% CFR, < 1 week MTTR
- **Low**: < 1/month, > 6 months, > 30% CFR, > 1 week MTTR

These metrics are also integrated in the Certification System for GEF/DORA correlation.

## Create an Extension

GEF provides a template to easily create extensions. See [`templates/extension-template/README.md`](../templates/extension-template/README.md) for the complete guide.

Basic structure:
```bash
templates/extension-template/
├── package.json          # Extension metadata
├── extension.json        # GEF rules configuration
├── rules/               # Specific rules (optional)
├── templates/           # File templates (optional)
└── README.md            # Documentation
```

## Local Framework Development

If you are modifying the GEF framework itself and want to test the CLI locally:

```bash
# 1. Clone the repository
git clone https://github.com/Gnzikoune/GEF.git GEF
cd GEF

# 2. Install dependencies
npm install

# 3. Make the local command globally accessible
npm link
```

---

*For more information, see [README.en.md](../README.en.md)*