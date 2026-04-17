---
type: plan
title: "Mega Audit V2 — Innovations cognitives FONCTION"
slug: 2026-04-16-mega-audit-v2-fonction
date: 2026-04-16
status: active
phases_total: 11
sessions_estimees: 3-5
related:
  - docs/audits/2026-04-16-mega-audit-v2/rapport-master-v2.md
  - docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md
  - docs/plans/2026-04-16-mega-audit-v2-execution.md (FORME companion)
  - wiki/concepts/Foundation OS.md
---

# Plan d'execution — Innovations cognitives Foundation OS

> **Companion de `2026-04-16-mega-audit-v2-execution.md` (FORME)**. Ce plan couvre la **FONCTION** : les 10 innovations qui transforment Foundation OS de "pile de rituels manuels" a "systeme cognitif auto-observant".
>
> **Source** : `docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md` (20 findings) + `rapport-master-v2.md` Partie 2.
>
> **Principe** : 1 phase = 1 innovation = 1 commit atomique. Chaque phase respecte les 6 elements obligatoires (pre-conditions + etat-repo + actions atomiques + verification + rollback + commit message).

## Ordre d'execution recommande (priorise par impact/effort)

1. **Phase 0** — Pre-conditions globales (lire definition canonique + audit) — 10 min
2. **Phase 1** — I-08 Routines Cloud → GitHub Actions — 2h **(autonomie reelle)**
3. **Phase 2** — I-02 Session transcript analyzer — 3h **(exploite 71 transcripts)**
4. **Phase 3** — I-01 Hook Grep wiki PreToolUse — 1h **(force reflexe 1)**
5. **Phase 4** — I-04 Tuile #15 "Propositions Claude" dans brief v12 — 1h **(cerveau, pas monitor)**
6. **Phase 5** — I-07 Self-diagnostic neuroplasticite — 2h
7. **Phase 6** — I-05 Enforcement runtime routing Cortex — 2h
8. **Phase 7** — I-09 Memory auto-priorisation — 1h
9. **Phase 8** — I-06 Contradiction detector — 2h
10. **Phase 9** — I-10 Feedback loop post-session — 1h
11. **Phase 10** — I-03 Brief v12 adaptatif — 3h (optionnel, nice-to-have)
12. **Phase 11** — Verification holistique + brief cloture — 30 min

**Total MUST (0-9 + 11)** : ~15h reparti sur 3-5 sessions.
**Total OPTIONNEL (0-10 + 11)** : ~18h reparti sur 4-6 sessions.

---

## Phase 0 — Pre-conditions globales

### Pre-conditions
- Plan FORME (`2026-04-16-mega-audit-v2-execution.md`) execute ou au moins Phase 1 (3 bombes latentes) corrigee
- Kevin a lu `wiki/concepts/Foundation OS.md` (definition canonique)
- Kevin a lu `rapport-master-v2.md` + `rapport-comportement.md`
- Kevin a valide l'ordre d'execution (ou a propose un ordre different)

### Etat repo attendu
- Sur main ou worktree dedie `feat/audit-v2-fonction-YYMMDD`
- Dossier `docs/audits/2026-04-16-mega-audit-v2/` present avec rapport-master-v2.md
- Branche a jour

### Actions atomiques
```bash
cd /Users/kevinnoel/foundation-os
git checkout main
git pull
bash scripts/worktree-new.sh audit-v2-fonction
cd .claude/worktrees/audit-v2-fonction-$(date +%y%m%d)
```

### Verification
- `git branch --show-current` = `feat/audit-v2-fonction-YYMMDD` (convention D-NAMING-01)
- `bash scripts/health-check.sh` = SAIN

### Rollback
`bash scripts/worktree-clean.sh audit-v2-fonction`

### Commit message
(aucun, prep seulement)

---

## Phase 1 — I-08 : Routines Cloud → GitHub Actions

**Pourquoi** : aujourd'hui les 14 routines Cloud sont documentees dans `wiki/meta/routines-setup.md` (860L) mais **pas creees dans UI Desktop**. Elles restent fiction. Les migrer en GitHub Actions avec cron les rend executables et versionnees.

### Pre-conditions
- Phase 0 complete
- `.github/workflows/` accessible (deja existe : ci.yml, supabase-ping.yml, supernova-sync.yml)
- GitHub Actions activees sur le repo

### Etat repo attendu
- `wiki/meta/routines-setup.md` contient 14 routines documentees (prompts detailles)
- 3 routines GitHub Actions deja existantes (ci, supabase-ping, supernova-sync)
- 0 routine de neuroplasticite active

