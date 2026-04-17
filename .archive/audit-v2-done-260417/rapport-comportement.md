---
type: audit-comportement
title: "Mega Audit V2 — Comportement, Intelligence, Organicite, Monitoring"
date: 2026-04-16
model: claude-opus-4-7
scope: "Foundation OS comme cerveau collaboratif Kevin-Claude"
method: "Simulation mentale de scenarios + lecture Core OS + commands + agents"
status: complete
---

# Foundation OS — Audit comportemental reel

> Cet audit evalue **ce que l'OS fait vraiment** quand Kevin et Claude travaillent ensemble. Pas la coherence des fichiers (audit precedent), mais le **fonctionnement cognitif** : est-ce que l'OS est reellement un cerveau, ou est-ce une pile de documents qui se regarde le nombril ?

## Methode

10 scenarios d'usage simules mentalement. Pour chacun : ce qui devrait arriver (spec), ce qui arrive vraiment (comportement observe), gap identifie.

---

## Les 10 scenarios

### S1 — Nouvelle instance Claude au SessionStart (cold start)

**Spec (CLAUDE.md + commands)** : Claude arrive, hook SessionStart tire drift-detector puis `session-start-wiki.sh` qui cat hot.md → je vois immediatement ou on en est.

**Realite** : settings.json SessionStart execute `bash scripts/drift-detector.sh` **directement**, pas le wrapper. Le `session-start-wiki.sh` existe mais n'est jamais invoque. **Consequence** : le cold start Claude NE lit PAS hot.md automatiquement. Il faut que Kevin tape `/cockpit` ou `/session-start` manuellement pour que je lise ma memoire court-terme.

**Verdict** : la promesse "Wiki = cerveau autonome au SessionStart" est **fausse**. Toutes les 3 dernieres sessions, j'ai lu hot.md seulement parce que Kevin a tape une slash-command explicite. Sans ca → onboarding aveugle.

### S2 — Kevin demande un travail ambigu ("on regarde ca ?")

**Spec (Cortex table routing)** : si ambiguite → demander a Kevin (1 question max, regle 2 de Cortex).

**Realite** : aucun mecanisme runtime ne m'oblige a consulter cortex.md table. La table est **documentation descriptive**, pas **enforcement**. En pratique, je fais ce qui me semble raisonnable. Si je consulte la table c'est par discipline cognitive, pas parce que le systeme me le force.

**Verdict** : Cortex est **decoratif**. Le routing effectif depend de ma memoire de CLAUDE.md qui pointe vers cortex.md. Aucun guard-rail runtime.

### S3 — Kevin dit "explique-moi le Void Glass"

**Spec (Reflexe 1 Neuroplasticite)** : `Grep wiki/ Void Glass` avant de repondre → lire `wiki/concepts/Void Glass.md` → citer.

**Realite** : ce reflexe est une regle ecrite dans CLAUDE.md. Aucun hook ne declenche un Grep avant ma reponse. Je peux tres bien repondre "Void Glass c'est dark-only #030303" de memoire sans consulter. **La page wiki/concepts/Void Glass.md existe mais rien ne garantit qu'elle est lue.**

**Verdict** : la neuroplasticite est **aspirationnelle**, pas **operationnelle**. Les 4 reflexes sont des rappels, pas des garde-fous executables.

### S4 — Je fais une erreur, Kevin me corrige

**Spec (Reflexe 3 Neuroplasticite)** : j'append l'erreur dans `wiki/meta/lessons-learned.md`.

**Realite** : ca fonctionne... quand je m'en souviens. Il n'y a aucun trigger apres une correction Kevin. Le taux de capture depend de ma discipline dans la conversation. **Dans cette session precedente, j'ai commis l'erreur d'avoir mal cadre l'audit — ai-je ajoute ca dans lessons-learned ? Non.**

**Verdict** : la boucle d'apprentissage ne se ferme pas. Les lecons s'accumulent pour les erreurs que je note, mais je peux oublier des lecons majeures sans que le systeme s'en apercoive.

### S5 — Session longue, contexte imminent a se compacter

**Spec (hooks knowledge.md)** : PostCompact hook cat hot.md pour restaurer le contexte.

**Realite** : je grep `PostCompact` dans `.claude/settings.json` → **absent**. Le hook est documente mais non configure. Si compactage survient, rien n'est re-injecte automatiquement.

**Verdict** : resilience au compactage = promesse non tenue. Apres compactage, je perds le contexte flash.

