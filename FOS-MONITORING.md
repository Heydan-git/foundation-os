# FOS-MONITORING.md
> Métriques et santé de Foundation OS
> À uploader dans Knowledge base du projet Claude.ai
> Mettre à jour à chaque session significative

---

## Statut global

| Indicateur | Valeur | Cible | Statut |
|-----------|--------|-------|--------|
| OS Readiness | 75% | 100% | ✅ PHASE 0 FOUNDATION EXECUTÉE · Hooks bloquants · Phantom files créés |
| Toolbox completeness | 250+ outils | 250+ | ✅ 22 use cases · M6 Workflow Generation · M7 RALPH Loop |
| Artifacts livrés | 7/7 fos-* | 7/7 | ✅ 7 artifacts produits · COMPLET |
| MD pairs complets | 7/7 | 7/7 | ✅ CONV-03 sync complet |
| Stack L1-L4 active | 3/4 | 4/4 | ✅ L0+L2+L3 · L1 partiel |
| Foundation OS App | 100% | Deployée | ✅ LIVE · https://foundation-os.vercel.app/ |
| DA compliance | 2/6 | 6/6 | ⏳ |

---

## Santé artifacts

| Artifact | Lignes | MD pair | DA | Storage | Statut |
|----------|--------|---------|-----|---------|--------|
| fos-commander.jsx | 364 | ✅ | ✅ | ✅ | Livré |
| fos-knowledge.jsx | 448 | ✅ | ✅ | — | Livré |
| fos-index.jsx | 431 | ✅ | ✅ | ✅ | Livré |
| fos-scale-orchestrator.jsx | 558 | ✅ | ✅ | ✅ | Livré |
| fos-graph.jsx | 309 | ✅ | ✅ | ✅ | Livré |
| fos-sync.jsx | 390 | ✅ | ✅ | ✅ | Livré |
| fos-toolbox.jsx | 534 | ✅ | ⚠️ | ✅ | Migré vers artifacts/ |

**Règle :** artifact sain = lignes < 700 · MD pair ✅ · DA ✅ · storage key unique

---

## Santé stack

| Couche | Composant | Statut | Prérequis |
|--------|-----------|--------|-----------|
| L0 | Void Glass DS | ✅ Défini | — |
| L1a | Claude.ai Projects (Knowledge base) | ✅ Créé | — |
| L1a | Knowledge base (~20 MD uploadés) | ✅ Uploadés | Projet créé |
| L1b | Cowork desktop (folder foundation-os/) | ✅ Configuré | — |
| L2 | Claude Code CLI | ✅ Installé | — |
| L2 | CLAUDE.md + hooks | ✅ Déployé | — |
| L2 | oh-my-claudecode | ✅ Installé (.omc/) | — |
| L3 | BMAD v6 (_bmad/) | ✅ Installé | — |
| L4 | Notion wiki | ✅ Créé (e01 ✅) | — |
| L4 | Asana projet | ✅ Créé (MCP) | — |
| L5 | Foundation OS App | ✅ Scaffoldée (npm ok) | — |
| L6 | GitHub repo | ✅ Créé (public) | — |

---

## Métriques contexte

| Source | Tokens estimés | % sur 200K |
|--------|---------------|-----------|
| fos-commander.jsx (571L) | ~14 000 | 7% |
| fos-knowledge.jsx (330L) | ~8 000 | 4% |
| fos-scale-orchestrator.jsx (435L) | ~11 000 | 5.5% |
| fos-index.jsx (479L) | ~12 000 | 6% |
| System prompt Anthropic | ~13 000 | 6.5% |
| Memories utilisateur | ~800 | 0.4% |
| Conversation courante | ~8 000 | 4% (croît) |
| **Total estimé avec 4 artifacts** | **~67 000** | **~33.5%** |

**Seuils :** Attention > 50% · Compact > 70% · Clear > 90%

---

## Métriques pipeline iOS (futur)

| Phase | Statut | Bloqueur |
|-------|--------|---------|
| 00 Validation | ⏳ | App iOS cible non définie |
| 01 Design | ⏳ | Phase 00 |
| 02 Architecture | ⏳ | Phase 00 |
| 03 Dev | ⏳ | Phase 00-02 |
| 04 Qualité | ⏳ | Phase 03 |
| 05 Launch | ⏳ | Phase 04 |
| 06 Monétisation | ⏳ | Phase 05 |
| 07 Growth | ⏳ | Phase 06 |

---

## Checklist santé — à vérifier chaque session

```
□ Artifacts < 700L chacun
□ Tous les JSX ont leur MD pair
□ Stack L5 = Vite + React + Supabase + Vercel (pas Railway)
□ L1a = Claude.ai Projects · L1b = Cowork Desktop · L2 = Claude Code
□ BMAD = _bmad/ (underscore, pas dot)
□ DA = #06070C fond, Figtree UI, JetBrains Mono code
□ Context budget < 70%
□ Journal session mis à jour
□ Prochaine étape identifiée dans SCALE-ORCHESTRATOR
□ Aucune mention de stack incorrecte dans les fichiers
□ MD pairs à jour après toute modification JSX
```

---

## Risques actifs

| ID | Risque | Impact | Proba | Mitigation | Statut |
|----|--------|--------|-------|------------|--------|
| R-01 | Context saturation (artifacts > 200K tokens) | high | medium | Compaction stratégique + Foundation OS App | open |
| R-02 | Drift MD/JSX (oubli sync) | medium | medium | FOUNDATION-OS-SKILL + review systématique | open |
| R-03 | DA regression (mauvais fond ou font) | low | low | Void Glass checklist dans skill | open |
| R-04 | Supabase pause 7j inactif | low | low | GitHub Actions cron ping hebdo | open |
| R-05 | oh-my-claudecode rate limit mid-session | medium | high | Auto-resume natif OMC | mitigated |

---

## Changelog

| Date | Session | Modification |
|------|---------|-------------|
| 2026-04-03 | CONV-10 | Création — métriques initiales |
| 2026-04-03 | CONV-12 | fos-index.jsx livré (479L) · OS Readiness 10% → 15% · 4/6 artifacts |
