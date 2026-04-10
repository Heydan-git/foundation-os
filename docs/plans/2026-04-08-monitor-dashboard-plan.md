# Foundation OS Monitor Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone HTML dashboard (`docs/monitor/`) that visualizes the current state of all Foundation OS plans, modules, initiatives, decisions and recent sessions, updated manually via a new `/session-end` step, while extracting Void Glass tokens into a shared CSS file to refine the design system.

**Architecture:** Vanilla HTML + CSS + JS in `docs/monitor/` (zero build, zero dep, zero npm). A single JS data file (`data.js`) drives rendering through pure DOM APIs (no template strings, no HTML-from-string injection — safer and compliant with security-reminder hook). A new shared tokens file (`docs/design-system/tokens.css`) becomes the Void Glass source of truth, consumed by the dashboard first and later by `modules/app` (out of scope v1).

**Tech Stack:** HTML 5, CSS 3 (variables, grid, flexbox), vanilla JavaScript ES2020+, no framework, no bundler. Figtree + JetBrains Mono fonts via Google Fonts CDN. Reference spec : `docs/specs/2026-04-08-monitor-dashboard-design.md`.

---

## Prerequisites

- [x] Branch `audit-massif-cycle3` (continue on this branch, no new branch)
- [x] Design spec approved : `docs/specs/2026-04-08-monitor-dashboard-design.md` (commit b15cdc0)
- [x] Void Glass design system read : `docs/design-system.md`
- [ ] Health-check DEGRADED tolere (pas de nouvelle regression imputable)
- [ ] Aucun changement sur `modules/app/` tout le long du plan (zero risque regression produit)

---

## File Structure

### Files to create

| Path | Purpose | Session |
|------|---------|---------|
| `docs/design-system/tokens.css` | Source unique Void Glass (variables CSS) + 4 new status tokens | D2 |
| `docs/monitor/index.html` | HTML skeleton, charge fonts + style.css + data.js + render.js | D2 |
| `docs/monitor/style.css` | Dashboard-specific styles, importe tokens.css | D2 |
| `docs/monitor/data.js` | `window.MONITOR_DATA = {...}`, hand-edited source of truth | D2 |
| `docs/monitor/render.js` | Vanilla JS rendering, DOM APIs only (no HTML-from-string) | D2 |
| `docs/monitor/README.md` | Schema reference + update guide + how-to-open | D3 |

### Files to modify

| Path | What changes | Session |
|------|-------------|---------|
| `CONTEXT.md` | Pause cycle3 audit, add dashboard as WIP initiative, update nextAction, log session D1 | D1 |
| `docs/design-system.md` | Document 4 new status color tokens in section Couleurs + Figma Mapping | D2 |
| `.claude/commands/session-end.md` | Insert step 5.5 for dashboard data.js update | D3 |
| `CONTEXT.md` | Dashboard monitor DONE, decide resume cycle3 or not, log session D3 | D3 |

**Total new files : 6.** **Total modified files : 3 (CONTEXT.md touched twice).** **Zero file at root.** **Zero file in `modules/`.** Respects CLAUDE.md anti-bloat rules.

---

# Session D1 — Spec + plan + CONTEXT.md pause (en cours)

D1 covers : brainstorm (done), spec (done, commit b15cdc0), plan (in-progress = this file), CONTEXT.md update (next), commit.

## Task D1.1 : Write implementation plan (this file)

**Files:**
- Create : `docs/plans/2026-04-08-monitor-dashboard-plan.md`

- [x] **Step 1** : Write complete plan with all tasks D1/D2/D3 using writing-plans skill
- [x] **Step 2** : Self-review plan against spec (gap scan, placeholder scan, type consistency)
- [ ] **Step 3** : Stage plan file

```bash
cd /Users/kevinnoel/foundation-os
git add docs/plans/2026-04-08-monitor-dashboard-plan.md
git status --short docs/plans/
```

Expected : `A  docs/plans/2026-04-08-monitor-dashboard-plan.md`

- [ ] **Step 4** : Commit plan file

