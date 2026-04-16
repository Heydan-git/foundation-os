# 02 — Plan Sessions Design System Bootstrap

Date : 2026-04-08
Statut : PROPOSITION
Dependances : `00-INDEX.md`, `01-spec.md`
**Audience : Cowork ET Claude Code CLI.** Ce plan est la source de verite partagee pour les deux tetes. Chaque session DS-1 a DS-6 cote CLI doit demarrer par relire ce fichier + 01-spec.md. Chaque session Cowork (DS-0, DS-3b, DS-4b, DS-6 volet pont) idem. Les decisions D-DS-* et questions Q-DS-* sont normatives pour les deux.

---

## 0. Principes de decoupage

- Chaque session = 1 objectif concret, 1 commit final, ~30-40 pourcent d'une session audit normale.
- Pattern anti-compactage WIP+phase F autorise (valide Cycle 3 S6).
- Verrou cowork acquis debut + release fin. Refresh TTL tous les 25min si session > 25min.
- Aucun commit Cowork. Tous les commits proposes a Kevin ou laisses au CLI.
- Skills chat-only utilisables pour conseil/sondage : `design-system-manager`, `a11y-specialist`, `lead-design`, `ui-expert`. **Jamais pour ecrire du code.**
- Le code source des primitives et tokens vit dans `modules/design-system/` = zone **Claude Code CLI proprietaire**. Cowork ne l'ecrit pas sauf session atelier explicitement demandee par Kevin (section 10 de 01-spec.md).
- Consequence directe : les sessions DS-1 a DS-5 sont **a executer cote Claude Code CLI** (scaffolding, code primitives, CI). Cowork assure le cadrage, la documentation, la session atelier visuel, et le pont Figma/Penpot.

---

## 1. Repartition Cowork vs CLI par session

| Session | Objectif | Execution cote |
|---------|----------|----------------|
| DS-0 | Spec + plan + questions (cette session) | **Cowork** |
| DS-1 | Scaffold modules/design-system/ + tokens DTCG + Style Dictionary | **CLI** (ecrit package.json + code + tokens/) |
| DS-2 | Storybook 8 install + preview Void Glass + 1 story | **CLI** |
| DS-3 | Primitives P1 : Button + Text + Icon + stories + tests | **CLI** |
| DS-3b (atelier) | Affinage visuel primitives P1 en direct avec Kevin | **Cowork** (mode atelier exception) |
| DS-4 | Primitives P2 : Input + Card + stories + tests | **CLI** |
| DS-4b (atelier) | Affinage visuel primitives P2 | **Cowork** |
| DS-5 | CI workflow design-system.yml + Playwright visual + axe-core gate | **CLI** |
| DS-6 | Export DTCG Figma/Penpot + consommation modules/app + doc DS + cloture | **CLI** + Cowork (pont MCP Figma) |
| DS-atelier (a la demande) | Session visuelle quand Kevin veut iterer | **Cowork** |

---

## 2. DS-0 — Cadrage (cette session Cowork)

### Objectif

Produire spec + plan + questions ouvertes. Aucun code. Valider avec Kevin le scope et les 10 questions Q-DS-01..10.

### Tasks

| # | Task | Fait |
|---|------|------|
| 0.1 | Web search bonnes pratiques Storybook/DTCG/monorepo 2026 | OK |
| 0.2 | Creer dossier docs/travaux-cowork/2026-04-08-design-system-bootstrap/ | OK |
| 0.3 | 00-INDEX.md | OK |
| 0.4 | 01-spec.md (10 sections + 10 questions ouvertes) | OK |
| 0.5 | 02-plan.md (ce fichier) | In progress |
| 0.6 | Update CONTEXT.md (pause dashboard monitor + module DS PROPOSITION + prochaine action) | Pending |
| 0.7 | Verification finale (refs, coherence, zero invention) | Pending |
| 0.8 | Release verrou + propose commit `docs(ds): bootstrap spec + plan + questions` | Pending |

### Acceptance criteria DS-0

- [ ] 00-INDEX + 01-spec + 02-plan existent et sont coherents entre eux.
- [ ] 10 decisions D-DS-* tracees (4 valides + 4 proposes + 2 meta).
- [ ] 10 questions Q-DS-* listees avec options + recommandations explicites.
- [ ] CONTEXT.md reflete : dashboard monitor pause, DS-bootstrap PROPOSITION, prochaine action DS-1 (CLI).
- [ ] Aucun fichier cree hors docs/travaux-cowork/2026-04-08-design-system-bootstrap/.
- [ ] Aucun import ou commit execute.
- [ ] Verrou libere.

---

## 3. DS-1 — Scaffold module + tokens (cote CLI)

### Objectif

