# FOS-TOOLBOX-DATA.md
> Source de vérité — fos-toolbox.jsx
> DATA_VERSION : 7.0.0
> LAST_SYNC : 2026-04-04
> STORAGE_KEY : fos-toolbox-v2
> SKILL_SYNC : SKILL.md v3.0.0 (section 10-12 = toolbox reference)

---

## ARCHITECTURE UX v7

### Navigation principale : 4 volets (Flow AI = default)
- 🤖 **Flow AI** (tab par défaut) — Chat interactif : input texte + moteur genFlow() qui compose des workflows sur mesure par keyword matching contre les 22 use cases et 250+ outils
- 🚀 **Créer des apps** — 10 use cases opérationnels (dont workflow generator)
- 🔧 **Piloter l'OS** — 12 use cases maintenance/évolution (dont workflow generator + RALPH Loop)
- 📦 **Inventaire complet** — référence exhaustive par catégorie (9 sections dont MCP recommandés + plugins)

### Principe : USE CASE FIRST + CLAUDE AS ENGINE + FLOW AI INTERACTIF
- Navigation primaire = par besoin / situation concrète
- Chaque use case = Quand + Exemple pragmatique + Étapes détaillées avec outils
- Claude compose les workflows en combinant les 250+ outils
- **Flow AI = interface interactive** : l'utilisateur tape sa demande → genFlow() match les keywords → affiche un workflow composé avec étapes numérotées, outils, détails et sources
- SKILL.md sections 10-12 = référence pour Claude à tout moment
- Inventaire = vue secondaire de référence (catalogue complet)

### Concepts clés ajoutés v6-v7
- **Flow AI interactif (NOUVEAU)** — Input + 5 exemples cliquables + genFlow() keyword matching + workflow affiché avec étapes/outils/sources
- **genFlow()** — Normalise input → score chaque use case → top 4 → déduplique étapes → workflow composé
- **Workflow Generation (M6)** — Claude compose des workflows sur mesure à la demande
- **RALPH Loop (M7)** — Read → Analyze → Learn → Propose → Harmonize (cycle amélioration continue)
- **Superpower Mode** — brainstorm 62 tech + party mode 5+ agents + adversarial + edge cases + distillation
- **Context7 anti-hallucination** — doc live systématique avant tout code
- **Shinpr Recipes** — recipe-implement/design/diagnose/build/refactor
- **genFlow v2** — scoring pondéré (titre ×5, tags ×3, when ×2, body ×1) + stop words FR + prefix matching
- **22 TAGS ciblés** — mots-clés haute pertinence par use case pour matching intelligent
- **Indicateur installation ⬜/✅** — pour tracker les outils installés vs recommandés
- **11 MCP recommandés** — Supabase, Vercel, GitHub, Playwright, Sentry, PostHog, Stripe, Resend, Sequential Thinking, ESLint, Knowledge Graph
- **Plugins Claude Code** — claude-flow, claude-code-spec-workflow, production slash commands

---

## VOLET 1 — 🚀 CRÉER DES APPS (10 use cases)

1. 🤖 Dis-moi ce que tu veux réaliser (4 étapes) — WORKFLOW GENERATOR
2. 🎯 Je veux créer une nouvelle app (4 étapes)
3. 💡 J'ai besoin d'explorer des idées (4 étapes)
4. 🎨 Je veux designer l'interface (5 étapes)
5. 🏗️ Quelle architecture choisir ? (4 étapes)
6. ⚡ Je code la feature (4 étapes)
7. 🧪 C'est prêt ? Vérifie tout (5 étapes)
8. ✍️ Le texte est pas clair, améliore (4 étapes)
9. 🚀 Mets en prod (3 étapes)
10. 📊 Comment ça performe ? (4 étapes)

## VOLET 2 — 🔧 PILOTER L'OS (12 use cases)

