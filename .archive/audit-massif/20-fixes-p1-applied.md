# S20 — Fixes P1 appliques

> **Status** : DONE 2026-04-10
> **Phase** : XII (Application fixes — batch P1)
> **Mode** : MOI
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section S20
> **Gate G1** : validee par delegation Kevin
> **Branche** : audit-massif-cycle3

---

## 1. Fixes appliques (4/4)

### Fix 1 — F-S13-01 : mutations.ts types (21x `any` elimines)

- **Fichier** : `modules/app/src/lib/mutations.ts`
- **Changement** : import types `Database` depuis `database.types.ts`, 8 type aliases (SessionInsert/Update, DecisionInsert/Update, RiskInsert/Update, NextStepInsert, ContextBlockInsert). 8 params `any` → `Partial<XInsert>` ou `XUpdate`. 12 `catch (error: any)` → `catch (error: unknown)` avec guard `instanceof Error` + fallback `.message` pour objets Supabase.
- **Verification** : `tsc --noEmit` 0 errors, 5/5 mutations tests verts, build OK.

### Fix 2 — F-S13-02 : DELETE RLS policies (6 tables)

- **Fichier** : `supabase/migrations/002_add_delete_policies.sql` (nouveau)
- **Changement** : 6 policies `FOR DELETE USING (auth.role() = 'authenticated')` sur sessions, decisions, risks, next_steps, context_blocks, docs.
- **Verification** : SQL syntaxiquement correct, pattern identique aux policies SELECT/INSERT/UPDATE existantes. A appliquer cote Supabase lors du prochain deploy.

### Fix 3 — F-S13-03 : ARIA modals (2 composants)

- **Fichiers** : `EditDecisionModal.tsx`, `AddSessionForm.tsx`
- **Changement** : ajout `role="dialog" aria-modal="true" aria-label="..."` sur les divs overlay.
- **Note** : NextStepActions.tsx n'est pas un modal (pas d'overlay fixed), exclu du fix.
- **Verification** : build OK, 0 erreur.

### Fix 4 — F-S13-08 : clearAllData guard DEV

- **Fichier** : `modules/app/src/lib/mutations.ts`
- **Changement** : guard `if (!import.meta.env.DEV)` en tete de `clearAllData()` — retourne erreur en prod, fonctionne en dev.
- **Verification** : build OK, tests verts.

## 2. Verification finale

| Check | Resultat |
|-------|----------|
| `tsc --noEmit` | 0 errors |
| `npm run build` | OK 802ms (457.50kB JS, 22.12kB CSS) |
| `vitest run` | 19/19 tests verts (6 fichiers) |
| `health-check.sh` | DEGRADED baseline (0 critical, 1 warning refs cassees) |
| `grep ': any' mutations.ts` | 0 occurrences |
| Regression | Zero — memes 19 tests, build stable |

## 3. P1 restants apres S20

| Finding | Statut |
|---------|--------|
| F-S13-01 | **FIXE** (types) |
| F-S13-02 | **FIXE** (DELETE RLS, migration prete, a appliquer deploy) |
| F-S13-03 | **FIXE** (ARIA) |
| F-S13-08 | **FIXE** (guard DEV) |

**P1 actifs : 0.** Tous les P1 du cycle 3 sont resolus.

## 4. Prochaine : S21 batch P2

Ref roadmap : `19-synthese-roadmap.md` section 3 (23 fixes P2 en 5 lots).
