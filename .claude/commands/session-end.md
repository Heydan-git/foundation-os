# /session-end — Cloturer une session Foundation OS

> **VULGARISATION OBLIGATOIRE (TDAH-first)** : le brief cloture produit par cette command commence OBLIGATOIREMENT par une tuile `> **En bref (pour Kevin)**` en tete (2-5 phrases langage simple : ce qu'on a fait + prochaine etape). Regle spec : `docs/core/communication.md` section 6.0. Kevin = designer TDAH.

> **ORDRE IMPERATIF DE CLOTURE SESSION (5 phases, non-negociable)** — Decide 2026-04-20 apres une session ou l'ordre a ete sub-optimal (2 merges au lieu d'1).
>
> ```
> ┌─────────────────────────────────────────────────────────────┐
> │ PHASE 1 — SESSION-END CONTENT (branche worktree active)     │
> │   1.1  Update CONTEXT.md (sessions + cap + decisions)       │
> │   1.2  Update wiki/hot.md (entree Last Updated)             │
> │   1.3  Update wiki/meta/sessions-recent.md (append, max 5)  │
> │   1.4  Update wiki/meta/thinking.md + lessons-learned.md    │
> │   1.5  Update README module si applicable                   │
> │   1.6  Plan : marque status:done + phases_done:N            │
> │   1.7  Commit "docs(os): session-end <titre>"               │
> │   ⚠ NE PAS archiver le plan ici (phase 3)                   │
> └─────────────────────────────────────────────────────────────┘
>                            ↓
> ┌─────────────────────────────────────────────────────────────┐
> │ PHASE 2 — MERGE sur main (repo principal)                   │
> │   2.1  cd /Users/kevinnoel/foundation-os (repo principal)   │
> │   2.2  git merge --no-ff <worktree-branch> -m "merge: ..."  │
> │   2.3  Si conflits CONTEXT/hot/sessions → resoudre (fusion  │
> │        chronologique sans perte, ni main ni worktree)       │
> │   2.4  Commit merge                                         │
> └─────────────────────────────────────────────────────────────┘
>                            ↓
> ┌─────────────────────────────────────────────────────────────┐
> │ PHASE 3 — ARCHIVE PLAN (directement sur main)               │
> │   3.1  mkdir -p .archive/plans-done-YYMMDD/                 │
> │   3.2  mv docs/plans/<plan>.md .archive/plans-done-YYMMDD/  │
> │   3.3  Commit "chore(plans): archive <plan> DONE"           │
> │   (ou laisser hook SessionEnd auto-archive si setup OK)     │
> └─────────────────────────────────────────────────────────────┘
>                            ↓
> ┌─────────────────────────────────────────────────────────────┐
> │ PHASE 4 — PUSH origin main                                  │
> │   4.1  git push origin main                                 │
> │   (Autorise automatiquement — regle CLAUDE.md "Push main")  │
> └─────────────────────────────────────────────────────────────┘
>                            ↓
> ┌─────────────────────────────────────────────────────────────┐
> │ PHASE 5 — CLEANUP worktree (optionnel, apres push reussi)   │
> │   5.1  git worktree remove .claude/worktrees/<nom>          │
> │   5.2  git branch -d <branch>                               │
> └─────────────────────────────────────────────────────────────┘
> ```
>
> **Pourquoi cet ordre** :
> - **Phase 1 AVANT Phase 2** : les updates CONTEXT/hot/sessions sont le travail de session → doivent etre dans la branche qui merge (pas des commits directs sur main).
> - **Plan marque done Phase 1, archive Phase 3** : le status:done dans frontmatter est du contenu (commit sur branche), l'archive est un `mv` qui profite d'etre fait **directement sur main** (evite 2e merge inutile).
> - **Push en Phase 4 uniquement** : on verifie localement que tout est coherent avant de pousser. Permet rollback simple si probleme detecte.
> - **Cleanup Phase 5 en dernier** : apres le push origin main, on sait que tout est safe a distance. Retirer le worktree avant serait dangereux.
>
> **Faute classique a eviter** : faire l'archive du plan dans le worktree **apres** avoir deja merge → force un 2e merge inutile. L'archive doit etre directement sur main.
>
> ---
>
> **IMPERATIF** — tool calls en premier :
>
> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Bash git diff --name-status HEAD` — inventaire changements session
> 2. `Bash git worktree list` — detecter worktree actif
> 3. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 4. `Bash bash scripts/ref-checker.sh 2>&1 | head -5` — refs cassees
> 5. `Bash bash scripts/wiki-health.sh 2>&1 | tail -10` — sante wiki (pages, wikilinks, hot.md age)
>
> **Tour 2 (OBLIGATOIRE)** :
> 6. Verifier qu'aucune todo TodoWrite n'est `in_progress` orpheline. Si oui, clarifier avant de continuer.
> 7. Pour chaque changement Tour 1 : classer (feature/fix/docs/refactor/chore), rassembler par commit logique
>
> **Tour 3 (OBLIGATOIRE si changements)** :
> 7. `Edit CONTEXT.md` — ajouter entree Sessions recentes, update Cap + Decisions si applicable
> 8. `Edit wiki/hot.md` — update cache narratif 500 mots (Last Updated / Key Recent Facts / Recent Changes / Active Threads / Next Action)
> 9. `Edit wiki/meta/sessions-recent.md` — APPEND resume de cette session (decisions, pages wiki, threads ouverts). Garder 5 sessions max.
> 10. `Edit wiki/meta/thinking.md` — ajouter insights/hypotheses de cette session si pertinent
> 11. `Edit wiki/meta/lessons-learned.md` — ajouter erreurs/pieges rencontres cette session si applicable
> 13. `Edit wiki/index-wiki.md` — mettre a jour stats (Concepts/Entities/Sources/Total pages) si pages wiki creees/modifiees
> 14. Si plan execute cette session → marquer phases `[x]` dans `docs/plans/<slug>.md` Execution log
> 16. Si wiki/ modifie non committe → proposer `bash scripts/wiki-commit.sh` ou inclure dans commit principal
> 17. Proposer commit conventionnel (pas de `git commit` automatique, attendre OK Kevin)
>
> **Tour 4** : produire brief cloture v12 (format `docs/core/communication.md` section 6.2)
>
> Si worktree != main : rappeler workflow merge + `/wt clean`.

Journalise la session, met a jour CONTEXT.md, et produit le brief de cloture v12 (TDAH-friendly).

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

## Phase 5bis — Auto-archive des plans termines (OBLIGATOIRE)

**Regle** : un plan est "termine" si son `## Execution log` contient UNIQUEMENT des cases `[x]` (zero `[ ]`) OU son frontmatter `status` = `done`/`closed`.

