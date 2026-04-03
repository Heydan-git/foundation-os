# FOS-META-PLAN.md
> Plan méta révisé — Ce que Claude peut faire seul, ce que Kévin doit faire, éléments manquants, alternatives aux artifacts
> Produit lors de : CONV-10
> DATA_VERSION : 1.0.0 · 2026-04-03

---

## PARTIE 1 — CE QUE CLAUDE PEUT FAIRE MAINTENANT (sans terminal)

### Via MCP Notion (connecté)

Claude peut créer directement dans Notion, maintenant, sans aucune action de Kévin :

```
Structure wiki "Foundation OS" :
  ├── ADR (Architecture Decision Records) — 6 ADR migrés depuis orchestrateur
  ├── Sessions — journal des sessions de travail
  ├── Décisions — registre
  ├── Garde-fous — règles permanentes
  ├── Stack — L1→L4 + MCP plugins
  ├── Architecture — 6 artifacts fos-* + DS Void Glass
  └── Roadmap — v0.1 → v2.0

Action Claude : "Claude, crée la structure wiki Foundation OS dans Notion"
Temps : ~5 min
```

### Via MCP Asana (connecté)

```
Projet "Foundation OS Setup" :
  - 15 tâches (escape steps e01→e15)
  - Priorités + assignés (Kévin vs Claude→K)
  - Sections : L1 Projects · L1b Cowork · L2 Code · L3 BMAD · L4 MCP · Consolidation

Action Claude : "Claude, crée le projet Asana Foundation OS avec toutes les tâches"
Temps : ~3 min
```

### Via MCP Figma (connecté)

```
Fichier "Foundation OS — Design System" :
  - Page "Void Glass Tokens" : couleurs, typo, spacing, radii, effets
  - Page "Components" : Card, Pill, Bar, Button, Tab, Input, Modal
  - Page "Patterns" : MD/JSX architecture, storage pattern

Action Claude : "Claude, crée le fichier Figma DS Void Glass"
Temps : ~10 min
```

### Fichiers Claude Code (Claude génère, Kévin copy-paste)

```
Fichiers préparés par Claude, déployés par Kévin :
  CLAUDE.md              ← Claude génère le contenu exact ≤100L
  .claude/settings.json  ← Hooks : PreToolUse, PostToolUse, Stop
  .claude/agents/os-architect.md
  .claude/agents/doc-agent.md
  .claude/agents/review-agent.md
  .claude/agents/dev-agent.md
  project-context.md     ← Constitution BMAD (Foundation OS)
  FOS-TECH-ARCHITECTURE.md        ← Référence technique pour les agents

Action Kévin : créer les fichiers avec le contenu fourni par Claude
Temps : ~30 min
```

### fos-*.jsx restants (Claude produit, Kévin upload)

```
fos-graph.jsx + FOS-GRAPH-DATA.md
fos-sync.jsx + FOS-SYNC-DATA.md
fos-index.jsx + FOS-INDEX-DATA.md (enrichi)
fos-pipeline.jsx + FOS-PIPELINE-DATA.md (reskin DA)

Action Kévin : upload dans le projet Claude.ai
Temps : ~5 min par artifact
```

---

## PARTIE 2 — CE QUE KÉVIN DOIT FAIRE (terminal + décisions)

### Décisions (Claude ne peut pas décider pour toi)

| Décision | Contexte | Impact |
|----------|----------|--------|
| Choisir task manager : Asana OU Monday | Pas les deux. Asana = plus léger, Monday = plus visuel | Medium |
| Valider l'architecture 6 artifacts fos-* | Avant de continuer à produire | High |
| Choisir le pipeline (Artifacts A vs App B vs Hybrid C) | Voir Partie 4 | HIGH |

### Terminal requis (Kévin seul)

```
Ordre d'exécution recommandé :
  1. brew install node  (si absent)
  2. npm install -g @anthropic-ai/claude-code
  3. claude login
  4. mkdir foundation-os && cd foundation-os && git init
  5. gh repo create foundation-os --private --push
  6. [Copier les fichiers .claude/ préparés par Claude]
  7. claude .  → vérifier que CLAUDE.md est lu
  8. npx bmad-method install  → module iOS + Claude Code IDE
  9. /plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
  10. /plugin install oh-my-claudecode
  11. Créer projet Claude.ai + upload MDs
```

### Durée estimée

```
Terminal setup      : ~1h (first time setup, mostly waiting)
Claude Code deploy  : ~30min (copy-paste fichiers préparés)
Projects KB upload  : ~15min
Total               : ~2h pour avoir tout opérationnel
```

