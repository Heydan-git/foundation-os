# Phase 4 — Monitoring : Implementation Plan

> Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 4
> Plan ecrit le 2026-04-07. Decoupage en 1 session.

**Goal:** Les checks de sante deviennent automatiques. Trois livrables : (1) `health-check.sh` en pre-commit hook qui bloque les commits BROKEN, (2) bundle size tracking avec seuils d'alerte, (3) regles token-awareness ajoutees a CLAUDE.md.

**Architecture:** Bash + git hooks. Aucun code applicatif touche. Une seule modification de script (health-check.sh : fix bundle extraction + ajout seuils), un nouveau hook (pre-commit), et une section CLAUDE.md.

**Tech Stack:** Bash, git hooks. Pas de dependance.

---

## Constat avant execution

**Bug existant a corriger** : `scripts/health-check.sh` lignes 104-106. L'extraction bundle est cassee — `awk '{print $3 $4}'` retourne `kB│` (l'unite + le separateur Unicode) au lieu de la taille. Output actuel :
```
[OK] Bundle: JS kB│ / CSS kB│
```

Cause : sur la ligne vite `dist/assets/index-*.css   17.22 kB │ gzip:   3.96 kB`, les colonnes sont :
- $1 = chemin
- $2 = **17.22** (la valeur)
- $3 = kB
- $4 = │

Le script doit utiliser `$2 $3` pour avoir `17.22kB`, ou mieux : `$2` (numerique) pour pouvoir comparer aux seuils.

---

## Decoupage en 1 session

| Tache | Scope | Livrables | Critere |
|-------|-------|-----------|---------|
| **4.1** | Fix bundle extraction + thresholds | `scripts/health-check.sh` modifie | Output: `Bundle: JS 457KB / CSS 17KB` (valeurs reelles) ; alert si JS>600KB ou CSS>40KB |
| **4.2** | Pre-commit hook | `scripts/git-hooks/pre-commit` (cree) + install dans `.git/hooks/` | `git commit` declenche health-check ; BROKEN bloque (exit 1), DEGRADED warn (exit 0), SAIN passe |
| **4.3** | Token-awareness rules | Section ajoutee a `CLAUDE.md` | Tableau spec (5 regles) inclus, < 1500 mots total |
| **4.4** | Verification + commit | health-check OK + test pre-commit + CONTEXT.md update | Voir steps |

Phase 4 est completee quand toutes les checkboxes du critere global de la spec (ligne 234-239) sont cochees.

---

## Task 4.1 — Fix bundle extraction + thresholds

**Objectif :** L'output bundle doit afficher des valeurs reelles (pas `kB│`), et un seuil JS>600KB ou CSS>40KB doit declencher un WARNING.

**Files:**
- Modify: `scripts/health-check.sh`

### Steps

- [ ] **Step 1** : Corriger l'extraction. Remplacer :
  ```bash
  JS_SIZE=$(echo "$BUILD_OUT" | grep "\.js " | awk '{print $3 $4}' | head -1)
  CSS_SIZE=$(echo "$BUILD_OUT" | grep "\.css " | awk '{print $3 $4}' | head -1)
  ```
  par :
  ```bash
  JS_SIZE=$(echo "$BUILD_OUT" | grep "\.js " | awk '{print $2}' | head -1)
  CSS_SIZE=$(echo "$BUILD_OUT" | grep "\.css " | awk '{print $2}' | head -1)
  ```
  → on extrait juste le nombre (`457.15`).

- [ ] **Step 2** : Ajouter les seuils. Convertir en entier et comparer :
  ```bash
  JS_INT=${JS_SIZE%.*}        # 457.15 → 457
  CSS_INT=${CSS_SIZE%.*}      # 17.22 → 17
  BUNDLE_WARN=""
  [ "${JS_INT:-0}" -gt 600 ] && BUNDLE_WARN="$BUNDLE_WARN JS>600KB"
  [ "${CSS_INT:-0}" -gt 40 ] && BUNDLE_WARN="$BUNDLE_WARN CSS>40KB"
  if [ -z "$BUNDLE_WARN" ]; then
    echo -e "  ${DIM}[OK]${RST} Bundle: JS ${JS_SIZE}kB / CSS ${CSS_SIZE}kB"
  else
    echo -e "  ${YEL}[WARN]${RST} Bundle: JS ${JS_SIZE}kB / CSS ${CSS_SIZE}kB$BUNDLE_WARN"
    WARNING=$((WARNING + 1))
  fi
  ```
  → Le seuil est dans la section INFO actuellement, mais il doit incrementer WARNING pour faire basculer le verdict en DEGRADED si depasse. Note : la spec dit "marge ~37% au-dessus de l'actuel" → 600KB pour JS (actuel ~457), 40KB pour CSS (actuel ~17.22). On garde ces seuils.

- [ ] **Step 3** : Tester l'output : `bash scripts/health-check.sh` doit afficher `Bundle: JS 457.15kB / CSS 17.22kB` (sans `kB│`).

- [ ] **Step 4** : Verifier que verdict reste SAIN (les valeurs actuelles sont sous les seuils).

---

## Task 4.2 — Pre-commit hook

**Objectif :** Chaque `git commit` declenche `health-check.sh`. BROKEN (exit 1) bloque le commit. DEGRADED (exit 2) affiche un warning mais laisse passer. SAIN (exit 0) passe silencieusement.

**Files:**
- Create: `scripts/git-hooks/pre-commit` (source version-controlled)
- Install: `.git/hooks/pre-commit` (copie operationnelle, pas committee)