### Actions atomiques

```bash
# 1. Creer le dossier
mkdir -p .github/workflows/routines

# 2. Extraire les 3 routines prioritaires de routines-setup.md (Wiki Health, Wiki Consolidation, Documentation Drift)
# Les convertir en .yml GitHub Actions

# Exemple Wiki Health (quotidien 8h UTC)
cat > .github/workflows/routines/wiki-health-daily.yml << 'EOF'
name: Routine Wiki Health
on:
  schedule:
    - cron: '0 8 * * *'  # Tous les jours 8h UTC
  workflow_dispatch:

jobs:
  wiki-health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run wiki-health.sh
        run: bash scripts/wiki-health.sh
      - name: Run drift-detector.sh
        run: bash scripts/drift-detector.sh --fix-cosmetic
      - name: Commit fixes if any
        run: |
          git config user.name "foundation-os-bot"
          git config user.email "noreply@foundation-os.local"
          git add wiki/ scripts/
          git diff --staged --quiet || git commit -m "chore(routines): wiki-health daily auto-fix"
      - name: Push
        run: git push origin main
EOF

# 3. Creer wiki-consolidation-weekly.yml (dimanche 20h UTC)
# 4. Creer documentation-drift-weekly.yml (lundi 9h UTC)

# 5. Pour chaque routine : creer un prompt Claude correspondant dans scripts/routines/
#    qui, lance par GitHub Action, appelle Claude CLI en mode non-interactif
#    (ex: bash scripts/routines/wiki-consolidation.sh qui utilise claude code headless)
```

### Verification
- `.github/workflows/routines/*.yml` existent (3 fichiers minimum)
- `gh workflow list` affiche les nouvelles routines
- `gh workflow run wiki-health-daily` trigger manuel OK
- Log GitHub Actions : routine execute, commits auto si fixes

### Rollback
```bash
rm -rf .github/workflows/routines/
git add .github/workflows/routines/
```

### Commit message
```
feat(os): I-08 — 3 routines Cloud migrees en GitHub Actions (autonomie reelle)

- wiki-health-daily.yml : cron 8h UTC, fix wikilinks, refresh hot.md stale, commit auto
- wiki-consolidation-weekly.yml : cron dimanche 20h UTC, enrichir pages seed > 7j
- documentation-drift-weekly.yml : cron lundi 9h UTC, CONTEXT < 200L, docs sync
- Scripts helper scripts/routines/*.sh pour Claude headless

Les 14 routines documentees dans wiki/meta/routines-setup.md peuvent maintenant etre portees progressivement.

Refs : Mega audit v2 FONCTION I-08, rapport-comportement.md C-09
```

---

## Phase 2 — I-02 : Session transcript analyzer

**Pourquoi** : `.omc/sessions/` contient 71 transcripts complets de sessions Kevin-Claude. Gold mine de patterns jamais analysee. Extraire : patterns de demandes, friction points, lexique Kevin, ratios plans finis/commences, temps moyen par tache.

### Pre-conditions
- Phase 1 complete (routines GitHub Actions fonctionnelles)
- Access a `.omc/sessions/` (~71 dossiers)
- Node ou Python disponible

### Etat repo attendu
- `.omc/sessions/` avec N fichiers JSONL par session (tool_uses, messages, etc.)
- Aucun script d'analyse existant

### Actions atomiques

```bash
# 1. Creer scripts/sessions-analyze.sh
cat > scripts/sessions-analyze.sh << 'EOF'
#!/usr/bin/env bash
# Analyse les transcripts .omc/sessions/ pour extraire patterns
# Usage : bash scripts/sessions-analyze.sh [--period=7d|30d|all]
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
SESSIONS_DIR="$REPO_ROOT/.omc/sessions"
OUTPUT="$REPO_ROOT/wiki/meta/session-patterns.md"
PERIOD="${1:-30d}"

# Extraction patterns :
# - Mots les plus frequents dans user messages (lexique Kevin)
# - Plans commences vs termines (docs/plans/ + .archive/plans-done-*/)
# - Frequence des slash-commands (/cockpit, /session-start, /plan-os, /wt)
# - Rework ratio (fichier modifie >= 2 fois dans la meme session)
# - Sessions DONE vs NEEDS_CONTEXT vs BLOCKED
# - Agents les plus invoques (dev-agent, doc-agent, os-architect, review-agent)
# - Temps moyen par type de tache (plan vs code vs doc vs audit)

# Output : wiki/meta/session-patterns.md avec tables + insights

# ... implementation detaillee ...
EOF
chmod +x scripts/sessions-analyze.sh

# 2. Creer routine GitHub Actions
cat > .github/workflows/routines/session-patterns-weekly.yml << 'EOF'
name: Session Patterns Analyzer
on:
  schedule:
    - cron: '0 3 * * 1'  # Lundi 3h UTC
  workflow_dispatch:

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run sessions-analyze.sh
        run: bash scripts/sessions-analyze.sh --period=7d
      - name: Commit patterns update
        run: |
          git config user.name "foundation-os-bot"
          git config user.email "noreply@foundation-os.local"
          git add wiki/meta/session-patterns.md
          git diff --staged --quiet || git commit -m "chore(routines): session patterns weekly update"
          git push origin main
EOF

# 3. Lancer une premiere analyse manuelle
bash scripts/sessions-analyze.sh --period=all
```

