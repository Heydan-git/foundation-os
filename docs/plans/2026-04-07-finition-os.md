# Finition OS — Implementation Plan

> Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` (Phase 5 mise de cote)
> Plan ecrit le 2026-04-07. Decoupage en 3 sessions.
> Objet : cloturer la dette Tools + housekeeping avant Phase 5 Expansion.

**Goal:** Foundation OS Phases 1-4 sont DONE (build SAIN, 19/19 tests, pre-commit, sync-check 5/6, module-scaffold). Reste de la dette opt-in (backlog Tools) + 1 action manuelle Kevin (Supabase) + housekeeping (decisions-log). Ce plan programme tout sur 3 sessions, avec criteres SAIN par session et points de drop si overlap detecte.

**Architecture:** Bash scripts + edits docs/. Aucun code applicatif touche. Pattern existant (`health-check.sh`, `sync-check.sh`, `module-scaffold.sh`). Python embedded (env vars) si edition complexe de markdown.

**Tech Stack:** Bash, grep, find, Python3 (deja utilise dans module-scaffold).

---

## Decoupage en 3 sessions

| Session | Scope | Effort | Livrables |
|---------|-------|--------|-----------|
| **S1** | A + B : Email confirmations + sync-check 6/6 | court | Rappel Kevin + sync-check.sh check fonts |
| **S2** | C1 : ref-checker | moyen | `scripts/ref-checker.sh` nouveau |
| **S3** | C2 + C3 + D : eval polish + housekeeping | court | bundle-tracker (eval), context-diff (eval), decisions-log nettoye |

Total : 3 sessions incrementales. Chaque fin de session = commit + health-check SAIN + update CONTEXT.md.

---

## Session 1 — Polish /sync + rappel Email confirmations

### A — Action manuelle Kevin (rappel)

**Pas de code.** En debut de session, rappeler a Kevin :
- Aller dans Supabase Dashboard → Project foundation-os → Authentication → Providers → Email
- Activer le toggle "Confirm email"
- Cette action est pendante depuis Phase 2.3 (code DONE, mais cette config UI non faite)

**Action automatisable cote OS :** une fois Kevin a confirme, retirer l'item de CONTEXT.md "Prochaine action" (action manuelle pendante). Migrer la mention dans "Dernieres sessions".

### B — sync-check.sh check fonts

**Files:**
- Modify: `scripts/sync-check.sh`
- Modify: `.claude/commands/sync.md` (refleter 6/6)
- Modify: `docs/core/tools.md` (ligne sync-check)

**Constat actuel :** d'apres `.claude/commands/sync.md` ligne 16, sections manuelles restantes :
- Section 4 reste : artifacts listes, builds time/tailles
- Section 5 : fonts (Figtree primaire, pas Outfit/Inter en primaire)

**Decision honnete :**
- "Builds time/tailles" → trop noisy a auto-check (varie par machine), **drop**
- "Artifacts listes details" → deja couvert par health-check `MD pairs (7/7 in archive)`, **drop**
- "Fonts" → vraiment non automatise aujourd'hui, **garder**

Donc B = 1 check : fonts en primaire dans CSS et TSX.

**Tasks:**
- B.1 : Lire `docs/design-system.md` pour identifier exactement les fonts autorisees (Figtree pour UI, JetBrains Mono pour code) et interdites en primaire (Outfit, Inter, system-ui seul)
- B.2 : Identifier les fichiers source ou les fonts sont declarees (probable : `modules/app/src/index.css` ou similaire, plus inline `font-family` dans tsx)
- B.3 : Ajouter dans `sync-check.sh` une nouvelle section :
  ```bash
  # ── 7. Fonts (Void Glass) ──────────────────────────────────────────
  FONT_VIOL=$(grep -rnE 'font-family.*(Outfit|Inter|system-ui)' \
    modules/app/src --include="*.css" --include="*.tsx" --include="*.ts" 2>/dev/null \
    | grep -v 'fallback' | wc -l | tr -d ' ')
  if [ "$FONT_VIOL" -eq 0 ]; then
    echo -e "  ${GRN}[OK]${RST} Fonts (Figtree primaire, 0 violation)"
  else
    echo -e "  ${YEL}[WARN]${RST} Fonts violations: $FONT_VIOL"
    WARNING=$((WARNING + 1))
  fi
  ```
- B.4 : Tester sur etat actuel → 0 violation attendu (CONTEXT.md indique Void Glass propre)
- B.5 : Tester en injectant volontairement `font-family: Inter` dans un fichier scratch → detecte
- B.6 : Restaurer + verifier
- B.7 : Update `.claude/commands/sync.md` ligne 16 : "5/6" → "6/6", retirer la section fonts du manuel
- B.8 : Update `docs/core/tools.md` ligne sync-check : "5 checks" → "6 checks" + mentionner fonts
- B.9 : Commit `feat(tools): sync-check 6/6 — auto check fonts Void Glass`

**Critere S1 :**
- [ ] sync-check.sh contient le check fonts
- [ ] Test casse : violation injectee → DEGRADED
- [ ] Test sain : etat actuel → SAIN
- [ ] sync.md + tools.md a jour
- [ ] health-check SAIN
- [ ] 1 commit propre
- [ ] Kevin a coche Email confirmations OU note explicitement dans CONTEXT.md "encore pendant"

---

## Session 2 — ref-checker.sh

### C1 — ref-checker (full-repo refs cassees)

**Files:**
- Create: `scripts/ref-checker.sh`
- Modify: `docs/core/tools.md` (sortir du backlog → existant)

**Goal :** Detecter les refs cassees full-repo. Vs sync-check qui ne fait que `HEAD~1..HEAD`, ref-checker verifie *tous* les liens dans le repo a un instant T.

**Approche :**
1. Pour chaque fichier .md, .ts, .tsx, .json, .sh, .py du repo (hors `.archive`, `node_modules`, `dist`, `.git`, `.omc`, `_bmad`)
2. Extraire les references a des fichiers locaux :
   - Markdown links : `[text](path/to/file.md)` ou `[text](./foo.ts)`
   - Inline backticks : `` `example/path.sh` ``, `` `docs/core/tools.md` ``
   - Imports relatifs : `from './foo'`, `from '../bar/baz'`
   - Path strings dans JSON : `"main": "./src/index.ts"`
3. Verifier que chaque path existe sur disque (relatif au fichier source ou a la racine repo selon contexte)
4. Reporter les refs cassees `file:line → ref`

**Tasks :**
- C1.1 : Echantillonner les patterns reels — grep `\[.*\]\(.*\.md\)` dans `docs/` et `.claude/` pour voir les variantes
- C1.2 : Decision quoi scanner :
  - Markdown links `(...)` : oui (haut signal)
  - Backtick refs : oui mais filtrer (`bash`, `npm`, `git` ne sont pas des paths)
  - Imports JS/TS : optionnel — TS compile catch deja les broken imports
  - **Recommandation MVP** : commencer par markdown links + backticks paths, ajouter imports si besoin
- C1.3 : Ecrire `scripts/ref-checker.sh`. Squelette :
  ```bash
  #!/bin/bash
  # ref-checker.sh — Detect broken refs full-repo
  set -uo pipefail
  cd "$(git rev-parse --show-toplevel)"

  # Find files to scan
  FILES=$(find . -type f \( -name "*.md" -o -name "*.json" \) \
    -not -path './.archive/*' -not -path './node_modules/*' \
    -not -path './dist/*' -not -path './.git/*' \
    -not -path './.omc/*' -not -path './_bmad/*')

  BROKEN=0
  for f in $FILES; do
    # Extract markdown links: [text](path)
    grep -nE '\]\(([^)]+\.(md|sh|ts|tsx|json|py))\)' "$f" 2>/dev/null | while read line; do
      lineno=$(echo "$line" | cut -d: -f1)
      ref=$(echo "$line" | grep -oE '\(([^)]+)\)' | head -1 | tr -d '()')
      # Skip http(s) and anchors
      [[ "$ref" =~ ^https?:// ]] && continue
      [[ "$ref" =~ ^# ]] && continue
      # Resolve relative to source dir or repo root
      ...
    done
  done
  ```
- C1.4 : `--help`, idempotent, exit codes : 0=clean, 1=refs cassees trouvees
- C1.5 : Test sain : `bash scripts/ref-checker.sh` sur etat actuel → 0 broken (ou liste connue de faux positifs a noter)
- C1.6 : Test casse : creer un .md avec `[link](inexistant.md)` → detecte
- C1.7 : Cleanup test
- C1.8 : Update `docs/core/tools.md` : sortir ref-checker du backlog `### Moyenne priorite` → ajouter dans `### Scripts` existants
- C1.9 : Commit `feat(tools): ref-checker.sh — detect broken refs full-repo`

**Decision design — integrer ou pas a sync-check ?**
- **Standalone (recommande)** : permet d'invoquer sans tout sync-check, plus rapide a iterer
- **Integre a sync-check** : possible drapeau `--full` qui call ref-checker, mais pas necessaire MVP

**Critere S2 :**
- [ ] ref-checker.sh executable, --help OK, idempotent
- [ ] Test sain : sortie 0 sur etat actuel
- [ ] Test casse : ref injectee detectee + reportee correctement
- [ ] tools.md mis a jour (backlog → existant)
- [ ] health-check SAIN
- [ ] 1 commit propre

**Hors scope S2 :** integration sync-check, scan imports JS/TS (TS le fait deja).

---

## Session 3 — Eval polish + housekeeping

**Note importante :** En debut de S3, **evaluer si C2 et C3 sont reellement necessaires** avant de les construire. Critere : si overlap fort avec health-check + sync-check, **dropper** au lieu de construire (principe Tools : "pas d'outil sans besoin").

### C2 — bundle-tracker (eval)

**Question :** health-check loggue deja la taille bundle dans son output et alerte si > seuil. Est-ce qu'on veut un *log historique persistent* ?

**Cas pour build :**
- Tracker l'evolution dans le temps (CSV/JSON append)
- Detecter une regression silencieuse < seuil mais croissante

**Cas pour drop :**
- Le seuil 600/40 est deja en place
- Personne ne va consulter un CSV
- Git history des CONTEXT.md "Etat technique" donne deja l'historique

**Recommandation pre-eval :** drop, sauf si Kevin veut explicitement un graph d'evolution. Dans tools.md, marquer "evalue, droppe : overlap health-check, alerte deja en place".

**Si build :** _(branche non prise — drop confirme post-eval)_
- Files : Create scripts/bundle-tracker.sh
- Output : append `.omc/bundle-history.csv` avec date, JS_KB, CSS_KB
- Tasks : ~50L bash, parse health-check output, append CSV, commit

### C3 — context-diff (eval)

**Question :** sync-check fait deja (1) modules vs CONTEXT, (2) routes vs App.tsx, (3) Core OS coherence. Que ferait context-diff de plus ?

**Cas pour build :**
- Decisions-log vs CONTEXT.md
- MD pairs detail (deja dans health-check)
- Inventory CONTEXT.md "Outils installes" vs reality

**Cas pour drop :**
- Forte chance de doublonner sync-check
- "Inventory tools installes" est manuel et change rarement

**Recommandation pre-eval :** **drop**. Marquer dans tools.md : "evalue, droppe : overlap sync-check + faible valeur ajoutee".

### D — Housekeeping decisions-log

**Files:**
- Modify: `CONTEXT.md` (section Decisions actives)
- Modify: `docs/decisions-log.md` (append decisions migres)

**Goal :** Reduire la table "Decisions actives" de CONTEXT.md aux decisions vraiment chaudes. Selon le protocole Memory, archiver les decisions stables dans `docs/decisions-log.md`.

**Tasks :**
- D.1 : Lister les decisions actuelles de CONTEXT.md (14 a la date du 2026-04-07) :
  ```
  Memoire (2026-04-05), Core OS (2026-04-05), Dashboard (2026-04-05),
  Foundation v2 (2026-04-05), Phase 1 DONE (2026-04-05),
  Phase 2.1 DONE (2026-04-07), Phase 2.2/2.3 DONE (2026-04-07),
  Phase 2 DONE (2026-04-07), Phase 3 DONE (2026-04-07),
  BMAD garde (2026-04-07), Code review (2026-04-07),
  Phase 4 DONE (2026-04-07), Affinement OS (2026-04-07),
  Chantier OS suite (2026-04-07)
  ```
- D.2 : Decider quoi migrer (criteres : decision stable, plus referee depuis 7+ jours OU decision purement historique) :
  - **Migrer** : Phase 1/2.1/2.2/2.3/2 DONE (5 decisions historiques cumulees dans Phase 2)
  - **Migrer** : Memoire, Core OS, Foundation v2 (specs stabilisees)
  - **Migrer** : Phase 3 DONE, Phase 4 DONE (DONE confirme)
  - **Garder** : BMAD garde, Code review (decisions de routing actives)
  - **Garder** : Dashboard (futur a definir)
  - **Garder** : Affinement OS, Chantier OS suite (recent — laisser une session)
- D.3 : Append dans `docs/decisions-log.md` les decisions migres (avec leur date originale)
- D.4 : Retirer ces lignes de CONTEXT.md "Decisions actives"
- D.5 : Verifier que CONTEXT.md reste lisible (~5-6 decisions actives apres housekeeping)
- D.6 : Commit `docs(context): decisions-log housekeeping — archive 9 decisions stables`

**Critere S3 :**
- [ ] C2 evalue : decision documentee dans tools.md (build OU drop)
- [ ] C3 evalue : decision documentee dans tools.md (build OU drop)
- [ ] CONTEXT.md "Decisions actives" ≤ 6 lignes
- [ ] decisions-log.md a recu les migres
- [ ] health-check SAIN
- [ ] 1-2 commits propres (1 pour les eval drops, 1 pour le housekeeping)

---

## Critere de succes global Finition OS

- [ ] **S1** : sync-check 6/6, fonts auto, Email confirmations Kevin
- [ ] **S2** : ref-checker livre + teste
- [ ] **S3** : C2 + C3 evalues (build OU drop documente), decisions-log housekeeping fait
- [ ] CONTEXT.md a jour apres chaque session
- [ ] health-check SAIN apres chaque commit
- [ ] 3-5 commits propres au total

Apres ce plan, Foundation OS sera pret pour Phase 5 Expansion (nouveau module Finance/Sante/Trading) avec :
- 6/6 sync auto
- ref-checker dispo
- Decisions-log allege
- Backlog Tools clarifie (build OU drop documente, plus de "evalue plus tard")

---

## Recapitulatif fichiers

| # | Fichier | Session | Action |
|---|---------|---------|--------|
| 1 | `scripts/sync-check.sh` | S1 | Modify — section fonts |
| 2 | `.claude/commands/sync.md` | S1 | Modify — refleter 6/6 |
| 3 | `docs/core/tools.md` | S1, S2, S3 | Modify x3 — sync-check 6 checks, ref-checker existant, eval C2/C3 |
| 4 | `scripts/ref-checker.sh` | S2 | Create |
| 5 | scripts/bundle-tracker.sh | S3 | DROP post-eval (overlap health-check) |
| 6 | scripts/context-diff.sh | S3 | DROP post-eval (overlap sync-check) |
| 7 | `CONTEXT.md` | S1, S2, S3 | Modify x3 — sessions log, prochaine action, decisions housekeeping |
| 8 | `docs/decisions-log.md` | S3 | Modify — append decisions migres |

Total certain : 4 modifies + 1 create (S2). Total optionnel S3 : 0-2 creates.

---

## Hors scope (Phase 5 reservee a l'expansion)

- Nouveau module Finance/Sante/Trading → Phase 5 Expansion
- Tests E2E Playwright → hors spec v2
- Sentry / monitoring runtime → hors spec v2
- BMAD activation → decision Kevin "garde dormant"
- Coderabbit invocation → decision Kevin "review-agent custom = principal"

---

## Notes prag

- **Si une session deborde** : arreter et splitter plutot que torcher
- **Pre-commit hook health-check tournera automatiquement** → blocage si BROKEN, warn si DEGRADED
- **En cas de doute sur eval C2/C3** : dropper, principe `pas d'outil sans besoin`
- **Token-awareness** : chaque session touche < 5 fichiers, 1 domaine → travail direct, pas d'agent sauf exploration ref-checker (S2.1) si patterns trop larges