### Steps

- [ ] **Step 1** : Creer `scripts/git-hooks/pre-commit` :
  ```bash
  #!/bin/bash
  # Foundation OS pre-commit hook : run health-check, block on BROKEN
  # Install: cp scripts/git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

  bash scripts/health-check.sh
  RC=$?

  if [ $RC -eq 1 ]; then
    echo ""
    echo "COMMIT BLOQUE : health-check = BROKEN"
    echo "Fixe les erreurs critiques avant de commit."
    exit 1
  elif [ $RC -eq 2 ]; then
    echo ""
    echo "WARNING : health-check = DEGRADED (commit autorise)"
    exit 0
  fi

  exit 0
  ```

- [ ] **Step 2** : Rendre executable et installer : `chmod +x scripts/git-hooks/pre-commit && cp scripts/git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`.

- [ ] **Step 3** : Documenter dans `docs/core/tools.md` (section "Existants") : ajouter `pre-commit (git hook, scripts/git-hooks/pre-commit)`.

- [ ] **Step 4** : **Test du hook** :
  - Casser temporairement le build (eg ajouter une erreur TS volontaire dans un fichier scratch)
  - `git add .` puis `git commit -m "test: should fail"`
  - Verifier : commit bloque, message "COMMIT BLOQUE : health-check = BROKEN"
  - Annuler le scratch
  - Verifier : commit re-passe

  → Si le test casse vraiment quelque chose qu'on ne veut pas perdre, sauter le step et faire seulement un dry-run mental.

---

## Task 4.3 — Token-awareness rules dans CLAUDE.md

**Objectif :** Ajouter une section `## Token-awareness` a CLAUDE.md, avec le tableau de regles de la spec, sans depasser 1500 mots.

**Files:**
- Modify: `CLAUDE.md`

### Steps

- [ ] **Step 1** : Ajouter une section apres "Garde-fous" et avant "Anti-bullshit gates" :

  ```markdown
  ## Token-awareness

  | Situation | Action |
  |-----------|--------|
  | < 3 fichiers, 1 domaine | Direct (pas d'agent) |
  | 3+ fichiers ou 2+ domaines | Agent(s) |
  | Recherche exploratoire | Agent Explore |
  | Max agents paralleles | 3 (projet solo) |
  | Build/tests | run_in_background |
  ```

- [ ] **Step 2** : Verifier que `wc -w CLAUDE.md` reste < 1500. Actuellement : 902 mots. Le tableau ajoute ~30 mots → ~930 mots. OK.

- [ ] **Step 3** : Pas de duplication a verifier — la section n'existait pas avant.

---

## Task 4.4 — Verification finale + commit

- [ ] **Step 1** : `bash scripts/health-check.sh` → SAIN, output bundle correct (`JS 457.15kB / CSS 17.22kB`).

- [ ] **Step 2** : `cd modules/app && npm run build` → exit 0 (sanity).

- [ ] **Step 3** : `cd modules/app && npm test` → 19 tests, 0 failure (sanity).

- [ ] **Step 4** : Test pre-commit hook (optionnel si test trop intrusif — sinon dry-run mental).

- [ ] **Step 5** : Update `CONTEXT.md` :
  - Section "App Builder — Etat technique" : ligne `Build : OK (XXXms, JS 457.15kB / CSS 17.22kB)` (mettre les valeurs reelles)
  - Ajouter dans "Dernieres sessions" : `2026-04-07 | Phase 4 Monitoring DONE : pre-commit hook (health-check), bundle thresholds (JS>600KB / CSS>40KB), token-awareness rules dans CLAUDE.md. health-check SAIN.`
  - "Prochaine action" → pointer vers Phase 5 (Expansion) avec ref a la spec
  - Decisions : `Phase 4 DONE | 2026-04-07 | Monitoring : pre-commit + bundle thresholds + token-awareness`

- [ ] **Step 6** : Commit final :
  ```
  feat(os): phase 4 — pre-commit health-check + bundle thresholds + token rules
  ```

---

## Critere de succes Phase 4 (copie de la spec, ligne 234-239)

- [ ] Commit avec build casse → bloque par pre-commit
- [ ] Bundle size dans CONTEXT.md section "Etat technique"
- [ ] Regles token-awareness dans CLAUDE.md
- [ ] `health-check.sh` = SAIN

---

## Recapitulatif fichiers

| # | Fichier | Action |
|---|---------|--------|
| 1 | `scripts/health-check.sh` | Modify — fix bundle extraction + add thresholds |
| 2 | `scripts/git-hooks/pre-commit` | Create — wrapper sur health-check |
| 3 | `.git/hooks/pre-commit` | Install (cp + chmod) — non committee, pas dans git |
| 4 | `CLAUDE.md` | Modify — section token-awareness |
| 5 | `docs/core/tools.md` | Modify — referencer le pre-commit hook |
| 6 | `CONTEXT.md` | Modify — bundle sizes + session log + decision |

Total : 1 fichier cree (committable), 4 fichiers modifies, 1 install local non committable, 1 commit final.

---

## Hors scope

- **CI auto-fix** : si DEGRADED en CI, on ne tente pas de corriger automatiquement. Phase 4 = local pre-commit only.
- **Pre-push hook** : non. Trop strict pour un projet solo.
- **Bundle history graphique** : non. Le tracking se fait en lisant CONTEXT.md historique.
- **Notification Slack/Telegram sur DEGRADED** : non. Le verdict s'affiche dans le terminal, c'est suffisant.