**Action automatique pour chaque plan termine dans `docs/plans/`** :

```bash
mkdir -p .archive/plans-done-$(date +%y%m%d)
mv docs/plans/<slug>.md .archive/plans-done-$(date +%y%m%d)/
```

- Inclure dans le brief de cloture Phase 7 : cadre `PLANS TERMINES CETTE SESSION` avec la liste des plans archives (titre + commit final + date).
- Au prochain `/cockpit` ou `/session-start` : dans le brief v12 cadre `PLANS ACTIFS`, afficher une ligne `🟢 <N> plans termines recemment` qui pointe vers le dossier archive.

Exclure `_template-plan.md` et le plan actif session courante.

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

## Phase 7 — Produire le brief de cloture v12

Appliquer le format **tuiles Markdown** defini dans `docs/core/communication.md` section 6.2 (v12), 6.3 (rendu), 6.4 (sources).

**IMPORTANT : Format tuiles Markdown (PAS box-drawing terminal)**
- Chaque section = 1 blockquote `>` contenant `####` titre + contenu + tables
- Sections separees par `---`
- NE PAS utiliser `┌─┐│└┘╔═╗╚╝` — utiliser `>`, `####`, `| |`, `**bold**`, `---`
- Entete = `# 🪐 SESSION END — YYYY-MM-DD` + blockquote status