```bash
git commit -m "$(cat <<'EOF'
docs(plan): monitor dashboard implementation plan v1

Bite-sized tasks for 3 sessions D1/D2/D3 :
- D1 : spec + plan + CONTEXT.md pause cycle3 (current)
- D2 : tokens.css + HTML/CSS/JS skeleton + data.js real state
- D3 : README + session-end step 5.5 + final checks

Reference spec : docs/specs/2026-04-08-monitor-dashboard-design.md

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected : pre-commit hook runs health-check DEGRADED, commit authorized (WARNING tolere).

## Task D1.2 : Update CONTEXT.md (pause cycle3, add dashboard WIP)

**Files:**
- Modify : `CONTEXT.md` (sections Modules, Dernieres sessions, Cycle3 progress, Prochaine action, Decisions actives)

**Rationale :** CONTEXT.md is the narrative source of truth. Must reflect : (1) S7 is actually DONE on disk but cycle3 is paused, (2) dashboard monitor v1 is a new WIP initiative, (3) Prochaine action = session D2.

- [ ] **Step 1** : Read current state of CONTEXT.md sections touched

Read tool with offset/limit (file too large for single Read). Sections to read :
- lines 5-16 (Modules table)
- lines 17-27 (Dernieres sessions table)
- lines 28-42 (Cycle 3 progress table)
- lines 45-58 (Prochaine action)
- lines 60-76 (Decisions actives)

- [ ] **Step 2** : Update Modules table — add "Monitor Dashboard" row after Meta-audit

New line to insert :
```
| Monitor Dashboard | WIP v1 D1/3 | Mini-projet outil interne meta-OS : docs/monitor/ standalone HTML + docs/design-system/tokens.css partages. Spec b15cdc0 (docs/specs/2026-04-08-monitor-dashboard-design.md). Decoupage 3 sessions D1/D2/D3 anti-compactage. Pause audit cycle3 en attendant. |
```

- [ ] **Step 3** : Update Cycle 3 progress table — mark S7 as DONE + mark S8-S23 as PAUSED

Change line (after S6) from :
```
| S7-S23 | PENDING | voir plan | voir plan |
```
To :
```
| S7 Agents deep | DONE 2026-04-08 (non-integre CONTEXT.md en S7.5) | MOI | 07-agents.md (402L, 4 agents scannes) |
| S8-S23 | PAUSED (dashboard D1/D2/D3 priorite) | voir plan | voir plan |
```

- [ ] **Step 4** : Add session entry to "Dernieres sessions" table (prepend, keep max 5)

New entry :
```
| 2026-04-08 | **[IN_PROGRESS] Dashboard monitor D1/3 — Spec + plan + pause cycle3**. Mini-projet outil interne meta-OS lance en pause du mega audit cycle3. Sur branche audit-massif-cycle3. Session precedente avait bugge mais S7 deja livre sur disque (.archive/audit-massif/07-agents.md 402L DONE 2026-04-08, a integrer dans CONTEXT.md en S7.5 plus tard). Kevin demande mise en pause du mega audit pour construire un dashboard HTML qui monitore visuellement tous les plans + modules + initiatives + decisions + sessions. Brainstorm + design spec valide en 3 questions (forme/scope/update) + 5 sections presentees + full approval. Spec committee docs/specs/2026-04-08-monitor-dashboard-design.md (374L, commit b15cdc0) puis plan committee docs/plans/2026-04-08-monitor-dashboard-plan.md. **5 decisions D-MON-01..05** : (01) standalone HTML docs/monitor/ pas React, (02) scope large plans+modules+initiatives+decisions+sessions, (03) update manuel v1 via nouvelle etape session-end, (04) extraction docs/design-system/tokens.css partagee = enrichir le DS comme demande Kevin, (05) decoupage 3 sessions D1/D2/D3 pattern S6 anti-compactage. **4 nouveaux tokens Void Glass identifies** : --fos-accent-wip/paused/parking/archived (cibles #3B82F6/#F59E0B/#A78BFA/rgba white 12%, les 2 derniers derives des orbs existants). Health check DEGRADED 11→23 refs cassees (forward-refs spec vers futurs fichiers, normales pour design doc, se resorberont en D2/D3). Zero regression modules/app (build 769ms OK, 19/19 tests). 2 commits : (spec) b15cdc0 + (plan) a venir. Prochaine : Session D2 implementation skeleton. |
```

- [ ] **Step 5** : Update Prochaine action section — replace current action 1 with dashboard D2

Replace existing action 1 with :
```
1. **Dashboard monitor — Session D2 implementation skeleton**. Sur branche audit-massif-cycle3. Creer docs/design-system/tokens.css (tokens existants + 4 nouveaux status), puis docs/monitor/ (index.html + style.css + data.js avec etat reel extrait de CONTEXT.md + render.js). Visual check : open docs/monitor/index.html ou python -m http.server 8000 -d docs/monitor. Commit feat(monitor): skeleton + render + data init. Plan : docs/plans/2026-04-08-monitor-dashboard-plan.md section Session D2. Taches T2.1-T2.8.

2. **Dashboard monitor — Session D3 integration**. Apres D2. README.md + /session-end step 5.5 + tests visuels finaux + CONTEXT.md dashboard DONE. Plan section Session D3.

3. **Cycle 3 — S7.5 integration + reprise S8 Commands deep** (apres dashboard D3). S7 Agents est DONE sur disque (.archive/audit-massif/07-agents.md 402L) mais non integre CONTEXT.md, a integrer en debut de session reprise. Puis S8 commands (4) deep audit. Decision D-S7-01 inchangee : audit lineaire S8-S23 puis fixes en bloc.

4. **Phase 5 Expansion** (apres cycle3 S23 + fixes + G3 merge) : inchange.

5. **Initiatives Cowork (parking, post-audit)** : inchange.
```

- [ ] **Step 6** : Add decision D-MON-01..05 block to Decisions actives section

New row in table :
```
| D-MON-01..05 Dashboard v1 | 2026-04-08 | 5 decisions brainstormees pour mini-projet dashboard monitor : (01) standalone HTML docs/monitor/ pas de React, (02) scope large plans+modules+initiatives+decisions+sessions recentes, (03) update manuel v1 + option script plus tard, (04) extraction docs/design-system/tokens.css partagee = enrichir le DS, (05) decoupage 3 sessions D1/D2/D3 anti-compactage. Spec : docs/specs/2026-04-08-monitor-dashboard-design.md. Plan : docs/plans/2026-04-08-monitor-dashboard-plan.md. |
```

- [ ] **Step 7** : Verify CONTEXT.md parses correctly (no broken markdown tables)

```bash
cd /Users/kevinnoel/foundation-os
head -100 CONTEXT.md | tail -60
sed -n '45,80p' CONTEXT.md
```

Expected : pas de ligne markdown cassee, tables alignees.

- [ ] **Step 8** : Stage CONTEXT.md

```bash
git add CONTEXT.md
git status --short CONTEXT.md
```

Expected : `M  CONTEXT.md`

- [ ] **Step 9** : Commit CONTEXT.md

```bash
git commit -m "$(cat <<'EOF'
docs(context): pause cycle3 + dashboard D1/3 done (spec+plan)

- Cycle3 S7 DONE sur disque non integre (S7.5 a venir), S8-S23 PAUSED
- Monitor Dashboard v1 ajoute comme initiative WIP D1/3
- Prochaine action : Session D2 implementation skeleton
- 5 decisions D-MON-01..05 ajoutees

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected : commit OK, health-check DEGRADED tolere.

- [ ] **Step 10** : Post-commit verification

```bash
git log --oneline -3
bash scripts/health-check.sh 2>&1 | tail -20
```

Expected :
- 3 derniers commits visibles : CONTEXT.md pause + plan + spec
- Health DEGRADED (0 critical, 1 warning refs cassees)
- Build OK < 1500ms
- Tests 19/19

## Task D1.3 : End session D1

- [ ] **Step 1** : Announce session D1 end

Short format :
```
Session D1 cloturee — 2026-04-08
Statut : DONE
Livrable : docs/specs/...design.md + docs/plans/...plan.md (committed)
CONTEXT.md : mis a jour (pause cycle3 + dashboard WIP)
Prochaine action : Session D2 implementation skeleton (plan section Session D2)
```

- [ ] **Step 2** : No further action D1. Fresh session starts D2.

---

# Session D2 — Implementation skeleton

D2 creates all files in `docs/monitor/` + `docs/design-system/tokens.css` + updates `docs/design-system.md`.

## Task D2.1 : Create `docs/design-system/tokens.css`

**Files:**
- Create : `docs/design-system/tokens.css`

**Rationale :** Extract all Void Glass variables documented in `docs/design-system.md` into a real importable CSS file + add 4 new status tokens. This becomes the shared source of truth (the dashboard imports it, modules/app can later).

- [ ] **Step 1** : Create tokens.css with existing + new tokens

Full file content :

```css
/* Foundation OS — Void Glass Design System Tokens */
/* Source of truth : docs/design-system.md */
/* Consumers : docs/monitor/, (future) modules/app/ */

:root {
  /* === Couleurs de base (existantes) === */
  --fos-bg       : #06070C;
  --fos-accent   : #5EEAD4;
  --fos-card-bg  : rgba(255,255,255,.025);
  --fos-border   : rgba(255,255,255,.055);
  --fos-text     : rgba(255,255,255,.88);
  --fos-muted    : rgba(255,255,255,.42);

  /* === Orbs (effets de fond existants) === */
  --fos-orb-1    : rgba(94,234,212,.09);
  --fos-orb-2    : rgba(167,139,250,.09);
  --fos-orb-3    : rgba(59,130,246,.09);

  /* === NOUVEAUX — Status accents (v1 dashboard monitor) === */
  --fos-accent-wip      : #3B82F6;            /* Blue, derive --fos-orb-3 */
  --fos-accent-paused   : #F59E0B;            /* Amber */
  --fos-accent-parking  : #A78BFA;            /* Purple, derive --fos-orb-2 */
  --fos-accent-archived : rgba(255,255,255,.12);

  /* === Typographie (existante) === */
  --fos-font-ui   : 'Figtree', system-ui, sans-serif;
  --fos-font-mono : 'JetBrains Mono', 'Fira Code', monospace;

  /* === Border radius (existants) === */
  --fos-radius-card  : 12px;
  --fos-radius-pill  : 8px;
  --fos-radius-input : 6px;

  /* === Animations (existantes) === */
  --fos-anim-duration : 0.25s;
  --fos-anim-easing   : ease;
  --fos-anim-stagger  : 40ms;
}
```

- [ ] **Step 2** : Visual inspection

```bash
cat /Users/kevinnoel/foundation-os/docs/design-system/tokens.css
```

Expected : file exists, well-formatted, 4 new tokens present under "NOUVEAUX" comment.

## Task D2.2 : Update `docs/design-system.md` with new tokens

**Files:**
- Modify : `docs/design-system.md` (section Couleurs + Figma Mapping)

- [ ] **Step 1** : Add new subsection under `## Couleurs`

Insert a new subsection after the closing `\`\`\`` of the existing color block :

```markdown
### Status accents (v1 dashboard monitor)

\`\`\`css
--fos-accent-wip       : #3B82F6                   /* Blue — WIP/en cours */
--fos-accent-paused    : #F59E0B                   /* Amber — en pause volontaire */
--fos-accent-parking   : #A78BFA                   /* Purple — gele externe */
--fos-accent-archived  : rgba(255,255,255,.12)     /* Gris fonce — abandonne */
\`\`\`

Introduits via docs/monitor/ (spec docs/specs/2026-04-08-monitor-dashboard-design.md). Consommes initialement par le dashboard, disponibles pour modules/app si besoin futur. Les blue/purple sont alignes sur --fos-orb-3 et --fos-orb-2 existants (coherence).
```

- [ ] **Step 2** : Add 4 rows to the Figma Mapping table

Append to existing table :
```markdown
| color/status/wip | --fos-accent-wip | #3B82F6 |
| color/status/paused | --fos-accent-paused | #F59E0B |
| color/status/parking | --fos-accent-parking | #A78BFA |
| color/status/archived | --fos-accent-archived | rgba(255,255,255,.12) |
```

- [ ] **Step 3** : Verify no existing rules broken

```bash
cat /Users/kevinnoel/foundation-os/docs/design-system.md
```

Expected : existing sections intact, new subsection under Couleurs, 4 new rows in Figma Mapping.

## Task D2.3 : Create `docs/monitor/index.html` skeleton

**Files:**
- Create : `docs/monitor/index.html`

- [ ] **Step 1** : Write HTML skeleton

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foundation OS — Monitor</title>

  <!-- Fonts : Figtree + JetBrains Mono (Void Glass DS) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Styles : shared tokens + dashboard-specific -->
  <link rel="stylesheet" href="../design-system/tokens.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main id="app">
    <!-- Section 1 : Header hero -->
    <header id="hero" class="hero"></header>

    <!-- Section 2 : Next Action banner -->
    <section id="next-action" class="next-action"></section>

    <!-- Section 3 : Plans grid -->
    <section id="plans" class="plans-section">
      <h2 class="section-title">Plans</h2>
      <div id="plans-grid" class="plans-grid"></div>
    </section>

    <!-- Section 4 : Modules + Initiatives (2 cols) -->
    <section class="two-col">
      <div class="col">
        <h2 class="section-title">Modules</h2>
        <div id="modules-list" class="list"></div>
      </div>
      <div class="col">
        <h2 class="section-title">Initiatives</h2>
        <div id="initiatives-list" class="list"></div>
      </div>
    </section>

    <!-- Section 5 : Decisions + Sessions recentes (2 cols) -->
    <section class="two-col">
      <div class="col">
        <h2 class="section-title">Decisions actives</h2>
        <div id="decisions-list" class="list"></div>
      </div>
      <div class="col">
        <h2 class="section-title">Sessions recentes</h2>
        <div id="sessions-list" class="list"></div>
      </div>
    </section>
  </main>

  <!-- Data + render (order matters : data first) -->
  <script src="data.js"></script>
  <script src="render.js"></script>
</body>
</html>
```

- [ ] **Step 2** : Open file to check syntax

```bash
open /Users/kevinnoel/foundation-os/docs/monitor/index.html
```

Expected : page loads blank (no CSS yet applied visibly, no JS data), devtools Console = 0 errors (just a warning about MONITOR_DATA undefined which is fixed next task).

## Task D2.4 : Create `docs/monitor/style.css`

**Files:**
- Create : `docs/monitor/style.css`

- [ ] **Step 1** : Write styles

```css
/* Foundation OS — Monitor Dashboard styles */
/* Imports tokens from ../design-system/tokens.css (linked in index.html) */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--fos-bg);
  color: var(--fos-text);
  font-family: var(--fos-font-ui);
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
  padding: 32px 24px;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === Section 1 : Hero === */
