# Scripts orphelins — Archive 2026-04-17

Archive des hooks et scripts orphelins detectes par audit v2 Agent 2.

## Contenu

### wiki-recall-reminder.sh
- **Role original** : Hook PostToolUse Read qui detecte mentions de domaines (trading/finance/sante/design/dev) et rappelle le reflexe 1 neuroplasticite (recall wiki avant reponse).
- **Orphelin** : jamais invoque dans `.claude/settings.json`. Declare "opt-in, Kevin activera manuellement" mais jamais active.
- **Motif archive** : neuroplasticite manuelle via CLAUDE.md lignes 113-117 suffit aujourd'hui. Redondant si on fait un jour le hook PreToolUse wiki-recall propose en Phase 12 I-01 de l'audit v2 (reporte).

## Orphelins NON archives

### session-lock.sh
- **Garde en scripts/** malgre orphelin (jamais invoque)
- **Motif** : utile si Kevin active les routines Cloud Phase 5 (coordination Cowork<->CLI). Kevin a explicitement dit 2026-04-17 "routines Cloud plus tard, on se focus sur du local". Attente activation future.

Refs : `docs/audits/2026-04-16-mega-audit-v2/raw/agent-2-scripts-harness.md` F-04, F-05
