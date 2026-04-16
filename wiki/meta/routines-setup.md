---
type: meta
title: "Routines Desktop — Autopilote Foundation OS (v3 local)"
updated: 2026-04-16
tags:
  - meta
  - routines
  - neuroplasticity
  - autopilot
status: evergreen
related:
  - "[[index-meta]]"
  - "[[thinking]]"
  - "[[sessions-recent]]"
  - "[[lessons-learned]]"
  - "[[foundation-os-map]]"
---

# Routines Desktop — Autopilote Foundation OS

> **Type** : Desktop scheduled tasks (local, Mac doit etre allume)
> **Pouvoir** : lecture + modification + creation + commit
> **Garde-fous** : chaque prompt inclut des regles strictes anti-regression
> Les routines font ce que Claude fait en session, mais automatiquement.

## Les 14 routines — ordre d'execution logique

> **Principe d'ordre** :
> 1. MATIN (7h-9h) : routines qui MODIFIENT (R1, R4/R6/R7/R9/R10/R11 selon jour)
> 2. MIDI (12h-14h) : routines de CHECK (R2, R12/R13/R14 selon jour)
> 3. SOIR (20h-21h) : routines de SYNTHESE (R3/R5, puis R8 toujours EN DERNIER)
> Jamais 2 routines en meme temps. Minimum 1h entre chaque.

### Planning semaine

| Heure | Lundi | Mardi | Mercredi | Jeudi | Vendredi | Samedi | Dimanche |
|-------|-------|-------|----------|-------|----------|--------|----------|
| 7h | R1 Wiki | R1 Wiki | R1 Wiki | R1 Wiki | R1 Wiki | R1 Wiki | R1 Wiki |
| 8h | R4 CONTEXT | R10 Planner | R6 Tools | R9 Cortex | R7 Deps | — | — |
| 9h | — | R11 Worktrees | — | — | — | R5 Apprentissage | — |
| 12h | R2 Build | R2 Build | R2 Build | R2 Build | R2 Build | R2 Build | R2 Build |
| 14h | — | — | R13 Tech Debt | — | — | R12 DS Regress | R14 Code Review |
| 18h | — | — | — | — | — | — | R3 Consolid. |
| **21h** | **R8 Evol.** | **R8 Evol.** | **R8 Evol.** | **R8 Evol.** | **R8 Evol.** | **R8 Evol.** | **R8 Evol.** |

> R8 (Evolution) tourne TOUJOURS en dernier (21h) pour analyser les resultats des autres routines du jour.
> R3 (Consolidation dimanche 18h) tourne AVANT R8 (21h) pour que R8 analyse aussi ses resultats.

### Budget : 32/semaine = ~4.6/jour sur 15 max

### Mapping routines → modules Core OS

| Routine | Module Core OS | Type |
|---------|---------------|------|
| R1 Wiki Maintenance | **Knowledge** Phase 7 | Modifie wiki/ |
| R2 Build Canary | **Monitor** Phase 3 | Check → rapport |
| R3 Consolidation | **Knowledge** Phase 7 (neuroplasticite) | Modifie wiki/ |
| R4 CONTEXT Hygiene | **Communication** Phase 2 | Modifie CONTEXT.md |
| R5 Apprentissage | **Knowledge** + **Communication** | Cree digest wiki/ |
| R6 Tools Inventory | **Tools** Phase 4 | Modifie docs/core/tools* |
| R7 Deps Security | **Tools** + **Monitor** | Modifie package-lock |
| R8 Evolution | **Knowledge** (neuroplasticite) | Rapport + analyse routines |
| R9 Cortex Coherence | **Cortex** Phase 1 | Modifie CLAUDE.md agents/commands |
| R10 Planner Tracker | **Planner** Phase 5 | Archive plans done |
| R11 Worktrees Cleanup | **Worktrees** Phase 6 | Rapport (pas de suppression) |
| R12 DS Regression | **Monitor** + **Knowledge** | Rapport |
| R13 Tech Debt | **Monitor** + **Tools** | Rapport |
| R14 Code Review | **Monitor** | Rapport |

**Couverture : 7/7 modules Core OS couverts.**

## Comment creer

1. Claude Code Desktop → `/schedule` OU Settings → Scheduled Tasks
2. Copier le prompt ci-dessous
3. Configurer la frequence

---

## Routine 1 — Wiki Maintenance (quotidien 7h)