### Verification
- `wiki/meta/session-patterns.md` existe avec contenu analytique
- Le brief v12 peut lire ce fichier (potentiel nouveau cadre "Patterns cette semaine")
- `gh workflow list` inclut session-patterns-weekly

### Rollback
```bash
rm scripts/sessions-analyze.sh
rm wiki/meta/session-patterns.md
rm .github/workflows/routines/session-patterns-weekly.yml
```

### Commit message
```
feat(os): I-02 — sessions-analyze.sh exploite 71 transcripts .omc/sessions/

- Extract patterns: lexique Kevin, ratios plans finis/commences, frequence commands, rework ratio
- Output : wiki/meta/session-patterns.md (hebdo auto-regenere)
- GitHub Actions cron lundi 3h UTC (routine autonome)
- Premiere analyse manuelle lancee, ~N patterns detectes

Refs : Mega audit v2 FONCTION I-02, rapport-comportement.md C-17
```

---

## Phase 3 — I-01 : Hook Grep wiki PreToolUse

**Pourquoi** : le reflexe 1 neuroplasticite (recall wiki avant reponse technique) est ecrit dans CLAUDE.md mais jamais enforce. Un hook PreToolUse qui grep le wiki automatiquement le rend involontaire.

### Pre-conditions
- Phase 2 complete
- `.claude/settings.json` accessible
- `scripts/hooks/` existe

### Etat repo attendu
- 0 hook enforce le reflexe 1
- wiki/ contient 11 concepts + 5 entities etc. (~48 pages)

### Actions atomiques

```bash
# 1. Creer hook script
cat > scripts/hooks/wiki-recall.sh << 'EOF'
#!/usr/bin/env bash
# Hook PreToolUse Read/Grep : inject wiki context si domaine technique detecte
set -euo pipefail

USER_PROMPT="${CLAUDE_USER_PROMPT:-}"  # si exposé par Claude Code
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# Detect domaines techniques dans le prompt
DOMAINS="trading|finance|sante|design|dev|void-glass|wiki|cortex|brief|neuroplasticite|knowledge"
if [[ -n "$USER_PROMPT" ]] && [[ "$USER_PROMPT" =~ $DOMAINS ]]; then
  # Extract keyword detected
  KEYWORD=$(echo "$USER_PROMPT" | grep -oiE "$DOMAINS" | head -1)
  # Grep wiki pour ce keyword
  MATCHES=$(grep -rli "$KEYWORD" "$REPO_ROOT/wiki/" 2>/dev/null | head -3)
  if [[ -n "$MATCHES" ]]; then
    echo "[WIKI RECALL] Pages wiki pertinentes detectees pour '$KEYWORD' :"
    echo "$MATCHES"
    echo "Reflex 1 (neuroplasticite) : consulte ces pages avant de repondre."
  fi
fi
EOF
chmod +x scripts/hooks/wiki-recall.sh

# 2. Ajouter dans .claude/settings.json hooks.PreToolUse
# (editer le JSON pour ajouter un nouveau matcher)
# Apres le matcher validate-void-glass/security-reminder :
#   {
#     "matcher": "Read|Grep",
#     "hooks": [{"type": "command", "command": "bash scripts/hooks/wiki-recall.sh"}]
#   }
```

### Verification
- Hook execute au prochain Read/Grep dans une session avec prompt "explique Void Glass"
- Output injecte dans le contexte avec "[WIKI RECALL]"
- Claude (moi) voit la suggestion et peut decider de lire

