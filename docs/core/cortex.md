# Cortex — Spec

Module d'intelligence de Foundation OS. Routing, contexte, orchestration.

## 1. Routing — Arbre de decision

### Routing etendu (Tools v2)

Avant la table agents ci-dessous, verifier `docs/core/tools/routing.json` pour un match plus granulaire (35 regles couvrant 109 outils). Si un outil/skill matche → l'utiliser directement. Sinon → fallback sur la table agents.

### Table agents

Quand une tache arrive, Cortex la route vers l'agent adapte.

| Signal dans la tache | Agent | Exemples |
|---------------------|-------|----------|
| architecture, ADR, stack, schema, structurer, option A vs B | os-architect | "Comment structurer finance ?" |
| code, composant, page, Supabase, React, build, scaffold, CSS, Tailwind | dev-agent | "Ajoute un bouton delete" |
| documente, note, trace, journalise, met a jour CONTEXT, met a jour docs | doc-agent | "Mets a jour CONTEXT.md" |
| verifie, audit, check, revue, regression, deployer | review-agent | "Verifie avant commit" |

### Regles de priorite

1. Match explicite → deleguer a l'agent
2. Ambiguite entre agents → demander a Kevin
3. Multi-agent (ex: code puis review) → executer sequentiellement
4. Aucun match → traiter directement sans delegation
5. Tache triviale (< 1 fichier, < 10 lignes) → traiter directement

## 2. Contexte — Protocole CONTEXT.md

### Lecture (session-start)

1. Lire CONTEXT.md entierement
2. Extraire : modules actifs, derniere session, prochaine action, decisions
3. Detecter tous les modules dans modules/ (pas seulement app)
4. Verifier coherence : ce que CONTEXT.md dit vs ce qui existe sur le filesystem

### Mise a jour (session-end)

1. "Sessions recentes" : ajouter en tete, garder max 5, supprimer la plus ancienne
2. "Cap" : remplacer par la suite logique
3. "Modules" : mettre a jour si changement de status
4. "Decisions" : ajouter si nouvelle decision prise
5. "Metriques" : mettre a jour si builds/routes/artifacts changent

### Invariants

- Tout ce qui est dans CONTEXT.md doit etre verifiable par une commande
- Pas de metriques inventees, pas d'estimations optimistes
- Une seule source de verite par information (pas de duplication)

## 3. Commands — Registry

| Command | Quand | Ce qu'elle fait |
|---------|-------|-----------------|
| /session-start | Debut de session | Lire contexte → check structure → build tous modules actifs → annoncer |
| /session-end | Fin de session | Lister changes → coherence → build → update CONTEXT.md → proposer commit |
| /new-project | Creer un module | Scaffold modules/[nom]/ → update CONTEXT.md |
| /sync | Verifier coherence | Structure + refs + CONTEXT.md vs filesystem + Void Glass + MD pairs |

Detail de chaque command : `.claude/commands/<nom>.md` (source unique).

## 4. Agents — Protocole uniforme

Chaque agent suit le meme protocole :

### Entree
- Lire CONTEXT.md pour le contexte global
- Lire les fichiers specifiques a son scope

### Execution
- Appliquer ses regles
- Rester dans son scope (ne pas deborder sur un autre agent)
- Signaler si la tache necessite un autre agent

### Sortie
- Rapporter ce qui a ete fait, format court
- Lister les fichiers crees/modifies
- Signaler les warnings ou decisions prises

### Contraintes communes
- Ne jamais creer de fichier sans demande explicite
- Ne jamais creer de fichier a la racine
- Build verifie avant affirmation de completion
- Conventional commits : type(scope): description

## 5. Limites de Cortex

Ce que Cortex ne gere PAS (delegue aux autres modules Core OS) :
- Persistance inter-session structuree → Communication (docs/core/communication.md)
- Metriques et health checks automatiques → Monitor (docs/core/monitor.md)
- Scripts et automation CLI → Tools (docs/core/tools.md)

Status : les 7 modules Core OS sont actifs depuis 2026-04-07 (Phase 4 Monitoring DONE, Phase 5 Planner, Phase 6 Worktrees, Phase 7 Knowledge).

## Voir aussi

- [[communication]] — module Communication (tiers memoire, brief v12)
- [[monitor]] — module Monitor (health indicators, seuils)
- [[tools]] — module Tools (scripts, CI/CD, catalogue)
- [[knowledge]] — module Knowledge (wiki, neuroplasticite)

## 6. Cockpit — Point d'entree simplifie

Le skill `/cockpit` est un super-pilote optionnel au-dessus de Cortex.

Il automatise le workflow complet : scan → brief v12 → routing → execution → cloture.
Kevin n'a plus a choisir entre /session-start, agents, ou /session-end.

**Coexistence** : les commandes /session-start, /session-end, /sync, /new-project restent intactes et utilisables independamment.

**Routing** : le cockpit utilise la table de routing section 1 (memes signaux, memes agents). La seule difference : le routing est automatique au lieu de manuel.

**Spec complete** : `.archive/specs-done-260417/2026-04-10-cockpit-design.md`