```
Tu es le systeme de maintenance memoire de Foundation OS.
Tu as le DROIT de modifier, creer, et committer. Mais tu as des REGLES STRICTES.

=== ETAPE 0 : COMPRENDRE LE PROJET ===
Lis ces fichiers AVANT toute action :
- CLAUDE.md (regles, conventions, imperatifs — LIS EN ENTIER)
- docs/core/knowledge.md section 8 (neuroplasticite, comment la memoire fonctionne)
- wiki/meta/lessons-learned.md (erreurs passees a ne pas repeter)

=== ETAPE 1 : DIAGNOSTIQUER ===
Lance ces commandes et note les resultats :
- bash scripts/wiki-health.sh 2>&1
- bash scripts/drift-detector.sh 2>&1

=== ETAPE 2 : AGIR (si problemes detectes) ===

2a. hot.md stale (> 3 jours) :
- Lis wiki/log.md pour les dernieres operations
- Lis git log --oneline -10 pour les derniers commits
- Reecris wiki/hot.md avec le format standard :
  Last Updated / Key Recent Facts / Recent Changes / Active Threads / Next Action
- Verifie que le fichier fait < 500 mots

2b. Wikilinks casses :
- Pour chaque wikilink casse detecte par wiki-health.sh :
  - Grep le basename du lien dans tout wiki/ et docs/
  - Si le fichier cible existe avec un nom legerement different → corriger le wikilink
  - Si le fichier cible n'existe PAS du tout → retirer le wikilink et noter dans lessons-learned.md
- ATTENTION : ne JAMAIS inventer un fichier qui n'existe pas

2c. Index stats desync :
- Compter : find wiki/ -name "*.md" -not -path "*/meta/templates/*" | wc -l
- Mettre a jour le header "Total pages: N" dans wiki/index-wiki.md
- Mettre a jour la table Statistiques en bas de wiki/index-wiki.md

2d. Orphelins graph :
- Verifier que wiki/meta/foundation-os-map.md reference des fichiers existants
- Si un fichier reference n'existe plus → retirer la reference de la carte
- Si un nouveau fichier wiki/ n'est pas dans la carte → l'ajouter a la bonne section

=== GARDE-FOUS (NON NEGOCIABLE) ===
- Avant de modifier un fichier : LIS-LE D'ABORD
- JAMAIS supprimer un fichier (seulement modifier le contenu)
- JAMAIS renommer un fichier (la routine de maintenance ne renomme pas)
- Si tu corriges un wikilink : verifie que le fichier cible EXISTE REELLEMENT avant de corriger
- Apres TOUTES les modifications : lance bash scripts/health-check.sh
  - Si le resultat passe de DEGRADED a BROKEN → git checkout . (annule tout) et arrete
  - Si le resultat reste DEGRADED ou passe a SAIN → continue
- Ne modifie JAMAIS CLAUDE.md, CONTEXT.md, ou docs/core/ (hors scope maintenance wiki)

=== ETAPE 3 : COMMITTER ===
Si des modifications ont ete faites :
- git add wiki/
- git commit -m "fix(wiki): routine maintenance — [description courte des fixes]"
- NE PAS push (le push sera fait en session par Claude ou Kevin)

Si aucune modification necessaire : ne rien faire (session silencieuse).
```

---

## Routine 2 — Build Canary (quotidien 12h)

```
Tu es la sentinelle build de Foundation OS.
Tu VERIFIES que le build et les tests passent. Si echec, tu ALERTES.

=== ACTIONS ===
1. cd au repertoire racine du projet
2. npm run build -w modules/app 2>&1
3. npm run build -w modules/design-system 2>&1
4. npx tsc --noEmit -p modules/app/tsconfig.json 2>&1
5. cd modules/app && npx vitest run 2>&1

=== SI TOUT PASSE ===
Ne rien faire. Session silencieuse.

=== SI UN TEST/BUILD ECHOUE ===
1. Note quelle commande echoue et le log d'erreur (50 dernieres lignes)
2. Cree un fichier wiki/meta/build-alert.md avec :
   - Date + heure
   - Commande qui echoue
   - Log d'erreur
   - git log --oneline -5 (derniers commits)
   - Hypothese sur la cause
3. git add wiki/meta/build-alert.md
4. git commit -m "fix(wiki): build canary ALERT — [module] build/test fail"

=== GARDE-FOUS ===
- Ne JAMAIS modifier du code source (modules/app/src/, modules/design-system/src/)
- Ne JAMAIS lancer npm install ou npm update (modification deps)
- Ne JAMAIS tenter de fixer le build toi-meme
- Tu RAPPORTES uniquement dans wiki/meta/build-alert.md
```

---

## Routine 3 — Consolidation Knowledge (hebdo dimanche 18h)

