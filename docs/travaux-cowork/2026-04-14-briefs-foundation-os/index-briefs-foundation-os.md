# 00 — INDEX — Briefs FoundationOS (morning + hebdo)

> Ouverture : 2026-04-14
> Proprietaire : Cowork
> But : poser les bases de deux livrables recurrents — un morning brief quotidien et une synthese hebdo — branches sur les sources reelles de FoundationOS (CLAUDE.md, CONTEXT.md, COWORK-CONTEXT.md, git, docs/plans/, Asana projet "Foundation OS — Setup").
> Inspiration : meme logique que les briefs Delubac Design AI workspace, transposee sur FoundationOS.

## Ordre de lecture

1. `01-specs-morning-brief.md` — spec structurelle du brief quotidien (sections, triggers, poids, duree cible de lecture).
2. `02-specs-hebdo-synthesis.md` — spec structurelle de la synthese hebdo (sections, vendredi 18h, retrospective + prospective).
3. `03-sources-et-regles.md` — mapping exhaustif des sources et regles anti-doublon (quelle info vient d'ou, comment on arbitre filesystem vs Asana vs git).
4. `04-exemple-morning-2026-04-14.html` — rendu visuel Void Glass du morning brief du 14/04/2026 avec donnees reelles.
5. `05-exemple-hebdo-s15.html` — rendu visuel de la synthese hebdo S15 (2026-04-07 → 2026-04-13) avec donnees reelles.

## Principes directeurs

- 🎨 **Visuel Void Glass** : dark #06070C, Figtree UI, JetBrains Mono code, cadres box-drawing, barres `████░░░░`, pictos couleur 🟢🟡🔴🔵⚪⚫🔮. Coherent avec le brief session v11 (D-BRIEF-01).
- 🧠 **TDAH-friendly** : hierarchie visuelle forte, zones courtes, un message par cadre, scannable en < 60 s (morning) / < 5 min (hebdo).
- 🪓 **Anti-bloat** : jamais de section vide. Si rien a signaler → le cadre disparait.
- 🔗 **Branche sur sources reelles** : chaque metrique a une commande de verification (cf. `03-sources-et-regles.md`).
- 🧭 **Anti-doublon** : une info ne vit qu'a un seul endroit. Si Asana contient deja le detail → on pointe Asana, on ne recopie pas. Le brief resume, ne duplique pas.
- 🚫 **Ne touche pas aux donnees** : lecture seule. Jamais de completion de tache Asana sans OK explicite Kevin (imperatif non-negociable).

## Fichier(s) a produire plus tard (hors scope v1)

- `06-regles-scheduling.md` : specs scheduled tasks (morning 8h lundi-vendredi, hebdo vendredi 18h). A activer quand format stabilise.
- `07-generator.md` : script ou skill qui genere automatiquement les briefs depuis les sources. Discussion : skill dedie vs commande `/morning-brief` + `/hebdo-brief` vs scheduled task MCP.

## Lien avec CONTEXT

- Cette spec est Cowork. Proposition de reference dans `CONTEXT.md` → section "Travaux Cowork" (a remonter via COWORK-CONTEXT.md apres validation Kevin).
- Ne remplace pas le brief session v11 (`docs/core/communication.md` §6) : le brief session tourne en ouverture de conversation, le morning brief tourne en debut de journee, le hebdo le vendredi soir. Trois livrables distincts, trois temporalites.
