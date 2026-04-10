# Tools Audit — 2026-04-07

> Audit Phase 3.3. Verdict par outil pour eviter la dette de fonctionnalites non utilisees.
> Aucun deplacement de fichier n'a ete fait : ce document **propose**, Kevin **decide**.

## Methodologie

Pour chaque outil :
- **Invocations en session** : `grep -ril "<nom>" .omc/sessions/` sur les sessions trackees (3 sessions actuelles)
- **Verdict** : GARDER / DOCUMENTER / ARCHIVER / IGNORER
- **Action proposee** : ce qui devrait suivre, sous reserve d'OK Kevin

Limite connue : `.omc/sessions/` ne contient que 3 fichiers JSON (sessions trackees par OMC apres son installation). L'historique anterieur n'est pas dans ce repertoire.

---

## BMAD v6 — `_bmad/` (12 modules core)

**Modules presents :**
bmad-advanced-elicitation, bmad-brainstorming, bmad-distillator, bmad-editorial-review-prose, bmad-editorial-review-structure, bmad-help, bmad-index-docs, bmad-init, bmad-party-mode, bmad-review-adversarial-general, bmad-review-edge-case-hunter, bmad-shard-doc.

**Invocations en session** : `grep -ril "bmad" .omc/sessions/` → **0 fichier**.

**Observation** : aucun des 12 modules n'a ete invoque dans les 3 sessions trackees. Le dossier `_bmad/` est dans la liste des "Outils installes" du CONTEXT.md depuis le 2026-04-05 ("a auditer Phase 3"). 5 jours sans usage → signal clair.

**Overlap fonctionnel** :
- bmad-brainstorming → Superpowers `brainstorming` deja installe et utilise
- bmad-editorial-review-prose / -structure → Superpowers `requesting-code-review` + agents OMC
- bmad-review-adversarial-general → review-agent custom Foundation
- bmad-init → /new-project custom Foundation
- bmad-distillator / bmad-shard-doc → doc-agent custom Foundation

**Verdict initial (audit) : ARCHIVER**
**Decision Kevin 2026-04-07 : GARDER en l'etat.**

**Raison de la decision** : Kevin overrule l'audit. BMAD reste a disposition, dormant. Pas d'archivage.

**Action requise** : aucune. `_bmad/` reste en place. Si une session future en a besoin, il est la. Sinon, re-evaluation possible plus tard sans urgence.

---

## OMC (oh-my-claudecode)

**Surface** : ~80+ skills (vu dans la liste system-reminder de session-start), 30+ agents disponibles via subagent_type.