.hero {
  padding: 40px 32px;
  background: var(--fos-card-bg);
  border: 1px solid var(--fos-border);
  border-radius: var(--fos-radius-card);
}

.hero h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--fos-text);
}

.hero .meta-line {
  margin-top: 8px;
  font-family: var(--fos-font-mono);
  font-size: 13px;
  color: var(--fos-muted);
}

/* === Section 2 : Next Action === */
.next-action {
  padding: 24px 28px;
  background: var(--fos-card-bg);
  border: 1px solid var(--fos-border);
  border-left: 3px solid var(--fos-accent);
  border-radius: var(--fos-radius-card);
}

.next-action .label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--fos-muted);
  margin-bottom: 6px;
}

.next-action .content {
  font-size: 18px;
  font-weight: 500;
  color: var(--fos-text);
  line-height: 1.4;
}

/* === Section titles === */
.section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fos-muted);
  margin-bottom: 16px;
}

/* === Section 3 : Plans grid === */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .plans-grid { grid-template-columns: 1fr; }
}

.plan-card {
  padding: 20px;
  background: var(--fos-card-bg);
  border: 1px solid var(--fos-border);
  border-radius: var(--fos-radius-card);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.plan-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--fos-text);
  line-height: 1.3;
}

.plan-card .priority {
  font-family: var(--fos-font-mono);
  font-size: 11px;
  color: var(--fos-muted);
}

.plan-card .progress {
  height: 6px;
  background: var(--fos-border);
  border-radius: 3px;
  overflow: hidden;
}

.plan-card .progress-fill {
  height: 100%;
  background: var(--fos-accent);
  transition: width var(--fos-anim-duration) var(--fos-anim-easing);
}

.plan-card .progress-text {
  font-family: var(--fos-font-mono);
  font-size: 11px;
  color: var(--fos-muted);
}

.plan-card .phase {
  font-size: 13px;
  color: var(--fos-muted);
  line-height: 1.4;
}

.plan-card details summary {
  cursor: pointer;
  font-size: 12px;
  color: var(--fos-muted);
  user-select: none;
  list-style: none;
}

.plan-card details summary::-webkit-details-marker { display: none; }

.plan-card details summary::before {
  content: "▸ ";
  display: inline-block;
  transition: transform var(--fos-anim-duration);
}

.plan-card details[open] summary::before {
  transform: rotate(90deg);
}

.plan-card details .timeline {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plan-card .timeline .session {
  font-family: var(--fos-font-mono);
  font-size: 11px;
  color: var(--fos-muted);
  display: flex;
  gap: 8px;
}

.plan-card .notes {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--fos-border);
  font-size: 12px;
  font-style: italic;
  color: var(--fos-muted);
}

/* === Badges status === */
.badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--fos-radius-pill);
  border: 1px solid;
}

.badge.done     { color: var(--fos-accent);          border-color: var(--fos-accent); }
.badge.wip      { color: var(--fos-accent-wip);      border-color: var(--fos-accent-wip); }
.badge.paused   { color: var(--fos-accent-paused);   border-color: var(--fos-accent-paused); }
.badge.pending  { color: var(--fos-muted);           border-color: var(--fos-border); }
.badge.parking  { color: var(--fos-accent-parking);  border-color: var(--fos-accent-parking); }
.badge.archived { color: var(--fos-muted);           border-color: var(--fos-accent-archived); }

/* === Section 4 + 5 : Two-column === */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .two-col { grid-template-columns: 1fr; }
}

.two-col .col {
  display: flex;
  flex-direction: column;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  padding: 14px 16px;
  background: var(--fos-card-bg);
  border: 1px solid var(--fos-border);
  border-radius: var(--fos-radius-card);
}

.list-item .title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fos-text);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.list-item .detail {
  font-size: 12px;
  color: var(--fos-muted);
  line-height: 1.4;
}

.list-item .meta {
  margin-top: 6px;
  font-family: var(--fos-font-mono);
  font-size: 10px;
  color: var(--fos-muted);
}

.list-item .blocked-by {
  margin-top: 6px;
  font-size: 11px;
  color: var(--fos-accent-paused);
}

/* === Scrollbar (Void Glass subtle) === */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--fos-border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--fos-muted); }
```

- [ ] **Step 2** : Visual check — reload `index.html` in browser

Expected : page still mostly blank (no data yet), but background is `#06070C`, font family Figtree visible in devtools Computed tab on body, borders rounded, section titles visible in muted color.

## Task D2.5 : Create `docs/monitor/data.js` with real state

**Files:**
- Create : `docs/monitor/data.js`

**Rationale :** Canonical snapshot of Foundation OS state at 2026-04-08 D2 session. Hand-extracted from CONTEXT.md + docs/plans/ + .archive/audit-massif/.

- [ ] **Step 1** : Write full data.js

