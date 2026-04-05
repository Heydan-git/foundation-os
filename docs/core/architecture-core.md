# Core OS — Architecture

4 modules qui forment le cerveau de Foundation OS.

## Couches

```
MODULES  (app, finance, sante)          Projets concrets
CORE OS  (cortex, memory, monitor,      Intelligence
          tools)
TOOLKIT  (OMC, BMAD, MCP)              Outils externes
```

## Modules

| Module | Role | Phase | Status | Runtime |
|--------|------|-------|--------|---------|
| Cortex | Routing, contexte, orchestration | 1 | actif | CLAUDE.md, .claude/agents/, .claude/commands/ |
| Memory | Persistance structuree inter-session | 2 | prevu | a definir |
| Monitor | Metriques, health, alertes | 3 | prevu | a definir |
| Tools | CLI utils, automation | 4 | prevu | a definir |

## Cortex (Phase 1)

Le cerveau actif. Trois responsabilites :

1. **Routing** — tache → agent (arbre de decision dans CLAUDE.md)
2. **Contexte** — CONTEXT.md lifecycle (lecture, mise a jour, coherence)
3. **Orchestration** — commands qui coordonnent les workflows

Spec complete : [docs/core/cortex.md](cortex.md)

## Memory (Phase 2 — prevu)

Persistance structuree au-dela de CONTEXT.md :
- Decisions avec historique et rationale
- Patterns appris entre sessions
- Index de connaissances projet

## Monitor (Phase 3 — prevu)

Observabilite :
- Build status par module
- Coherence CONTEXT.md vs filesystem
- Alertes sur derives (fichiers orphelins, refs cassees)

## Tools (Phase 4 — prevu)

Automation :
- Validateurs custom (Void Glass, structure)
- Scripts utilitaires
- Helpers CI/CD

## Principes Core OS

- Chaque module a une spec dans docs/core/
- Pas de code sans spec validee
- Un module n'impacte pas les autres sans coordination
- CONTEXT.md reste la source de verite pour l'etat
