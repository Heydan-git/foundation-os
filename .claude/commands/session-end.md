# /session-end — Cloturer une session Foundation OS

Journalise la session, met a jour CONTEXT.md, et produit le brief de cloture v10.
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

## Phase 5.5 — Mettre a jour Monitor Dashboard

Edition additive de `docs/monitor/data.js` :

- `meta.updatedAt` = date du jour
- `meta.updatedInSession` = libelle court session
- `meta.nextAction` = miroir Cap (phase 5.2)
- `plans[*].sessions` : append/update sessions touchees
- `plans[*].currentPhase` + `notes` si change
- `recentSessions` : prepend entree, pop si > 5
- `decisions` : append si nouvelle D-XXX
- `modules` + `initiatives` : update si status change

## Phase 6 — Proposer commit

Si des changements sont en attente → proposer un commit (conventional commits, pas d'auto-congratulation).

## Phase 7 — Produire le brief de cloture v10

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
- 🧠 Decisions prises cette session (avec ID)

### 4. Idees capturees
- 💡 Reflexions/pistes qui ont emerge (sauvees dans CONTEXT.md > Idees & Parking)
- Si aucune → "Pas de nouvelle idee cette session"

### 5. Mises a jour persistance
- CONTEXT.md : ✅ mis a jour (lister les sections touchees)
- Monitor Dashboard : ✅/⏭

### 6. Cap mis a jour
- 🎯 Direction apres cette session
- 🛤 Prochaine action concrete

### 7. Concerns (seulement si statut != DONE)
```
⚠ Concerns / Questions / Blocage :
- [description]
```

## Regles de rendu

- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Separateurs : `────────────────────────────────` 32 chars
- Lignes courtes : ~60 chars max
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : si simplification cache un risque → `> ⚠`
- Mots interdits : revolution, historique, accomplish, reference mondiale