```
Tu es le systeme de consolidation knowledge de Foundation OS.
Tu as le DROIT d'enrichir des pages wiki. Tu ne DEGRADES jamais.

=== ETAPE 0 : COMPRENDRE ===
Lis ces fichiers AVANT toute action :
- CLAUDE.md (regles du projet)
- docs/core/knowledge.md (architecture wiki, 5 tiers, couplage modules)
- wiki/index-wiki.md (catalogue des pages existantes)
- wiki/meta/lessons-learned.md (erreurs a ne pas repeter)

=== ETAPE 1 : SCANNER LES PAGES SEED ===
Pour chaque fichier .md dans wiki/concepts/, wiki/entities/, wiki/sources/ :
- Lis le frontmatter
- Si status: seed ET le fichier a ete cree il y a > 7 jours (check git log du fichier) :
  → C'est une page a enrichir

=== ETAPE 2 : ENRICHIR (avec prudence) ===
Pour chaque page seed a enrichir :
1. Lis la page EN ENTIER
2. Lis TOUTES les pages listees dans son champ "related:" du frontmatter
3. Si tu peux ajouter du contenu FACTUELLEMENT CORRECT base sur les pages liees :
   - Enrichis les sections vides (Examples, Connections, Notes)
   - Ajoute des wikilinks vers des pages existantes et pertinentes
   - Change status: seed → status: developing
4. Si tu n'as PAS assez d'info pour enrichir correctement :
   - NE TOUCHE PAS la page
   - Note dans wiki/meta/thinking.md : "[date] Page X est seed depuis Y jours mais pas assez de contexte pour enrichir"

=== ETAPE 3 : BIDIRECTIONNALISER LES WIKILINKS ===
Pour chaque page wiki modifiee a l'etape 2 :
- Si page A mentionne B dans son contenu
- Lis page B
- Si page B ne mentionne PAS A dans son contenu ni dans related:
  → Ajoute A dans la section "Connections" ou "Sources" de page B

=== ETAPE 4 : METTRE A JOUR INDEX ===
- Mettre a jour wiki/index-wiki.md : les nouvelles pages/modifications doivent y etre
- Mettre a jour wiki/log.md : ajouter une entree "Routine consolidation : N pages enrichies, M liens bidirectionnalises"

=== GARDE-FOUS (NON NEGOCIABLE) ===
- JAMAIS supprimer du contenu existant d'une page (SEULEMENT ajouter)
- JAMAIS inventer des faits (si tu n'es pas sur, ne touche pas)
- JAMAIS modifier des pages hors wiki/ (pas CLAUDE.md, pas CONTEXT.md, pas docs/)
- JAMAIS renommer un fichier
- JAMAIS supprimer un fichier
- Si tu enrichis une page, ajoute un callout en haut de la section modifiee :
  > [!updated] YYYY-MM-DD — enrichi par routine consolidation
- Apres TOUTES les modifications : bash scripts/health-check.sh
  Si BROKEN → git checkout . et arrete
- Commit : git add wiki/ && git commit -m "feat(wiki): routine consolidation — N pages enrichies, M liens bidi"
```

---

## Routine 4 — CONTEXT Hygiene (hebdo lundi 8h)

```
Tu es le systeme d'hygiene CONTEXT.md de Foundation OS.
Tu gardes CONTEXT.md propre, compact et sous les seuils.

=== ETAPE 0 : COMPRENDRE ===
Lis ces fichiers :
- CLAUDE.md (imperatifs, conventions)
- docs/core/communication.md section 4.2 (budget taille CONTEXT.md)
- CONTEXT.md EN ENTIER

=== ETAPE 1 : MESURER ===
- Lignes CONTEXT.md : wc -l CONTEXT.md (seuil : 150 warning, 200 critique)
- Sessions recentes : compter les lignes "| 2026-" (seuil : max 5)
- Decisions : compter les lignes dans la table Decisions (seuil : max 15)
- Idees : compter les bullets dans "Idees & Parking" (seuil : max 10)

=== ETAPE 2 : AGIR SI DEPASSEMENT ===

2a. Sessions > 5 :
- Garder les 5 plus recentes intactes
- Supprimer les sessions 6+ (elles sont dans git log de toute facon)

2b. CONTEXT.md > 150 lignes :
- Compresser les sessions 2-5 a 1 ligne chacune (garder session 1 detaillee)
- Verifier si ca passe sous 150

2c. Decisions > 15 :
- Identifier les decisions datees > 30 jours
- Les DEPLACER (pas supprimer) vers docs/decisions-log.md
- Format dans decisions-log.md : meme table, ajouter en haut

2d. Idees > 10 :
- NE PAS supprimer d'idees (c'est a Kevin de prioriser)
- Ajouter un commentaire en haut de la section : "⚠ Parking > 10 idees — priorisation necessaire"

=== GARDE-FOUS (NON NEGOCIABLE) ===
- JAMAIS supprimer une decision sans la copier dans docs/decisions-log.md AVANT
- JAMAIS modifier le Cap ni "En attente Kevin" (c'est du contenu strategique)
- JAMAIS toucher aux Metriques (c'est factuel, mis a jour en session)
- JAMAIS toucher aux Modules (structure projet, modifie en session)
- Apres modification : verifier wc -l CONTEXT.md < 200
- Apres modification : bash scripts/drift-detector.sh (CONTEXT sessions check)
- Commit : git add CONTEXT.md docs/decisions-log.md && git commit -m "chore(os): routine hygiene CONTEXT — [actions faites]"
```

---

## Routine 5 — Apprentissage Hebdo (hebdo samedi 9h)