### S6 — Kevin lance `/plan-os "X"`

**Spec** : Tour 1 `EnterPlanMode()` — active plan window Desktop IMMEDIATEMENT, pas de texte chat avant.

**Realite** : fonctionne quand /plan-os est invoque dans le contexte principal. **MAIS** : EnterPlanMode est un tool deferred (pas toujours charge). Si je ne le pre-charge pas avec ToolSearch, le Tour 1 echoue avec InputValidationError. Aucune instruction dans plan-os.md ne dit "pre-charge EnterPlanMode si deferred".

**Verdict** : fragile sur les nouvelles instances / sessions fraiches. Depend de l'etat du tool catalog.

### S7 — 2 worktrees actifs (Kevin bosse main, Claude bosse worktree)

**Spec** : `session-lock.sh` protege les ecritures croisees (TTL 30min key=value).

**Realite** : `session-lock.sh` est **orphelin** (zero invocation nulle part). La protection anti-collision annoncee dans CLAUDE.md "Routines Cloud Max 15/jour" n'a aucun mecanisme d'application. Si 2 Claude ecrivent en meme temps → race condition possible.

**Verdict** : la promesse "safe parallelism" est fiction. Heureusement Kevin n'a pas encore active les 14 routines, donc le probleme ne s'est pas encore manifeste.

### S8 — Kevin demande "est-ce que j'ai deja bosse sur X ?"

**Spec (wiki-query skill)** : le skill search multi-depth dans le vault.

**Realite** : le skill existe mais je n'ai pas de trigger automatique. Quand Kevin pose la question, je dois me souvenir que wiki-query existe. Sinon je fais du `grep` manuel moins efficace.

**Verdict** : le skill est un outil non-route. Cortex table n'a pas de regle "question historique → wiki-query".

### S9 — Kevin me partage un article URL/PDF

**Spec (CLAUDE.md + wiki-ingest skill)** : "Wiki = cerveau autonome, utiliser en autonomie sans attendre Kevin".

**Realite** : ca fonctionne si je m'en souviens. Il n'y a pas de detection automatique "URL detectee → propose wiki-ingest". C'est 100% manuel de ma part.

**Verdict** : autonomie aspirationnelle. Les sources s'ingestent seulement si Kevin rappelle OU si je m'en souviens.

### S10 — Un drift apparait (CONTEXT.md desync filesystem, wiki counts divergent, etc.)

**Spec (drift-detector + docs-sync-check)** : scripts detectent les drifts et les affichent au SessionStart.

**Realite** : les scripts detectent. **Personne ne fixe**. J'affiche un warning "DRIFT" au SessionStart et on continue. Kevin doit se souvenir de fixer. Il y a des drifts depuis **plusieurs jours** (CSS 40/65, registry v11, counts wiki 41/36/43) qu'aucun mecanisme n'a rattrape.

**Verdict** : l'OS detecte mais ne se repare pas. Aucune boucle auto-correction.

---

## Les 20 findings comportementaux (ce qui ne marche pas vraiment)

### INTELLIGENCE

### C-01 · Intelligence REACTIVE, pas PROACTIVE
L'OS ne fait RIEN par lui-meme. Les 14 routines Cloud "autonomes" annoncees dans `wiki/meta/routines-setup.md` (860L) ne sont **pas creees** (CONTEXT.md "Kevin doit creer dans UI Desktop"). La promesse autonomie = fiction actuellement. Sans les routines, Foundation OS ne vit que quand Kevin invoque une slash-command.

### C-02 · Routing Cortex est DECORATIF
La table routing (cortex.md section 1) decrit "code → dev-agent, architecture → os-architect". Aucun mecanisme runtime ne m'oblige a consulter cette table. En pratique j'improvise. Les 4 agents sont des **fichiers markdown**, pas des runtime guards. Dans les 5 dernieres sessions, combien de fois ai-je vraiment delegue a dev-agent ou os-architect ? Quasi zero. J'ai tout fait direct.

### C-03 · Neuroplasticite MANUELLE
Les 4 reflexes (recall, consolidation, lessons, self-check) sont des regles ecrites. Aucun hook ne les declenche. Ils dependent de ma discipline cognitive session par session. Si je compacte ou demarrage froid, j'oublie. **Symptomatique** : cette session, j'ai mal cadre l'audit — aucune entree dans lessons-learned a ete ajoutee automatiquement.

