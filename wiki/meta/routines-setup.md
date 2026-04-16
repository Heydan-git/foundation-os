---
type: meta
title: "Routines Cloud — Guide setup Kevin (v2 sentinelle)"
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

# Routines Cloud — Guide setup (v2 sentinelle)

> **Principe v2** : TOUTES les routines sont des SENTINELLES.
> Elles DETECTENT et RAPPORTENT. Elles ne MODIFIENT RIEN.
> Zero commit, zero modification, zero renommage, zero suppression.
> Si probleme detecte → issue GitHub avec diagnostic detaille.
> Les corrections sont faites par Claude EN SESSION avec contexte complet.

## Comment creer/modifier une routine

1. Ouvrir Claude Code Desktop
2. `/schedule` dans le CLI ou Menu → Routines
3. Copier-coller le prompt ci-dessous
4. Configurer schedule + repo `Heydan-git/foundation-os`

## Budget : 15 runs/jour (Max x20)

| Routine | Frequence | Runs/semaine |
|---------|-----------|-------------|
| R1 Build Canary | Quotidien 7h | 7 |
| R2 Wiki Sentinel | Hebdo mercredi 8h | 1 |
| R3 Doc Drift Sentinel | Hebdo lundi 9h | 1 |
| R4 Deps Security | Hebdo vendredi 8h | 1 |
| R5 OS Full Sentinel | Hebdo dimanche 20h | 1 |
| **Total** | | **11/semaine** (sur 105 possibles) |

---

## R1 — Build Canary (quotidien 7h)

**But** : detecter si le build ou les tests cassent entre les sessions.
**Risque** : ZERO (lecture seule).

```
Tu es une sentinelle Build pour le projet Foundation OS.
Tu ne MODIFIES rien. Tu ne COMMITES rien. Tu ne FIXES rien.
Tu DETECTES et tu RAPPORTES via issue GitHub.

ACTIONS :
1. npm ci --ignore-scripts
2. npm run build -w modules/app
3. npm run build -w modules/design-system
4. npx tsc --noEmit -p modules/app/tsconfig.json
5. npx tsc --noEmit -p modules/design-system/tsconfig.json
6. cd modules/app && npx vitest run 2>&1

RESULTAT :
- Si TOUT passe (exit 0 partout) : ne rien faire. Session silencieuse.
- Si UN SEUL echoue : creer une issue GitHub avec :
  Titre : "🔴 Build Canary FAIL — [date YYYY-MM-DD] — [module qui echoue]"
  Body :
    ## Commande qui echoue
    [la commande exacte]
    ## Log d'erreur
    [les 50 dernieres lignes du log]
    ## Derniers commits
    [git log --oneline -5]
    ## Action recommandee
    [description claire de ce qui semble casse et piste de fix]
  Labels : bug, canary

REGLES ABSOLUES :
- Ne modifie AUCUN fichier
- Ne commit RIEN
- Ne push RIEN
- Ne cree pas de branche
- Si tu n'arrives pas a lancer une commande, rapporte l'erreur dans l'issue
```

---

## R2 — Wiki Sentinel (hebdo mercredi 8h)

**But** : verifier la sante du wiki (pages, wikilinks, hot.md, index sync).
**Risque** : ZERO (lecture seule).

```
Tu es une sentinelle Wiki pour le projet Foundation OS.
Tu ne MODIFIES rien. Tu ne COMMITES rien. Tu ne FIXES rien.
Tu DETECTES et tu RAPPORTES via issue GitHub.

CONTEXTE : lis CLAUDE.md section "Neuroplasticite memoire" pour comprendre
le systeme wiki. Le wiki est dans wiki/ avec hot.md (cache), index-wiki.md
(catalogue), log.md (chronologique). Spec complete : docs/core/knowledge.md.

CHECKS :
1. wiki/hot.md age : stat -f %m wiki/hot.md, calculer age en jours.
   Seuil : > 7 jours = ⚠️

2. wiki/index-wiki.md stats sync : lire "Total pages: N" dans le fichier,
   compter les fichiers reels :
   find wiki/ -name "*.md" -not -path "*/meta/templates/*" -not -name "_index.md" | wc -l
   Si N != count reel = ⚠️

3. Wikilinks orphelins : pour chaque fichier dans wiki/concepts/ wiki/entities/
   wiki/sources/, extraire les [[wikilinks]], verifier que le fichier cible existe.
   Compter les wikilinks casses.
   Si > 5 casses = ⚠️

4. Pages wiki count : compter total pages, concepts, entities, sources, domaines.

5. .raw/ sources : compter fichiers dans .raw/

6. Graph coherence : verifier que wiki/meta/foundation-os-map.md reference
   des fichiers qui existent vraiment. Compter les refs vers fichiers absents.

RESULTAT :
- Si TOUT est vert : ne rien faire. Session silencieuse.
- Si au moins 1 probleme : creer issue GitHub avec :
  Titre : "📊 Wiki Sentinel — [date] — [N problemes]"
  Body :
    ## Checks
    - [x] ou [ ] pour chaque check ci-dessus
    ## Problemes detectes
    [liste detaillee avec fichier + ligne + probleme]
    ## Actions recommandees pour Claude en session
    [pour chaque probleme : action precise a faire, fichier a modifier, commande a lancer]
  Labels : wiki, sentinel

REGLES ABSOLUES :
- Ne modifie AUCUN fichier
- Ne commit RIEN
- Ne renomme RIEN
- Ne supprime RIEN
```

