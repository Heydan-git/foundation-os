# Cycle 3 — S14 SUGG tech part 1 (perf + deps + types)

> **Status** : DONE 2026-04-10
> **Mode** : MOI (commandes directes)
> **Scope** : SUGG-1 performance, SUGG-6 deps audit, SUGG-7 type safety
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED 84 refs cassees (zero drift)
> **Cross-refs** : S13 F-S13-01/F-S13-11 (any types), F-DS3-01 (vite vuln), S0 W1/W2 (vite deprecation)
> **Commits** : `<S14>` (ce livrable)

## 1. Objectif

Audit technique 3 axes : performance (build, bundle, hooks latence), dependencies (vulnerabilites, outdated), type safety (strict mode, explicit any, assertions).

## 2. Methodologie

Commandes directes (pas de sub-agent — tests mecaniques) :
- `time npm run build` (perf + bundle)
- `npm audit` (vulnerabilites)
- `npm outdated` (packages stales)
- `npx tsc --noEmit --strict` (type safety)
- `time` sur hooks (latence)
- Lecture tsconfig.json (config)

## 3. Findings

### 3.1 SUGG-1 Performance

| Metric | Mesure | Seuil CLAUDE.md | Verdict |
|--------|--------|-----------------|---------|
| Build total (prebuild DS + tsc + vite) | 2.85s wall | <1500ms vite seul | OK (vite 898ms) |
| JS bundle | 457.15 kB (gzip 128.83 kB) | <600 kB | OK |
| CSS bundle | 22.12 kB (gzip 5.02 kB) | <40 kB | OK |
| Modules transformes | 108 | - | INFO |
| TSX max | 544L (Phase1Demo) | <700L | OK (marge 22%) |
| Hook validate-void-glass | 9ms | - | OK |
| Hook security-reminder | 51ms | - | OK |

**Verdict perf : SAIN.** Tous les seuils respectes.

### 3.2 SUGG-6 Dependencies — Vulnerabilites

| Package | Severity | Detail | Fix |
|---------|----------|--------|-----|
| esbuild <=0.24.2 | moderate | Dev server contactable par site tiers (GHSA-67mh-4wv8-2f99) | vite@8 (breaking) |
| vite <=6.4.1 | moderate | Depends on vulnerable esbuild | vite@8 (breaking) |

**2 moderate, 0 high, 0 critical.** Dev-only. Confirme F-DS3-01.

### 3.3 SUGG-6 Dependencies — Outdated majeurs

| Package | Current | Latest | Breaking |
|---------|---------|--------|----------|
| vite | 5.4.21 | 8.0.8 | Rolldown remplace esbuild, plugin-react@6 |
| react / react-dom | 18.3.1 | 19.2.5 | React 19 (use, Actions, compiler) |
| tailwindcss | 3.4.19 | 4.2.2 | CSS-first config, @apply changes |
| storybook | 8.6.18 | 10.3.5 | API changes |
| typescript | 5.9.3 | 6.0.2 | isolatedDeclarations, new checks |
| style-dictionary | 4.4.0 | 5.4.0 | tokens build a verifier |
| lucide-react | 0.469.0 | 1.8.0 | icon API, DS Icon wrapper |

Patches safe : @supabase/supabase-js 2.101→2.103, @testing-library/user-event 14.5→14.6.

### 3.4 SUGG-7 Type Safety

| Check | Resultat |
|-------|----------|
| tsconfig strict | `true` + noUnusedLocals + noUnusedParameters + noFallthroughCasesInSwitch |
| tsc --noEmit --strict | **0 erreurs** |
| Explicit `any` | **38 occurrences** dans 6 fichiers (mutations.ts 21, Phase1Demo 10, others 7) |
| `as unknown as` / `as never` | **0** |

**Paradoxe** : strict=true + 0 erreurs mais 38x `any` explicites. Strict mode bloque les implicites, pas les explicites. Seul un linter `@typescript-eslint/no-explicit-any` pourrait les attraper.

### 3.5 Finding bonus : settings.json chemins relatifs

Le fix F-S11-01 (chemins relatifs `./scripts/hooks/...`) ne fonctionne pas de maniere fiable : quand le CWD bash derive (ex: `cd modules/app`), les hooks resolvent depuis le mauvais dossier. Revert aux chemins absolus. F-S11-01 reste ouvert — solution post-cycle3 : variable d'environnement ou hook wrapper avec `cd`.

## 4. Findings consolides

| ID | Severite | Finding |
|----|----------|---------|
| F-S14-01 | P2 | 2 vulns moderate dev-only (esbuild + vite) — fix = vite@8 breaking. Confirme F-DS3-01 |
| F-S14-02 | P2 | 7 packages major outdated — migration coordonnee post-cycle3 |
| F-S14-03 | P3 | 38x explicit `any` toleres par strict mode — couple D-S13-01/D-S13-11 |
| F-S14-04 | P3 | Phase1Demo 544L marge 22% avant seuil 700L — couple D-S13-09 |
| F-S14-05 | P3 | Vite deprecation warnings oxc/rolldown — confirme S0 W1/W2, resolu par migration vite@8 |
| F-S14-06 | P3 | settings.json chemins relatifs non fiables (CWD derive) — revert absolu, F-S11-01 reste ouvert |

## 5. Decisions

| ID | Decision | Batch |
|----|----------|-------|
| D-S14-01 | Migration coordonnee vite@8 + react@19 + tailwind@4 = chantier dedie post-cycle3 (1-2 sessions) | post-cycle3 |
| D-S14-02 | Patch @supabase/supabase-js 2.101→2.103 safe a faire en S21 | S21 |
| D-S14-03 | Elimination `any` couple D-S13-01/D-S13-11 meme batch | S21 |
| D-S14-04 | F-S11-01 settings.json = revert absolu, solution robuste post-cycle3 | parking |
| D-S14-05 | Vite warnings = no action, resolu par D-S14-01 | no action |

## 6. Cross-references

- F-S14-01 confirme F-DS3-01 (meme 2 vulns)
- F-S14-03 couple S13 F-S13-01/F-S13-11 (38x any, meme fix)
- F-S14-05 confirme S0 W1/W2 (deprecation warnings vite)
- F-S14-06 invalide partiellement le fix F-S11-01 (chemins relatifs)

## 7. Learnings metaboliques

1. **Strict mode est necessaire mais pas suffisant** : 0 erreurs tsc + 38 `any` explicites = faux sentiment de securite. Un linter rule `@typescript-eslint/no-explicit-any` est le vrai garde-fou. A ajouter post-cycle3.

2. **Hooks CWD = fragile** : le CWD bash peut deriver pendant une session (`cd modules/app`), cassant les chemins relatifs dans settings.json. Les chemins absolus sont la seule option fiable actuellement. Solution future : variable env ou wrapper script.

## 8. Next session

**S15 — SUGG tech part 2** (coverage + CI + DB + naming) conforme plan cycle 3.
