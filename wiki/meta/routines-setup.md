---
type: meta
title: "Routines Cloud — Guide setup Kevin"
updated: 2026-04-16
tags:
  - meta
  - routines
  - neuroplasticity
  - setup
status: evergreen
related:
  - "[[thinking]]"
  - "[[sessions-recent]]"
  - "[[lessons-learned]]"
  - "[[foundation-os-map]]"
---

# Routines Cloud — Guide setup

> 3 routines a creer dans Claude Code Desktop. Chaque routine prend ~1 minute a configurer.
> Les routines tournent sur l'infra Anthropic (pas besoin que ton Mac soit allume).
> Max x20 = 15 routines/jour.

## Comment creer une routine

**Option A — Via le CLI (dans le terminal Claude Code) :**
1. Ouvrir Claude Code sur le projet Foundation OS
2. Taper `/schedule`
3. Suivre les instructions (prompt + schedule + repo)

**Option B — Via l'UI Desktop :**
1. Ouvrir Claude Code Desktop
2. Menu → Routines (ou Settings → Scheduled Tasks)
3. "New Routine" → remplir prompt + schedule

---

## Routine 1 — Wiki Health Monitor (quotidien)

**Schedule** : chaque jour a 8h
**Repo** : `Heydan-git/foundation-os`

**Prompt (copie-colle tel quel)** :

```
Tu es le systeme de maintenance memoire Foundation OS.

REGLES ABSOLUES :
- Ne JAMAIS supprimer de fichier
- Ne JAMAIS renommer sans recabler TOUTES les references
- Apres CHAQUE modification : bash scripts/ref-checker.sh
- Commit direct sur main avec message conventional (feat/fix/docs)
- Si un fix risque de casser quelque chose, NE PAS le faire, creer une issue GitHub a la place

ACTIONS :
1. Lire CLAUDE.md pour comprendre les regles du projet
2. Executer bash scripts/wiki-health.sh — noter les problemes
3. Si hot.md > 3 jours : le rafraichir depuis wiki/log.md + git log --oneline -10 (format : Last Updated / Key Recent Facts / Recent Changes / Active Threads / Next Action)
4. Si wikilinks casses detectes : grep le basename → trouver le fichier reel → corriger le lien
5. Si wiki/index.md stats desync avec filesystem : mettre a jour les compteurs (Total pages, Concepts, Entities, Sources)
6. Verifier : bash scripts/ref-checker.sh (0 refs cassees attendu)
7. Si modifications faites : git add + git commit -m "fix(wiki): routine health — [description]" + git push origin main
8. Si rien a faire : ne rien committer
```

---

## Routine 2 — Wiki Consolidation (hebdomadaire)

**Schedule** : dimanche a 20h
**Repo** : `Heydan-git/foundation-os`

**Prompt (copie-colle tel quel)** :

```
Tu es le systeme de consolidation knowledge Foundation OS.

REGLES ABSOLUES :
- Ne JAMAIS supprimer de fichier
- Ne JAMAIS degrader le contenu existant (seulement enrichir)
- Apres CHAQUE modification : bash scripts/ref-checker.sh
- Commit direct sur main avec message conventional
- Si incertain sur une fusion/modification → NE PAS FAIRE, creer issue GitHub detaillee

ACTIONS :
1. Lire CLAUDE.md + docs/core/knowledge.md pour comprendre l'architecture wiki
2. Scanner wiki/concepts/ + wiki/entities/ + wiki/sources/ pour pages avec frontmatter status: seed
3. Pour chaque page seed creee il y a > 7 jours :
   - Lire les pages liees (related dans frontmatter)
   - Si du contexte dans les pages liees peut enrichir cette page → enrichir
   - Changer status: seed → status: developing si enrichie
4. Scanner les wikilinks unidirectionnels :
   - Si page A mentionne [[B]] mais page B ne mentionne pas [[A]]
   - Ajouter [[A]] dans la section Connections/Sources de page B
5. Verifier : bash scripts/wiki-health.sh + bash scripts/ref-checker.sh
6. Si modifications : git add wiki/ + git commit -m "feat(wiki): routine consolidation — [N pages enrichies, M liens bidirectionnalises]" + git push origin main
```

---

## Routine 3 — Documentation Drift (hebdomadaire)

**Schedule** : lundi a 9h
**Repo** : `Heydan-git/foundation-os`

**Prompt (copie-colle tel quel)** :

```
Tu es le systeme de verification coherence Foundation OS.

REGLES ABSOLUES :
- Fix mineur (stats, typo, lien casse) → commit direct main
- Fix majeur (reecriture spec, restructuration) → creer issue GitHub ULTRA detaillee (titre clair + description du probleme + solution proposee + fichiers concernes)
- Toujours bash scripts/health-check.sh AVANT de commit
- Ne JAMAIS supprimer de fichier

ACTIONS :
1. Lire CLAUDE.md pour comprendre les regles
2. Verifier CONTEXT.md < 200 lignes (si > 200, compresser les sessions anciennes en gardant les 5 recentes)
3. Verifier wiki/index.md stats sync avec filesystem : find wiki/ -name "*.md" -not -path "*/meta/templates/*" -not -name "_index.md" | wc -l doit matcher "Total pages: N"
4. Verifier CLAUDE.md coherent avec docs/core/ (sections Commands, Automations actives)
5. Verifier wiki/hot.md age < 7 jours
6. Executer bash scripts/health-check.sh — si BROKEN, creer issue GitHub urgente
7. Si fixes mineurs faits : git add + git commit -m "fix(os): routine drift — [description]" + git push origin main
```

---

## Verification apres creation

Apres avoir cree les 3 routines, verifie :
1. Dans Claude Code → liste des routines → 3 visibles avec bon schedule
2. Attendre le premier run (lendemain 8h pour health, dimanche pour consolidation, lundi pour drift)
3. Verifier que le premier commit de routine apparait sur GitHub

## Notes

- Si une routine casse quelque chose → la desactiver immediatement dans l'UI
- Les routines n'ont PAS acces a auto-memory (~/.claude/projects/) — uniquement au repo git
- Les routines font un clone frais a chaque run — elles voient le dernier etat de main
- Max x20 = 15 runs/jour
