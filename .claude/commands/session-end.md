# /session-end — Cloturer une session Foundation OS

Journalise la session, met a jour CONTEXT.md, et produit le brief de cloture v11 (TDAH-friendly).
Ref spec : `docs/core/communication.md` + CLAUDE.md section "Briefs session".

## Phase 1 — Inventaire des changements

1. `git diff --name-status HEAD` : fichiers crees (A), modifies (M), supprimes (D) cette session
2. Si aucun changement → brief minimal "Session sans modification" + skip phases 3-5

## Phase 2 — Verification coherence + technique (parallele)

Lancer en parallele :

1. **Structure** :
   - Aucun nouveau fichier a la racine (sinon le deplacer)
   - `bash scripts/ref-checker.sh` : references cassees
   - Modules dans CONTEXT.md correspondent a `modules/` sur le filesystem
2. **Build** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
3. **Tests** : pour chaque module avec tests → `npm test -w modules/[nom]`
4. **Health-check** : `bash scripts/health-check.sh`

## Phase 3 — Classifier la session

| Statut | Condition |
|--------|-----------|
| **DONE** | Toutes taches finies, build + tests verts, health SAIN |
| **DONE_WITH_CONCERNS** | Livre mais dette/risque a documenter |
| **NEEDS_CONTEXT** | Bloque par manque d'info Kevin |
| **BLOCKED** | Impossible de continuer (bug externe, dep cassee) |

DONE n'est valide que si **tout** est vert et **toutes** les taches du scope sont livrees.
Si health DEGRADED mais aucun nouveau warning introduit cette session → DONE acceptable.

## Phase 4 — Capture d'idees

Passer en revue la session et extraire les reflexions/pistes qui meritent de survivre :

- Pistes techniques non explorees ("on pourrait faire X pour Y")
- Questions strategiques ("est-ce qu'on devrait Z avant W ?")
- Options gardees pour plus tard
- Retours d'experience

Ne PAS capturer : taches concretes (→ Cap), decisions tranchees (→ Decisions), bugs a fixer (→ Cap).

## Phase 5 — Mettre a jour CONTEXT.md

Mettre a jour chaque section dans cet ordre. Pour chaque section, verifier si un changement est pertinent. Si rien n'a change → ne pas toucher.

### 5.1 Sessions recentes
- Ajouter cette session en tete au format structure :
  ```
  | YYYY-MM-DD | **[STATUT] Titre court** |
  |            | Scope : ce qui a ete touche |
  |            | Decisions : D-XX-01 titre (si applicable) |
  |            | Idees capturees : bullets (si applicable) |
  |            | Commits : hash titre |
  ```
- Derniere session : 4-8 lignes. Les sessions 2-5 : comprimer a 1-2 lignes.
- Supprimer la 6e si > 5.
- Prefixer `[STATUT]` si != DONE.

### 5.2 Cap
- Mettre a jour la direction si elle a change
- Actualiser les pistes A/B/C

### 5.3 Idees & Parking
- Ajouter les idees capturees (phase 4) avec emoji 💡/🔮/❓ et source (session du YYYY-MM-DD)
- Supprimer les idees resolues (faites ou rejetees)
- Si > 10 entrees → prioriser, archiver ou supprimer le surplus

### 5.4 En attente Kevin
- Ajouter si nouvelle action/question humaine
- Retirer si resolue cette session

### 5.5 Decisions
- Ajouter si nouvelle decision (2-3 lignes max, avec date)
- Si > 15 decisions → archiver les stables dans `docs/decisions-log.md`

### 5.6 Metriques
- Mettre a jour si build/tests/routes/bundle size ont change
- Table compacte : Module | Build | JS | CSS | Tests | Routes

### 5.7 Modules
- Mettre a jour si status d'un module a change

### 5.8 Chantier en cours
- Mettre a jour si applicable (progress, phase)
- Retirer si chantier termine

### 5.9 Verification finale
- Relire CONTEXT.md apres modifications
- Verifier < 200 lignes (sinon warning + compresser)
- Verifier coherence : ce qui est dans les sessions recentes correspond aux commits reels

## Phase 6 — Proposer commit

Si des changements sont en attente → proposer un commit (conventional commits, pas d'auto-congratulation).

## Phase 7 — Produire le brief de cloture v11

Rendre avec le format TDAH-friendly : cadres box-drawing, colonnes alignees, espacement genereux.

### Template complet

```
╔══════════════════════════════════════════╗
║   SESSION CLOTUREE · YYYY-MM-DD         ║
║   Statut : [DONE / CONCERNS / ...]      ║
╚══════════════════════════════════════════╝


┌─ ETAT TECHNIQUE ─────────────────────────┐
│                                          │
│   🟢 Build    [OK/KO par module]         │
│   🟢 Tests    [N/N verts]               │
│   🟢 Health   [SAIN/DEGRADED/BROKEN]     │
│   🟢 Refs     [N .md scannes, 0 cassee] │
│                                          │
└──────────────────────────────────────────┘


┌─ CE QUI A ETE FAIT ─────────────────────┐
│                                          │
│   📅 Commits                             │
│     · [hash] [titre]                    │
│       [bullet vulgarise 1]             │
│       [bullet vulgarise 2]             │
│                                          │
│   📁 Fichiers                            │
│     [N] crees · [N] modifies · [N] sup  │
│                                          │
│   🧠 Decisions                           │
│     · [D-XX-01] [titre]                │
│                                          │
└──────────────────────────────────────────┘


┌─ IDEES CAPTUREES ────────────────────────┐
│                                          │
│   💡 [idee 1]                            │
│   💡 [idee 2]                            │
│   (ou "Pas de nouvelle idee")           │
│                                          │
└──────────────────────────────────────────┘



┌─ CAP MIS A JOUR ────────────────────────┐
│                                          │
│   🎯 Direction                           │
│     [ou on va apres cette session]      │
│                                          │
│   🛤  Prochaine action                   │
│     [action concrete]                   │
│                                          │
└──────────────────────────────────────────┘


┌─ ⚠ CONCERNS ────────────────────────────┐
│   (seulement si statut != DONE)         │
│                                          │
│   [description du concern/blocage]      │
│                                          │
└──────────────────────────────────────────┘
```

## Regles de rendu v11 (TDAH-friendly)

### Structure visuelle
- **Cadres** : chaque section dans un cadre `┌─ TITRE ─┐ ... └─┘` (42 chars largeur)
- **Entete** : double trait `╔═══╗ ... ╚═══╝` (zone d'ancrage)
- **Blanc** : 2 lignes vides entre chaque cadre (respiration visuelle)
- **Indentation** : 3 espaces apres `│` pour le contenu

### Alignement
- Labels : emoji + mot, padde a 12 chars
- Valeurs : alignees a droite pour les chiffres
- Colonnes consistantes dans chaque cadre

### Couleurs et symboles
- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Barres : `█` plein, `░` vide (12 blocs max)

### Texte
- Lignes courtes : ~55 chars max (interieur cadre)
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : si simplification cache un risque → `⚠ [risque]`
- Mots interdits : revolution, historique, accomplish, reference mondiale