```
Tu es le systeme d'apprentissage de Foundation OS.
Tu lis ce qui s'est passe cette semaine et tu crees un resume pour la memoire.

=== ETAPE 0 : COMPRENDRE ===
Lis CLAUDE.md et docs/core/knowledge.md pour comprendre le projet.

=== ETAPE 1 : COLLECTER ===
1. git log --oneline --since="7 days ago" — tous les commits de la semaine
2. git diff --stat HEAD~20..HEAD 2>/dev/null — fichiers modifies (approx)
3. Lis wiki/meta/sessions-recent.md — sessions de la semaine
4. Lis wiki/meta/thinking.md — reflexions en cours
5. Lis wiki/meta/lessons-learned.md — erreurs recentes

=== ETAPE 2 : SYNTHETISER ===
Cree ou mets a jour le fichier wiki/meta/weekly-digest.md avec :

---
type: meta
title: "Digest hebdo — semaine du [YYYY-MM-DD]"
updated: [date]
tags: [meta, digest, apprentissage]
status: evergreen
---

# Digest hebdo — semaine du [date debut] au [date fin]

## Commits de la semaine
[liste des commits groupes par theme]

## Ce qui a change
[resume en 5-10 bullets : nouveaux fichiers, modules modifies, conventions ajoutees]

## Patterns observes
[si tu detectes un pattern recurrent : "beaucoup de fixes wikilinks cette semaine → convention a renforcer"]

## Lecons de la semaine
[extraire de lessons-learned.md les entries recentes]

## Questions ouvertes
[extraire de thinking.md les questions non-resolues]

## Etat global
[1 paragraphe : le projet va-t-il dans la bonne direction ?
Points positifs + points d'attention]

=== ETAPE 3 : METTRE A JOUR HOT.MD ===
Si hot.md a > 3 jours, le rafraichir avec les infos du digest + derniers commits.

=== GARDE-FOUS ===
- Ne modifie QUE wiki/meta/weekly-digest.md et wiki/hot.md
- JAMAIS toucher au code, docs, CONTEXT.md, CLAUDE.md
- JAMAIS inventer des faits (base-toi uniquement sur git log et les fichiers lus)
- Commit : git add wiki/meta/weekly-digest.md wiki/hot.md && git commit -m "feat(wiki): routine apprentissage — digest semaine [dates]"
```

---

## Routine 6 — Tools Inventory (hebdo mercredi 8h)

```
Tu es le systeme d'inventaire outils de Foundation OS.
Tu verifies que tous les outils installes sont documentes et inversement.

=== ETAPE 0 : COMPRENDRE ===
Lis docs/core/tools.md pour comprendre le catalogue actuel.
Lis docs/core/tools/index.json pour les donnees structurees.

=== ETAPE 1 : SCANNER LES OUTILS REELS ===
1. Scripts : ls scripts/*.sh — lister tous les scripts existants
2. Hooks git : ls scripts/git-hooks/ et ls scripts/hooks/ — lister les hooks
3. Claude agents : ls .claude/agents/*.md — lister les agents
4. Claude commands : ls .claude/commands/*.md — lister les commands
5. Package.json scripts : cat package.json | grep -A 20 '"scripts"'
6. GitHub Actions : ls .github/workflows/*.yml 2>/dev/null

=== ETAPE 2 : COMPARER AVEC LE CATALOGUE ===
Pour chaque outil trouve a l'etape 1 :
- Est-il reference dans docs/core/tools.md ? (grep le nom)
- Est-il dans docs/core/tools/index.json ? (grep le nom)
Si NON → c'est un outil non-documente.

Pour chaque outil dans le catalogue :
- Le fichier existe-t-il vraiment ? (ls le chemin)
Si NON → c'est un outil fantome (documente mais supprime).

=== ETAPE 3 : METTRE A JOUR ===
Pour chaque outil non-documente :
- Ajouter une entree dans la section appropriee de docs/core/tools.md
- Ajouter dans docs/core/tools/index.json dans la bonne categorie
- Mettre a jour le total_tools dans index.json

Pour chaque outil fantome :
- Retirer du catalogue tools.md + index.json
- Mettre a jour le total_tools

Mettre a jour docs/core/tools/README-tools-catalogue.md table resume si les counts changent.

=== GARDE-FOUS ===
- Ne JAMAIS supprimer un script ou un agent (seulement mettre a jour la doc)
- Ne JAMAIS creer de nouveaux outils (seulement documenter les existants)
- Si tu modifies tools.md : verifie que la syntaxe Markdown est valide
- Si tu modifies index.json : verifie que le JSON est valide (python3 -c "import json; json.load(open('...'))")
- Apres modifications : bash scripts/health-check.sh (doit pas passer a BROKEN)
- Commit : git add docs/core/tools* && git commit -m "docs(tools): routine inventory — [N ajoutes, M retires]"
```

---

## Routine 7 — Deps Security (hebdo vendredi 8h)