**7 sections en tuiles** :
1. 🏥 ETAT TECHNIQUE (table build/tests/health/refs/wiki)
2. 📌 CE QUI A ETE FAIT (N commits + table batches + decisions)
3. 📦 PLANS TERMINES (table plans archives si applicable)
4. 💡 IDEES CAPTUREES (table emoji + description)
5. 🎯 CAP MIS A JOUR (direction + prochaines actions table)
6. ⚠️ CONCERNS (uniquement si statut != DONE)
7. Rappel worktree si applicable

Les regles de rendu (tuiles blockquote, hierarchie 4 niveaux, emojis, tables) sont **dans communication.md section 6.3 (v12)**. Ne pas reinventer. NE PAS utiliser de box-drawing terminal.

## Phase 7bis — Rating session enrichi (D-BODY-01 P2)

**Spec** : module Body `docs/core/body.md` section 4 (Couche C3 Feedback structure). Evolution I-10 (rating simple Y/N/partial) vers schema enrichi qui capture drift categories + P-XX violated pour alimenter learning loop Body C4.

### Questions AskUserQuestion (4 sequentielles)

1. **Rating** (1 choix) : Comment s'est passee cette session ?
   - `Y` (bien) / `N` (mal) / `partial` (mitige)

2. **Drift categories** (multi-select, optionnel) : Quelles derives detectees ?
   - `interpretation` (ecart comprends vs verbatim Kevin)
   - `surgonflage` (exagerer findings / metriques)
   - `bullshit` (claim DONE sans preuve)
   - `hallucination` (invention / verification manquee)
   - `scope-creep` (action hors scope intent)
   - `quality` (travail bacle, superficiel)
   - `honnetete` (politesse diplomatique vs honnetete directe)
   - `aucune` (zero drift detectee)

3. **Principles violated** (texte libre, optionnel) : Lister P-XX violes (`docs/core/constitution.md`). Ex : "P-04, P-17" ou "aucun".

4. **Notes libres** (texte libre, optionnel, max 500 chars) : Contexte additionnel pour learning loop.

### Append dual-format

1. **`.omc/alignment/YYYY-MM-DD-<slug>.jsonl`** (nouveau format enrichi D-BODY-01) :
   ```jsonl
   {"id":"<branch>","date":"YYYY-MM-DD","rating":"Y|N|partial","drift_categories":[...],"principles_violated":["P-XX"],"notes":"...","intent_file":".omc/intent/... | null","auditor_report":".omc/alignment/auditor-... | null"}
   ```
   - `intent_file` : pointer vers intent capture si existait cette session (`/plan-os`)
   - `auditor_report` : pointer vers rapport subagent `alignment-auditor` P4 (si invoque Phase 7ter)

2. **`.omc/ratings.jsonl`** (retro-compat format simple) : continuer append pour archive historique :
   ```jsonl
   {"id":"<branch>","date":"YYYY-MM-DD","rating":"Y|N|partial","notes":"<notes>"}
   ```

### Exemple bash append

```bash
BRANCH=$(git branch --show-current)
TODAY=$(date +%Y-%m-%d)
SLUG="<session-slug>"
RATING="<Y|N|partial>"
NOTES="<notes>"
DRIFT='["interpretation","scope-creep"]'   # JSON array ou []
PRINCIPLES='["P-04","P-17"]'               # JSON array ou []
INTENT_FILE=".omc/intent/${TODAY}-${SLUG}.md"
[ ! -f "$INTENT_FILE" ] && INTENT_FILE="null"

# Append schema enrichi (D-BODY-01)
mkdir -p .omc/alignment
echo "{\"id\":\"$BRANCH\",\"date\":\"$TODAY\",\"rating\":\"$RATING\",\"drift_categories\":$DRIFT,\"principles_violated\":$PRINCIPLES,\"notes\":\"$NOTES\",\"intent_file\":\"$INTENT_FILE\",\"auditor_report\":null}" >> ".omc/alignment/${TODAY}-${SLUG:-body}.jsonl"

# Append format simple (retro-compat .omc/ratings.jsonl)
echo "{\"id\":\"$BRANCH\",\"date\":\"$TODAY\",\"rating\":\"$RATING\",\"notes\":\"$NOTES\"}" >> .omc/ratings.jsonl
```

### Kevin peut skip

Toute reponse vide = skip. Ne pas bloquer le workflow. Rating = Y par defaut si total skip.

### Apres append — analyze disponible