### C-04 · Pas de detection "je vais bientot etre compacte"
Aucun mecanisme qui m'avertit "il te reste 10% de context". Aucun auto-save preventif. Le PostCompact hook qui devrait re-injecter hot.md n'est pas configure dans settings.json.

### C-05 · Les suggestions proactives n'existent pas
Le brief v12 donne 14 sections d'etat. Jamais de "Claude recommande X" ou "je detecte un pattern Y, on devrait Z". C'est un monitor passif. Un cerveau fait des suggestions. Cet OS fait uniquement du reporting.

### COMPORTEMENT / AUTOMATION

### C-06 · Hook SessionStart ne lit pas wiki/hot.md
Deja identifie Agent 2 F-02 dans l'audit precedent. Confirme : la chaine `drift-detector → hot.md` documentee dans knowledge.md est cassee. settings.json appelle drift-detector direct.

### C-07 · Archivage auto-plans = code mort
settings.json SessionEnd → `auto-archive-plans.sh`. Fonctionne OK. MAIS actuellement 0 plan actif, donc 0 chose a archiver. Le hook tourne a vide depuis plusieurs sessions. Pas mortel, juste inutile tant que les plans ne vivent pas regulierement.

### C-08 · Brief v12 = monolithe non-adaptatif
Chaque session, 14 tuiles meme si Kevin veut juste une info. Pas de "mode minimal". Pas de contextual (brief different si post-commit vs post-audit vs debut de chantier). Le brief devrait adapter sa forme au contexte.

### C-09 · Les 14 routines Cloud sont documentees mais inertes
`wiki/meta/routines-setup.md` = 860L de prompts tres detailles. **Kevin doit les creer une par une dans l'UI Desktop**. Ca n'a pas ete fait depuis 2 sessions. Probleme de friction creation. La documentation n'est pas executable.

### C-10 · Pas de recurrence "lessons-learned consultees avant action"
Les lecons s'accumulent mais rien ne garantit que je les consulte. Si "wikilinks ../ ne marchent pas" est liste, je peux quand meme en recreer. Aucune verification automatique au moment de l'action.

### ORGANICITE / AUTO-REPARATION

### C-11 · Detection drift sans auto-fix
drift-detector detecte. Personne ne fixe. Kevin voit un warning et doit agir manuellement. Aucun `--fix` qui corrige les drifts identifies (counts wiki, CSS seuils, v11/v12).

### C-12 · Les 5 tiers memoire ne sont pas enforces
"Une info = un tier" est une **regle ecrite**. Aucun script ne verifie. Les duplications CLAUDE.md ↔ auto-memory decouvertes dans audit precedent prouvent que la regle n'est pas tenue. Le systeme fait confiance a la discipline.

### C-13 · Pas de garbage collection knowledge
Le wiki grandit sans se structurer. Pas de detection "3 sources parlent de X, cree un concept". Pas de suggestion "ces 2 pages sont similaires, fusionner ?". Wiki-lint skill existe mais personne ne l'invoque regulierement.

### C-14 · CONTEXT.md n'auto-compresse pas
Quand CONTEXT.md depasse 200L, drift-detector warn. Mais personne ne compresse. Les sessions s'accumulent jusqu'a ce que Kevin tape /session-end qui trim manuellement.

### C-15 · Les agents n'ont pas de guards reels
dev-agent dit "hors scope : architecture → os-architect". Aucun mecanisme bloque un dev-agent qui modifie docs/architecture.md. C'est de l'auto-discipline, pas de l'enforcement.

### MONITORING REEL

### C-16 · Health-check audite la forme, pas la fonction
Mesures actuelles : build OK, tests 19/19, refs intactes, CSS < 65KB. **Jamais** : est-ce que Claude a consulte le wiki avant de repondre aux questions techniques ? Les 4 reflexes ont ete appliques combien de fois cette semaine ? Les lessons-learned capturent-elles les vraies erreurs ? Les sessions-recent evoluent-elles en qualite ? Aucun KPI cognitif.

### C-17 · Pas d'analytics sur les ~71 sessions `.omc/sessions/`
Foundation OS a les transcripts complets de 71 sessions dans `.omc/sessions/`. **Rien ne les analyse**. On pourrait extraire :
- Patterns de demandes Kevin
- Friction points recurrents
- Mots que Kevin utilise (lexique projet)
- Ratios plans commences/termines
- Temps moyen par type de tache

**Gold mine laissee au sol.**

