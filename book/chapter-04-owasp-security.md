# Chapitre 4 : Sécurité OWASP par Design

## 4.1. "La complexité est l'ennemie de la sécurité"

Cette phrase, inscrite au cœur du Playbook GEF, résume une vérité fondamentale en sécurité logicielle : plus le code est complexe, plus il est vulnérable.

Pourquoi ?

### 1. La complexité crée des angles morts

Une fonction avec une complexité cyclomatique de 15 a 15 chemins d'exécution différents. Pour tester cette fonction de manière exhaustive, il faut écrire 15 tests. Pour la comprendre, il faut mentalement tracer 15 scénarios.

En pratique, personne ne le fait. Les développeurs testent le "chemin heureux" (le scénario nominal) et peut-être 2-3 cas d'erreur. Les 10-12 autres chemins restent non testés et non compris. C'est dans ces angles morts que les vulnérabilités se cachent.

### 2. La complexité masque les failles

Un code simple est facile à auditer. Un développeur expérimenté peut lire une fonction de 10 lignes et identifier immédiatement les problèmes potentiels : validation manquante, injection SQL possible, XSS non protégée.

Un code complexe de 100 lignes avec 5 niveaux d'imbrication est beaucoup plus difficile à auditer. Les failles sont noyées dans la complexité, rendues invisibles par la surcharge cognitive.

### 3. La complexité augmente la surface d'attaque

Chaque condition, chaque boucle, chaque appel de fonction est une opportunité pour une erreur. Plus il y a de code, plus il y a d'opportunités pour des bugs de sécurité.

GEF attaque ce problème à la racine en limitant la complexité via les Hard Limits du Clean Code quantitatif. Une fonction qui ne peut pas dépasser 30 lignes et 10 de complexité cyclomatique est intrinsèquement plus sûre qu'une fonction illimitée.

Mais GEF va plus loin : il applique les principes OWASP avec des limites chiffrées strictes.

## 4.2. Zero Trust et validation stricte

Le principe Zero Trust en sécurité est simple : ne jamais faire confiance aux entrées, qu'elles viennent d'un utilisateur, d'une API externe, ou même de composants internes.

GEF impose cette validation à trois niveaux :

### Niveau 1 : Validation à la frontière

Toute entrée doit être validée dès qu'elle franchit la frontière du système :

- Requêtes HTTP : validation des paramètres, headers, body
- API externes : validation des réponses
- Base de données : validation des données récupérées
- Fichiers : validation du type, taille, contenu

GEF recommande l'utilisation de bibliothèques de validation comme Zod (TypeScript/JavaScript) ou Joi (Node.js).

**Exemple avec Zod :**
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
  name: z.string().min(2).max(100),
});

function createUser(input: unknown) {
  const user = UserSchema.parse(input);
  // Si input invalide, lance une erreur avant toute logique métier
  // ...
}
```

### Niveau 2 : Typage strict

GEF impose l'utilisation de typage strict (TypeScript pour JavaScript/Node.js, mypy pour Python). Le typage statique capture de nombreuses erreurs à la compilation, avant même que le code ne s'exécute.

**tsconfig.json (généré par GEF) :**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Niveau 3 : Sanitisation à la sortie

Même après validation, les données doivent être sanitizées avant d'être utilisées dans des contextes sensibles :

- HTML : encodage pour prévenir XSS
- SQL : requêtes paramétrées pour prévenir SQLi
- URL : encodage pour prévenir les attaques par URL
- JSON : échappement pour prévenir les injections JSON

## 4.3. Hard Limits de sécurité

Comme pour le Clean Code, GEF définit des Hard Limits chiffrés pour la sécurité. Ces limites sont basées sur les standards OWASP et les meilleures pratiques de l'industrie.

### Authentification & Sessions

| Paramètre | Limite | Justification |
|---|---|---|
| Access Token (JWT) | 15 minutes max | Réduit la fenêtre d'exploitation si un token est volé |
| Refresh Token | 7 jours max (HttpOnly) | Équilibre entre UX et sécurité ; HttpOnly prévient le vol via XSS |

Ces limites sont configurées dans le code généré par GEF et documentées dans le Playbook.

**Exemple de configuration JWT :**
```typescript
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const accessToken = jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
const refreshToken = jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
```

### Limites de Charge (Payload Limits)

Les limites de payload protègent contre les attaques par déni de service (DoS) où un attaquant envoie des requêtes massives pour saturer le serveur.

| Paramètre | Limite (Standard) | Limite (Mission Critical) |
|---|---|---|
| Corps de requête API (JSON) | 1 Mo max | 100 Ko max |
| Upload d'image | 5 Mo max | 1 Mo max |

Ces limites sont configurées dans :
- Le serveur (Express, FastAPI, etc.)
- Le load balancer (Nginx, AWS ALB)
- La CI/CD (tests de charge)

**Exemple avec Express :**
```typescript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
```

### Anti-Brute Force (Rate Limiting)

Les attaques par force brute tentent de deviner des mots de passe ou des tokens en essayant des milliers de combinaisons. GEF impose deux protections :

1. **Blocage après échecs** : Bloquer un compte/IP pendant 15 minutes après 5 tentatives échouées
2. **Limite globale** : 100 requêtes API / minute / IP

Ces protections sont implémentées via :
- Middleware de rate limiting (express-rate-limit, flask-limiter)
- Base de données Redis pour stocker les tentatives
- CI/CD pour tester la résistance aux attaques

**Exemple avec express-rate-limit :**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes, réessayez plus tard',
});

app.use('/api/', limiter);
```

