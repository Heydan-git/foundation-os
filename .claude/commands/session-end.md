# /session-end — Cloturer une session Foundation OS

> **IMPERATIF** — tool calls en premier :
>
> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Bash git diff --name-status HEAD` — inventaire changements session
> 2. `Bash git worktree list` — detecter worktree actif
> 3. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 4. `Bash bash scripts/ref-checker.sh 2>&1 | head -5` — refs cassees
>
> **Tour 2 (OBLIGATOIRE)** :
> 5. Verifier qu'aucune todo TodoWrite n'est `in_progress` orpheline. Si oui, clarifier avant de continuer.
> 6. Pour chaque changement Tour 1 : classer (feature/fix/docs/refactor/chore), rassembler par commit logique
>
> **Tour 3 (OBLIGATOIRE si changements)** :
> 7. `Edit CONTEXT.md` — ajouter entree Sessions recentes, update Cap + Decisions si applicable
> 8. Proposer commit conventionnel (pas de `git commit` automatique, attendre OK Kevin)
>
> **Tour 4** : produire brief cloture v11 (format `docs/core/communication.md` section 6.2)
>
> Si worktree != main : rappeler workflow merge + `/wt clean`.

Journalise la session, met a jour CONTEXT.md, et produit le brief de cloture v11 (TDAH-friendly).

**Format brief** : voir `docs/core/communication.md` section 6.2 (template cloture), 6.3 (regles de rendu), 6.4 (sources de donnees). **SOURCE UNIQUE.** Ne pas dupliquer ici.

## Phase 1 — Inventaire des changements

1. `git diff --name-status HEAD` : fichiers crees (A), modifies (M), supprimes (D) cette session
2. **Worktree check** : `git worktree list` + branche courante. Si on est dans un worktree (pas main), afficher un rappel dans le brief : "Session dans worktree `<nom>`. Apres merge/push depuis main, fermer via `/wt clean <nom>`."
3. **Tasks pane check** : verifier qu'aucune todo TodoWrite n'est `in_progress` orpheline. Si oui, lister et clarifier (blocage, attente, oubli). Memoire : `feedback_todowrite_systematique.md`.
4. Si aucun changement → brief minimal "Session sans modification" + skip phases 3-5

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

## Phase 6bis — Proposer sync externe (opt-in)

Si `OMC_SYNC_EXTERNAL=1` ET cette session contient decisions OU statut module change OU nouveau plan :

1. **Asana** : lire taches ouvertes workspace `1213280972575193`. Proposer a Kevin :
   - taches a cloturer (plans/blocs DONE cette session)
   - taches a creer (nouveaux items Cap + prochaine action)
   - Attendre OK explicite avant tout `update_tasks` ou `create_tasks`.
2. **Notion** : `mcp__claude_ai_Notion__notion-search` workspace user `4f1b99db`.
   - Page "Foundation OS - Etat" a mettre a jour (contenu = section Modules + Metriques + Cap)
   - Attendre OK explicite avant tout `notion-update-page`.

Aucune ecriture externe sans OK Kevin (regle CLAUDE.md imperatifs).
Si variable absente → skip la phase entierement.

## Phase 7 — Produire le brief de cloture v11

Appliquer le template + regles de rendu definis dans `docs/core/communication.md` section 6.2 (cloture), 6.3 (rendu), 6.4 (sources).

**Sections du brief de cloture** (ordre, voir spec) :
1. ETAT TECHNIQUE (build + tests + health + refs)
2. CE QUI A ETE FAIT (commits + fichiers + decisions)
3. IDEES CAPTUREES (3-5 max)
4. CAP MIS A JOUR (direction + prochaine action)
5. ⚠ CONCERNS (uniquement si statut != DONE)

Les regles de cadres, entete double trait, espacement, alignement, emojis couleur sont **dans communication.md section 6.3**. Ne pas reinventer.

## Phase 8 — Worktree cleanup (si applicable)

Si on est dans un worktree (`git worktree list` != main path) ET la branche est mergee dans main :

- Proposer `/wt clean <nom>` apres confirmation Kevin.
- Ne **pas** auto-cleaner (action destructive, regle CLAUDE.md).

Sinon, rappeler simplement : "Worktree `<nom>` actif. Apres merge dans main + push, fermer avec `/wt clean <nom>`."

## References

- Spec brief v11 : `docs/core/communication.md` section 6 (template + regles + sources)
- Conventions nommage : `docs/core/naming-conventions.md`
- Format session naming : memoire `feedback_sessions_nommage_planete.md`
- TodoWrite : memoire `feedback_todowrite_systematique.md`
- Worktrees actif : memoire `feedback_worktrees_actifs.md` + `docs/core/worktrees.md`