### C-18 · Foundation OS ne se mesure pas lui-meme
Aucune metrique d'efficacite collaboration :
- Input tokens Kevin moyens par session
- Rework ratio (tache refaite 2 fois)
- Session DONE vs BLOCKED ratio
- Temps reponse brief v12
- Plans moyennement lent / rapide

**L'OS ne sait pas si il est efficace.**

### C-19 · Pas de feedback loop "c'etait utile ?"
Kevin n'indique jamais "cette session a bien marche / mal marche". Pas de rating, pas de tag session. Le system ne sait pas distinguer une session productive d'une session frustrante.

### C-20 · Pattern Karpathy superficiel
"Compounding Knowledge" est cite partout. Mais les 48 pages wiki contiennent 14 meta (29%), 7 index (15%), 5 templates (10%). **Seulement 11 concepts + 5 entities + 4 sources = 20 pages de "vrai contenu compressed knowledge" sur 48 (42%)**. Le reste est squelette. Le pattern ne peut pas "compounder" sur 20 pages. Il faudrait 100+.

---

## Ce qui MARCHE cognitivement

Honnetement :

### H-01 · Brief v12 = scan TDAH efficace
14 tuiles, emojis, tables. Kevin scanne en 30s. Format robuste. Meilleure innovation OS.

### H-02 · 5 tiers memoire = modele mental clair
CONTEXT.md operationnel, auto-memory comportement, docs/ specs, wiki/ knowledge. Chaque tier a sa place. Bien pense.

### H-03 · /cockpit comme super-pilote
Un seul appel pour tout faire (scan + brief + route + execute + cloture). TDAH-friendly. Fonctionnel.

### H-04 · Conventions nommage (D-NAMING-01/02)
Branches `wt/<desc>-<yymmdd>`, sessions `🪐 (DD-MM-YYYY)`, plans `docs/plans/YYYY-MM-DD-<slug>.md`. Stable et applique par /wt + /plan-os.

### H-05 · Neuroplasticite (quand je m'en souviens) = productive
Ecrire dans lessons-learned, thinking, sessions-recent donne de la compoundabilite. Les sessions recentes sont lisibles. Les lecons evitent des pieges connus (wikilinks ../, hidden folders Obsidian).

### H-06 · Worktrees workflow
`/wt new|clean` + scripts = isolation propre pour chantiers risques. Bien integre avec /cockpit brief.

### H-07 · Wiki Karpathy pattern = bon fondation
Meme si le volume est bas, la structure (concepts / entities / sources / questions / comparisons) est correcte. Quand le volume montera (Phase 5), le pattern va tenir.

### H-08 · Anti-bullshit gates (mots interdits, pas de $XB, pas de "revolution")
Regles claires dans CLAUDE.md. Fonctionnent **quand je les respecte**. Cette session tu m'as pris en flagrant delit de non-respect (survendre les findings) — mais la regle existe et tu as pu la brandir.

---

## Les 10 innovations QUI RENDRAIENT L'OS VRAIMENT INTELLIGENT

Pas "nettoyer les duplications" — ca c'est l'audit precedent. **Vraies innovations cognitives** :

### I-01 · Hook PreToolUse qui Grep le wiki avant chaque reponse technique
Forcer reflexe 1. Si la reponse touche a un domaine couvert (design, dev, trading, etc.), le hook tire un grep wiki/ et injecte les resultats dans mon contexte. **La neuroplasticite devient involontaire, pas volontaire.**

### I-02 · Session transcript analyzer (`scripts/sessions-analyze.sh`)
Parser les 71 sessions dans `.omc/sessions/` pour extraire patterns, friction, lexique, rework ratio. Output : `wiki/meta/session-patterns.md` mis a jour hebdo. **L'OS s'auto-observe.**

### I-03 · Brief v12 adaptatif
3 modes selon contexte :
- **Minimal** (post-commit, pas de changement significatif) : 3 tuiles
- **Standard** (session normale) : 14 tuiles
- **Deep** (post-audit, post-plan, reprise longue) : 14 + tuile supplementaire "Propositions Claude"
Le mode est choisi automatiquement selon git log + date derniere session + drift-detector.

### I-04 · Proposition proactive dans brief
Ajouter tuile #15 optionnelle : "🤖 Propositions Claude" qui cite 1-3 actions recommandees basees sur le contexte (drift detecte, pattern recurrent, idee en parking > 7j). Forcer l'OS a proposer, pas juste rapporter.

### I-05 · Enforcement runtime du routing Cortex
Hook PostToolUse qui detecte quand je fais un Write/Edit sur un fichier et check contre la table Cortex. Si le fichier est "code React" et je n'ai pas invoque dev-agent → warning. **Cortex devient executable, pas decoratif.**