### Rollback
```bash
# Retirer le hook du settings.json
# Supprimer scripts/hooks/wiki-recall.sh
```

### Commit message
```
feat(os): I-01 — hook PreToolUse wiki-recall.sh (reflex 1 neuroplasticite auto)

- Detect domaines techniques dans USER_PROMPT
- Grep wiki/ pour pages pertinentes
- Inject "[WIKI RECALL]" dans le contexte avant l'outil Read/Grep
- Reflex 1 devient involontaire (vs manuel aujourd'hui)

Refs : Mega audit v2 FONCTION I-01, rapport-comportement.md C-03/S3
```

---

## Phase 4 — I-04 : Tuile #15 "Propositions Claude" dans brief v12

**Pourquoi** : brief v12 actuel = 14 tuiles de monitoring passif. Jamais de "Claude recommande X". Ajouter une tuile optionnelle de propositions basees sur le contexte.

### Pre-conditions
- Phase 3 complete
- `docs/core/communication.md` section 6 (brief v12 spec)

### Actions atomiques

```bash
# 1. Editer docs/core/communication.md section 6.1
# Ajouter tuile #15 apres CAP+INPUT :
#
# 15. **PROPOSITIONS CLAUDE** `🤖` (optionnel) :
#     - Triggers : drift detecte OU pattern recurrent lessons-learned OU idee en parking > 7j OU plan inactif > 14j
#     - Format : table "Proposition | Raison | Action proposee"
#     - Max 3 propositions, prioritisees
#     - Ne remplace pas INPUT Kevin (restent les choix A/B/C)

# 2. Editer .claude/commands/cockpit.md et session-start.md
# Ajouter Phase 2bis "Generer propositions" avant brief

# 3. Creer scripts/propositions-generator.sh
cat > scripts/propositions-generator.sh << 'EOF'
#!/usr/bin/env bash
# Genere 0-3 propositions Claude pour la tuile #15 du brief v12
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
OUTPUT="/tmp/fos-propositions.md"

# Trigger 1 : drift detecte
if ! bash "$REPO_ROOT/scripts/drift-detector.sh" --quiet; then
  echo "| Corriger drift detecte | Health-check flag warning | \`bash scripts/drift-detector.sh --fix-cosmetic\` |"
fi

# Trigger 2 : idees en parking > 7j
# Parse CONTEXT.md section Idees & Parking, detecter celles avec source > 7j
# ... implementation ...

# Trigger 3 : plan inactif > 14j
# Parse docs/plans/*.md, check mtime
# ... implementation ...

# Trigger 4 : lessons-learned repetitives
# Parse lessons-learned.md, detecter erreurs > 1 occurrence
# ... implementation ...

cat > "$OUTPUT"
EOF
```

### Verification
- Brief v12 au prochain /cockpit affiche tuile #15 si triggers actifs
- Propositions actionnables (command ready a copier)
- Kevin peut ignorer ou executer

### Rollback
Retirer section 15 de communication.md, retirer script, retirer Phase 2bis des commands.

### Commit message
```
feat(os): I-04 — tuile #15 "Propositions Claude" dans brief v12

- communication.md section 6.1 : 14 → 15 tuiles
- scripts/propositions-generator.sh : detect triggers (drift, idees stale, plans inactifs, lessons repetitives)
- Format : table proposition/raison/action, max 3
- cockpit.md + session-start.md : Phase 2bis avant brief

L'OS devient proactif (suggere) vs passif (reporte).

Refs : Mega audit v2 FONCTION I-04, rapport-comportement.md C-05
```

---

## Phase 5 — I-07 : Self-diagnostic neuroplasticite

**Pourquoi** : health-check audite build/tests/CSS. Jamais si Claude respecte les 4 reflexes. Ajouter un score cognitif dans brief Sante.

### Pre-conditions
- Phase 4 complete

### Actions atomiques