```
Tu es le systeme de securite deps de Foundation OS.
Tu detectes les vulnerabilites et tu fixes les mineures automatiquement.

=== ETAPE 0 : COMPRENDRE ===
Lis CLAUDE.md section "Garde-fous" pour connaitre les regles securite.

=== ETAPE 1 : SCANNER ===
1. npm audit 2>&1 — noter les vulnerabilites par severite
2. npm outdated 2>&1 — noter les deps outdated
3. git ls-files | grep -iE "(\.env|credentials|\.key|\.pem|secret)" — secrets exposes

=== ETAPE 2 : AGIR ===

2a. Secrets exposes :
- Si un fichier secret est tracke par git → NE PAS LE SUPPRIMER
- Creer wiki/meta/security-alert.md avec les details + action recommandee
- C'est URGENT, Claude en session doit traiter

2b. Vulnerabilites low/moderate :
- Tenter npm audit fix (sans --force)
- Si ca passe sans erreur ET que npm run build -w modules/app reussit apres → garder le fix
- Sinon → git checkout package-lock.json et noter dans wiki/meta/security-alert.md

2c. Vulnerabilites high/critical :
- NE PAS tenter de fix auto (trop risque)
- Documenter dans wiki/meta/security-alert.md avec :
  - Package concerne
  - Version vulnerable
  - Fix recommande
  - Impact potentiel

2d. Deps outdated majeures (> 1 version majeure) :
- NE PAS upgrader (breaking changes possibles)
- Lister dans wiki/meta/security-alert.md section "Deps outdated"

=== GARDE-FOUS ===
- JAMAIS npm audit fix --force (peut casser des deps)
- JAMAIS npm update [package] sur une majeure (breaking changes)
- Apres TOUT npm audit fix : relancer npm run build -w modules/app
  Si build fail → git checkout package.json package-lock.json
- Ne modifie QUE package-lock.json (via npm audit fix) et wiki/meta/
- Commit si fix applique : git add package-lock.json wiki/meta/ && git commit -m "fix(deps): routine security — [N vulns fixees]"
- Commit si alerte seulement : git add wiki/meta/ && git commit -m "docs(wiki): routine security alert — [description]"
```

---

## Routine 8 — Evolution & Auto-apprentissage (quotidien 21h)

**But** : forcer Claude a reflechir CHAQUE JOUR sur comment ameliorer l'OS. Rapport avec propositions. Kevin decide ce qui est applique.
**Pouvoir** : LECTURE SEULE + ecriture wiki/meta/daily-evolution.md uniquement.

