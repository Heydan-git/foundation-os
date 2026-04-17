# modules/app/data/ — Archive 2026-04-17

## Contexte

7 fichiers Markdown qui documentaient des composants JSX archives plus tot (Phase 2.4 Cycle 3). Le dossier `modules/app/data/` n'etait **reference nulle part** dans `modules/app/src/` (aucun import). Dead code / documentation fige.

## Motifs de l'archive

1. **Mots interdits CLAUDE.md** : `commander.md:82-84` contenait "REVOLUTION HISTORIQUE ACHEVEE", "Reference Mondiale Absolue", "$1B+ potential", "Premier OS IA-driven commercial mondial", "250+ outils" — viole explicitement l'anti-bullshit gate de CLAUDE.md.
2. **Aucun consommateur** : zero import depuis `modules/app/src/` (grep confirme 0 match pour `modules/app/data/`).
3. **Narrative obsolete** : ADR-034 a ADR-044 decrivent des "phases" qui ne correspondent pas a l'etat reel du projet (seed-data.ts charge ADR-001 a ADR-012 seulement).

## Contenu

- `data/commander.md` (256L) — ADRs historiques + mots interdits
- `data/graph.md` (196L)
- `data/index-app-pages.md` (138L)
- `data/knowledge.md` (36L)
- `data/scale-orchestrator.md` (37L)
- `data/sync.md` (226L)
- `data/toolbox.md` (150L)

## Refs audit v2

- `docs/audits/2026-04-16-mega-audit-v2/raw/agent-5-modules-app.md` F-02 (mots interdits dans commander.md)
- Memoire `feedback_imperatifs_qualite.md` (mots interdits)

## Restauration (si besoin — non recommande)

```bash
mv .archive/app-data-jsx-260417/data modules/app/data
```

Mais : **purger les mots interdits avant** toute restauration (regles anti-bullshit CLAUDE.md).