```bash
# 1. Creer scripts/neuroplasticity-score.sh
cat > scripts/neuroplasticity-score.sh << 'EOF'
#!/usr/bin/env bash
# Compte les applications des 4 reflexes sur les 7 derniers jours
# Output : % de neuroplasticite

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
SINCE="7 days ago"

# Reflex 1 : Grep wiki/ avant reponses techniques
# Parser .omc/sessions/*/tool_uses.jsonl pour pattern Grep wiki/
GREP_WIKI_COUNT=$(grep -r "Grep.*wiki/" "$REPO_ROOT/.omc/sessions/" 2>/dev/null | wc -l | tr -d ' ')

# Reflex 2 : consolidation post-ingest (callout [!updated])
CONSOLIDATION_COUNT=$(grep -r "\[!updated\]" "$REPO_ROOT/wiki/" 2>/dev/null | wc -l | tr -d ' ')

# Reflex 3 : lessons-learned enrichi
LESSONS_RECENT=$(git log --since="$SINCE" --oneline -- wiki/meta/lessons-learned.md | wc -l | tr -d ' ')

# Reflex 4 : self-check session-end (update sessions-recent + thinking)
SELFCHECK_RECENT=$(git log --since="$SINCE" --oneline -- wiki/meta/sessions-recent.md wiki/meta/thinking.md | wc -l | tr -d ' ')

# Score
TOTAL=$((GREP_WIKI_COUNT + CONSOLIDATION_COUNT + LESSONS_RECENT + SELFCHECK_RECENT))
# Normaliser : attendu minimum ~10 par semaine
SCORE_PCT=$((TOTAL * 10))
[ $SCORE_PCT -gt 100 ] && SCORE_PCT=100

echo "Neuroplasticite cette semaine : ${SCORE_PCT}%"
echo "  Reflex 1 (recall wiki) : $GREP_WIKI_COUNT invocations"
echo "  Reflex 2 (consolidation) : $CONSOLIDATION_COUNT callouts"
echo "  Reflex 3 (lessons learned) : $LESSONS_RECENT commits"
echo "  Reflex 4 (self-check) : $SELFCHECK_RECENT commits"
EOF
chmod +x scripts/neuroplasticity-score.sh

# 2. Chain dans health-check.sh section INFO
# 3. Afficher dans brief v12 tuile Sante
```

### Verification
- `bash scripts/neuroplasticity-score.sh` output un %
- Score affiche dans brief Sante au prochain /cockpit

### Rollback
```bash
rm scripts/neuroplasticity-score.sh
# Retirer chain health-check
```

### Commit message
```
feat(os): I-07 — self-diagnostic neuroplasticite (scripts/neuroplasticity-score.sh)

- Mesure 4 reflexes sur 7 derniers jours
- Score % affiche dans brief v12 tuile Sante
- Chain dans health-check.sh section INFO

L'OS mesure son propre score cognitif (vs aveugle aujourd'hui).

Refs : Mega audit v2 FONCTION I-07, rapport-comportement.md C-16
```

---

## Phase 6 — I-05 : Enforcement runtime routing Cortex

**Pourquoi** : Cortex table routing decorative. Hook PostToolUse qui check si j'ai delegue au bon agent selon le fichier touche.

### Pre-conditions
- Phase 5 complete

### Actions atomiques

```bash
# 1. Creer scripts/hooks/cortex-routing-check.sh
cat > scripts/hooks/cortex-routing-check.sh << 'EOF'
#!/usr/bin/env bash
# Hook PostToolUse Write|Edit : check si delegation agent correcte
set -euo pipefail

FILE="${1:-}"
[ -z "$FILE" ] && exit 0

# Regles de routing (extraites de cortex.md)
if [[ "$FILE" =~ modules/app/src/.*\.(tsx|ts|css)$ ]]; then
  echo "[CORTEX] Fichier code React : prefer dev-agent delegation (sonnet model)"
elif [[ "$FILE" =~ docs/core/.*\.md$ ]] || [[ "$FILE" =~ ^CLAUDE\.md$ ]]; then
  echo "[CORTEX] Fichier architecture/spec : prefer os-architect delegation (opus model)"
elif [[ "$FILE" =~ ^CONTEXT\.md$ ]] || [[ "$FILE" =~ docs/.*\.md$ ]]; then
  echo "[CORTEX] Fichier doc : prefer doc-agent delegation (sonnet model)"
fi
# Pas d'enforcement strict (warning only) — Kevin peut override
EOF
chmod +x scripts/hooks/cortex-routing-check.sh

# 2. Ajouter dans .claude/settings.json hooks.PostToolUse matcher Write|Edit
```

### Verification
- Au prochain Write/Edit sur `modules/app/src/Button.tsx`, hook affiche "[CORTEX] prefer dev-agent"
- Warning non-bloquant

### Rollback
Supprimer le script + retirer du settings.json