1. 🤖 Dis-moi ce que tu veux faire sur l'OS (4 étapes) — WORKFLOW GENERATOR
2. 📍 On reprend, on en est où ? (3 étapes)
3. 🔍 Fais un audit complet du système (6 étapes)
4. 🧬 Propose des améliorations de l'OS (8 étapes)
5. 🔁 Mets à jour X sans casser Y (7 étapes)
6. 📝 Crée ou modifie un artifact fos-* (4 étapes)
7. 🔗 Vérifie que tout est synchronisé (4 étapes)
8. 🎭 Superpower Mode — la totale multi-agents (6 étapes)
9. 🔄 RALPH Loop — amélioration continue (5 étapes)
10. 🧠 Mon contexte sature (5 étapes)
11. 📋 On arrête pour aujourd'hui (4 étapes)
12. 🆕 J'ai perdu le fil, on recommence (3 étapes)

---

## VOLET 3 — 📦 INVENTAIRE COMPLET (250+ outils · 9 catégories)

### 🧠 Outils natifs Claude (14)
Read · Write · Edit · Glob · Grep · Bash · Agent · WebSearch · WebFetch · TodoWrite · AskUserQuestion · NotebookEdit · ToolSearch · Skill

### 🧱 Frameworks (7)
Claudify (L2) · BMAD v6.2.2 (L3) · oh-my-claudecode OMC (L2) · Void Glass DS (L0) · Foundation OS App (L5) · Context7 MCP (L4) · Shinpr Workflows (L2)

### 🏗️ BMAD v6 Modules (12) — enrichis avec best practices
brainstorming (5 phases, 62 techniques, 9 cat, anti-biais) · party-mode (BMad Master 2-3 agents/msg) · advanced-elicitation (50 méthodes, appliquer post-draft) · distillator (lossless, --validate, ~90% tokens) · editorial-review-prose (Microsoft Writing Style) · editorial-review-structure (5 modèles) · review-adversarial (cynique, 2 passes critique) · edge-case-hunter (mécanique, orthogonal) · help · index-docs · init · shard-doc

### 🔌 MCP Connecteurs installés (15 · 228+ commandes)
Notion (14) · Asana (22) · Figma (16) · Monday (42) · ClickUp (48) · Computer Use (27) · Claude in Chrome (19) · Control Chrome (10) · Apple Notes (4) · Pencil (15) · Scheduled Tasks (3) · Cowork Internal (3) · MCP Registry (2) · Plugins (2) · Session Info (2)

### 🤖 Agents (17) — enrichis avec détails rôles
Claude Code : @os-architect (ADR numérotés) · @doc-agent (cascade JOURNAL→MONITORING→NOTION) · @review-agent (8 garde-fous R1-R8) · @dev-agent (Void Glass obligatoire)
BMAD v6 party : Analyst Mary · PM John · UX Sally · Architect Winston · SM Bob · Dev Amelia · QA Quinn · Quick Flow Barry
BMAD distillator : distillate-compressor · round-trip-reconstructor
OMC : team N workers (ultrapilot 3-5x) · autopilot smart routing · /deep-interview scoring ambiguïté

### ⚡ Commandes & Hooks (9 cmd + 3 hooks) — enrichis
/session-start (séquence SCALE→MONITORING→JOURNAL→M6) · /session-end · /new-project · /sync-md (5 checks) · /bmad-help · /compact (>70%) · /clear (>90%) · /deep-interview (anti-scope-creep) · /omc-setup
Hooks : PreToolUse(Bash) bloque suppression · PostToolUse(Write|Edit) log JOURNAL · Stop

### 🎯 Skills Cowork (28)
🔴 critique : foundation-os-orchestrator · fullstack-dev · ios-dev · product-design-uxui · design-system-manager
🟠 fréquent : lead-dev · devops-specialist · database-architect · specialiste-ai · n8n-specialist
🟡 spécialisé : ui-expert · ux-ergonome · audit-ux-complet · a11y-specialist · security-engineer · qa-specialist · app-store-publisher · data-analyst · copywriter-ux · da-direction-artistique · motion-designer · hierarchie-information · doc-coauthoring · lead-design
⚪ utilitaire : skill-supervisor · project-skill-director · skill-creator · web-artifacts-builder · canvas-design · theme-factory

