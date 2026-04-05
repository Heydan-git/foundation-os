# Memory — Spec

Protocole de persistance de Foundation OS. Definit quoi va ou, comment les decisions vivent, et ce qui survit entre les sessions.

## 1. Tiers de memoire

| Tier | Support | Duree de vie | Mis a jour par |
|------|---------|-------------|----------------|
| Session | Conversation Claude | 1 session | automatique |
| Contexte | CONTEXT.md | Permanent (mis a jour chaque session) | doc-agent / session-end |
| Reference | docs/ | Permanent (mis a jour quand les fondamentaux changent) | doc-agent |
| Auto-memory | ~/.claude/projects/.../memory/ | Permanent (auto-gere) | Claude Code natif |

### Session (volatile)
- Taches en cours, progres, debug
- Meurt quand la session se ferme
- Pas besoin de persister — c'est le flux de travail

### Contexte (CONTEXT.md)
- Etat courant du projet : modules, decisions actives, prochaine action
- Derniere sessions (max 5 — les plus anciennes tombent)
- Mis a jour a chaque /session-end
- **Source de verite pour l'etat courant**

### Reference (docs/)
- Architecture, design system, specs Core OS, setup guide
- Change rarement — seulement quand un fondamental change
- **Source de verite pour les decisions structurelles**

### Auto-memory (Claude natif)
- Profil utilisateur, preferences, patterns de travail
- Feedback (corrections, confirmations)
- Gere automatiquement par Claude Code — pas de maintenance manuelle

## 2. Protocole — Quoi va ou

| Information | Tier | Exemple |
|-------------|------|---------|
| Etat d'un module (status, build, routes) | Contexte | "App Builder MVP, build OK 784ms" |
| Decision technique active | Contexte | "Stack: Vite+React+TS" |
| Architecture du projet | Reference | docs/architecture.md |
| Spec d'un module Core OS | Reference | docs/core/cortex.md |
| Design tokens | Reference | docs/design-system.md |
| Preference de Kevin sur le style de travail | Auto-memory | "Pas de bullshit, direct" |
| Bug en cours de debug | Session | Meurt avec la session |
| Tache en cours | Session | Tasks Claude Code |

### Regle d'or
**Une information ne vit que dans UN tier.** Pas de duplication entre CONTEXT.md et docs/. Si c'est dans docs/, CONTEXT.md pointe vers le doc, pas de copie.

## 3. Decisions — Lifecycle

Les decisions dans CONTEXT.md suivent un lifecycle :

```
proposee → active → supersedee
```

### Format dans CONTEXT.md

```markdown
| Decision | Date | Detail |
|----------|------|--------|
| Stack | 2026-04-01 | Vite + React + TS + Tailwind + Supabase + Vercel |
```

- **Date** : quand la decision a ete prise (format YYYY-MM-DD)
- **Detail** : ce qui a ete decide + pourquoi si non evident
- Quand une decision est supersedee : la remplacer, ajouter "(remplace: [ancien])" dans le detail

### Regles
- Max ~15 decisions actives dans CONTEXT.md (au-dela, archiver les stables dans docs/)
- Une decision sans date = legacy (ajouter la date quand on la touche)
- Pas de decisions "pour info" — seulement ce qui guide le travail

## 4. Sessions — Ce qui survit

A chaque /session-end, le protocole Memory decide quoi persister :

### Toujours persister (Contexte)
- Nouveau status de module
- Nouvelle decision ou decision modifiee
- Prochaine action mise a jour
- Resume de session (1 ligne)

### Persister si fondamental change (Reference)
- Changement d'architecture → docs/architecture.md
- Changement de design tokens → docs/design-system.md
- Nouveau module Core OS → docs/core/[module].md

### Ne pas persister
- Details de debug (session seulement)
- Tentatives echouees (sauf si ca devient un pattern)
- Metriques intermediaires (seul le resultat final compte)

## 5. Limites de Memory

Ce que Memory ne gere PAS :
- Monitoring automatique des metriques (→ Monitor, Phase 3)
- Scripts d'archivage ou migration (→ Tools, Phase 4)
- Notifications ou alertes (→ Monitor, Phase 3)