## 4.4. Rate limiting et anti-brute force

Le rate limiting est une protection essentielle contre plusieurs types d'attaques :

### 1. Force brute sur l'authentification

Sans rate limiting, un attaquant peut essayer des milliers de combinaisons mot de passe / utilisateur par seconde. Avec rate limiting, il est limité à quelques tentatives par minute.

### 2. DDoS (Distributed Denial of Service)

Une attaque DDoS inonde le serveur de requêtes pour le rendre indisponible. Le rate limiting par IP limite l'impact de chaque attaquant.

### 3. Scraping abusif

Des scrapers malveillants peuvent extraire des données en masse via l'API. Le rate limiting limite la vitesse d'extraction.

### Implémentation GEF

GEF génère automatiquement la configuration de rate limiting adaptée à votre stack :

**Express (Node.js) :**
```typescript
import rateLimit from 'express-rate-limit';

// Limite globale
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});

// Limite d'authentification (plus stricte)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: true,
});
```

**FastAPI (Python) :**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/login")
@limiter.limit("5/15minutes")
async def login(request: Request):
    # Logique d'authentification
    pass
```

## 4.5. Fail-Safe Defaults

Le principe Fail-Safe stipule que si un système échoue, il doit échouer dans un état sécurisé. En d'autres termes : en cas de doute, refuser l'accès plutôt que de l'accorder.

GEF applique ce principe à plusieurs niveaux :

### 1. Par défaut : refus

Toute permission est refusée par défaut. Les permissions doivent être accordées explicitement.

**Mauvais (allow by default) :**
```typescript
const permissions = ['read', 'write', 'delete'];
if (user.role === 'admin') {
  // Admin a tous les droits
}
```

**Bon (deny by default) :**
```typescript
const permissions: Record<string, string[]> = {
  admin: ['read', 'write', 'delete'],
  user: ['read'],
  guest: [],
};