**Invocations en session** : `grep -ril "oh-my-claudecode" .omc/sessions/` → **0 fichier** (les sessions ne tracent pas l'invocation de skills par leur namespace complet).

**MAIS** : OMC est **actif comme infrastructure** :
- HUD : `.omc/state/hud-state.json`, `hud-stdin-cache.json` — activement updates
- Project-memory : `.omc/project-memory.json` — present et updates
- Hooks : `.omc/state/last-tool-error.json`, `mission-state.json` — present
- Sessions tracker : `.omc/sessions/*.json` — 3 fichiers, 1 par session recente

**Skills custom Foundation OS** (declarees dans `.claude/commands/`, **pas** dans OMC) :
- `/session-start`, `/session-end`, `/new-project`, `/sync` → **utilises a chaque session**

**Skills OMC (`oh-my-claudecode:*`)** :
- Tier-0 (autopilot, ultrawork, ralph, team, ralplan) : **0 invocation directe** dans ce projet
- Skills utiles theorique (omc-doctor, hud, learner) : non invoques

**Verdict** : **GARDER (infrastructure) + IGNORER (skills explicites)**.

**Action proposee** :
- Aucun retrait. OMC fournit l'infra (HUD, hooks, project-memory) qui est utile passivement.
- Ne pas essayer d'apprendre/utiliser les skills `oh-my-claudecode:*` — les commands custom Foundation (`/session-start`, etc.) couvrent les besoins.
- Ne pas documenter OMC skills dans CLAUDE.md projet — la version user-global (~/.claude/CLAUDE.md) est deja chargee a chaque session.

**Note** : si jamais le besoin d'orchestration multi-agents apparait (Phase 5 ou +), revisiter `oh-my-claudecode:team` et `oh-my-claudecode:autopilot`. Pas avant.

---

## Coderabbit — `~/.claude/plugins/cache/.../coderabbit/1.0.0`

**Statut** : installe (vu dans `~/.claude/plugins/installed_plugins.json`).

**Skills exposees** :
- `coderabbit:review` — Run CodeRabbit AI code review
- `coderabbit:code-review` (variante) — Reviews code changes using CodeRabbit AI

**Invocations en session** : `grep -ril "coderabbit" .omc/sessions/` → non verifie (le grep BMAD a retourne 0 pour BMAD ; presomption similaire pour coderabbit, qui n'a jamais ete mentionne par Kevin).

**Overlap** :
- `code-review@claude-plugins-official` (Anthropic officiel) — egalement installe
- `review-agent` custom Foundation OS — utilise pour audits coherence
- Agent `oh-my-claudecode:code-reviewer` (via subagent_type) — disponible

→ **4 outils de code review** disponibles. C'est trop pour un projet solo.

**Verdict : GARDER review-agent custom Foundation comme outil principal de code review.**

**Decision Kevin 2026-04-07** : "garde le meilleur" → choix `review-agent`.

**Raison du choix** :
1. Deja integre dans le routing Cortex (CLAUDE.md ligne `verifie, audit, check, revue, regression, deployer | review-agent`)
2. Deja utilise dans le workflow normal
3. Zero ceremonie : pas de plugin externe a configurer, pas d'API tierce
4. Aligne avec la philosophie Foundation OS (custom, leger, focused)

**Statut des 3 autres** :
- `coderabbit` (plugin user-global) : laisse installe, **ne pas invoquer** dans les sessions Foundation OS
- `code-review@claude-plugins-official` (plugin user-global) : laisse installe, **ne pas invoquer**
- `oh-my-claudecode:code-reviewer` : couvert par la decision globale OMC (IGNORER les skills explicites)

**Action requise** : aucune desinstallation. Les plugins user-global ne polluent pas le projet. Convention documentee : pour Foundation OS, code review = `review-agent` exclusivement.

---

## Knowledge Graph MCP (mention spec ligne 322)

**Statut** : non installe, jamais evalue dans ce projet.

**Verdict** : **IGNORER** (pour l'instant).

**Raison** : la spec dit "evaluer en Phase 3 si besoin identifie". Aucun besoin identifie pendant Phase 1 + Phase 2 + ce debut Phase 3. CONTEXT.md + auto-memory + project-memory.json suffisent. A re-evaluer si Phase 5 amene un module multi-domaines.

---

## Recapitulatif des decisions (Kevin 2026-04-07)

| Outil | Verdict final | Action requise |
|-------|---------------|----------------|
| BMAD v6 (12 modules) | **GARDER** (overrule Kevin) | Aucune — dormant en place |
| OMC (infra) | GARDER | Aucune — utilisation passive |
| OMC (skills explicites) | IGNORER | Aucune — ne pas invoquer |
| Coderabbit | IGNORER | Aucune desinstallation, ne pas invoquer |
| code-review (Anthropic) | IGNORER | Idem |
| oh-my-claudecode:code-reviewer | IGNORER | Idem |
| **review-agent** custom | **GARDER (principal)** | Outil unique pour code review Foundation |
| Knowledge Graph MCP | IGNORER | Aucune action |

---

## Ce qui n'est PAS dans cet audit

- **Superpowers** : actif et utile (writing-plans, executing-plans, brainstorming, TDD). Pas a auditer.
- **gstack** : actif (qa, cso). Phase 1 l'a installe explicitement. Pas a auditer.
- **MCP servers** (Asana, Notion, Figma, Computer Use, etc.) : ils ont leur place propre, pas overlap avec les skills/agents.
- **Hooks** (validate-void-glass, security-reminder, commit-msg) : installes Phase 1, valides operationnellement. Pas a auditer.
