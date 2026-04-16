# Design System Bootstrap — Foundation OS

Date d'ouverture : 2026-04-08
Auteur : Cowork (Kevin)
Statut : PROPOSITION — attente validation Kevin avant DS-1

## Objectif

Construire les fondations d'un Design System Foundation OS full fonctionnel, qualite WCAG AA, iso entre Storybook et code produit, connectable ulterieurement a Figma ou Penpot via Design Tokens DTCG. **Possibilite d'affiner visuellement le DS en session live avec Cowork** (section 10 de 01-spec.md), avec branche MCP Figma disponible et MCP Penpot a explorer via search_mcp_registry.

**Audience documentaire : Cowork ET Claude Code CLI.** Les deux tetes lisent 01-spec.md + 02-plan.md en debut de chaque session DS-x.

## Contexte

- Void Glass existe deja en specification : `docs/design-system.md` (fond #06070C, Figtree, JetBrains Mono).
- Tokens CSS planifies en D2.1 du Dashboard monitor mais pas encore crees.
- Aucun Storybook, aucun package reutilisable, aucun test visuel, aucun gate a11y automatise.
- Dashboard monitor D2/D3 mis en pause par decision Kevin 2026-04-08 pour prioriser ce chantier.

## Decisions cadre (valides par Kevin via AskUserQuestion 2026-04-08)

| ID | Decision | Consequence |
|----|----------|-------------|
| D-DS-01 | Dashboard monitor D2/D3 mis en pause | Spec+plan monitor conserves, reprise apres DS bootstrap |
| D-DS-02 | Nouveau module `modules/design-system/` | Package isole consommable par tous les modules futurs |
| D-DS-03 | Stack : Storybook 8 + Playwright visual + axe-core | 100 pourcent open source, zero SaaS externe |
| D-DS-04 | Scope bootstrap = tokens + 5 primitives + Storybook + CI + pont Figma/Penpot | Scope complet, decoupe en 6 sessions courtes |

## Livrables prevus dans ce dossier

| Fichier | Contenu | Statut |
|---------|---------|--------|
| 00-INDEX.md | Sommaire + decisions cadre + pointeurs (ce fichier) | WIP |
| 01-spec.md | Vision, architecture cible, arborescence, imperatifs AA, decisions D-DS-*, questions ouvertes | WIP |
| 02-plan.md | Decoupage sessions DS-1 a DS-6 bite-sized + acceptance criteria | WIP |

## Sessions prevues (detail dans 02-plan.md)

| Session | Objectif | Estimation |
|---------|----------|------------|
| DS-0 | Cadrage (spec + plan + questions ouvertes) — **cette session Cowork** | In progress |
| DS-1 | Scaffold `modules/design-system/` + tokens DTCG + Style Dictionary | Pending validation Kevin |
| DS-2 | Storybook 8 install + preview Void Glass + 1 story hello | Pending |
| DS-3 | Primitives P1 : Button + Text + Icon (stories + tests unit) | Pending |
| DS-4 | Primitives P2 : Input + Card (stories + tests unit) | Pending |
| DS-5 | CI : Storybook build + Playwright visual regression + axe AA gate | Pending |
| DS-6 | Pont Figma/Penpot DTCG export + doc DS + consommation modules/app + cloture | Pending |

## Pointeurs externes

- Void Glass spec : `docs/design-system.md`
- Tokens CSS (planifie D2.1 dashboard monitor, non encore cree) : `docs/design-system/tokens.css`
- Plan dashboard monitor (paused) : `docs/plans/2026-04-08-monitor-dashboard-plan.md`
- Decisions Cycle 3 : `docs/decisions-log.md`

## Regles applicables (rappel)

- Destination obligatoire travaux-cowork : ce dossier est la seule racine Cowork pour ce chantier jusqu'a DS-1 (quand modules/design-system/ sera cree cote CLI).
- Aucun code ecrit par Cowork dans modules/ sans demande explicite Kevin (regle anti-collision §4).
- Aucun commit Cowork. Commits proposes en fin de session, Kevin ou CLI executent.
- Sessions courtes anti-compactage. Pattern WIP+phase F si besoin.
- AA strict : chaque primitive doit passer axe-core sans violation avant merge.