```js
/* Foundation OS — Monitor Dashboard data */
/* Source of truth : hand-edited. Updated at each /session-end (step 5.5). */
/* Schema reference : docs/monitor/README.md */
/* Enum status : DONE | WIP | PAUSED | PENDING | PARKING | ARCHIVED */

window.MONITOR_DATA = {
  meta: {
    version: "0.1.0",
    updatedAt: "2026-04-08",
    updatedInSession: "D2 — Implementation skeleton",
    nextAction: "Session D3 — README + session-end step 5.5 + final checks"
  },

  plans: [
    {
      id: "cycle3-audit",
      title: "Cycle 3 — Audit massif",
      status: "PAUSED",
      priority: "P0",
      path: "docs/plans/2026-04-07-cycle3-implementation.md",
      progress: { done: 8, total: 24, unit: "sessions" },
      currentPhase: "S7 DONE disque non-integre (S7.5 a venir), S8-S23 PAUSED (dashboard priorite)",
      startedAt: "2026-04-07",
      sessions: [
        { id: "S0", title: "Pre-flight", status: "DONE", date: "2026-04-07" },
        { id: "S1", title: "Carto repo", status: "DONE", date: "2026-04-07" },
        { id: "S2", title: "Inventaire components", status: "DONE", date: "2026-04-07" },
        { id: "S3", title: "Fondations Core OS", status: "DONE", date: "2026-04-08" },
        { id: "S4", title: "Architecture orga", status: "DONE", date: "2026-04-08" },
        { id: "S5", title: "Workflows + routing", status: "DONE", date: "2026-04-08" },
        { id: "S6", title: "Orchestration + automation", status: "DONE", date: "2026-04-08" },
        { id: "S7", title: "Agents (4) deep + tests", status: "DONE", date: "2026-04-08" },
        { id: "S8", title: "Commands (4) deep", status: "PAUSED" },
        { id: "S9", title: "Scripts + hooks", status: "PAUSED" },
        { id: "S10", title: "Skills orchestration", status: "PAUSED" },
        { id: "S11", title: "Comm + securite", status: "PAUSED" },
        { id: "S12", title: "Memory anti-compactage", status: "PAUSED" },
        { id: "S13", title: "Module app", status: "PAUSED" },
        { id: "S14-S17", title: "Suggestions tech + strategic + external", status: "PAUSED" },
        { id: "S18-S19", title: "Cross-check + synthese roadmap", status: "PAUSED" },
        { id: "S20-S22", title: "Fixes P1/P2/P3", status: "PAUSED" },
        { id: "S23", title: "Rapport final", status: "PAUSED" }
      ],
      notes: "Decision D-S7-01 : audit lineaire puis fixes en bloc. Pause decidee en D1 dashboard."
    },
    {
      id: "phase1-fondations",
      title: "Phase 1 — Fondations",
      status: "DONE",
      priority: "P0",
      path: "docs/plans/2026-04-05-phase1-fondations.md",
      progress: { done: 1, total: 1, unit: "phase" },
      currentPhase: "Terminee 2026-04-05",
      startedAt: "2026-04-05",
      sessions: [],
      notes: "Setup initial module app : routes, composants, Supabase"
    },
    {
      id: "phase2-app-hardening",
      title: "Phase 2 — App Hardening",
      status: "DONE",
      priority: "P1",
      path: "docs/plans/2026-04-07-phase2-app-hardening.md",
      progress: { done: 1, total: 1, unit: "phase" },
      currentPhase: "Terminee 2026-04-07",
      startedAt: "2026-04-07",
      sessions: [],
      notes: "Navbar 4 items, KnowledgePage, 0 artifact JSX, Vitest 19 tests"
    },
    {
      id: "phase3-os-intelligence",
      title: "Phase 3 — OS Intelligence",
      status: "DONE",
      priority: "P1",
      path: "docs/plans/2026-04-07-phase3-os-intelligence.md",
      progress: { done: 1, total: 1, unit: "phase" },
      currentPhase: "Terminee 2026-04-07",
      startedAt: "2026-04-07",
      sessions: [],
      notes: "Cortex + routing agents"
    },
    {
      id: "phase4-monitoring",
      title: "Phase 4 — Monitoring",
      status: "DONE",
      priority: "P1",
      path: "docs/plans/2026-04-07-phase4-monitoring.md",
      progress: { done: 1, total: 1, unit: "phase" },
      currentPhase: "Terminee 2026-04-07",
      startedAt: "2026-04-07",
      sessions: [],
      notes: "health-check.sh + sync-check.sh + ref-checker"
    },
    {
      id: "finition-os",
      title: "Finition OS",
      status: "DONE",
      priority: "P1",
      path: "docs/plans/2026-04-07-finition-os.md",
      progress: { done: 3, total: 3, unit: "sessions" },
      currentPhase: "Terminee 2026-04-07",
      startedAt: "2026-04-07",
      sessions: [],
      notes: "sync-check 6/6 + ref-checker + polish decisions-log"
    },
    {
      id: "dashboard-monitor",
      title: "Dashboard Monitor v1",
      status: "WIP",
      priority: "P1",
      path: "docs/plans/2026-04-08-monitor-dashboard-plan.md",
      progress: { done: 2, total: 3, unit: "sessions" },
      currentPhase: "D2 en cours — implementation skeleton",
      startedAt: "2026-04-08",
      sessions: [
        { id: "D1", title: "Spec + plan + pause cycle3", status: "DONE", date: "2026-04-08" },
        { id: "D2", title: "Implementation skeleton", status: "WIP", date: "2026-04-08" },
        { id: "D3", title: "README + session-end integration + tests", status: "PENDING" }
      ],
      notes: "Mini-projet outil interne meta-OS, pause du cycle3. Spec b15cdc0, plan committe."
    }
  ],

  modules: [
    {
      id: "app",
      name: "App Builder",
      status: "production-ready",
      detail: "8 routes, Navbar 4 items, Vitest 19/19, build ~825ms, bundle 457kB"
    },
    {
      id: "core-os",
      name: "Core OS",
      status: "4/4 actif",
      detail: "Cortex (routing), Memory (tiers), Monitor (health), Tools (automation)"
    },
    {
      id: "finance",
      name: "Finance",
      status: "prevu",
      detail: "Post-Cycle 3 + Phase 5 expansion"
    },
    {
      id: "sante",
      name: "Sante",
      status: "prevu",
      detail: "Post-Cycle 3 + Phase 5 expansion"
    }
  ],

  initiatives: [
    {
      id: "cowork-sprint1",
      title: "Cowork Sprint 1 (skill orchestrator v3)",
      status: "PARKING",
      path: "docs/travaux-cowork/2026-04-08-collaboration-ia/02-plan-action.md",
      blockedBy: "D-S7-01 — post-audit cycle3",
      detail: "Skill orchestrator v3 + brancher session-lock.sh + fix validate-void-glass.sh"
    },
    {
      id: "plan-router",
      title: "Plan-Router",
      status: "PARKING",
      path: "docs/travaux-cowork/2026-04-08-plan-router/",
      blockedBy: "6 Q ouvertes Q1-Q6 + D-S7-01",
      detail: "5 profils execution SCAN/CODE/ARCHITECT/AUDIT/DOC"
    },
    {
      id: "cowork-meta-audit",
      title: "Meta-audit collab-IA",
      status: "ARCHIVED",
      path: "docs/travaux-cowork/2026-04-08-collaboration-ia/",
      blockedBy: null,
      detail: "Livre 2026-04-08, audit + plan-action RICE + tuto HTML + README. Lu et integre."
    }
  ],

  decisions: [
    {
      id: "D-MON-01",
      date: "2026-04-08",
      title: "Dashboard standalone HTML docs/monitor/",
      summary: "Pas de React ni module. Zero build, vanilla JS, separation meta-OS/produit."
    },
    {
      id: "D-MON-02",
      date: "2026-04-08",
      title: "Scope large plans+modules+initiatives+decisions+sessions",
      summary: "Vue panoramique plutot que focalisee audit-seulement."
    },
    {
      id: "D-MON-03",
      date: "2026-04-08",
      title: "Update manuel v1, script optionnel plus tard",
      summary: "YAGNI : decouvrir format avant de construire un parser CONTEXT.md."
    },
    {
      id: "D-MON-04",
      date: "2026-04-08",
      title: "Extraction tokens.css partages",
      summary: "docs/design-system/tokens.css devient source unique Void Glass + 4 nouveaux tokens status."
    },
    {
      id: "D-MON-05",
      date: "2026-04-08",
      title: "Decoupage 3 sessions D1/D2/D3 anti-compactage",
      summary: "Pattern S6 valide : phases intermediaires + commits WIP."
    },
    {
      id: "D-S7-01",
      date: "2026-04-08",
      title: "Foundation OS = outil produit",
      summary: "Audit lineaire S7-S23 puis fixes en bloc, Cowork parking, Phase 5 Finance/Sante objectif final."
    }
  ],

  recentSessions: [
    {
      date: "2026-04-08",
      tag: "WIP",
      title: "D2 — Dashboard monitor implementation skeleton",
      summary: "Creation tokens.css + index.html + style.css + data.js + render.js + update DS doc."
    },
    {
      date: "2026-04-08",
      tag: "DONE",
      title: "D1 — Dashboard monitor spec + plan + pause cycle3",
      summary: "Brainstorm valide + spec b15cdc0 + plan + CONTEXT.md pause cycle3 + 5 decisions D-MON-01..05."
    },
    {
      date: "2026-04-08",
      tag: "DONE",
      title: "S7 Agents (4) deep + tests reels (non integre CONTEXT.md)",
      summary: "Livrable 07-agents.md 402L livre sur disque par session precedente qui avait bugge. A integrer en S7.5."
    },
    {
      date: "2026-04-08",
      tag: "DONE",
      title: "S6.5 Integration Cowork + decision D-S7-01",
      summary: "Integration 6 livrables Kevin Cowork (instructions, plan-router, meta-audit) + decision strategique Foundation OS = outil produit."
    },
    {
      date: "2026-04-08",
      tag: "DONE",
      title: "S6 Orchestration + automation + hooks chain",
      summary: "Phase F consolidation, 19 findings + 1 meta M-S6-01, pattern WIP+phase F valide."
    }
  ]
};
```

- [ ] **Step 2** : Visual check — reload browser