const userPermissions = permissions[user.role] || [];
if (userPermissions.includes('delete')) {
  // Explicite : seul admin peut supprimer
}
```

### 2. Validation stricte des types

En cas de doute sur le type d'une donnée, rejeter plutôt que tenter une conversion.

**Mauvais :**
```typescript
const age = parseInt(input); // Si input = "abc", age = NaN (silencieux)
```

**Bon :**
```typescript
const age = parseInt(input);
if (isNaN(age)) {
  throw new ValidationError('Age must be a number');
}
```

### 3. Gestion des erreurs

En cas d'erreur, ne jamais exposer de détails techniques au client. Renvoyer une erreur générique avec un ID de log pour le debugging interne.

**Mauvais :**
```typescript
res.status(500).json({ error: 'Database connection failed: connection timeout to postgresql://user:pass@localhost:5432/db' });
```

**Bon :**
```typescript
const errorId = generateErrorId();
logger.error(`[${errorId}] Database connection failed`, { originalError });
res.status(500).json({ error: 'Internal server error', errorId });
```

## 4.6. Protection SQLi et XSS

### Injection SQL (SQLi)

L'injection SQL est une vulnérabilité où un attaquant manipule les requêtes SQL en injectant du code malveillant via les entrées utilisateur.

**Vulnérable :**
```typescript
const query = `SELECT * FROM users WHERE name = '${userName}'`;
// Si userName = "' OR '1'='1", la requête devient :
// SELECT * FROM users WHERE name = '' OR '1'='1' -- retourne tous les utilisateurs
```

**Protégé (requêtes paramétrées) :**
```typescript
const query = 'SELECT * FROM users WHERE name = $1';
const result = await pool.query(query, [userName]);
// La base de données traite userName comme une donnée, pas du code
```

GEF impose l'utilisation de requêtes paramétrées et génère des templates qui utilisent des ORM ou des query builders sécurisés (Prisma, TypeORM, SQLAlchemy).

### Cross-Site Scripting (XSS)

Le XSS est une vulnérabilité où un attaquant injecte du script malveillant dans une page web, qui s'exécute ensuite dans le navigateur des victimes.

**Vulnérable :**
```typescript
const comment = req.body.comment; // Si comment = "<script>alert('XSS')</script>"
res.send(`<div>${comment}</div>`); // Le script s'exécute
```

**Protégé (encodage) :**
```typescript
import { escape } from 'lodash';

const comment = escape(req.body.comment);
res.send(`<div>${comment}</div>`);
// Le script est encodé en &lt;script&gt;... et ne s'exécute pas
```

GEF recommande l'utilisation de frameworks modernes (React, Vue, Svelte) qui encodent automatiquement les données par défaut, et génère des configurations de Content Security Policy (CSP) pour une protection supplémentaire.

## 4.7. Gestion des secrets

La gestion des secrets est un aspect critique de la sécurité. Les secrets incluent :
- Clés API
- Mots de passe de base de données
- Tokens d'authentification
- Certificats SSL
- Clés de chiffrement

GEF impose deux règles strictes :

### 1. Jamais hardcodés

Les secrets ne doivent jamais être hardcodés dans le code source. Ils doivent toujours être stockés dans des variables d'environnement.

**Mauvais :**
```typescript
const API_KEY = 'sk-1234567890abcdef'; // Jamais !
```

**Bon :**
```typescript
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}
```

### 2. Toujours via .env

GEF génère un fichier `.env.example` template qui liste toutes les variables d'environnement requises, sans les valeurs. Les développeurs créent leur propre `.env` avec les valeurs réelles.

**.env.example (généré par GEF) :**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

**.env (créé par le développeur) :**
```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb
API_KEY=sk-1234567890abcdef
JWT_SECRET=my-super-secret-key
```

GEF configure également `.gitignore` pour s'assurer que `.env` n'est jamais commité dans le dépôt.

### 3. Rotation des secrets

GEF documente la pratique de rotation des secrets : les secrets doivent être changés régulièrement (par exemple tous les 90 jours) et immédiatement en cas de compromission suspectée.

## Résumé du chapitre

La sécurité OWASP par Design dans GEF repose sur le principe que "la complexité est l'ennemie de la sécurité". En limitant la complexité via les Hard Limits du Clean Code, GEF réduit intrinsèquement la surface d'attaque.

GEF applique le principe Zero Trust avec validation stricte à trois niveaux : validation à la frontière, typage strict, et sanitisation à la sortie. Les Hard Limits de sécurité incluent des limites chiffrées pour les tokens JWT (15 minutes max), les payloads (1 Mo max pour Standard), et le rate limiting (100 requêtes/minute/IP).

Le principe Fail-Safe est appliqué : en cas de doute, refuser l'accès. Les protections contre SQLi et XSS sont imposées via l'utilisation de requêtes paramétrées et l'encodage automatique. Enfin, la gestion des secrets est strictement encadrée : jamais hardcodés, toujours via variables d'environnement, avec rotation régulière.

Dans le chapitre suivant, nous explorerons comment GEF applique ces principes à la traçabilité via Git Flow et les hooks.
