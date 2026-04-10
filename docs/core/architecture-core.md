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
| Memory | Persistance structuree, tiers, decisions | 2 | actif | CONTEXT.md, docs/, auto-memory |
| Monitor | Health indicators, severite, seuils | 3 | actif | Integre dans /sync et review-agent |
| Tools | Validators, scripts, CI/CD | 4 | actif | scripts/, .github/, hooks |

## Cortex (Phase 1)

Le cerveau actif. Trois responsabilites :

1. **Routing** — tache → agent (arbre de decision dans CLAUDE.md)
2. **Contexte** — CONTEXT.md lifecycle (lecture, mise a jour, coherence)
3. **Orchestration** — commands qui coordonnent les workflows

Spec complete : [docs/core/cortex.md](cortex.md)

## Communication (Phase 2 — actif)

Spec : [docs/core/communication.md](communication.md)
- 4 tiers (session/contexte/reference/auto-memory)
- Decisions avec dates et lifecycle
- Protocole "quoi va ou" — une info = un seul tier

## Monitor (Phase 3 — actif)

Spec : [docs/core/monitor.md](monitor.md)
- Health indicators par severite (critical/warning/info)
- Verdicts : SAIN / DEGRADED / BROKEN
- Integre dans /sync et review-agent

## Tools (Phase 4 — actif)

Spec : [docs/core/tools.md](tools.md)
- Validators existants (Void Glass, conventional commits, security-reminder)
- Scripts actifs : health-check, sync-check, ref-checker, module-scaffold
- CI/CD : ci.yml (build/tsc/vitest), supabase-ping (cron lundi)
- Conventions : scripts/, idempotent, exit codes standards

## Principes Core OS

- Chaque module a une spec dans docs/core/
- Pas de code sans spec validee
- Un module n'impacte pas les autres sans coordination
- CONTEXT.md reste la source de verite pour l'etat