Expected : page still mostly blank (render.js not yet created), but browser devtools Console shows `window.MONITOR_DATA` accessible (type `window.MONITOR_DATA` in console, returns the object with all fields).

## Task D2.6 : Create `docs/monitor/render.js`

**Files:**
- Create : `docs/monitor/render.js`

**Rationale :** Vanilla JS rendering using pure DOM APIs (`createElement`, `textContent`, `appendChild`). **No template-strings-to-HTML injection** — avoids XSS class of bugs and complies with project security-reminder hook. Defensive : if any data field is missing, degrade gracefully.

- [ ] **Step 1** : Write render.js

```js
/* Foundation OS — Monitor Dashboard render */
/* Reads window.MONITOR_DATA, injects into DOM via pure DOM APIs */
/* Zero dep, vanilla ES2020+, zero HTML-from-string patterns */

(function () {
  'use strict';

  if (!window.MONITOR_DATA) {
    console.error('[monitor] window.MONITOR_DATA is not defined. Check data.js load order.');
    return;
  }

  const D = window.MONITOR_DATA;

  // ---- DOM helpers (pure createElement-based, no string-to-HTML parsing) ----

  function el(tag, opts) {
    opts = opts || {};
    const node = document.createElement(tag);
    if (opts.class) node.className = opts.class;
    if (opts.text != null) node.textContent = String(opts.text);
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) {
        if (opts.attrs[k] != null) node.setAttribute(k, opts.attrs[k]);
      });
    }
    if (opts.style) {
      Object.keys(opts.style).forEach(function (k) {
        node.style[k] = opts.style[k];
      });
    }
    if (opts.children) {
      opts.children.forEach(function (c) {
        if (c) node.appendChild(c);
      });
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function statusClass(status) {
    const s = (status || 'pending').toLowerCase();
    const known = ['done', 'wip', 'paused', 'pending', 'parking', 'archived'];
    return known.indexOf(s) >= 0 ? s : 'pending';
  }

  function badge(status) {
    return el('span', {
      class: 'badge ' + statusClass(status),
      text: status || 'PENDING'
    });
  }

  // ---- Section 1 : Hero ----

  function renderHero() {
    const target = document.getElementById('hero');
    if (!target || !D.meta) return;
    clear(target);
    target.appendChild(el('h1', { text: 'Foundation OS — Monitor' }));
    const metaText =
      'v' + (D.meta.version || '0.0.0') +
      ' · updated ' + (D.meta.updatedAt || '—') +
      ' · ' + (D.meta.updatedInSession || '—');
    target.appendChild(el('div', { class: 'meta-line', text: metaText }));
  }

  // ---- Section 2 : Next Action ----

  function renderNextAction() {
    const target = document.getElementById('next-action');
    if (!target || !D.meta) return;
    clear(target);
    target.appendChild(el('div', { class: 'label', text: 'Prochaine action' }));
    target.appendChild(el('div', {
      class: 'content',
      text: D.meta.nextAction || 'Aucune action definie'
    }));
  }

  // ---- Section 3 : Plans ----

  function sessionMarker(status) {
    if (status === 'DONE') return '✓';
    if (status === 'WIP') return '●';
    if (status === 'PAUSED') return '⏸';
    if (status === 'PARKING') return '◐';
    return '○';
  }

  function renderSessionRow(s) {
    const children = [
      el('span', { text: sessionMarker(s.status) }),
      el('span', { text: s.id || '' }),
      el('span', { text: s.title || '' })
    ];
    if (s.date) children.push(el('span', { text: s.date }));
    return el('div', { class: 'session', children: children });
  }

  function renderPlanCard(plan) {
    const progress = plan.progress || { done: 0, total: 1, unit: '' };
    const pct = progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

    const headRow = el('div', {
      class: 'row',
      children: [
        badge(plan.status),
        el('span', { class: 'priority', text: plan.priority || '' })
      ]
    });

    const title = el('h3', { text: plan.title || 'Untitled' });

    const progressBar = el('div', {
      class: 'progress',
      attrs: { 'aria-label': 'progress ' + pct + '%' },
      children: [
        el('div', { class: 'progress-fill', style: { width: pct + '%' } })
      ]
    });

    const progressText = el('div', {
      class: 'progress-text',
      text: progress.done + '/' + progress.total + ' ' + (progress.unit || '')
    });

    const phase = el('div', { class: 'phase', text: plan.currentPhase || '' });

    const children = [headRow, title, progressBar, progressText, phase];

    if ((plan.sessions && plan.sessions.length) || plan.notes) {
      const details = el('details');
      details.appendChild(el('summary', { text: 'Details' }));

      if (plan.sessions && plan.sessions.length) {
        const timeline = el('div', { class: 'timeline' });
        plan.sessions.forEach(function (s) {
          timeline.appendChild(renderSessionRow(s));
        });
        details.appendChild(timeline);
      }

      if (plan.notes) {
        details.appendChild(el('div', { class: 'notes', text: plan.notes }));
      }

      children.push(details);
    }

    return el('article', { class: 'plan-card', children: children });
  }

  function renderPlans() {
    const target = document.getElementById('plans-grid');
    if (!target || !Array.isArray(D.plans)) return;
    clear(target);

    const order = { WIP: 0, PAUSED: 1, PENDING: 2, DONE: 3, PARKING: 4, ARCHIVED: 5 };
    const sorted = D.plans.slice().sort(function (a, b) {
      const oa = order[a.status] != null ? order[a.status] : 9;
      const ob = order[b.status] != null ? order[b.status] : 9;
      return oa - ob;
    });

    sorted.forEach(function (p) {
      target.appendChild(renderPlanCard(p));
    });
  }

  // ---- Section 4 : Modules + Initiatives ----

  function renderListItem(item, kind) {
    const titleRow = el('div', { class: 'title' });
    titleRow.appendChild(document.createTextNode(item.title || item.name || 'Untitled'));
    if (item.status) titleRow.appendChild(badge(item.status));

    const children = [titleRow];

    if (item.detail) {
      children.push(el('div', { class: 'detail', text: item.detail }));
    }
    if (item.path) {
      children.push(el('div', { class: 'meta', text: item.path }));
    }
    if (kind === 'initiative' && item.blockedBy) {
      children.push(el('div', {
        class: 'blocked-by',
        text: 'Blocked by : ' + item.blockedBy
      }));
    }

    return el('div', { class: 'list-item', children: children });
  }

  function renderModules() {
    const target = document.getElementById('modules-list');
    if (!target || !Array.isArray(D.modules)) return;
    clear(target);
    D.modules.forEach(function (m) {
      target.appendChild(renderListItem(m, 'module'));
    });
  }

  function renderInitiatives() {
    const target = document.getElementById('initiatives-list');
    if (!target || !Array.isArray(D.initiatives)) return;
    clear(target);
    D.initiatives.forEach(function (i) {
      target.appendChild(renderListItem(i, 'initiative'));
    });
  }

  // ---- Section 5 : Decisions + Sessions ----

  function renderDecisions() {
    const target = document.getElementById('decisions-list');
    if (!target || !Array.isArray(D.decisions)) return;
    clear(target);
    D.decisions.forEach(function (d) {
      const node = el('div', {
        class: 'list-item',
        children: [
          el('div', { class: 'title', text: d.title || d.id || 'Untitled' }),
          el('div', { class: 'detail', text: d.summary || '' }),
          el('div', { class: 'meta', text: (d.id || '') + ' · ' + (d.date || '') })
        ]
      });
      target.appendChild(node);
    });
  }

  function renderSessions() {
    const target = document.getElementById('sessions-list');
    if (!target || !Array.isArray(D.recentSessions)) return;
    clear(target);
    D.recentSessions.forEach(function (s) {
      const titleRow = el('div', { class: 'title' });
      if (s.tag) titleRow.appendChild(badge(s.tag));
      titleRow.appendChild(document.createTextNode(s.title || 'Untitled'));

      const node = el('div', {
        class: 'list-item',
        children: [
          titleRow,
          el('div', { class: 'detail', text: s.summary || '' }),
          el('div', { class: 'meta', text: s.date || '' })
        ]
      });
      target.appendChild(node);
    });
  }

  // ---- Boot ----

  function renderAll() {
    try {
      renderHero();
      renderNextAction();
      renderPlans();
      renderModules();
      renderInitiatives();
      renderDecisions();
      renderSessions();
      console.log('[monitor] render OK');
    } catch (err) {
      console.error('[monitor] render error :', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
```