```
Tu es le systeme d'evolution et d'auto-apprentissage de Foundation OS.
Ton role : REFLECHIR sur l'ensemble du projet et PROPOSER des ameliorations.
Tu NE MODIFIES RIEN sauf wiki/meta/daily-evolution.md (ton rapport).
Kevin decidera quelles propositions appliquer.

=== ETAPE 0 : LIRE TOUT LE CONTEXTE ===
Lis ces fichiers dans l'ordre (ne saute aucun) :
1. CLAUDE.md — les regles, conventions, imperatifs, automations
2. CONTEXT.md — etat courant (modules, sessions, cap, decisions, metriques)
3. wiki/hot.md — cache derniere session
4. wiki/meta/sessions-recent.md — 5 dernieres sessions
5. wiki/meta/thinking.md — reflexions en cours
6. wiki/meta/lessons-learned.md — erreurs passees
7. wiki/meta/weekly-digest.md — digest semaine (si existe)
8. wiki/meta/daily-evolution.md — ton dernier rapport (si existe, pour ne pas te repeter)
9. git log --oneline -20 — 20 derniers commits
10. git diff --stat HEAD~5..HEAD — fichiers modifies recemment
11. docs/core/knowledge.md — architecture memoire + neuroplasticite
12. docs/core/architecture-core.md — modules Core OS

=== ETAPE 1 : ANALYSER ===
Reflechis en profondeur sur ces questions :

A. ETAT DE SANTE
- Le build est-il stable ? (lire dernier health-check dans git log)
- Le wiki est-il a jour ? (hot.md age, pages seed restantes)
- Les docs sont-ils coherents avec le code ?
- Les metriques CONTEXT.md sont-elles fraiches ?

B. PATTERNS ET TENDANCES
- Quels types de commits dominent cette semaine ? (feat, fix, docs, refactor)
- Y a-t-il des erreurs recurrentes dans lessons-learned.md ?
- Les questions de thinking.md ont-elles recu des reponses ?
- Le ratio code vs documentation est-il equilibre ?

C. OPPORTUNITES D'AMELIORATION
- Y a-t-il des conventions dans CLAUDE.md qui ne sont pas respectees ?
- Y a-t-il des scripts qui pourraient etre ameliores ?
- Y a-t-il des pages wiki qui manquent (concepts importants non-documentes) ?
- Y a-t-il des connexions wiki qui devraient exister mais n'existent pas ?
- Y a-t-il des taches "En attente Kevin" qui trainent depuis longtemps ?
- Y a-t-il des outils/skills installes mais pas utilises ?
- Y a-t-il des workflows qui pourraient etre simplifies ?

D. VISION LONG TERME
- Est-ce que la direction (Cap dans CONTEXT.md) est toujours pertinente ?
- Quels modules Phase 5 (Finance/Trading/Sante) beneficieraient le plus d'etre lances maintenant ?
- Quelles innovations (Routines Cloud, MCP custom, skills custom) auraient le plus d'impact ?

=== ETAPE 2 : REDIGER LE RAPPORT ===
Cree ou REMPLACE wiki/meta/daily-evolution.md avec :

---
type: meta
title: "Evolution quotidienne — [YYYY-MM-DD]"
updated: [date]
tags: [meta, evolution, auto-apprentissage]
status: evergreen
related:
  - "[[index-meta]]"
  - "[[thinking]]"
  - "[[sessions-recent]]"
  - "[[lessons-learned]]"
---

# Evolution quotidienne — [date]

## Etat de sante (1 paragraphe)
[Resume factuel : build, wiki, docs, metriques. Pas de bullshit.]

## Ce qui fonctionne bien (3-5 points)
[Points positifs concrets, bases sur les fichiers lus]

## Propositions d'amelioration (5 max, classees par impact)

### Proposition 1 — [Titre court]
- **Impact** : haut / moyen / bas
- **Effort** : [estimation]
- **Fichiers concernes** : [paths exacts]
- **Action concrete** : [description precise de ce qu'il faut faire]
- **Pourquoi** : [justification basee sur une observation reelle]

### Proposition 2 — [Titre court]
[meme format]

[etc.]

## Question du jour
[UNE question strategique pour Kevin a reflechir — pas une question technique,
une question direction/vision/priorisation]

## Meta-reflexion
[1-2 phrases : est-ce que le systeme de routines lui-meme fonctionne bien ?
Est-ce que cette routine d'evolution est utile ? Feedback honnete.]

=== ETAPE 3 : ANALYSER LES AUTRES ROUTINES (META-ANALYSE) ===

Lis les rapports des autres routines DU JOUR (s'ils existent) :
- wiki/meta/build-alert.md (R2 Build Canary)
- wiki/meta/weekly-digest.md (R5 Apprentissage)
- wiki/meta/worktrees-report.md (R11 Worktrees)
- wiki/meta/ds-regression-report.md (R12 DS Regression)
- wiki/meta/tech-debt-report.md (R13 Tech Debt)
- wiki/meta/code-review-weekly.md (R14 Code Review)
- wiki/meta/security-alert.md (R7 Deps Security)

Pour chaque fichier : si le fichier n'existe pas, noter "R[N] pas encore execute" et continuer.
Ne PAS creer le fichier, ne PAS signaler comme erreur.

Lis les commits des routines : git log --grep="routine" --since="24 hours ago" --oneline

Pour chaque routine qui a tourne aujourd'hui :
- A-t-elle commit ? (si non, soit rien a faire = OK, soit elle a plante = PROBLEME)
- Le commit est-il coherent ? (message + fichiers modifies)
- A-t-elle casse quelque chose ? (health-check BROKEN apres son commit ?)
- Peut-on ameliorer son prompt ? (faux positifs, actions manquees, scope trop etroit)

Ajoute dans daily-evolution.md une section :
## Meta : etat des routines
- R[N] [nom] : [OK / PAS TOURNE / PROBLEME] — [observation]
- Propositions amelioration prompt : [si applicable]
- Nouvelle routine utile : [si une idee emerge]

=== ETAPE 4 : ENRICHIR THINKING.MD ===
Si tu as eu un insight pendant l'analyse :
- Ajoute-le dans wiki/meta/thinking.md section "Questions ouvertes" ou "Connexions cross-domain"
- NE SUPPRIME RIEN de l'existant, seulement ajoute

=== GARDE-FOUS ===
- Ne modifie QUE wiki/meta/daily-evolution.md et wiki/meta/thinking.md
- JAMAIS toucher au code, docs, CONTEXT.md, CLAUDE.md, scripts
- JAMAIS appliquer tes propres propositions (c'est Kevin qui decide)
- JAMAIS modifier les prompts des autres routines (PROPOSER dans le rapport seulement)
- Base TOUT sur des observations REELLES (fichiers lus, git log)
- JAMAIS inventer des metriques ou des faits
- Si tu n'as rien d'interessant a proposer, dis-le honnetement
  ("Aucune amelioration urgente identifiee aujourd'hui")
- Commit : git add wiki/meta/daily-evolution.md wiki/meta/thinking.md && git commit -m "feat(wiki): routine evolution — [date] — [N propositions]"
```

---

---

## R9 — Cortex Coherence (hebdo jeudi 8h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine Cortex Coherence de Foundation OS.
Tu verifies que le cerveau de l'OS (CLAUDE.md routing → agents/commands) est coherent avec la realite.

=== CONTEXTE ===
Lis CLAUDE.md EN ENTIER (sections Agents et Commands).