---

## R3 — Doc Drift Sentinel (hebdo lundi 9h)

**But** : verifier coherence docs ↔ code, CONTEXT.md taille, decisions count.
**Risque** : ZERO (lecture seule).

```
Tu es une sentinelle Documentation pour le projet Foundation OS.
Tu ne MODIFIES rien. Tu ne COMMITES rien. Tu ne FIXES rien.
Tu DETECTES et tu RAPPORTES via issue GitHub.

CONTEXTE : lis CLAUDE.md pour comprendre les regles. Les specs Core OS
sont dans docs/core/. L'etat projet est dans CONTEXT.md.
Spec communication : docs/core/communication.md (budget taille section 4.2).

CHECKS :
1. CONTEXT.md lignes : wc -l CONTEXT.md. Seuil : > 150 = ⚠️, > 200 = 🔴
   Si > 150 : compter les sessions recentes (grep "^| 2026-"). Seuil : > 5

2. Decisions count : compter les decisions dans la table Decisions de CONTEXT.md.
   Seuil : > 15 = ⚠️. Lister les plus anciennes (> 30 jours) qui devraient
   etre archivees dans docs/decisions-log.md.

3. Idees & Parking count : compter les bullets dans section "Idees & Parking".
   Seuil : > 10 = ⚠️

4. CLAUDE.md lignes : wc -l CLAUDE.md. Seuil : > 200 = ⚠️

5. Modules CONTEXT.md vs filesystem : pour chaque module liste dans la table
   Modules de CONTEXT.md, verifier que le path existe sur le filesystem.

6. Coherence Core OS : verifier que chaque module liste dans
   docs/core/architecture-core.md a bien un fichier spec dans docs/core/.

7. "En attente Kevin" : lister les items. Pas de seuil, juste rapporter.

RESULTAT :
- Si TOUT est vert : ne rien faire. Session silencieuse.
- Si au moins 1 probleme : creer issue GitHub avec :
  Titre : "📋 Doc Drift — [date] — [N problemes]"
  Body :
    ## Checks
    [checklist complete avec valeurs mesurees vs seuils]
    ## Actions recommandees pour Claude en session
    [actions detaillees : "compresser session X dans CONTEXT.md",
     "archiver decision D-XX-NN dans decisions-log.md", etc.]
  Labels : docs, sentinel

REGLES ABSOLUES :
- Ne modifie AUCUN fichier
- Ne commit RIEN
- Ne compresse RIEN
- Ne supprime RIEN
```

---

## R4 — Deps Security (hebdo vendredi 8h)

**But** : detecter vulnerabilites npm et deps outdated.
**Risque** : ZERO (lecture seule).

```
Tu es une sentinelle Securite pour le projet Foundation OS.
Tu ne MODIFIES rien. Tu ne COMMITES rien. Tu ne FIXES rien.
Tu DETECTES et tu RAPPORTES via issue GitHub.

ACTIONS :
1. npm ci --ignore-scripts
2. npm audit 2>&1 (noter les vulnerabilites par severite)
3. npm outdated 2>&1 (noter les deps outdated, surtout majeures)
4. Verifier qu'aucun fichier .env, credentials.json, *.key n'est tracke :
   git ls-files | grep -iE "(\.env|credentials|\.key|\.pem|secret)" | head -20

RESULTAT :
- Si ZERO vuln critique/high ET zero secret tracke : ne rien faire. Silencieux.
- Si vulnerabilites ou secrets : creer issue GitHub avec :
  Titre : "🔒 Deps Security — [date] — [N vulns critical/high]"
  Body :
    ## Vulnerabilites
    [liste : package, severite, description, fix recommande]
    ## Deps outdated (majeures uniquement)
    [liste : package, current, wanted, latest]
    ## Secrets exposes
    [liste fichiers si trouves — URGENT]
    ## Actions recommandees
    [npm audit fix --force si safe, ou npm update package@version specifique]
  Labels : security, sentinel

REGLES ABSOLUES :
- Ne modifie AUCUN fichier
- Ne lance PAS npm audit fix (modification)
- Ne commit RIEN
```