- `bash scripts/alignment-analyze.sh` → distribution rating + top drift categories + top P-XX violated + streak detection + patterns 7-dernieres (si total >= 10).
- `bash scripts/session-ratings-analyze.sh` → format simple archive (retro-compat).

**Regle** : rating systematique a chaque /session-end, meme pour sessions courtes. Sans mesure, pas de learning loop Body C4.

## Phase 7ter — Alignment auditor (D-BODY-01 P4)

**Spec** : module Body `docs/core/body.md` section 5 (Couche C4 Learning loop). Invocation optionnelle subagent clean-slate `alignment-auditor` pour audit externe intent vs actions.

### Condition d'invocation

Invoquer UNIQUEMENT si :
1. `.omc/intent/<date>-<slug>.md` existe pour cette session (session `/plan-os` avec intent actif)
2. Kevin n'a pas explicitement skip ("pas d'auditor cette fois")

Si pas d'intent file → skip Phase 7ter silencieusement.

### Invocation

```
Task({
  subagent_type: "alignment-auditor",
  description: "Audit alignement <slug>",
  prompt: `
    ## Intent
    <cat .omc/intent/YYYY-MM-DD-<slug>.md>

    ## Actions executees (git diff + log)
    <git log --since="session-start" --name-status ou timestamp session>
    <git diff --stat HEAD~N..HEAD>

    ## Brief cloture draft
    <livrables + metriques declares par primary>

    ## Output path
    .omc/alignment/auditor-YYYY-MM-DD-<slug>.json

    ## Contexte disponible (read-only)
    - CLAUDE.md : regles comportementales
    - docs/core/constitution.md : 41+ P-XX (cross-referencer violations)
    - docs/core/body.md : spec module Body (tu es C4 Learning loop)
  `
})
```

### Apres rapport auditor

1. Rapport JSON append dans `.omc/alignment/auditor-YYYY-MM-DD-<slug>.json`
2. Updater l'entry `.omc/alignment/YYYY-MM-DD-<slug>.jsonl` (field `auditor_report`) pour pointer vers le rapport
3. **Afficher summary 2-3 lignes** dans brief cloture v12 (nouvelle tuile `🔍 ALIGNMENT AUDITOR` optionnelle, ou append a tuile CONCERNS si `recommendation: stop-and-clarify`)
4. Si `recommendation: stop-and-clarify` → **bloquer merge + push Phase 8** tant que Kevin n'a pas valide

### Limite cost

Subagent = ~5-10k tokens input + 2-3k output par invocation. Si quota tight, Kevin peut skip via reponse vide a la question "Invoquer auditor ?" (optionnel AskUserQuestion avant invocation).

### Regle

Phase 7ter NON-bloquante par defaut. Auditor = indicateur, pas verite. Kevin juge final. Si `recommendation: stop-and-clarify`, re-ouvrir conversation.

## Phase 8 — Merge main + worktree cleanup (OBLIGATOIRE si worktree)

Si on est dans un worktree (`git worktree list` != main path) :

1. **Merge dans main (OBLIGATOIRE, automatique)** :
   ```bash
   git merge-base --is-ancestor main HEAD && \
   cd $(git worktree list | head -1 | awk '{print $1}') && \
   git merge <branche-worktree> --ff-only
   ```
   - Si fast-forward possible → merger SANS demander (action safe, non-destructive)
   - Si PAS fast-forward (divergence) → alerter Kevin, NE PAS forcer
   - Verifier avec `git log -1 main` que le merge a fonctionne
2. **Cleanup worktree** : proposer `/wt clean <nom>` apres confirmation Kevin (action destructive → demander)

**REGLE** : fermer une session sans merger = session perdue. Le merge fast-forward est OBLIGATOIRE, pas optionnel.

## References

- Spec brief v12 : `docs/core/communication.md` section 6 (template + regles + sources)
- Conventions nommage : `docs/core/naming-conventions.md`
- Format session naming : memoire `feedback_sessions_nommage_planete.md`
- TodoWrite : memoire `feedback_todowrite_systematique.md`
- Worktrees actif : memoire `feedback_worktrees_actifs.md` + `docs/core/worktrees.md`