### I-06 · Contradiction detector
Script qui compare CLAUDE.md ↔ auto-memory ↔ docs/core ↔ CONTEXT.md pour detecter les duplications directes (meme phrase dans 2 tiers). Hook SessionStart affiche "3 duplications detectees, lesquelles garder ?". **Le systeme force l'application de "une info = un tier".**

### I-07 · Self-diagnostic "Claude a-t-il respecte les reflexes cette session ?"
Compteur a chaque session :
- Nombre de Grep wiki/ avant reponses techniques (reflexe 1)
- Nombre d'entrees ajoutees lessons-learned (reflexe 3)
- Nombre de pages enrichies post-ingest (reflexe 2)
- Update sessions-recent/thinking/hot.md (reflexe 4)

Output dans brief v12 tuile Sante : "Neuroplasticite cette semaine : 40%". **L'OS note son propre score.**

### I-08 · Routines Cloud executables comme scripts (pas Desktop UI)
Actuellement les 14 routines attendent que Kevin les cree dans UI Desktop. Migrer vers `.github/workflows/routines/` avec cron GitHub Actions. Plus besoin d'UI Desktop, plus de friction creation. Les routines tournent vraiment.

### I-09 · Memory auto-priorisation
Ajouter `last_used: YYYY-MM-DD` dans frontmatter auto-memory. Script mensuel qui trie par usage. Les memoires non-lues depuis 30j → deprecated. Les memoires lues tous les jours → priorite 1. **Le systeme gere sa propre charge cognitive.**

### I-10 · Feedback loop post-session
Ajouter 1 ligne a /session-end : "Cette session a bien marche ? [Y/N/partial]". Stocker dans `.omc/sessions/<id>/rating.txt`. Apres 10 sessions, analyser les patterns des N. **L'OS apprend de la satisfaction Kevin.**

---

## Verdict honnete

Foundation OS aujourd'hui =  **bonne fondation architecturale** + **brief v12 efficace** + **conventions solides** + **wiki structure prete a compound**. 

MAIS : **faible intelligence runtime**. Le systeme est une **pile de rituels manuels** qu'il faut invoquer. Les promesses "autonomie", "neuroplasticite", "cerveau qui apprend" sont **aspirationnelles**, pas operationnelles aujourd'hui.

L'OS est un **squelette rigoureux sans systeme nerveux**. Les modules Core OS decrivent parfaitement la structure. Les agents, hooks, reflexes decrivent parfaitement le comportement souhaite. Aucun de ces elements ne s'active par lui-meme au moment necessaire.

**Pour que Foundation OS devienne vraiment intelligent**, il faut passer de **documentation → enforcement**. Les 10 innovations ci-dessus sont concretes et faisables. Priorite :

1. **I-08** (routines en GitHub Actions) — retire friction Kevin, active l'autonomie
2. **I-02** (session analyzer) — exploite les 71 transcripts inutiles
3. **I-01** (hook grep wiki) — force le reflexe 1
4. **I-04** (proposition proactive dans brief) — l'OS devient cerveau, pas monitor
5. **I-07** (self-diagnostic neuroplasticite) — l'OS mesure son comportement
6. **I-05** (enforcement routing) — cortex devient executable
7. **I-09** (memory auto-prioritisation) — hygiene cognitive
8. **I-06** (contradiction detector) — enforcement "une info = un tier"
9. **I-10** (feedback loop) — satisfaction Kevin mesurable
10. **I-03** (brief adaptatif) — nice-to-have apres les 9 autres

**Avec ces 10 innovations**, Foundation OS passe de "bonne documentation et rituels manuels" a "systeme cognitif auto-observant". C'est ce que tu as demande initialement dans le mot "comportement + organicite + intelligence".

---

## Ce que je n'ai PAS audite (transparence)

- L'efficacite UX des commands en live (chrome-devtools test)
- Les scenarios d'erreur production (crash Supabase, token invalide, etc.)
- La courbe d'apprentissage pour un nouveau user (toi Kevin a 6 mois de pratique)
- La performance des sous-agents en cascade (lag, rework)
- L'interaction avec les plugins tiers (OMC, Superpowers, claude-obsidian) en profondeur

Ces audits sont des **autres exercices**. Celui-ci est : **est-ce que l'OS fonctionne comme un cerveau collaboratif** ? Reponse : **pas encore**, mais les fondations sont la.