- [ ] **Step 2** : Visual check — reload browser `docs/monitor/index.html`

Expected :
- Background `#06070C`
- Hero : "Foundation OS — Monitor" + meta line
- Next Action banner visible (large text, accent border-left)
- Plans grid : 7 cards (WIP first, then PAUSED, then DONE, etc.)
- Modules + Initiatives 2 cols
- Decisions + Sessions recentes 2 cols
- Zero console error
- Console log : `[monitor] render OK`

## Task D2.7 : Visual verification across browsers

- [ ] **Step 1** : Open in Safari (native macOS)

```bash
open -a Safari /Users/kevinnoel/foundation-os/docs/monitor/index.html
```

Expected : full page renders, fonts load (Figtree visible), no layout shift after fonts load.

- [ ] **Step 2** : Open in Chrome (if installed)

```bash
open -a "Google Chrome" /Users/kevinnoel/foundation-os/docs/monitor/index.html 2>/dev/null || echo "Chrome not installed, skip"
```

Expected : identical rendering.

- [ ] **Step 3** : Resize test — shrink window below 900px width

Expected : plans grid becomes 1 column, two-col sections stack vertically.

- [ ] **Step 4** : Expand/collapse test — click "Details" on a plan card

Expected : sessions timeline + notes appear, click again to collapse, `▸` rotates.

- [ ] **Step 5** : Void Glass violation checklist

Visual checks :
- [ ] Background is `#06070C` exact (devtools color picker on body)
- [ ] No `#0A0A0B` or `#08080A` anywhere in computed styles
- [ ] Font family starts with `Figtree` (body computed font-family)
- [ ] No `Outfit` or `Inter` in any computed style
- [ ] All borders have `border-radius` >= 6px

## Task D2.8 : Commit D2

- [ ] **Step 1** : Stage D2 files

```bash
cd /Users/kevinnoel/foundation-os
git add docs/design-system/tokens.css docs/design-system.md docs/monitor/index.html docs/monitor/style.css docs/monitor/data.js docs/monitor/render.js
git status --short docs/design-system/ docs/monitor/ docs/design-system.md
```

Expected :
```
A  docs/design-system/tokens.css
M  docs/design-system.md
A  docs/monitor/data.js
A  docs/monitor/index.html
A  docs/monitor/render.js
A  docs/monitor/style.css
```

- [ ] **Step 2** : Run health-check standalone to verify no regression

```bash
bash scripts/health-check.sh 2>&1 | tail -20
```

Expected : DEGRADED (refs cassees > 0 from other forward-refs, still tolerated) or SAIN. Build OK, tests 19/19, Void Glass 0 violation.

- [ ] **Step 3** : Commit D2

```bash
git commit -m "$(cat <<'EOF'
feat(monitor): skeleton + render + data + DS tokens extraction (D2/3)

- docs/design-system/tokens.css : extraction tokens Void Glass partages + 4 nouveaux status (wip/paused/parking/archived)
- docs/design-system.md : doc 4 nouveaux tokens + 4 lignes Figma Mapping
- docs/monitor/index.html : skeleton 5 sections + fonts Figtree/JetBrains Mono CDN
- docs/monitor/style.css : dashboard styles Void Glass strict
- docs/monitor/data.js : etat reel Foundation OS 2026-04-08 (7 plans + 4 modules + 3 initiatives + 6 decisions + 5 sessions)
- docs/monitor/render.js : vanilla JS rendering, 0 dep, pure DOM APIs (createElement/textContent/appendChild), defensive

Ouvert dans Safari, rendu OK, 0 erreur console.
Zero impact modules/app (build + tests inchanges).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected : commit OK, health-check DEGRADED tolere.

- [ ] **Step 4** : Announce D2 end

```
Session D2 cloturee — 2026-04-08
Statut : DONE
Livrable : docs/monitor/ + tokens.css + DS doc updated
Prochaine action : Session D3 (README + session-end step 5.5 + tests finaux)
```

---

# Session D3 — Integration + tests + close

D3 wraps up : README, /session-end integration, final visual tests, CONTEXT.md update, commit.

## Task D3.1 : Create `docs/monitor/README.md`

**Files:**
- Create : `docs/monitor/README.md`

- [ ] **Step 1** : Write README

```markdown
# Foundation OS — Monitor Dashboard

Standalone HTML dashboard qui monitore tous les plans, modules, initiatives, decisions et sessions recentes de Foundation OS. Outil meta-OS interne, pas un livrable produit.

## Comment ouvrir

**Double-clic** (simplest) : ouvrir `index.html` dans Finder.

**Serveur local** (si fonts CORS issues) :

\`\`\`bash
cd /Users/kevinnoel/foundation-os/docs/monitor
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
\`\`\`

## Comment mettre a jour

L'update se fait **manuellement** a chaque `/session-end` (step 5.5 integree dans la skill).

Editer `docs/monitor/data.js`, objet `window.MONITOR_DATA` :

1. `meta.updatedAt` — YYYY-MM-DD du jour
2. `meta.updatedInSession` — libelle court de la session (ex: "S8 Commands deep")
3. `meta.nextAction` — prochaine action apres cette session
4. `plans[*].sessions` — append new session entry si applicable, update status des sessions touchees
5. `plans[*].currentPhase` + `notes` — si change
6. `recentSessions` — prepend nouvelle entree, pop si > 5
7. `decisions` — append si nouvelle D-XXX
8. `modules` + `initiatives` — update si status change

**Verification** : ouvrir `index.html`, verifier 0 erreur console, verifier que les sections modifiees refletent les changements.

## Schema (data.js)

\`\`\`js
window.MONITOR_DATA = {
  meta: { version, updatedAt, updatedInSession, nextAction },
  plans: [ { id, title, status, priority, path, progress, currentPhase, startedAt, sessions, notes } ],
  modules: [ { id, name, status, detail } ],
  initiatives: [ { id, title, status, path, blockedBy, detail } ],
  decisions: [ { id, date, title, summary } ],
  recentSessions: [ { date, tag, title, summary } ]  // max 5
};
\`\`\`

### Enum status

| Status | Quand | Couleur (token) |
|--------|-------|-----------------|
| DONE | Termine, verifie | --fos-accent (turquoise) |
| WIP | En cours, cette session | --fos-accent-wip (blue) |
| PAUSED | Commence, en pause volontaire | --fos-accent-paused (amber) |
| PENDING | Pas commence | --fos-muted |
| PARKING | Gele externe | --fos-accent-parking (purple) |
| ARCHIVED | Abandonne | --fos-accent-archived (gris) |

### Regles de maintenance

- **Additif uniquement** : append aux tableaux, pas de restructuring
- **IDs stables** : une fois attribue, jamais change
- **updatedAt + updatedInSession obligatoires** a chaque edit
- **recentSessions max 5** : prepend + pop

## Architecture

- **HTML** : `index.html` — skeleton 5 sections
- **Styles** : `style.css` (dashboard-specific) + `../design-system/tokens.css` (Void Glass shared)
- **Data** : `data.js` — `window.MONITOR_DATA` canonical
- **Render** : `render.js` — vanilla JS, pure DOM APIs (createElement/textContent/appendChild), zero HTML-from-string

**Zero build, zero dep, zero npm.** Ouvert en `file://` ou serveur static simple.

## Evolution future (hors v1)

- **v2** : script `scripts/build-monitor-data.js` qui parse `CONTEXT.md` tables + scanne `docs/plans/` pour auto-generer data.js. A construire si manuel devient painful > 5 min/session regulierement.
- **v2** : `modules/app` importe aussi `../design-system/tokens.css` pour source unique Void Glass.
- **v2** : charts/historique/velocity si utile.

## Reference

- Spec : `docs/specs/2026-04-08-monitor-dashboard-design.md`
- Plan : `docs/plans/2026-04-08-monitor-dashboard-plan.md`
- Design System : `docs/design-system.md`
```

- [ ] **Step 2** : Visual check — open README in editor, verify markdown renders

## Task D3.2 : Add step 5.5 to `/session-end` skill

**Files:**
- Modify : `.claude/commands/session-end.md`

**Rationale :** Insert a new step between current step 5 (CONTEXT.md update) and step 6 (propose commit). Use numbering 5.5 to avoid renumbering existing steps.

- [ ] **Step 1** : Use Edit tool to insert step 5.5

Old string (matching exact current content at end of step 5, before step 6) :
```
   - Si un fondamental a change → mettre a jour aussi docs/ (reference tier)
6. Proposer un commit si des changements sont en attente
```

New string :
```
   - Si un fondamental a change → mettre a jour aussi docs/ (reference tier)

