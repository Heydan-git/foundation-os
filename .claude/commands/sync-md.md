# /sync-md — Vérifier et synchroniser tous les fichiers MD/JSX

Audit de cohérence complet entre les fichiers MD sources de vérité et leurs JSX pairs.

## Ce que fait cette commande

1. Liste tous les fos-*.jsx du projet
2. Vérifie que chaque JSX a son NOM-DATA.md
3. Compare les versions (DATA_VERSION dans MD vs commentaire dans JSX)
4. Vérifie les storage keys (pas de doublons)
5. Vérifie la taille des JSX (< 700L)
6. Rapport final avec actions correctives

## Checklist exécutée

```
□ fos-commander.jsx       ↔ FOS-COMMANDER-DATA.md
□ fos-knowledge.jsx       ↔ FOS-KNOWLEDGE-DATA.md
□ fos-scale-orchestrator.jsx ↔ FOS-SCALE-ORCHESTRATOR-DATA.md
□ fos-graph.jsx           ↔ FOS-GRAPH-DATA.md (⏳ à produire)
□ fos-sync.jsx            ↔ FOS-SYNC-DATA.md  (⏳ à produire)
□ fos-index.jsx           ↔ FOS-INDEX-DATA.md  (⏳ à produire)
□ fos-pipeline.jsx        ↔ FOS-PIPELINE-DATA.md (⏳ à produire)
```

## Vérifications additionnelles

```
□ Aucun JSX > 700 lignes
□ Storage keys uniques (grep "storage.set" *.jsx | sort | uniq -d)
□ Fond #06070C dans chaque JSX (pas #0A0A0B)
□ Figtree dans chaque JSX (pas Inter ou Outfit)
□ Pas de fos-fos- double prefix
□ Notation L1a/L1b/L2 (pas L2a/L2b)
```

## Output attendu

```
SYNC REPORT — [date]
━━━━━━━━━━━━━━━━━━━━

✅ fos-commander.jsx ↔ FOS-COMMANDER-DATA.md (v1.2.0)
✅ fos-knowledge.jsx ↔ FOS-KNOWLEDGE-DATA.md (v1.0.0)
✅ fos-scale-orchestrator.jsx ↔ FOS-SCALE-ORCHESTRATOR-DATA.md (v3.5.0)
⏳ fos-graph.jsx — À produire (P6-e21)
⏳ fos-sync.jsx  — À produire (P6-e22)
⏳ fos-index.jsx — À produire (P6)
⏳ fos-pipeline.jsx — À produire (P6)

Tailles : commander 571L ✅ · knowledge 330L ✅ · scale-orch 440L ✅
Storage : fondation-commander-v1 · fondation-knowledge-v1 · fondation-scale-v3 ✅

Verdict : [TOUT OK / X problème(s) à corriger]
```

## Actions correctives si désync

```
1. Ouvrir NOM-DATA.md → bumper DATA_VERSION
2. str_replace dans NOM.jsx → mettre à jour le commentaire version
3. git add NOM-DATA.md NOM.jsx && git commit -m "sync: NOM v[X.X.X]"
```
