# DS Tokens Scripts — Archive 2026-04-17

Archive des scripts Style Dictionary DTCG que Foundation OS DS n'utilise plus.

## Contexte

Foundation OS DS n'utilise PAS de pipeline Style Dictionary / DTCG. La source unique des tokens est `modules/design-system/src/styles/tokens.css` (variables CSS `--ds-*`) consomme directement par `modules/app` via `@foundation-os/design-system/styles.css`.

Les 2 scripts ci-dessous pointaient vers un dossier `modules/design-system/tokens/source/` **inexistant** — aucun token .json DTCG n'a jamais ete ecrit. `build-tokens.mjs` s'executait sans planter (Style Dictionary tolerant si aucun token source) mais generait rien ("No tokens for tokens.css. File not created.").

Refs audit v2 : `docs/audits/2026-04-16-mega-audit-v2/raw/agent-6 F-01` (tokens/ INEXISTANT casse package exports, scripts, docs, CHANGELOG).

## Contenu

- `build-tokens.mjs` — Style Dictionary 4 runner (custom transforms preservation alpha Void Glass)
- `check-contrast.mjs` — Validation WCAG AA 8 paires semantic

## Restauration (si Kevin veut recreer DTCG un jour)

1. Scaffolder `modules/design-system/tokens/source/{primitives,semantic}/*.json` format W3C DTCG
2. `mv .archive/ds-tokens-scripts-260417/build-tokens.mjs modules/design-system/scripts/`
3. `mv .archive/ds-tokens-scripts-260417/check-contrast.mjs modules/design-system/scripts/`
4. Dans `modules/design-system/package.json` :
   - Re-ajouter scripts `build:tokens`, `check:contrast`, hooks `prestorybook`/`prebuild-storybook`
   - Re-ajouter dependance devDep `"style-dictionary": "^4.1.4"`
   - Re-ajouter exports `./tokens.css`, `./tokens`, `./tokens.json` pointant vers `./tokens/build/`
   - Re-ajouter `"tokens/source"`, `"tokens/build"` dans `files`
5. Dans `modules/design-system/biome.json` : re-ajouter `"tokens/source/**"` dans `files.includes`
6. Dans `modules/design-system/.gitignore` : re-ajouter `tokens/build/`
7. `npm run build:tokens` genere `tokens/build/tokens.{css,js,json}`