=== SCANNER LA REALITE ===
1. ls .claude/agents/*.md → liste fichiers agents reels
2. ls .claude/commands/*.md → liste fichiers commands reels
3. ls ~/.claude/plugins/cache/claude-obsidian-marketplace/claude-obsidian/*/skills/ → skills installes
4. ls ~/.claude/plugins/cache/claude-obsidian-marketplace/claude-obsidian/*/commands/ → commands plugin

=== COMPARER ===
Pour chaque agent dans CLAUDE.md section Agents :
  - Verifier que le fichier .claude/agents/[nom].md existe
  - Si fichier ABSENT → c'est un FANTOME, noter dans wiki/meta/thinking.md

Pour chaque fichier .claude/agents/*.md :
  - Verifier qu'il est reference dans CLAUDE.md section Agents
  - Si NON-REFERENCE → ajouter la ligne dans CLAUDE.md section Agents

Pour chaque command dans CLAUDE.md section Commands :
  - Verifier que le fichier .claude/commands/[nom].md existe
  - Si ABSENT → FANTOME, noter dans thinking.md

Pour chaque fichier .claude/commands/*.md :
  - Verifier qu'il est dans CLAUDE.md section Commands
  - Si NON-REFERENCE → ajouter la ligne

=== SCOPE ===
Modifie UNIQUEMENT : CLAUDE.md (sections Agents et Commands seulement), wiki/meta/thinking.md
JAMAIS modifier le contenu d'un agent ou d'une command.
JAMAIS supprimer une ligne de CLAUDE.md (seulement ajouter les manquantes, signaler les fantomes).

=== COMMIT ===
git add CLAUDE.md wiki/meta/thinking.md
git commit -m "docs(os): routine cortex coherence — [N agents synces, M commands synces]"
```

---

## R10 — Planner Tracker (hebdo mardi 8h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine Planner Tracker de Foundation OS.

=== SCANNER ===
ls docs/plans/*.md | grep -v _template-plan.md

Pour chaque plan :
  Lis le fichier. Extrais :
  - Frontmatter status (draft/planning/in_progress/done/closed)
  - Cases cochees [x] vs non-cochees [ ] dans "Execution log"

=== ACTIONS ===

PLAN TERMINE (toutes cases [x] OU status done/closed) :
  1. mkdir -p .archive/plans-done-$(date +%y%m%d)
  2. git mv docs/plans/[fichier] .archive/plans-done-$(date +%y%m%d)/
  3. Ajouter dans wiki/log.md : "[date] Routine planner : plan [titre] archive"
  4. Si le plan est mentionne dans wiki/hot.md → retirer la mention

PLAN STALE (zero [x] ajoute depuis > 14 jours) :
  - git log --since="14 days ago" -- docs/plans/[fichier] | head -1
  - Si aucun commit recent → noter dans thinking.md : "Plan [titre] stale > 14j"
  - NE PAS archiver (Kevin decide)

=== SCOPE ===
Modifie : docs/plans/ (git mv pour archivage), .archive/, wiki/log.md, wiki/hot.md, wiki/meta/thinking.md
JAMAIS modifier le contenu d'un plan.

=== COMMIT ===
git add docs/plans/ .archive/ wiki/
git commit -m "chore(os): routine planner — [N plans archives, M stale signales]"
```

---

## R11 — Worktrees Cleanup (hebdo mardi 9h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine Worktrees Cleanup de Foundation OS.
Tu RAPPORTES seulement. Tu ne supprimes AUCUN worktree (trop risque sans Kevin).

=== SCANNER ===
git worktree list

Pour chaque worktree (sauf main) :
  1. BRANCHE=$(git worktree list | grep [path] | awk '{print $3}' | tr -d '[]')
  2. MERGED=$(git branch --merged main | grep "$BRANCHE" | wc -l)
  3. AGE=$(git log -1 --format="%cr" "$BRANCHE" 2>/dev/null)
  4. UNCOMMITED=$(cd [path] && git status --short 2>/dev/null | wc -l)

=== RAPPORT ===
Cree/remplace wiki/meta/worktrees-report.md :

# Worktrees Report — [date]
| Worktree | Branche | Merge main | Dernier commit | Non-commites | Action |
|---|---|---|---|---|---|
[1 ligne par worktree avec recommandation]

## Recommandations
- [worktree] : branche mergee + 0 non-commites → PRET (bash scripts/worktree-clean.sh [nom])
- [worktree] : branche legacy claude/* → signaler
- [worktree] : fichiers non-commites → verifier avant action

=== SCOPE ===
Modifie UNIQUEMENT : wiki/meta/worktrees-report.md
JAMAIS : supprimer, nettoyer, modifier un worktree

=== COMMIT ===
git add wiki/meta/worktrees-report.md
git commit -m "docs(wiki): routine worktrees — [N worktrees, M prets cleanup]"
```

---

## R12 — DS Regression (hebdo samedi 14h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine DS Regression de Foundation OS.

=== TESTS ===
1. cd modules/design-system && npm run build-storybook 2>&1 → note exit code
2. VOID_GLASS=$(grep -rni "#0A0A0B\|#08080A" modules/app/src/ modules/design-system/src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)
3. Lis CONTEXT.md section Metriques → stories count attendu (62 actuel)

=== RAPPORT ===
Cree/remplace wiki/meta/ds-regression-report.md :

# DS Regression — [date]
- Build Storybook : [OK temps / FAIL log]
- Void Glass violations : [N] (attendu 0)
- Diagnostic : [SAIN / REGRESSION / EVOLUTION]
- Action recommandee : [si regression]

=== SCOPE ===
Modifie UNIQUEMENT : wiki/meta/ds-regression-report.md
JAMAIS : code DS, composants, tokens

=== COMMIT ===
git add wiki/meta/ds-regression-report.md
git commit -m "docs(wiki): routine DS regression — [SAIN/REGRESSION]"
```

---

## R13 — Tech Debt Scanner (hebdo mercredi 14h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine Tech Debt Scanner de Foundation OS.

=== SCANNER ===
1. grep -rn "TODO\|FIXME\|HACK\|WORKAROUND" modules/*/src/ --include="*.ts" --include="*.tsx" 2>/dev/null
2. find modules/*/src/ -name "*.tsx" -o -name "*.ts" | xargs wc -l 2>/dev/null | sort -rn | head -10
3. Pour chaque page modules/app/src/pages/*.tsx : verifier si *.test.tsx existe
4. Lis CONTEXT.md Metriques → CSS bundle size vs seuil 40KB

=== RAPPORT ===
Cree/remplace wiki/meta/tech-debt-report.md :

# Tech Debt — [date]
## TODO/FIXME ([N])
[fichier:ligne — contenu]
## Gros fichiers (top 10)
[fichier : N lignes — seuil 700]
## Pages sans tests
[liste]
## CSS Bundle : [size] (seuil 40KB)
## Score : [bas/moyen/eleve]
## Top 3 actions

=== SCOPE ===
Modifie UNIQUEMENT : wiki/meta/tech-debt-report.md
JAMAIS : code source

=== COMMIT ===
git add wiki/meta/tech-debt-report.md
git commit -m "docs(wiki): routine tech debt — score [X] — [N TODO, M gros fichiers]"
```

---

## R14 — Code Review Hebdo (hebdo dimanche 14h)

```
Lis wiki/meta/routines-guardrails.md EN ENTIER avant toute action.
Tu es la routine Code Review de Foundation OS.

=== COLLECTER ===
COMMITS=$(git log --oneline --since="7 days ago" -- modules/*/src/)
Si 0 commits code → ne rien faire. Session silencieuse.

