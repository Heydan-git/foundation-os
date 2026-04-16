# Plan Dashboard Monitoring — Index

Plan complet pour le dashboard de monitoring de Foundation OS.
Produit par Cowork le 2026-04-13 a la demande de Kevin.

## Fichiers

### Cadre et vision
- `00-INDEX.md` — ce sommaire
- `01-vision-et-cartographie.md` — vision, philosophie, inventaire exhaustif de tout ce qui est monitorable
- `02-architecture-navigation.md` — arborescence complete des pages, structure de navigation, layout
- `03-pages-detail.md` — specification detaillee de chaque page (contenu, composants, sources de donnees)
- `04-donnees-et-liaisons.md` — modele de donnees, integration session-start/session-end, sources
- `05-ux-et-design-system.md` — principles UX, integration Void Glass, composants cles, interactions
- `06-plan-execution.md` — phases de construction, blocs, dependances, estimation, gates Kevin

### Approfondissements
- `07-features-avancees.md` — features innovantes, assistant contextuel, workflows avances, v1/v2/v3
- `08-ux-ergonomie-a11y.md` — heuristiques Nielsen, lois UX, WCAG 2.2 AA, parcours, hierarchie info
- `09-dynamisme-auto-sync.md` — le dashboard vivant : auto-sync, conventions, event bus, zero overhead
- `10-motion-microcopy-details.md` — tokens motion, catalogue animations, bibliotheque microcopy complete
- `11-tech-data-qa-security.md` — architecture tech, types TS, data, CI/CD, securite, tests
- `12-roadmap-metrics-futur.md` — roadmap Now/Next/Later, OKRs, metriques succes, sunset strategy
- `13-gouvernance-design-system.md` — contrainte 100% DS Void Glass, process nouveau composant, Supernova + Storybook
- `14-plan-execution-consolide.md` — **source de verite CLI** : sequence d'execution fusionnee (40 blocs 06 + 6 blocs 09 §11 + 9 blocs 13 §8 = 52 blocs, gates G1/G2 arbitres)

## Contexte

Kevin veut un dashboard qui :

1. Monitore la totalite de l'OS (modules, Core OS, skills, plugins, outils, memoire, DS...)
2. Serve d'interface de communication visuelle entre Kevin et Claude
3. Permette de capturer des idees, prendre des notes, creer des bases de modules
4. Affiche les plans (realises, en cours, a venir) avec suivi
5. Integre les specs, docs, travaux Cowork
6. Soit dynamique et lie aux sessions (session-start/session-end)
7. Soit vivant : auto-sync quand on ajoute outils/plans/decisions sans intervention manuelle
8. Consomme 100% le Design System Void Glass (composants et tokens), avec Supernova et Storybook a jour dans le meme flow

## Destination

Ce plan sera donne a Claude Code CLI pour execution via `/plan-os` ou lecture directe.
Pour l'execution : **lire `14-plan-execution-consolide.md` en priorite** (sequence d'execution fusionnee, gates G1/G2 arbitres), puis venir sur `06-plan-execution.md` pour le detail des blocs B1-B40, sur `09-dynamisme-auto-sync.md` pour les blocs `*bis`, et sur `13-gouvernance-design-system.md` pour les blocs DS et le process composant.

## Ordre de lecture recommande

1. **00** (index) → **01** (vision) → **02** (architecture) : comprendre le quoi
2. **03** (pages) → **05** (UX + DS) → **07** (features) : comprendre le comment
3. **09** (dynamisme) → **13** (DS governance) : comprendre les contraintes vivantes
4. **04** (data) → **11** (tech) : comprendre la plomberie
5. **08** (a11y) → **10** (motion + copy) : comprendre la qualite
6. **12** (roadmap) : comprendre le futur
7. **14** (plan consolide) → **06** (detail blocs) : construire

## Estimation totale

- Plan initial (06) : ~22h
- Avec blocs dynamisme (09 §11) : +3h → 25h
- Avec gouvernance DS (13 §8) : +8h → **~33h effort reel**

Soit environ 10-12 sessions de 2h30, sur 3 a 4 semaines selon rythme.
