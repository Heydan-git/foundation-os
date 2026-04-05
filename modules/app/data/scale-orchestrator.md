# FOS-SCALE-ORCHESTRATOR-DATA.md
> Source de vérité — fos-scale-orchestrator.jsx
> Règle absolue : modifier CE fichier EN PREMIER, puis syncer le JSX.
> Si le JSX est perdu, ce fichier suffit à reconstruire intégralement.

```
DATA_VERSION : 3.5.0
LAST_SYNC    : 2026-04-03
STORAGE_KEY  : fondation-scale-v3
JSX_CTRL     : fos-scale-orchestrator.jsx
PIPELINE     : Option D (Hybrid)
```

---

## CONTENU

Orchestrateur de passage à l'échelle Foundation OS. Contient :
- Décisions pipeline (Option D Hybrid, Asana, architecture artifacts, multi-agent)
- Phases P0-P3 avec étapes concrètes
- Matrice de priorisation (impact, effort, dépendances)
- Tracking de progression par phase

## DÉCISIONS

| Label | Valeur | Date |
|-------|--------|------|
| Pipeline | Option D — Hybrid | 2026-04-03 |
| Task manager | Asana | 2026-04-03 |
| Architecture artifacts | 6 fos-* | 2026-04-03 |
| Multi-agent | oh-my-claudecode | 2026-04-03 |

## PHASES

- P0 : Claude fait maintenant (pas de terminal requis)
- P1 : Terminal requis (setup local)
- P2 : Automatisation (CI/CD, cron)
- P3 : Échelle (multi-module, multi-user)
