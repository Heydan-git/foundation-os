---
type: concept
title: "Constitution FOS"
complexity: advanced
domain: dev
aliases:
  - "Constitution Foundation OS"
  - "Principes P-XX"
created: 2026-04-19
updated: 2026-04-19
tags:
  - concept
  - constitution
  - principles
  - alignment
  - canonical-definition
status: canonical
confidence: medium
related:
  - "[[Body]]"
  - "[[Alignment]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[index-concepts]]"
sources: []
---

# Constitution FOS — Principes P-XX canoniques

Source de verite des principes comportementaux Claude dans Foundation OS. Adoption D-BODY-01 (2026-04-19). Fichier operationnel : `docs/core/constitution.md`.

## Structure P-XX

Chaque principe a 5 champs obligatoires :

```markdown
## P-XX Titre court

**Regle** : <1 ligne imperative>
**Pourquoi** : <raison racine, 1-2 lignes>
**Done** : <exemple concret comportement aligne>
**Not-done** : <exemple concret anti-pattern>
**Source** : <CLAUDE.md LXX | lessons-learned.md section | feedback_*.md>
```

## Seed initial (~41 principes)

Derives 100% de sources FOS existantes (zero invention) :

| Plage P-XX | Source | Nombre |
|---|---|---|
| P-01 a P-14 | CLAUDE.md L9-24 imperatifs qualite | 14 |
| P-15 a P-19 | CLAUDE.md L148-153 anti-bullshit gates | 5 |
| P-20 a P-27 | wiki/meta/lessons-learned.md (YAGNI, push main, API, Obsidian, refs, split TSX, mesh) | 8 |
| P-28 a P-32 | wiki/concepts/[[Foundation OS]] 5 pieges cadrage | 5 |
| P-33 a P-36 | CLAUDE.md L119-128 interdits sans Kevin | 4 |
| P-37 a P-41 | auto-memory feedback_*.md conventions | 5 |

## Regles meta

1. **Append-only** : on ajoute P-XX, jamais renumerotation (traceabilite rapports auditor).
2. **Source obligatoire** : chaque P-XX doit citer sa source. Principe invente sans source = rejete.
3. **Max 50 P-XX** : au-dela, regrouper en meta-principes ou archiver vers `docs/constitution-archive.md`.
4. **Field `Source`** = lien traceable : CLAUDE.md LXX OU wiki/meta/lessons-learned.md section OU auto-memory feedback_*.md.

## Extension

### Manuel (Kevin ou Claude)

Append directement en bas de la section appropriee (A-F). Respecter format 5 champs.

### Assiste par script

`bash scripts/constitution-suggest.sh` scanne `🎯 to-constitute` dans `wiki/meta/lessons-learned.md` → propose drafts P-XX (titre + source pre-remplis). Kevin refine Regle/Done/Not-done et append.

### Convention `🎯 to-constitute`

Quand une lesson merite d'etre elevee en P-XX, prefixer le titre de la section `wiki/meta/lessons-learned.md` avec l'emoji `🎯`. Le script detecte les flags automatiquement.

## Top 10 critiques (affichage brief v12 tuile 🧭 ALIGNMENT)

Rotation quotidienne 1 par jour :

1. P-01 Executer a la lettre
2. P-04 Ne jamais halluciner
3. P-07 Lire = lire TOUT
4. P-14 Cause racine avant fix
5. P-15 Preuve avant "TERMINE"
6. P-20 YAGNI avant safety automatisee
7. P-28 Ne pas confondre FORME et FONCTION
8. P-31 Ecouter mots exacts Kevin
9. P-32 Admettre erreur, pas vendre correction
10. P-38 TodoWrite systematique >= 3 etapes

## Relation avec [[Body]] et [[Alignment]]

- [[Body]] : module 8e Core OS qui operationalise la constitution (couches C1-C4)
- [[Alignment]] : concept cross-domain qui explique pourquoi une constitution est necessaire (scope drift, faithfulness, IFEval)

## Reading sequence pour Claude (SessionStart)

1. L0 : `wiki/hot.md` (cache flash)
2. L1 : `CONTEXT.md` + `wiki/meta/sessions-recent.md`
3. **L2 : ajout `docs/core/constitution.md`** (D-BODY-01) + lessons-learned + thinking + plans
4. L3 : pages wiki on-demand (cette page peut etre une L3 si Kevin pose question sur "Constitution")

## Sources internes FOS

- Operationnel : `docs/core/constitution.md`
- Spec module : `docs/core/body.md` section 3 (Couche C1)
- Plan execution : `docs/plans/2026-04-19-body-module-complet.md`
- Decision : D-BODY-01 (CONTEXT.md)
- Script assistant : `scripts/constitution-suggest.sh`
- Archive future : `docs/constitution-archive.md` (vide jusqu'au premier archivage Q3 2026)

## Sources externes inspiration

- [Constitutional AI (Anthropic)](https://arxiv.org/abs/2212.08073)
- [Anthropic constitution publique](https://time.com/7354738/claude-constitution-ai-alignment/)