5.5. Mettre a jour le Monitor Dashboard (docs/monitor/data.js) :
   - `meta.updatedAt` = date du jour (YYYY-MM-DD)
   - `meta.updatedInSession` = libelle court de la session
   - `meta.nextAction` = prochaine action mise a jour (miroir step 5)
   - `plans[*].sessions` : append/update pour les sessions touchees
   - `plans[*].currentPhase` + `notes` si change
   - `recentSessions` : prepend nouvelle entree, pop si > 5
   - `decisions` : append si nouvelle D-XXX
   - `modules` + `initiatives` : update si status change
   - Verification : ouvrir `docs/monitor/index.html`, verifier 0 erreur console

6. Proposer un commit si des changements sont en attente
```

- [ ] **Step 2** : Verify edit applied

```bash
sed -n '26,50p' /Users/kevinnoel/foundation-os/.claude/commands/session-end.md
```

Expected : new step 5.5 visible between step 5 and step 6, all 9 sub-bullets listed.

## Task D3.3 : Dry-run /session-end step 5.5 (fake update test)

**Rationale :** Simulate a session close to verify the update workflow works end-to-end. Use data.js current state and only touch meta fields.

- [ ] **Step 1** : Edit `docs/monitor/data.js` — update meta fields to simulate D3 end

Old lines :
```js
  meta: {
    version: "0.1.0",
    updatedAt: "2026-04-08",
    updatedInSession: "D2 — Implementation skeleton",
    nextAction: "Session D3 — README + session-end step 5.5 + final checks"
  },
```

New lines :
```js
  meta: {
    version: "0.1.0",
    updatedAt: "2026-04-08",
    updatedInSession: "D3 — README + session-end integration + close",
    nextAction: "Cycle 3 — S7.5 integration CONTEXT.md + reprise S8 Commands deep (audit cycle3)"
  },
```

- [ ] **Step 2** : Update `dashboard-monitor` plan entry (progress done: 2 -> 3, status WIP -> DONE, currentPhase update, append D3 session entry)

Old lines :
```js
    {
      id: "dashboard-monitor",
      title: "Dashboard Monitor v1",
      status: "WIP",
      priority: "P1",
      path: "docs/plans/2026-04-08-monitor-dashboard-plan.md",
      progress: { done: 2, total: 3, unit: "sessions" },
      currentPhase: "D2 en cours — implementation skeleton",
      startedAt: "2026-04-08",
      sessions: [
        { id: "D1", title: "Spec + plan + pause cycle3", status: "DONE", date: "2026-04-08" },
        { id: "D2", title: "Implementation skeleton", status: "WIP", date: "2026-04-08" },
        { id: "D3", title: "README + session-end integration + tests", status: "PENDING" }
      ],
      notes: "Mini-projet outil interne meta-OS, pause du cycle3. Spec b15cdc0, plan committe."
    }
```

New lines :
```js
    {
      id: "dashboard-monitor",
      title: "Dashboard Monitor v1",
      status: "DONE",
      priority: "P1",
      path: "docs/plans/2026-04-08-monitor-dashboard-plan.md",
      progress: { done: 3, total: 3, unit: "sessions" },
      currentPhase: "v1 complete, en production (docs/monitor/)",
      startedAt: "2026-04-08",
      sessions: [
        { id: "D1", title: "Spec + plan + pause cycle3", status: "DONE", date: "2026-04-08" },
        { id: "D2", title: "Implementation skeleton", status: "DONE", date: "2026-04-08" },
        { id: "D3", title: "README + session-end integration + tests", status: "DONE", date: "2026-04-08" }
      ],
      notes: "Mini-projet outil interne meta-OS, v1 livree en 3 sessions courtes (pattern D1/D2/D3 anti-compactage valide)."
    }
```

- [ ] **Step 3** : Prepend D3 entry to recentSessions + pop oldest (keep max 5)

Insert at start of recentSessions array :
```js
    {
      date: "2026-04-08",
      tag: "DONE",
      title: "D3 — Dashboard monitor README + session-end integration + close",
      summary: "README + step 5.5 dans session-end + tests visuels finaux + projet DONE."
    },
```

And remove the last entry (S6 Orchestration) to keep max 5.

- [ ] **Step 4** : Reload `index.html` in browser

Expected :
- Hero meta line : "updated 2026-04-08 · D3 — README + session-end integration + close"
- Next Action : "Cycle 3 — S7.5 integration CONTEXT.md + reprise S8 Commands deep"
- Dashboard Monitor v1 card : badge DONE (turquoise), progress 3/3 sessions, 100% fill
- Recent Sessions : D3 at top, S6 Orchestration not visible (5 total)
- Zero console error

- [ ] **Step 5** : Cost measurement

Time spent editing data.js manually + reload + visual check. Target : < 3 min. If > 5 min, flag in CONTEXT.md notes as "update cost concern, consider v2 script".

## Task D3.4 : Final acceptance criteria check

Verify all items from spec section 8.

- [ ] `docs/monitor/index.html` ouvre en double-clic, 5 sections affichees sans erreur console
- [ ] Void Glass respecte : `#06070C` bg, Figtree, JetBrains Mono, radius >= 6px
- [ ] `docs/design-system/tokens.css` existe + 4 nouveaux tokens status
- [ ] `docs/design-system.md` mis a jour
- [ ] `/session-end` skill step 5.5 present
- [ ] Cycle manuel edit data.js → re-check rendu < 3 min
- [ ] `README.md` explique schema + update + how-to-open
- [ ] Health-check SAIN ou DEGRADED
- [ ] Zero regression `modules/app`

```bash
cd /Users/kevinnoel/foundation-os
grep -E "accent-wip|accent-paused|accent-parking|accent-archived" docs/design-system/tokens.css
sed -n '26,50p' .claude/commands/session-end.md
bash scripts/health-check.sh 2>&1 | tail -20
cd modules/app && npm run build && npm test
```

