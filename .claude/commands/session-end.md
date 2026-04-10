# /session-end — Cloturer une session Foundation OS

Produit le brief de fin de session au format v9 et met a jour CONTEXT.md + Monitor Dashboard.
Ref format : memory `feedback_brief_format.md` + CLAUDE.md section "Briefs session".

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

| Statut | Condition | Action |
|--------|-----------|--------|
| **DONE** | Toutes taches finies, build + tests verts, health SAIN | Rien |
| **DONE_WITH_CONCERNS** | Livre mais dette/risque a documenter | Documenter dans CONTEXT.md |
| **NEEDS_CONTEXT** | Bloque par manque d'info Kevin | Lister les questions |
| **BLOCKED** | Impossible de continuer (bug externe, dep cassee) | Documenter blocage + workaround tente |

Le statut se decide a partir des faits (health-check, build, tests) et de l'etat des taches du scope. DONE n'est valide que si **tout** est vert et **toutes** les taches du scope sont livrees.

## Phase 4 — Mettre a jour CONTEXT.md

Protocole Memory (docs/core/memory.md) :

- **Dernieres sessions** : ajouter cette session en tete (garder max 5). Prefixer `[STATUT]` si != DONE. Format : date + titre court + 1-2 phrases factuelles + commits
- **Prochaine action** : mettre a jour avec la suite logique
- **Modules** : mettre a jour le status si changement
- **Decisions actives** : ajouter les nouvelles (avec date YYYY-MM-DD)
- **Etat technique** : mettre a jour si builds/routes/artifacts changent
- Si un fondamental a change → mettre a jour aussi docs/ (reference tier)

## Phase 4.5 — Mettre a jour Monitor Dashboard

Edition additive de `docs/monitor/data.js` :

- `meta.updatedAt` = date du jour
- `meta.updatedInSession` = libelle court session
- `meta.nextAction` = miroir prochaine action (phase 4)
- `plans[*].sessions` : append/update sessions touchees
- `plans[*].currentPhase` + `notes` si change
- `recentSessions` : prepend entree, pop si > 5
- `decisions` : append si nouvelle D-XXX
- `modules` + `initiatives` : update si status change

## Phase 5 — Proposer commit

Si des changements sont en attente → proposer un commit (conventional commits, pas d'auto-congratulation).

## Phase 6 — Produire le brief de cloture v9

Rendre dans cet ordre, avec separateurs `────────────────────────────────` :

### 1. Entete
```
SESSION CLOTUREE · YYYY-MM-DD
Statut : [DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED]
```

### 2. Etat technique
```
🟢 Build         [OK/KO par module]
🟢 Tests (N)     [N/N verts]
🟢 Health-check  [SAIN/DEGRADED/BROKEN]
```
Couleur selon etat reel : 🟢 OK / 🟡 degrade / 🔴 casse.

### 3. Ce qui a ete fait
- 📅 Commits livres : hash + titre + bullets vulgarises (glose jargon)
- 📁 Fichiers : N crees, N modifies, N supprimes

### 4. Mises a jour persistance
- CONTEXT.md : ✅ mis a jour
- Monitor Dashboard : ✅ mis a jour (ou ⏭ skip si aucun changement pertinent)

### 5. Prochaine action
- 🎯 Suite logique extraite de CONTEXT.md apres mise a jour

### 6. Concerns (seulement si statut != DONE)
```
⚠ Concerns / Questions / Blocage :
- [description point d'attention]
- [workaround tente si BLOCKED]
```

## Regles de rendu (rappel)

- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Separateurs : `────────────────────────────────` 32 chars
- Lignes courtes : ~60 chars max
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : si simplification cache un risque → `> ⚠`
- Pas de mots interdits : revolution, historique, accomplish, etc.