### Commit message
```
feat(os): I-05 — enforcement runtime routing Cortex

- scripts/hooks/cortex-routing-check.sh : detect fichier → suggere agent
- Hook PostToolUse Write|Edit dans settings.json
- Warning non-bloquant (Kevin peut override)

Cortex table routing devient executable (vs decorative aujourd'hui).

Refs : Mega audit v2 FONCTION I-05, rapport-comportement.md C-02
```

---

## Phase 7 — I-09 : Memory auto-priorisation

**Pourquoi** : 28 auto-memories cumulatives sans priorite. Ajouter `last_used` frontmatter + trim mensuel des non-utilisees.

### Pre-conditions
- Phase 6 complete

### Actions atomiques

```bash
# 1. Ajouter last_used: YYYY-MM-DD dans frontmatter de chaque memoire
MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"
for f in "$MEMDIR"/*.md; do
  # Si frontmatter existe et pas de last_used
  if ! grep -q "last_used:" "$f"; then
    # Inject apres 'type:'
    sed -i.bak '/^type:/a\
last_used: 2026-04-16
' "$f"
    rm "$f.bak"
  fi
done

# 2. Creer scripts/memory-audit.sh pour trim mensuel
cat > scripts/memory-audit.sh << 'EOF'
#!/usr/bin/env bash
# Audit memoires : detect non-utilisees > 30j
set -euo pipefail
MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"
TODAY=$(date +%s)
for f in "$MEMDIR"/*.md; do
  LAST_USED=$(grep "^last_used:" "$f" | awk '{print $2}')
  [ -z "$LAST_USED" ] && continue
  LAST_USED_TS=$(date -j -f "%Y-%m-%d" "$LAST_USED" +%s 2>/dev/null || echo 0)
  DIFF_DAYS=$(( (TODAY - LAST_USED_TS) / 86400 ))
  if [ $DIFF_DAYS -gt 30 ]; then
    echo "[STALE > 30j] $f (last_used $LAST_USED, $DIFF_DAYS jours)"
  fi
done
EOF
chmod +x scripts/memory-audit.sh

# 3. Hook PreToolUse Read sur memory/ → update last_used
# (optionnel, peut etre fait manuellement par /session-end pour les memoires lues)

# 4. Update MEMORY.md avec last_audit meta
```

### Verification
- 28 memoires ont `last_used:` dans frontmatter
- `bash scripts/memory-audit.sh` detect les stales > 30j

### Rollback
```bash
# Retirer last_used de chaque memoire
for f in "$MEMDIR"/*.md; do
  sed -i.bak '/^last_used:/d' "$f"
  rm "$f.bak"
done
rm scripts/memory-audit.sh
```

### Commit message
```
feat(os): I-09 — memory auto-priorisation (last_used + trim mensuel)

- 28 memoires auto-memory : frontmatter last_used: YYYY-MM-DD ajoute
- scripts/memory-audit.sh : detect non-utilisees > 30j
- MEMORY.md : last_audit meta ajoute
- Base pour routine cloud mensuelle (Phase 1 routines)

Hygiene cognitive : l'OS gere sa propre charge memoire.

Refs : Mega audit v2 FONCTION I-09, rapport-comportement.md C-12
```

---

## Phase 8 — I-06 : Contradiction detector

**Pourquoi** : regle d'or "une info = un tier" non-enforce. Duplications CLAUDE.md ↔ auto-memory trouvees. Script qui detect et flag.

### Pre-conditions
- Phase 7 complete

### Actions atomiques

```bash
# 1. Creer scripts/tier-contradiction-check.sh
cat > scripts/tier-contradiction-check.sh << 'EOF'
#!/usr/bin/env bash
# Detect phrases dupliquees entre CLAUDE.md / CONTEXT.md / auto-memory / docs/core / wiki
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"

# Pour chaque ligne significative (> 40 chars) de CLAUDE.md :
grep -E "^[^#\-\|\s]" "$REPO_ROOT/CLAUDE.md" | while read -r LINE; do
  # Si trop court, skip
  [ ${#LINE} -lt 40 ] && continue
  # Chercher dans auto-memory
  MATCHES=$(grep -l "$LINE" "$MEMDIR"/*.md 2>/dev/null)
  if [ -n "$MATCHES" ]; then
    echo "[DUPLICATION] CLAUDE.md ligne dupliquee dans :"
    echo "$MATCHES"
    echo "  Ligne : \"$LINE\""
  fi
done

# Idem pour CONTEXT.md ↔ docs/, wiki/
EOF
chmod +x scripts/tier-contradiction-check.sh

# 2. Chain dans sync-check.sh
# 3. Hook SessionStart affiche si N duplications > 0
```

