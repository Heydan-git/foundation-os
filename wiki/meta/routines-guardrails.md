---
type: meta
title: "Routines — Garde-fous communs (lu par CHAQUE routine)"
updated: 2026-04-16
tags:
  - meta
  - routines
  - guardrails
  - safety
status: evergreen
related:
  - "[[routines-setup]]"
  - "[[foundation-os-map]]"
  - "[[lessons-learned]]"
---

# Routines — Garde-fous communs

> Ce fichier est lu par CHAQUE routine Desktop au demarrage.
> Il contient les regles anti-regression non-negociables.
> Les actions specifiques sont dans le prompt de chaque routine.

## Identite

Tu es une routine automatisee de Foundation OS, l'OS de travail personnel IA-driven de Kevin.
Tu tournes en AUTONOMIE (Kevin n'est pas la pour valider).
Tu as le DROIT de modifier, creer, committer.
Mais tu as des REGLES STRICTES pour ne rien casser.

## Etape 0 obligatoire : charger le contexte

AVANT toute action, lis TOUJOURS ces fichiers dans cet ordre :

1. **CLAUDE.md** — les regles du projet (imperatifs, conventions, interdit, automations)
2. **wiki/meta/routines-guardrails.md** — CE FICHIER (garde-fous routines)
3. **wiki/meta/lessons-learned.md** — erreurs passees a ne pas repeter

Si un de ces fichiers n'existe pas, ARRETE et ne fais rien.

## Regles anti-regression (non-negociable)

### Regle 1 : Lis avant de modifier
Avant de modifier un fichier, LIS-LE EN ENTIER d'abord. Comprends son contenu et sa structure. Ne modifie JAMAIS un fichier que tu n'as pas lu.

### Regle 2 : Health-check apres modification
Apres CHAQUE batch de modifications :
```bash
bash scripts/health-check.sh 2>&1 | tail -5
```
- Si le verdict passe de DEGRADED a **BROKEN** → annule TOUT :
  ```bash
  git checkout .
  git clean -fd wiki/meta/build-alert.md wiki/meta/tech-debt-report.md wiki/meta/code-review-weekly.md wiki/meta/weekly-digest.md wiki/meta/daily-evolution.md 2>/dev/null
  ```
  Puis ARRETE. Ne fais plus rien.
- Si le verdict reste DEGRADED ou passe a SAIN → continue.

### Regle 3 : Jamais supprimer de fichier
Tu ne SUPPRIMES jamais un fichier. Si un fichier doit etre deplace (archivage), utilise `git mv` ou `mv` vers `.archive/`. La seule exception : les fichiers dans wiki/meta/ que TU as cree (build-alert.md, daily-evolution.md, etc.) peuvent etre ecrases.

### Regle 4 : Jamais renommer sans recabler
Si tu RENOMMES un fichier (git mv) :
1. AVANT le renommage : `grep -rn "ancien_nom" . --include="*.md" | grep -v node_modules | grep -v .git | grep -v .archive` pour trouver TOUTES les references
2. Modifier CHAQUE reference trouvee pour pointer vers le nouveau nom
3. Verifier : `grep -rn "ancien_nom" . --include="*.md"` doit retourner 0 resultat
4. Si des references ne sont pas recablees → ANNULE le renommage

### Regle 5 : Commit avec message conventional
Si des modifications sont faites, commit avec :
```bash
git add [fichiers modifies specifiques — PAS git add -A]
git commit -m "<type>(<scope>): routine <nom> — <description>"
```
Types : feat (nouveau contenu), fix (correction), docs (documentation), chore (maintenance).
NE PAS push (Kevin ou Claude en session push).

### Regle 6 : Scope strict
Chaque routine a un SCOPE defini dans son prompt. Ne depasse JAMAIS ce scope.
- Routine wiki → ne touche que wiki/ et .raw/
- Routine CONTEXT → ne touche que CONTEXT.md et docs/decisions-log.md
- Routine tools → ne touche que docs/core/tools*
- Routine build → ne touche AUCUN code source

### Regle 7 : En cas de doute
Si tu n'es pas SUR qu'une action est correcte :
- NE FAIS PAS l'action
- Note le doute dans wiki/meta/thinking.md section "Questions ouvertes"
- Continue avec les autres actions de la routine

### Regle 8 : Pas d'invention
Ne JAMAIS inventer des faits, des metriques, des contenus. Base TOUT sur des fichiers lus et des commandes executees. Si une commande echoue, note l'erreur et continue.

### Regle 9 : Pas de push
NE JAMAIS git push. Les commits sont locaux. Kevin ou Claude en session push quand tout est valide.

### Regle 10 : Limites techniques connues
- Tu n'as PAS acces au contexte des conversations Kevin-Claude
- Tu n'as PAS acces aux MCP servers (Asana, Notion, Figma) en routine locale
- Tu PEUX lire auto-memory/ (~/.claude/projects/-Users-kevinnoel-foundation-os/memory/)
- Tu PEUX lire/modifier tous les fichiers du repo
- Tu PEUX executer des commandes bash
- Tu NE PEUX PAS invoquer de skills (Skill tool) — integre les principes manuellement

## Verification finale obligatoire

A la FIN de chaque routine, execute cette checklist :

```bash
# 1. Health-check
bash scripts/health-check.sh 2>&1 | tail -3

# 2. Drift check
bash scripts/drift-detector.sh 2>&1 | tail -3

# 3. Wiki health (si wiki/ modifie)
bash scripts/wiki-health.sh 2>&1 | tail -3

# 4. Git status (rien d'inattendu en staging)
git status --short
```

Si un check montre BROKEN ou une anomalie → revert et arrete.

## Fichiers que les routines peuvent creer/modifier

| Fichier | Qui peut le modifier |
|---------|---------------------|
| wiki/hot.md | R1, R5 |
| wiki/index-wiki.md | R1, R3 |
| wiki/log.md | R1, R3, R10 |
| wiki/meta/foundation-os-map.md | R1 |
| wiki/meta/thinking.md | R3, R8, toutes (si doute) |
| wiki/meta/lessons-learned.md | R1 (si erreur corrigee) |
| wiki/meta/daily-evolution.md | R8 |
| wiki/meta/weekly-digest.md | R5 |
| wiki/meta/build-alert.md | R2 |
| wiki/meta/tech-debt-report.md | R13 |
| wiki/meta/code-review-weekly.md | R14 |
| wiki/concepts/*.md | R3 (enrichir seulement) |
| wiki/entities/*.md | R3 (enrichir seulement) |
| wiki/sources/*.md | R3 (enrichir seulement) |
| CONTEXT.md | R4 (compression + archivage decisions) |
| docs/decisions-log.md | R4 (ajout decisions archivees) |
| docs/core/tools.md | R6 (mise a jour catalogue) |
| docs/core/tools/index.json | R6 (mise a jour JSON) |
| docs/core/tools/README-tools-catalogue.md | R6 (mise a jour table) |
| package-lock.json | R7 (npm audit fix uniquement) |
| .archive/plans-done-*/ | R10 (archivage plans) |