Expected :
- 4 tokens presents dans tokens.css
- Step 5.5 visible dans session-end.md
- Health DEGRADED tolere (refs cassees toujours dues forward-refs d'autres docs Kevin Cowork)
- Build OK, tests 19/19

## Task D3.5 : Update CONTEXT.md — dashboard DONE

**Files:**
- Modify : `CONTEXT.md`

- [ ] **Step 1** : Update Modules table — change dashboard monitor status

From :
```
| Monitor Dashboard | WIP v1 D1/3 | ... |
```
To :
```
| Monitor Dashboard | DONE v1 | Mini-projet outil interne meta-OS : docs/monitor/ standalone HTML (index + style + data + render + README) + docs/design-system/tokens.css partages + 4 nouveaux tokens status + /session-end step 5.5. Spec b15cdc0, plan committe, 3 sessions D1/D2/D3 pattern anti-compactage valide. |
```

- [ ] **Step 2** : Add session D3 to Dernieres sessions (prepend, pop oldest if > 5)

New entry :
```
| 2026-04-08 | **[DONE] Dashboard monitor D3/3 — README + session-end integration + close**. Sur branche audit-massif-cycle3. Troisieme et derniere session du mini-projet dashboard. **Livrables** : docs/monitor/README.md (schema + update guide + how-to-open + architecture + evolution), insertion step 5.5 dans .claude/commands/session-end.md (9 sous-etapes update data.js), dry-run test end-to-end edit data.js + reload + visual check (< 3 min confirmed), final acceptance criteria 9/9 OK, CONTEXT.md update. **Cost session** : ~30% session normale (pattern decoupage D1/D2/D3 valide, chaque session 2-3 tasks au lieu de 5-8). **Verification** : build modules/app 769ms OK, Vitest 19/19, Void Glass 0 violation, tokens.css import chain OK, 6 fichiers crees dans docs/monitor/, 2 fichiers modifies (design-system.md + session-end.md). Zero regression modules/app. Health DEGRADED (refs cassees toujours presentes pour forward-refs d'autres docs Kevin Cowork, non imputables dashboard). **Acceptance criteria 9/9 OK** (voir spec section 8). Prochaine : S7.5 integration CONTEXT.md + reprise cycle3 S8 Commands deep. |
```

- [ ] **Step 3** : Update Prochaine action — replace dashboard items with cycle3 resume

```
1. **Cycle 3 — S7.5 integration CONTEXT.md + reprise S8 Commands deep** (mode MOI strict). Sur branche audit-massif-cycle3. S7 Agents est DONE sur disque (.archive/audit-massif/07-agents.md 402L DONE 2026-04-08 par session qui avait bugge). Integration S7.5 = ajouter S7 dans Cycle3 progress table + update nextAction + lire 07-agents.md pour extraire findings/decisions/learnings. Puis enchainer S8 Commands (4) deep audit (4 commands : session-start, session-end, new-project, sync) selon plan cycle3 ligne ~700+. Mode MOI strict 8e consecutive. Decision D-S7-01 inchangee : audit lineaire puis fixes en bloc.

2. **Phase 5 Expansion** (apres cycle3 S23 + fixes + G3 merge) : inchange, choisir Finance/Sante/Trading.

3. **Initiatives Cowork (parking, post-audit)** : inchange.

4. **Dashboard monitor v2 (hors scope, facultatif)** : si update manuel devient penible > 5 min/session regulierement, envisager script scripts/build-monitor-data.js parse CONTEXT.md. Pas avant 5+ sessions d'usage reel.
```

- [ ] **Step 4** : Verify CONTEXT.md parses correctly

```bash
head -120 CONTEXT.md | tail -80
```

Expected : tables bien alignees, pas de markdown casse.

## Task D3.6 : Final commit D3

- [ ] **Step 1** : Stage D3 files

```bash
cd /Users/kevinnoel/foundation-os
git add docs/monitor/README.md .claude/commands/session-end.md docs/monitor/data.js CONTEXT.md
git status --short
```

Expected :
```
A  docs/monitor/README.md
M  .claude/commands/session-end.md
M  docs/monitor/data.js
M  CONTEXT.md
```

- [ ] **Step 2** : Run final health-check

```bash
bash scripts/health-check.sh 2>&1 | tail -20
```

Expected : DEGRADED tolere ou SAIN. Build OK, tests 19/19.

- [ ] **Step 3** : Commit D3

```bash
git commit -m "$(cat <<'EOF'
feat(monitor): README + session-end integration + close D3/3

- docs/monitor/README.md : schema + update guide + how-to-open + architecture
- .claude/commands/session-end.md : step 5.5 dashboard update (9 sous-etapes)
- docs/monitor/data.js : dry-run test update meta + dashboard plan DONE
- CONTEXT.md : dashboard monitor DONE + prochaine action S7.5 + reprise cycle3

Acceptance criteria 9/9 OK. Pattern decoupage D1/D2/D3 valide.
Next : cycle3 S7.5 integration + reprise S8 Commands audit.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected : commit OK, health-check tolere.

- [ ] **Step 4** : Verify final state

```bash
git log --oneline -6
ls docs/monitor/
head -5 docs/design-system/tokens.css
```

Expected :
- 6 last commits include : (D3) README + session-end + CONTEXT, (D2) skeleton, (D1 CONTEXT) pause, (D1 plan), (D1 spec)
- `docs/monitor/` contains 5 files (index.html, style.css, data.js, render.js, README.md)
- tokens.css starts with "Foundation OS" comment

- [ ] **Step 5** : Announce D3 end

```
Session D3 cloturee — 2026-04-08
Statut : DONE
Livrable : docs/monitor/ complet + /session-end step 5.5 + CONTEXT.md DONE
Health : DEGRADED (tolere, refs cassees externes)
Build : OK 769ms, Vitest 19/19
Prochaine action : Cycle 3 S7.5 + reprise S8 Commands (audit cycle3)

Mini-projet Dashboard Monitor v1 : DONE en 3 sessions D1/D2/D3.
```

---

## Self-review (writing-plans skill)

### Spec coverage

Checking against `docs/specs/2026-04-08-monitor-dashboard-design.md` section by section :

- **Section 1 Contexte** : N/A (descriptive)
- **Section 2 Requirements** :
  - G1 (HTML ouvrable double-clic, zero build) → Task D2.3-D2.7 (index.html + visual check)
  - G2 (Void Glass strict) → Task D2.1 (tokens.css) + D2.4 (style.css) + D2.7 (visual verif)
  - G3 (5 sections) → Task D2.3 (HTML structure) + D2.6 (render.js)
  - G4 (data.js hand-editable) → Task D2.5
  - G5 (step 6.5 session-end) → Task D3.2 (actually step 5.5, placement corrige — improvement over spec)
  - G6 (tokens.css shared DS refinement) → Task D2.1 + D2.2
  - G7 (3 sessions D1/D2/D3) → entire plan structure
- **Section 3 Architecture** : all file paths used in tasks match spec section 3.1
- **Section 4 Data Schema** : Task D2.5 implements the exact shape from spec 4.1, status enum from 4.2
- **Section 5 Layout** : Task D2.3 (HTML skeleton) + D2.4 (CSS) + D2.6 (render logic per section)
- **Section 6 Update workflow** : Task D3.2 (insert step 5.5) + D3.3 (dry-run test)
- **Section 7 DS refinement** : Task D2.1 (tokens.css) + D2.2 (update design-system.md). Phase 2 (modules/app tokens import) explicitly out of v1.
- **Section 8 Acceptance criteria** : Task D3.4 (explicit 9-check verification)
- **Section 9 Decoupage** : D1 = D1.1-D1.3, D2 = D2.1-D2.8, D3 = D3.1-D3.6
- **Section 10 Risques** : addressed implicitly via defensive render.js (D2.6) + cost measurement (D3.3) + zero impact modules/app (D2.7 + D3.4)
- **Section 11 Decisions** : documented in data.js (D2.5) + CONTEXT.md (D1.2, D3.5)
- **Section 12 Open questions** :
  - OQ1 (defer vs DOMContentLoaded) → resolved in D2.6 with `document.readyState === 'loading'` check
  - OQ2 (`<details>` native vs JS toggle) → resolved in D2.4 using `<details>` native
  - OQ3 (sort order plans) → resolved in D2.6 WIP-first via `order` map
  - OQ4 (recentSessions 5 vs 10) → resolved at 5 in D2.5 + D3.3

**Gap : none found.** All spec sections map to at least one task.

**Improvement over spec noted** : spec says "step 6.5" but plan uses "step 5.5" because session-end.md structure has commit proposal at step 6, and the dashboard update must happen BEFORE commit proposal. Logical placement is between step 5 (CONTEXT.md) and step 6 (commit). This is an improvement over spec, not a deviation.

**Security improvement over initial draft** : first draft of render.js used innerHTML + escapeHtml pattern. Security-reminder hook flagged innerHTML as XSS vector. Rewrote using pure DOM APIs (createElement + textContent + appendChild). Safer (automatic escaping via textContent) AND complies with project security policy.

### Placeholder scan

Plan file has no TBD/TODO/XXX/FIXME/??? patterns. "D-XXX" reference in D3.2 step 1 is legitimate (describes the ID format convention for decisions).

### Type consistency

- **Status enum** : `DONE | WIP | PAUSED | PENDING | PARKING | ARCHIVED` — used consistently in data.js (D2.5), render.js statusClass (D2.6), CSS classes (D2.4 badges), README table (D3.1), CONTEXT.md entries
- **Tokens** : `--fos-accent-wip|paused|parking|archived` — consistent across tokens.css (D2.1), style.css badges (D2.4), design-system.md (D2.2), README (D3.1)
- **File paths** : all references use `docs/monitor/`, `docs/design-system/tokens.css`, `.claude/commands/session-end.md` consistently
- **DOM helper API** : `el(tag, opts)` with `class`/`text`/`attrs`/`style`/`children` keys — used uniformly in render.js (D2.6)

**Type consistency : OK.**

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-04-08-monitor-dashboard-plan.md`.

Two execution options for D2 and D3 (D1 remaining tasks to execute now : commit this plan + update CONTEXT.md + close D1) :

1. **Inline execution (recommended)** — Continue in current session (Kevin-facing), execute D1.1 steps 3-4 (commit this plan) + D1.2 (update CONTEXT.md) + D1.3 (close D1). Then fresh sessions for D2 and D3. This matches Kevin's style (solo, francais, direct, anti-ceremony) and the 3-session anti-compactage pattern. Uses the REQUIRED SUB-SKILL superpowers:executing-plans for the batched checkpoints.

2. **Subagent-Driven** — Dispatch a fresh subagent per task. Not recommended here : Kevin's CLAUDE.md explicitly restricts sub-agents to "contexte global NOT needed", and this project touches CONTEXT.md + design system + narrative decisions which require Kevin's memory and narrative coherence. Uses REQUIRED SUB-SKILL superpowers:subagent-driven-development.

**Recommendation : inline execution, continue D1 now** (commit plan + CONTEXT.md + close D1).