### Verification
- `bash scripts/tier-contradiction-check.sh` detecte les 3 duplications connues (imperatifs_qualite, minimal_files, no_token_limit vs neuroplasticity)
- Brief v12 sync cadre affiche "3 duplications a resoudre"

### Rollback
```bash
rm scripts/tier-contradiction-check.sh
# Retirer chain sync-check
```

### Commit message
```
feat(os): I-06 — tier-contradiction-check.sh (enforce "une info = un tier")

- Detect phrases dupliquees entre les 5 tiers memoire
- Output : "[DUPLICATION] file : ligne"
- Chain dans sync-check.sh
- Brief v12 sync affiche N duplications detectees

Enforce regle d'or D-WIKI-01 "une info = un seul tier".

Refs : Mega audit v2 FONCTION I-06, rapport-comportement.md C-12
```

---

## Phase 9 — I-10 : Feedback loop post-session

**Pourquoi** : l'OS ne sait pas si une session s'est bien passee. Ajouter un rating simple dans /session-end.

### Pre-conditions
- Phase 8 complete

### Actions atomiques

```bash
# 1. Editer .claude/commands/session-end.md
# Phase 7bis : demander "Cette session a bien marche ? [Y/N/partial]"
# Stocker dans .omc/sessions/<id>/rating.txt

# 2. Creer scripts/session-ratings-analyze.sh
cat > scripts/session-ratings-analyze.sh << 'EOF'
#!/usr/bin/env bash
# Analyse les 30 derniers ratings pour pattern
set -euo pipefail
RATINGS_DIR="$HOME/.omc/sessions"
# ... compter Y/N/partial, detecter streak negative, correlate type session ...
EOF
chmod +x scripts/session-ratings-analyze.sh

# 3. Ajouter dans routines-setup.md : routine ratings-monthly-review
```

### Verification
- Prochain /session-end demande rating
- `.omc/sessions/<id>/rating.txt` cree
- `bash scripts/session-ratings-analyze.sh` apres 10 sessions affiche pattern

### Rollback
Retirer la Phase 7bis + script + routine.

### Commit message
```
feat(os): I-10 — feedback loop post-session (rating Kevin)

- /session-end Phase 7bis : demande Y/N/partial
- Stockage .omc/sessions/<id>/rating.txt
- scripts/session-ratings-analyze.sh : pattern detection apres 10 sessions
- Routine mensuelle ratings-monthly-review

Satisfaction Kevin mesurable.

Refs : Mega audit v2 FONCTION I-10, rapport-comportement.md C-19
```

---

## Phase 10 — I-03 : Brief v12 adaptatif (OPTIONNEL)

**Pourquoi** : brief 14 tuiles chaque fois. Adapter selon contexte : minimal post-commit, standard normal, deep post-audit.

### Pre-conditions
- Phases 1-9 completes

### Actions atomiques

```bash
# 1. Editer docs/core/communication.md section 6.1
# Ajouter :
# - Mode minimal (3 tuiles) : Sante, Hot, Input. Trigger : commit < 1h ago, pas de drift
# - Mode standard (14 tuiles) : actuel
# - Mode deep (15 tuiles) : actuel + tuile Propositions. Trigger : post-audit, post-plan, reprise > 7j

# 2. Editer /cockpit et /session-start
# Phase 1bis : detecter mode selon triggers

# 3. Creer scripts/brief-mode-detector.sh
```

### Verification
- Brief au prochain /cockpit utilise le bon mode selon contexte

### Rollback
Revert communication.md + commands.

### Commit message
```
feat(os): I-03 — brief v12 adaptatif (3 modes selon contexte)

- Mode minimal : 3 tuiles post-commit
- Mode standard : 14 tuiles normal
- Mode deep : 15 tuiles post-audit
- scripts/brief-mode-detector.sh
- cockpit.md + session-start.md : Phase 1bis detect mode

Nice-to-have apres les 9 autres innovations.

Refs : Mega audit v2 FONCTION I-03, rapport-comportement.md C-08
```

---

## Phase 11 — Verification holistique + brief cloture

### Pre-conditions
- Phases 1-9 (MUST) ou 1-10 (complet) completes

### Actions atomiques

