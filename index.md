# Foundation OS - Index des fichiers

## Documentation principale

- **[README.md](./README.md)** - Point d'entrée basique du projet
- **[project-context.md](./project-context.md)** - Constitution complète : stack technique, Void Glass DS, ADR résumés
- **[SKILL.md](./SKILL.md)** - Orchestrateur Foundation OS v2.0.0 pour Cowork desktop
- **[CLAUDE.md](./CLAUDE.md)** - Instructions Claude Code L2 avec hooks et agents

## Guides et documentation système

- **[FOS-SETUP-GUIDE.md](./FOS-SETUP-GUIDE.md)** - Guide onboarding complet pour reprendre le projet
- **[FOS-META-PLAN.md](./FOS-META-PLAN.md)** - Analyse autonomie Claude, éléments manqués, alternatives artifacts
- **[FOS-JOURNAL.md](./FOS-JOURNAL.md)** - Historique 12 sessions avec ADR et décisions architecturales
- **[FOS-MONITORING.md](./FOS-MONITORING.md)** - Métriques santé : 20% readiness, 4/6 artifacts livrés
- **[FOS-ERROR-LOG.md](./FOS-ERROR-LOG.md)** - Log erreurs pour amélioration continue CLAUDE.md

## Données d'artifacts (MD = source de vérité)

- **[FOS-COMMANDER-DATA.md](./FOS-COMMANDER-DATA.md)** - Données cockpit : ADR, sessions, next steps
- **[FOS-KNOWLEDGE-DATA.md](./FOS-KNOWLEDGE-DATA.md)** - Manifeste, frameworks, roadmap Foundation OS
- **[FOS-INDEX-DATA.md](./FOS-INDEX-DATA.md)** - Structure navigation complète des 27 fichiers
- **[FOS-SCALE-ORCHESTRATOR-DATA.md](./FOS-SCALE-ORCHESTRATOR-DATA.md)** - Plan 22 étapes, stack L0-L6, changelog

## Artifacts JSX (contrôleurs UI)

- **[fos-commander.jsx](./fos-commander.jsx)** - Cockpit Foundation OS (571L, Void Glass)
- **[fos-knowledge.jsx](./fos-knowledge.jsx)** - Manifeste et frameworks (330L)
- **[fos-index.jsx](./fos-index.jsx)** - Hub navigation des 27 fichiers (479L)

## Configuration

### .claude/
- **[.claude/settings.json](./.claude/settings.json)** - Configuration Claude Code avec hooks
- **[.claude/settings.local.json](./.claude/settings.local.json)** - Paramètres locaux

### .omc/
- **[.omc/project-memory.json](./.omc/project-memory.json)** - Mémoire projet oh-my-claudecode

---

**Architecture :** MD first (source de vérité) → JSX ensuite (contrôleur UI)  
**Stack :** L0 Void Glass → L1a Projects + L1b Cowork → L2 Claude Code → L3 BMAD v6  
**Statut :** Phase 00 Setup, 4/6 artifacts livrés, 20% OS readiness