Creer `modules/design-system/` avec package.json workspace, tsconfig, vite.config.ts lib mode, tokens DTCG source + Style Dictionary build. Pas de Storybook, pas de primitive.

### Tasks estimees

- 1.1 — Trancher Q-DS-01 (npm vs pnpm workspaces) avec Kevin.
- 1.2 — Scaffold `modules/design-system/package.json` + tsconfig + vite.config.ts.
- 1.3 — Creer arbo `tokens/source/` avec 6 fichiers DTCG : color, typography, spacing, radius, elevation, motion.
- 1.4 — Installer `style-dictionary@4` (verifier version stable DTCG au moment de l'install).
- 1.5 — Ecrire `scripts/build-tokens.mjs` qui lit tokens/source/ et genere tokens/build/tokens.css + tokens.ts + tokens.json (DTCG flat).
- 1.6 — `npm run build:tokens` execute et verifie : 3 outputs generes, tokens.css contient les variables Void Glass attendues.
- 1.7 — Grep verification : #06070C present, Figtree present, aucune interdiction (#0A0A0B, #08080A, Outfit, Inter).
- 1.8 — Test contraste AA : sur chaque paire fond/texte definie dans color.json, ratio >= 4.5 ou documenter exception (script node `scripts/check-contrast.mjs`).
- 1.9 — README modules/design-system/ minimal (description + scripts disponibles).
- 1.10 — Commit `feat(ds): scaffold module + tokens DTCG + style-dictionary build`.

### Acceptance criteria DS-1

- [ ] `ls modules/design-system/` retourne l'arbo attendue (section 3.1 de 01-spec.md).
- [ ] `npm run build:tokens` sort 0 erreur, genere 3 fichiers build.
- [ ] tokens.css contient toutes les variables critiques Void Glass.
- [ ] Ratio contraste AA verifie sur toutes les paires.
- [ ] health-check.sh : SAIN maintenu (ou DEGRADED explique et accepte).
- [ ] Zero regression modules/app (build + 19 tests verts).

---

## 4. DS-2 — Storybook 8 setup + preview Void Glass (cote CLI)

### Objectif

Storybook 8 operationnel sur le module DS, preview global Void Glass (fond + fonts + tokens.css importe), 1 story "Welcome" hello-world verifiable visuellement.

### Tasks estimees

- 2.1 — `npx storybook@latest init` dans modules/design-system/ (framework react-vite).
- 2.2 — Configure `.storybook/main.ts` : framework vite, stories glob `src/**/*.stories.tsx`, addon-a11y, addon-essentials.
- 2.3 — `.storybook/preview.ts` : import tokens.css global, background Void Glass, parametres a11y par defaut.
- 2.4 — `.storybook/manager.ts` : theme dark SB pour coherence.
- 2.5 — Creer `src/Welcome.stories.tsx` story qui affiche les tokens color + typography (grille de swatches).
- 2.6 — `npm run storybook` execute en local. Kevin verifie visuellement (screenshot + OK explicite) ou session atelier.
- 2.7 — Commit `feat(ds): storybook 8 preview void glass + welcome story`.

### Acceptance criteria DS-2

- [ ] `npm run storybook` lance sans erreur, port accessible.
- [ ] Fond #06070C visible, fonts Figtree chargees (verifiable devtools).
- [ ] addon-a11y present et fonctionne (sidebar tab "Accessibility").
- [ ] 1 story Welcome affichee et valide par Kevin.

---

## 5. DS-3 — Primitives P1 : Button + Text + Icon (cote CLI)

### Objectif

3 primitives atomiques avec stories + tests unit + tests a11y. Chaque primitive en respect strict Void Glass + WCAG AA.

### Tasks estimees par primitive

Pattern repete pour Button, Text, Icon :

- x.1 — Designer API publique (props, variants, etats) → 1 mini ADR dans `docs/decisions-log.md`.
- x.2 — Implementer primitive + CSS Module.
- x.3 — Story par variant + etat (default, hover via Storybook interactions, focus, disabled si applicable).
- x.4 — Test unit Vitest : render + props + interactions de base.
- x.5 — Test a11y jest-axe : zero violation.
- x.6 — Verification manuelle Storybook dans atelier DS-3b (optionnel mais recommande).

### Specifique Button

- Variants : primary, secondary, ghost, danger.
- Etats : default, hover, focus, active, disabled, loading.
- Focus ring visible (outline token dedie).
- Taille : sm, md, lg.

### Specifique Text

- Niveaux semantiques : h1-h6, body, caption, code.
- Poids : regular, medium, semibold, bold.
- Composant rendu l'element HTML correct selon `as` prop (`as="h1"` -> <h1>).

### Specifique Icon

- Wrapper `lucide-react`.
- Props : `name`, `size`, `aria-label` ou `aria-hidden`.
- Default aria-hidden=true (decoratif par defaut).

### Acceptance criteria DS-3

- [ ] 3 primitives exportees depuis src/index.ts.
- [ ] 3 ensembles de stories (Button, Text, Icon) dans Storybook.
- [ ] Vitest : tous tests verts, couverture > 80 pourcent sur primitives.
- [ ] jest-axe : zero violation sur les 3.
- [ ] Commit `feat(ds): primitives P1 button + text + icon`.

---

## 6. DS-3b — Atelier visuel P1 (cote Cowork, optionnel a la demande)

### Objectif

Kevin veut raffiner visuellement les primitives Button/Text/Icon. Session exceptionnelle Cowork qui peut editer modules/design-system/src/primitives/** et tokens/source/**.

### Forme

Voir section 10 de 01-spec.md. Kevin lance Storybook, Cowork itere via :

- Screenshots Kevin (option A).
- Claude in Chrome MCP (option B, recommande si extension active).
- MCP Figma pour reference (si fichier Figma disponible, Q-DS-10).

### Tasks

- 3b.1 — Acquerir verrou cowork + refresh TTL.
- 3b.2 — Lancer `search_mcp_registry` pour Penpot connector si Kevin veut Penpot.
- 3b.3 — Lire etat courant Storybook via screenshot ou Chrome MCP.
- 3b.4 — Iteration token-level puis primitive-level avec feedback visuel.
- 3b.5 — Liste des edits proposes au fur et a mesure, edits Edit tool avec accord Kevin a chaque round.
- 3b.6 — Si MCP Figma utilise : `get_design_context` sur fichier ref, comparer variables Figma <-> tokens DS.
- 3b.7 — Proposer commit `refactor(ds): atelier visual P1 - [scope]`.
- 3b.8 — Release verrou.

### Acceptance criteria DS-3b

- [ ] Verrou acquis et libere proprement.
- [ ] Liste des edits tracee dans un append a 02-plan.md ou note dans CONTEXT.md.
- [ ] Tests unit + a11y toujours verts apres modifs.
- [ ] Void Glass toujours respecte.
- [ ] Commit propose, pas execute.

---

## 7. DS-4 — Primitives P2 : Input + Card (cote CLI)

### Objectif

2 primitives supplementaires avec stories + tests.

### Specifique Input

- Types : text, email, password, number, search.
- Etats : default, focus, disabled, error, success.
- Label + helper text + error message.
- Associates via htmlFor ou aria-describedby.

### Specifique Card

- Variants : default, elevated (ombre token), interactive (hover + focus).
- Slot pattern : header / body / footer.
- Interactive version = role="button" + keyboard support.

### Acceptance criteria DS-4

- [ ] 2 primitives exportees + stories + tests.
- [ ] Total 5 primitives Button/Text/Icon/Input/Card exportees depuis src/index.ts.
- [ ] Commit `feat(ds): primitives P2 input + card`.

---

## 8. DS-4b — Atelier visuel P2 (Cowork, optionnel)

Identique DS-3b pour Input + Card.

---

## 9. DS-5 — CI : visual regression + axe AA gate (cote CLI)

### Objectif

GitHub Actions workflow dedie qui :

1. Lance sur paths `modules/design-system/**` et main + PR.
2. Install deps + `npm run build:tokens`.
3. `npm run build-storybook` (output statique dans storybook-static/).
4. Playwright serve + visual snapshots sur toutes les stories.
5. axe-playwright sur toutes les stories.
6. Fail si diff visuel ou violation a11y.

### Tasks estimees

- 5.1 — `.github/workflows/design-system.yml` avec paths filter.
- 5.2 — `tests/playwright.config.ts` dans modules/design-system.
- 5.3 — `tests/visual/stories.spec.ts` : enumere stories, take screenshot, compare.
- 5.4 — `tests/a11y/stories.a11y.spec.ts` : enumere stories, run axe, fail sur violation.
- 5.5 — Premier run local : generer baselines snapshots + commit `test(ds): baseline visual snapshots`.
- 5.6 — Declencher workflow sur CI, verifier vert.
- 5.7 — Intentionnellement casser un style (test) : verifier que la CI fail. Revert.
- 5.8 — Commit `ci(ds): visual regression + axe aa gate workflow`.

### Acceptance criteria DS-5

- [ ] Workflow execute sur PR et passe au vert.
- [ ] Baselines committees (N snapshots = N stories).
- [ ] Test intentionnellement casse fail la CI avec diff visible.
- [ ] Zero violation axe sur toutes stories P1 + P2.

---

## 10. DS-6 — Pont Figma/Penpot + consommation app + cloture (cote CLI + Cowork)

### Objectif

- Export DTCG JSON utilisable Figma (import natif) et Penpot (natif).
- `modules/app` consomme `@foundation-os/design-system` pour tokens.css au minimum.
- README DS complet.
- CONTEXT.md module DS passe de PROPOSITION a production-ready.

### Tasks

- 6.1 — `scripts/export-dtcg.mjs` : prend tokens/build/tokens.json + metadata, sort `tokens/build/foundation-os.tokens.json` pret pour Figma Variables import.
- 6.2 — Documentation : README.md du module DS avec sections (scripts, architecture, import Figma, import Penpot, roadmap).
- 6.3 — `modules/app/package.json` + import `@foundation-os/design-system/tokens.css` dans modules/app/src/main.tsx.
- 6.4 — Regression test modules/app : build 19 tests verts.
- 6.5 — **Cowork** : si MCP Figma dispo et fichier ref fourni par Kevin, verifier que les tokens exportes sont importables via `use_figma` tool.
- 6.6 — **Cowork** : `search_mcp_registry` penpot + suggest si pas encore fait, pour branchement futur.
- 6.7 — Update CONTEXT.md : Module Design System passe en production-ready avec metrics.
- 6.8 — Commit `feat(ds): dtcg export + app consumption + close bootstrap`.

### Acceptance criteria DS-6

- [ ] tokens.json DTCG valide (script de validation spec-compliant).
- [ ] modules/app importe et build sans regression.
- [ ] README DS complet.
- [ ] CONTEXT.md module DS production-ready.
- [ ] Kevin valide import Figma (manuel, screenshot ou via MCP).

---

## 11. Estimation globale

Chaque session bite-sized ~30-40 pourcent d'une session audit normale.

| Session | Estimation relative | Risque compactage |
|---------|---------------------|-------------------|
| DS-0 | 20 pourcent (cadrage pur doc) | Faible |
| DS-1 | 40 pourcent | Faible |
| DS-2 | 25 pourcent | Faible |
| DS-3 | 60 pourcent (3 primitives x 5 sous-tasks) | **Moyen — candidat WIP+phase F** |
| DS-3b | 30 pourcent (atelier) | Faible |
| DS-4 | 45 pourcent | Faible-Moyen |
| DS-4b | 30 pourcent | Faible |
| DS-5 | 50 pourcent (CI + debug baselines) | **Moyen — candidat WIP+phase F** |
| DS-6 | 40 pourcent | Faible |

**Total** : ~7 sessions effectives + 2 ateliers = ~340 pourcent d'une session audit, soit approximativement l'equivalent charge de 3.5 sessions audit completes, etale sur plusieurs jours/semaines au rythme Kevin.

---

## 12. Risques identifies

| ID | Risque | Mitigation |
|----|--------|------------|
| R-DS-01 | CI baselines instables cross-OS Mac local vs Linux CI | Q-DS-07 : generer baselines en CI uniquement, workflow_dispatch pour update |
| R-DS-02 | validate-void-glass.sh hook ne voit pas nouveaux fichiers (F-S6-B-01) | Q-DS-06 : accepter risque, log F-DS-01 |
| R-DS-03 | DTCG spec evolue encore (stable oct 2025) | Pinner version style-dictionary et tokens-studio tools |
| R-DS-04 | Storybook 8 + Vite 5 + React 18 version mismatch | Verifier compat matrix avant DS-2, rollback plan |
| R-DS-05 | Kevin veut Penpot mais pas de MCP connector | Fallback export JSON manuel, search_mcp_registry au DS-3b |
| R-DS-06 | Chantier s'eloigne de l'audit massif Cycle 3 indefiniment | DS-6 clot le bootstrap, S7.5 audit reprend strict |
| R-DS-07 | Modules/app duplique des composants (Button existe peut-etre deja dans app) | Audit rapide modules/app/src/components au DS-6 avant consumption |

---

## 13. Pointeurs de sortie

- Fin DS-6 : update CONTEXT.md Modules table ajoute "Design System | production-ready | ..." et retire PROPOSITION.
- Reprise Dashboard monitor D2/D3 apres DS-6.
- Reprise S7.5 audit apres Dashboard monitor D3.
- Fixes en bloc S23+ inclut fixes F-DS-01 et equivalents.

---

## 14. Ce qui bloque immediatement

Avant de lancer DS-1, Kevin doit trancher :

- Q-DS-01 (workspace tool)
- Q-DS-02 (styles primitives)
- Q-DS-07 (baselines cross-OS)
- Q-DS-09 (canal feedback atelier)
- Q-DS-10 (reference Figma ou non)

Les autres questions peuvent etre tranchees au fil de l'eau.