```bash
# 1. Relancer scenarios S1-S10 mentalement (voir rapport-comportement.md)
# Verifier que chaque innovation adresse le scenario :
# S1 cold start → I-08 + wiki hot.md hook (dep. plan FORME)
# S2 ambiguite routing → I-05
# S3 recall wiki → I-01
# S4 erreur → encore manuel, mais I-07 mesure
# S5 compactage → I-03 mode deep trigger (partiellement)
# S6 /plan-os → pas couvert par ces innovations (stable)
# S7 worktrees parallele → I-08 routines peut inclure session-lock activation
# S8 question historique → I-02 + I-01
# S9 article partage → manuel mais I-04 peut suggerer
# S10 drift detecte → I-04 propose fix

# 2. Verifier scores
bash scripts/health-check.sh
bash scripts/neuroplasticity-score.sh
bash scripts/wiki-counts-sync.sh --check  # (cree en plan FORME Phase 6)
bash scripts/tier-contradiction-check.sh

# 3. Update CONTEXT.md + wiki/hot.md + sessions-recent
# 4. Proposer commit final + merge main (ff-only)
```

### Verification
- 9/10 scenarios couverts par innovations
- Neuroplasticity score > 50% (vs ~20% aujourd'hui)
- 0 duplication tier
- Health-check SAIN

### Commit message final
```
chore(os): mega audit v2 FONCTION DONE — 9/10 innovations cognitives livrees

Foundation OS passe de "pile de rituels manuels" a "systeme cognitif auto-observant" :
- I-08 : 3 routines Cloud actives (GitHub Actions autonomes)
- I-02 : 71 transcripts analyses, patterns extraits hebdo
- I-01 : reflex 1 (recall wiki) enforce via hook
- I-04 : tuile #15 propositions proactives dans brief
- I-07 : score neuroplasticite mesure et affiche
- I-05 : cortex routing enforce runtime
- I-09 : memory auto-priorisation last_used
- I-06 : contradiction detector enforce "une info = un tier"
- I-10 : feedback loop post-session rating
- (I-03 reporte : nice-to-have brief adaptatif)

L'OS devient un cerveau qui s'observe et se mesure.
Score fonction : 4/10 → 8/10 estime.

Refs : docs/audits/2026-04-16-mega-audit-v2/ (rapport-master-v2.md, rapport-comportement.md)
```

---

## Annexe — Budget tokens estime

| Phase | Tokens |
|-------|--------|
| Phase 0 prep | 5K |
| Phase 1 I-08 | 40K |
| Phase 2 I-02 | 50K |
| Phase 3 I-01 | 25K |
| Phase 4 I-04 | 30K |
| Phase 5 I-07 | 25K |
| Phase 6 I-05 | 20K |
| Phase 7 I-09 | 30K |
| Phase 8 I-06 | 25K |
| Phase 9 I-10 | 15K |
| Phase 10 I-03 | 40K (optionnel) |
| Phase 11 verif | 15K |
| **TOTAL MUST** | **~280K** |
| **TOTAL COMPLET** | **~320K** |

Tenable dans 2-3 sessions Opus 4.7 1M ctx.

---

## Annexe — Ordre d'execution par session

### Session 1 (~4h)
- Phase 0 prep
- Phase 1 I-08 (routines Cloud)
- Phase 2 I-02 (session analyzer)
- Phase 3 I-01 (hook wiki recall)

### Session 2 (~4h)
- Phase 4 I-04 (propositions)
- Phase 5 I-07 (score neuroplasticite)
- Phase 6 I-05 (cortex enforcement)

### Session 3 (~4h)
- Phase 7 I-09 (memory priorisation)
- Phase 8 I-06 (contradiction detector)
- Phase 9 I-10 (feedback loop)
- Phase 11 verif + brief cloture

### Session 4 (optionnel, ~3h)
- Phase 10 I-03 (brief adaptatif)
- Phase 11 re-verif

---

## Annexe — Checklist finale

- [ ] Phase 0 worktree cree
- [ ] Phase 1 I-08 routines GitHub Actions
- [ ] Phase 2 I-02 session analyzer
- [ ] Phase 3 I-01 hook wiki recall
- [ ] Phase 4 I-04 tuile propositions
- [ ] Phase 5 I-07 score neuroplasticite
- [ ] Phase 6 I-05 cortex enforcement
- [ ] Phase 7 I-09 memory priorisation
- [ ] Phase 8 I-06 contradiction detector
- [ ] Phase 9 I-10 feedback loop
- [ ] Phase 10 I-03 brief adaptatif (optionnel)
- [ ] Phase 11 verification + merge main + archivage plan

---

**FIN DU PLAN FONCTION**. Executable avec ou sans plan FORME companion.