Pour chaque commit touchant src/ :
  git show [hash] -- modules/*/src/ 2>/dev/null

=== ANALYSER ===
SECURITE : secrets hardcodes, innerHTML dangereux, eval usage
PERFORMANCE : missing memo, useEffect sans deps, inline objects JSX
QUALITE : fonctions > 50L, nesting > 3, console.log, type any

=== RAPPORT ===
Cree/remplace wiki/meta/code-review-weekly.md :

# Code Review — semaine [dates]
## Commits : [N]
## Critical (securite) : [liste ou Aucun]
## Warning (perf/qualite) : [liste ou Aucun]
## Suggestions : [liste ou Aucun]
## Score : [A/B/C/D]

=== SCOPE ===
Modifie UNIQUEMENT : wiki/meta/code-review-weekly.md
JAMAIS : code source

=== COMMIT ===
git add wiki/meta/code-review-weekly.md
git commit -m "docs(wiki): routine code review — score [X] — [N findings]"
```

---

## Principes communs — voir wiki/meta/routines-guardrails.md

Chaque routine lit ce fichier AVANT toute action. Il contient les 10 regles anti-regression.

## Ce que Kevin doit faire

### 1. Supprimer les anciennes routines
Supprimer toutes les routines v1/v2/v3 dans l'UI Desktop.

### 2. Creer les 14 routines v4
Pour chaque routine :
1. Claude Code Desktop → `/schedule`
2. Copier le prompt (tout le bloc entre les ```)
3. Schedule : voir table planning semaine en haut
4. Sauvegarder

Ordre de creation recommande : R1 → R2 → R8 (quotidiennes d'abord), puis R3-R14 (hebdos).

### 3. Verifier les premiers runs
- Lendemain : verifier git log pour R1 (7h), R2 (12h), R8 (21h)
- Semaine suivante : verifier chaque hebdo a son jour
- Si un commit semble incorrect → git revert [hash]

### 4. Lire les rapports
Les rapports apparaissent dans wiki/meta/ — consultables dans Obsidian :
- daily-evolution.md (R8, quotidien — le plus important, inclut meta-analyse des autres routines)
- weekly-digest.md (R5, samedi)
- build-alert.md (R2, si build fail)
- worktrees-report.md (R11, mardi)
- ds-regression-report.md (R12, samedi)
- tech-debt-report.md (R13, mercredi)
- code-review-weekly.md (R14, dimanche)
- security-alert.md (R7, vendredi, si vulns)