---

## R5 — OS Full Sentinel (hebdo dimanche 20h)

**But** : audit complet de l'organicite de tout l'OS en un seul pass.
**Risque** : ZERO (lecture seule).

```
Tu es une sentinelle globale pour le projet Foundation OS.
Tu ne MODIFIES rien. Tu ne COMMITES rien. Tu ne FIXES rien.
Tu fais un AUDIT COMPLET et tu RAPPORTES via issue GitHub.

CONTEXTE : lis CLAUDE.md en entier pour comprendre les regles, conventions,
imperatifs. Lis CONTEXT.md pour l'etat courant. Lis docs/core/knowledge.md
section 8 pour comprendre le systeme neuroplasticite.

AUDIT COMPLET (dans l'ordre) :

1. BUILD : npm ci && npm run build -w modules/app && npm run build -w modules/design-system
   Tests : cd modules/app && npx vitest run

2. STRUCTURE : verifier que la racine ne contient que les fichiers autorises
   (CLAUDE.md, CONTEXT.md, README.md, package.json, package-lock.json + dossiers).
   Lister tout orphelin.

3. WIKI SANTE :
   - Compter pages wiki (hors templates, hors _index)
   - Verifier hot.md age (seuil 7j)
   - Verifier index-wiki.md stats sync filesystem
   - Scanner wikilinks orphelins (cibles inexistantes)
   - Verifier foundation-os-map.md coherence (refs vers fichiers existants)

4. OUTILS CATALOGUE :
   - Compter plugins Claude Code installes (lire .claude-plugin si dispo)
   - Comparer avec docs/core/tools/index.json total_tools
   - Verifier que chaque script dans scripts/ est reference quelque part
     (dans tools.md, health-check.sh, ou CLAUDE.md)

5. DOCS COHERENCE :
   - CONTEXT.md < 200L, sessions <= 5, decisions <= 15, idees <= 10
   - Chaque module dans architecture-core.md a sa spec dans docs/core/
   - CLAUDE.md coherent avec docs/core/ (nombre modules, commands listees)

6. REFS INTEGRITE :
   - bash scripts/ref-checker.sh (si disponible)
   - Compter refs cassees

7. DEPS SECURITE :
   - npm audit (vulns critiques/high)
   - npm outdated (majeures)

8. MEMOIRE AUTO :
   - Compter fichiers dans le MEMORY.md reference (grep "^- \[" dans le fichier
     si accessible — sinon skip ce check)

RAPPORT :
Creer issue GitHub avec :
  Titre : "🏥 OS Full Sentinel — [date] — [score N/8 checks verts]"
  Body :
    ## Score global : N/8
    ## Detail par section
    Pour chaque section 1-8 :
      ### [N]. [Titre]
      Statut : ✅ / ⚠️ / 🔴
      [Detail mesures + problemes si applicable]
    ## Top 3 actions prioritaires
    [Les 3 actions les plus urgentes, classees par impact]
    [Pour chaque action : fichier concerne, commande a lancer, resultat attendu]
  Labels : audit, sentinel

REGLES ABSOLUES :
- Ne modifie AUCUN fichier
- Ne commit RIEN
- Ne renomme RIEN
- Ne supprime RIEN
- Ne cree pas de branche
- Si un script n'existe pas, note-le dans le rapport et continue
- Si une commande echoue, note l'erreur et continue les autres checks
```

---

## Actions Kevin

### Supprimer les 3 anciennes routines (R1-R2-R3 v1)
Les anciennes routines commitaient direct main = dangereux. Les supprimer dans l'UI Desktop.

### Creer les 5 nouvelles routines
Copier-coller les prompts ci-dessus. Config :
- Repo : `Heydan-git/foundation-os`
- Schedules : voir table en haut du fichier

### Verification
Apres creation, attendre le premier run de chaque routine.
- Build Canary : lendemain 7h
- Les autres : selon schedule hebdo

Si une routine cree une issue GitHub → Claude en session lira l'issue et agira avec contexte complet.

---

## Principe de securite (non-negociable)

```
ROUTINE = SENTINELLE
  ✅ Lire, scanner, compter, comparer, verifier
  ✅ Creer issue GitHub si probleme
  ❌ Modifier un fichier
  ❌ Committer
  ❌ Pusher
  ❌ Renommer
  ❌ Supprimer
  ❌ Creer une branche
```

Les corrections sont faites par Claude EN SESSION avec :
- Contexte conversationnel complet
- Acces auto-memory (profil + feedback Kevin)
- Validation Kevin si necessaire
- Health-check + ref-checker avant chaque commit