---

## PARTIE 3 — ÉLÉMENTS IMPORTANTS MANQUÉS

### 🔴 Critiques (à intégrer maintenant)

**oh-my-claudecode** (trending #1 GitHub, 3.6K+ stars)
- Multi-agent orchestration pour Claude Code
- 32 agents spécialisés + 28 skills
- Modes : Autopilot · Team · Deep (Ultrapilot supprimé depuis v4.1.7)
- `/deep-interview` avant de coder (Socratic questioning)
- Auto-resume quand rate limit reset
- 30-50% économie tokens (smart routing Haiku/Opus)
- Commande : `/plugin install oh-my-claudecode`
- Impact : **L2 Claude Code devient un OS complet, pas juste un assistant**

**project-context.md (BMAD)**
- Constitution du projet chargée automatiquement par TOUS les workflows BMAD
- Contient : stack, conventions, patterns interdits, règles projet
- Sans ça, BMAD ne peut pas contextualiser ses agents correctement
- Claude peut le générer maintenant

**FOS-TECH-ARCHITECTURE.md**
- Document référence technique chargé par l'agent Architect
- Contient : schéma BDD, patterns d'architecture, ADR résumés
- Sans ça, chaque session repart sans contexte architectural

### 🟠 Hautes (à planifier)

**FOS-ERROR-LOG.md pattern**
- À chaque erreur ou bug Claude → ajouter dans FOS-ERROR-LOG.md
- CLAUDE.md peut référencer FOS-ERROR-LOG.md comme source d'apprentissage
- Principe Boris Cherny : "When Claude does something wrong, add it to CLAUDE.md"

**Conventional commits + hooks**
- Hook PreToolUse(Bash) → valider que le message de commit suit la convention
- Commit format : `type(scope): description`
- Types : feat · fix · docs · refactor · chore · test · style

**`/compact` strategy**
- À 70% contexte → /compact automatique (summarise la session)
- À 90% → /clear obligatoire
- Les hooks peuvent déclencher /compact automatiquement
- Sans stratégie → contexte dégrade, hallucinations augmentent

**Sub-agents isolation pattern**
- Chaque tâche complexe → spawn un sub-agent dans un contexte séparé
- Évite la pollution du contexte principal
- oh-my-claudecode gère ça en natif (team mode)

**PR workflow**
- `claude --from-pr <number>` → Claude résume la PR et continue depuis là
- Permet de travailler de façon asynchrone
- Utile pour les code reviews

### 🟡 Moyennes (à intégrer plus tard)

**Git worktrees + tmux** — Développement parallèle sur plusieurs branches
**TDD pattern** — Tests avant code (`tdd:` keyword dans oh-my-claudecode)
**Headless mode** — Claude Code en CI/CD sans interface
**`/batch` command** — Refactoring parallèle sur N fichiers

---

## PARTIE 4 — ALTERNATIVES AUX ARTIFACTS JSX

### Option A : Artifacts JSX (actuel)

```
Pour : conversation, prototyping rapide, démonstration
Contre : scalabilité

✅ Intégré dans claude.ai
✅ Void Glass, interactif, window.storage
✅ Zéro setup
✅ Parfait pour communication/visualisation

❌ ~800L limite pratique
❌ window.storage = local, pas cross-device
❌ 10 artifacts = 10 îles isolées, pas de navigation
❌ sendPrompt cassé
❌ Non déployable
❌ Ne peut pas accéder aux vrais fichiers
❌ Pas scalable au-delà d'un MVP

Verdict : OUTIL DE COMMUNICATION, pas outil de production
```

### Option B : Vraie app via Claude Code (recommandé long terme)

```
Stack  : Vite + React + TypeScript + Tailwind
DB     : Supabase (PostgreSQL + Auth + API auto-générée + SDK JS)
Deploy : Vercel (depuis GitHub, auto-deploy sur git push · free permanent)
Maintenu par : Claude Code + oh-my-claudecode

✅ ILLIMITÉ en taille (pas de 800L)
✅ DB réelle Supabase (cross-device, SDK JS direct depuis React)
✅ URL permanente Vercel (ex: foundation-os.vercel.app)
✅ Navigation réelle entre "pages" (pas d'îles isolées)
✅ Claude Code peut construire et maintenir
✅ Auto-deploy depuis GitHub sur chaque git push
✅ Auth incluse (Supabase) pour plus tard
✅ Void Glass parfait (CSS pur, pas de contraintes JSX)
✅ window.storage → remplacé par Supabase (vrai)
✅ Pas de backend custom à écrire (SDK direct)

❌ Setup initial : ~1h (node, vite, supabase, vercel)
❌ Pas embedded dans claude.ai
❌ Supabase pause si 7j inactif free tier (cron ping = solution)

Verdict : OUTIL DE PRODUCTION, scalable, pérenne · $0 pour usage perso
```

### Option C : Notion comme OS (zero setup, maintenant)

```
Via MCP Notion : Claude lit/écrit directement

✅ Déjà connecté
✅ Accessible partout (cross-device)
✅ Claude peut modifier directement via MCP
✅ Base de données relationnelle
✅ Zéro setup

❌ UI Notion, pas Void Glass
❌ Dépendance à Notion (vendor lock-in)
❌ Moins interactif que React
❌ Pas de visualisations custom

Verdict : TRANSITION RAPIDE, bien pour les données, pas pour l'UI
```

### Option D : Hybrid (recommandé maintenant)

```
Phase 0 (maintenant → Foundation OS setup) :
  → Artifacts JSX pour visualisation dans les conversations
  → Notion pour les données persistantes (via MCP)
  → Préparation des fichiers Claude Code

Phase 1 (après setup) :
  → Construire Foundation OS App (Option B) via Claude Code
  → Artifacts deviennent des prototypes rapides, pas des outils permanents
  → Notion reste pour la documentation collaborative

Phase 2 (long terme) :
  → Foundation OS App = outil principal
  → Artifacts = communication ponctuelle dans le chat

C'est la voie la plus pragmatique :
  - Rien à jeter (les artifacts servent toujours)
  - Setup progressif (pas tout en une fois)
  - Scalable vers une vraie app sans repartir de zéro
```

---

## PARTIE 5 — STACK RÉVISÉE (avec éléments manquants)

```
L0 : Void Glass Design System (tokens + composants + Figma spec)
L1a : Claude.ai Projects (Knowledge base + Instructions cross-device)
L1b : Cowork desktop (agent local · fichiers · tâches autonomes)
L2 : Claude Code + CLAUDE.md + hooks + agents
     + oh-my-claudecode (32 agents · 40+ skills · autopilot/team)
     + shinpr/claude-code-workflows
     + catlog22/CCW (37 skills)
     + project-context.md
     + FOS-ERROR-LOG.md
     + FOS-TECH-ARCHITECTURE.md
L3 : BMAD v6 (_bmad/ underscore) + project-context.md
L4 : MCP Plugins (Notion + Figma + Asana/Monday)
L1  : Claude.ai Projects (Knowledge base · web/mobile cross-device)
L1b : Cowork / Claude Desktop (agent local · SKILL.md · MCP)
L2  : Claude Code (terminal · CLAUDE.md · hooks · oh-my-claudecode)
L5  : Foundation OS App (Vite + React + TypeScript + Tailwind + Supabase + Vercel) ← décision finale
L6 : Git (GitHub + conventional commits + PR workflow)
```

---

## PARTIE 6 — PROCHAINES ÉTAPES RÉVISÉES

### Session courante (Claude peut faire maintenant)

```
Si Kévin dit "go" :
  1. Créer wiki Notion Foundation OS (via MCP) — 5min
  2. Créer projet Asana avec toutes les tâches — 3min
  3. Générer CLAUDE.md (≤100L) — Foundation OS spécifique
  4. Générer .claude/settings.json (hooks)
  5. Générer 4 agents .claude/agents/
  6. Générer 5 commands .claude/commands/
  7. Générer project-context.md (BMAD constitution)
  8. Continuer fos-graph.jsx + fos-sync.jsx
```

### Session suivante (Kévin + terminal)

```
  1. npm install -g @anthropic-ai/claude-code
  2. git init + gh repo create foundation-os
  3. Copier les fichiers .claude/ préparés
  4. npx bmad-method install
  5. /plugin install oh-my-claudecode
  6. Créer projet Claude.ai + upload tous les MDs
  7. Test : /deep-interview "Foundation OS setup"
```

### Décision importante à prendre

```
Pipeline option ? A · B · C · D ?
  D (Hybrid) = recommandé → artifacts pour le chat, vraie app pour le long terme

Task manager ? Asana ou Monday ?
  Asana = recommandé (plus léger, moins de features inutiles)
```

---

## CHANGELOG

| Version | Date | Modification |
|---------|------|-------------|
| 1.0.0 | 2026-04-03 | Création — CONV-10 · Autonomie Claude · Manqués · Alternatives |