### 🔮 MCP recommandés — NON INSTALLÉS (11 serveurs)
⬜ Supabase MCP — OFFICIEL · 15+ cmd · claude mcp add --transport http supabase
⬜ Vercel MCP — OFFICIEL · 12+ cmd · claude mcp add --transport http vercel https://mcp.vercel.com
⬜ GitHub MCP — OFFICIEL · 40+ cmd · npm install @modelcontextprotocol/server-github
⬜ Playwright MCP — OFFICIEL MS · 15+ cmd · npm install @microsoft/playwright-mcp
⬜ Sentry MCP — OFFICIEL · 8+ cmd · mcp.sentry.dev/mcp (OAuth)
⬜ PostHog MCP — OFFICIEL · 10+ cmd · PostHog Wizard auto-install
⬜ Stripe MCP — OFFICIEL · 20+ cmd · Stripe App Marketplace
⬜ Resend MCP — OFFICIEL · 12+ cmd · npm install @resend/mcp
⬜ Sequential Thinking — Anthropic · 8+ cmd · npm install @modelcontextprotocol/server-sequentialthinking
⬜ ESLint MCP — OFFICIEL · 4+ cmd · npm install @eslint/mcp
⬜ Knowledge Graph Memory — COMMUNAUTÉ · 8+ cmd · npm install mcp-knowledge-graph
→ Changer ⬜ en ✅ après installation

### 🧩 Plugins & extensions Claude Code (6 ressources)
⬜ claude-flow — 60+ agents, swarms parallèles · npm install -g claude-flow
⬜ claude-code-spec-workflow — gates validation · npm install @pimzino/claude-code-spec-workflow
⬜ Production slash commands (57) — github.com/wshobson/commands → .claude/commands/
✅ BMAD v6.2.2 — npx bmad-method install
✅ oh-my-claudecode OMC — npm i -g oh-my-claude-sisyphus@latest
✅ Shinpr Workflows — /plugin marketplace add shinpr/claude-code-workflows

---

## LIAISON SKILL.md

Le SKILL.md orchestrateur (v3.0.0) contient désormais :
- **Section 10** — Toolbox complète (250+ outils référencés)
- **Section 11** — M6 Workflow Generation (protocole AUTO-RÉFÉRENTIEL)
- **Section 12** — M7 RALPH Loop (cycle amélioration continue)

→ Claude utilise la TOOLBOX pour optimiser son propre protocole d'exécution.

---

## CHANGELOG
| Version | Date | Modification |
|---------|------|-------------|
| 1.0.0 | 2026-04-04 | Création v1 — 578L · 68 outils |
| 2.0.0 | 2026-04-04 | Refonte v2 — 140+ commandes MCP · 8 flows · Claude acteur central |
| 3.0.0 | 2026-04-04 | v3 ultra-complète — 300L · 250+ outils · 10 tabs · 12 BMAD modules · 62 brainstorm · 15 MCP (228+ cmd) · 10 flows · Superpower Mode |
| 4.0.0 | 2026-04-04 | Refonte UX totale — navigation par USE CASE · 2 volets + Inventaire · 19 use cases · 87 étapes |
| 5.0.0 | 2026-04-04 | Claude comme moteur · M6 Workflow Generation · M7 RALPH Loop · Context7/Shinpr détaillés · Superpower renforcé · SKILL.md v3.0.0 synced · 22 use cases |
| 5.1.0 | 2026-04-04 | Protocole AUTO-RÉFÉRENTIEL — toolbox pour optimiser ses propres étapes · Glob+Grep+Agent pour Read · Plan+BMAD+OMC pour Analyse · @architects pour Workflow |
| 6.0.0 | 2026-04-04 | Flow AI interactif — chat + genFlow() keyword matching · 4ème tab (défaut) · input + 5 exemples + workflow généré · 488L · zéro régression |
| 6.1.0 | 2026-04-04 | genFlow v2 + enrichissement massif descriptions BMAD/Context7/OMC/Shinpr/Figma · 526L |
| 7.0.0 | 2026-04-04 | +2 catégories INV : 🔮 MCP recommandés (11 serveurs non installés : Supabase, Vercel, GitHub, Playwright, Sentry, PostHog, Stripe, Resend, Sequential Thinking, ESLint, Knowledge Graph) + 🧩 Plugins Claude Code (claude-flow, spec-workflow, slash commands). Indicateur ⬜/✅ pour statut installation. Recherche web exhaustive des meilleurs MCP 2025-2026. Total 9 catégories INV · 547L |
| 7.0.1 | 2026-04-04 | Compression descriptions : 69KB→46KB (sous limite 50KB artifact). Style télégraphique, zéro perte d'info structurelle. 534L |
