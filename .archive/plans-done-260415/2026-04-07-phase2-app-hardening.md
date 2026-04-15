# Phase 2 — App Hardening : Implementation Plan

> Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 2
> Plan ecrit le 2026-04-07. Decoupage en 3 sessions.

**Goal:** L'app passe de MVP a production-ready : tests logique metier, navigation entre modules, auth complete, integration de 2 artifacts en TSX.

**Architecture:** On garde la stack actuelle (Vite + React + TS + Supabase + Tailwind + Vitest). Aucun ajout de dependance non justifie. Les tests utilisent vi.mock pour isoler la logique du vrai Supabase. Les 2 tests existants (smoke client + render IndexPage) restent intacts.

**Tech Stack:** Vitest 4, @testing-library/react 16, jsdom 29, vi.mock, react-router-dom 7, Supabase Auth.

---

## Decoupage en 3 sessions

| Session | Date prevue | Scope | Critere de succes |
|---------|-------------|-------|-------------------|
| **1** | 2026-04-07 (cette session) | 2.1 Tests logique metier | `npm test` = 15+ tests, 0 failure ; build OK ; health-check SAIN |
| 2 | TBD | 2.2 Navigation + 2.3 Auth complete | NavLink actif sur 3 routes ; signup avec email verif ; password reset flow |
| 3 | TBD | 2.4 Integration 2 artifacts | fos-commander.tsx + fos-knowledge.tsx integres comme pages, JSX archives |

Phase 2 est completee quand toutes les checkboxes du critere global de la spec sont cochees.

---

## Session 1 — Tests logique metier (cette session)

**Objectif :** 15+ tests Vitest qui couvrent la logique metier critique sans toucher la vraie DB Supabase.

### Task 1 : Helper de mocks Supabase

**Files:**
- Create: `modules/app/src/test/mocks/supabase.ts`

- [ ] **Step 1** : creer un helper `createSupabaseMock()` qui retourne un objet avec `from()` et `auth.*` mockes via `vi.fn()`. Le helper doit etre extensible (overrides via parametre) pour que chaque test impose ses propres comportements.

- [ ] **Step 2** : exporter aussi `createQueryBuilder({ data, error })` qui simule la chaine `.from().select().order()` / `.from().insert().select().single()` etc. Le builder retourne des thenables (Promise-like) pour matcher l'API Supabase.

- [ ] **Step 3** : verifier en local : `cd modules/app && npm test -- mocks` (test rapide d'auto-import si on veut, sinon skip).

---

### Task 2 : Tests `mutations.ts`

**Files:**
- Create: `modules/app/src/test/mutations.test.ts`

- [ ] **Step 1** : `vi.mock('@/lib/supabase', ...)` avec un mock hoisted pour pouvoir le re-configurer dans chaque test.

- [ ] **Step 2** : tester `useCommanderMutations().createSession()` :
  - Cas success → retourne `{ success: true, data: { id: ... } }`
  - Cas erreur Supabase → retourne `{ success: false, error: 'msg' }`
- [ ] **Step 3** : tester `updateSession()` success.
- [ ] **Step 4** : tester `deleteSession()` success.
- [ ] **Step 5** : tester `markStepDone()` success + edge case (erreur reseau).

Cible : **5 tests**.

---

### Task 3 : Tests `useCommander.ts`

**Files:**
- Create: `modules/app/src/test/useCommander.test.ts`

- [ ] **Step 1** : utiliser `renderHook` de `@testing-library/react`.

- [ ] **Step 2** : test 1 — quand toutes les requetes Supabase retournent `data: []`, le hook bascule sur SEED et `source === 'seed'`.

- [ ] **Step 3** : test 2 — quand les requetes retournent des `data` non vides, `source === 'supabase'` et les setters utilisent les data.

- [ ] **Step 4** : test 3 — quand au moins une requete a un `error`, fallback SEED.

Cible : **3 tests**.

---

### Task 4 : Tests `AuthContext.tsx`

**Files:**
- Create: `modules/app/src/test/AuthContext.test.tsx`

- [ ] **Step 1** : mock `supabase.auth.getSession()` pour retourner `{ data: { session: null } }`, mock `onAuthStateChange()` pour retourner un subscription unsubscribe noop.

- [ ] **Step 2** : test 1 — `signIn(email, pwd)` succes → retourne `{ error: null }`, supabase.auth.signInWithPassword est appele avec les bons args.

- [ ] **Step 3** : test 2 — `signIn` erreur → retourne `{ error: 'message' }`.

- [ ] **Step 4** : test 3 — `signUp(email, pwd)` retourne `{ error: null }` et appelle supabase.auth.signUp.

- [ ] **Step 5** : test 4 — `signOut()` appelle supabase.auth.signOut.

Cible : **4 tests**.

---

### Task 5 : Tests forms (`AddSessionForm`, `NextStepActions`)

**Files:**
- Create: `modules/app/src/test/forms.test.tsx`

- [ ] **Step 1** : test 1 — `AddSessionForm` ne render rien quand `isOpen={false}`.

- [ ] **Step 2** : test 2 — `AddSessionForm` desactive le bouton submit quand `title` est vide.

- [ ] **Step 3** : test 3 — `AddSessionForm` appelle `onSuccess` + `onClose` apres un createSession reussi (mock mutations).

- [ ] **Step 4** : test 4 — `NextStepActions` cycle de status `getNextStatus` : todo→in_progress→done→todo (test indirect via click sur le bouton).

Cible : **4 tests**.

Total cumule : 5 (mutations) + 3 (useCommander) + 4 (AuthContext) + 4 (forms) = **16 tests** (+ 3 existants = 19 total).

---

### Task 6 : Verification finale

- [ ] **Step 1** : `cd modules/app && npm test` → 19 tests, 0 failure.

- [ ] **Step 2** : `cd modules/app && npm run build` → exit 0, bundle stable.

- [ ] **Step 3** : `bash scripts/health-check.sh` → SAIN.

- [ ] **Step 4** : update `CONTEXT.md` :
  - Ligne App Builder : remplacer `Vitest 3 tests` par `Vitest 19 tests`
  - Ajouter ligne dans "Dernieres sessions" : `2026-04-07 | Phase 2.1 Tests : helper mocks Supabase + 16 nouveaux tests (mutations, useCommander, AuthContext, forms)`
  - Mettre a jour "Prochaine action" pour pointer vers Session 2 (Navigation + Auth)

- [ ] **Step 5** : commit final
  ```
  test(app): phase 2.1 — 16 tests logique metier (mutations, hook, auth, forms)
  ```

---

## Session 2 — Navigation + Auth complete (a faire plus tard)

### 2.2 Navigation entre modules
- Modifier `Layout.tsx` : ajouter une top-nav avec NavLink actif
- Liens : `/`, `/commander`, `/dashboard`
- Mobile-responsive (hamburger ou hidden md:flex)
- Pas de nouvelle dependance (react-router-dom 7 deja la)

### 2.3 Auth complete
- Email verification : config Supabase (email confirmations ON)
- Password reset flow :
  - `LoginPage` : ajouter lien "Mot de passe oublie ?"
  - Nouvelle page `/reset-password`
  - Flow Supabase `resetPasswordForEmail` + `updateUser({password})`
- Min 8 caracteres : valider cote front dans signup form

### Critere session 2
- [ ] NavLink visible sur toutes les routes auth-protegees
- [ ] Signup envoie un mail de verification (test manuel avec une vraie adresse)
- [ ] Reset password fonctionne end-to-end
- [ ] Tests Phase 2.1 toujours verts
- [ ] Build OK + health-check SAIN

---

## Session 3 — Integration 2 artifacts (a faire plus tard)

### 2.4 Choix : `fos-commander.jsx` + `fos-knowledge.jsx`

Pourquoi ces 2 :
- `fos-commander` recoupe la page Commander existante → integration logique, eviter la duplication
- `fos-knowledge` apporte une vue manquante (artifacts/data MD)

### Etapes
- [ ] Lire `fos-commander.jsx` + `FOS-COMMANDER-DATA.md`
- [ ] Convertir JSX → TSX avec types stricts (utiliser les types `Session`, `Decision`, etc. de `database.types.ts`)
- [ ] Decouper en composants si > 700 lignes
- [ ] Idem pour fos-knowledge
- [ ] Ajouter routes `/knowledge` dans `App.tsx`
- [ ] Update Layout nav
- [ ] Archiver les 5 autres artifacts dans `.archive/artifacts-jsx/` (conserver pour reference)
- [ ] Mettre a jour les MD pairs correspondants si necessaire

### Critere session 3
- [ ] `/commander` et `/knowledge` rendent les vues integrees
- [ ] 0 fichier `.jsx` restant dans `src/artifacts/` (tous archives)
- [ ] `data/` MD pairs alignes (verification : refs intactes)
- [ ] Build OK + health-check SAIN
- [ ] **Phase 2 DONE** — passer Phase 3

---

## Recapitulatif Session 1 (cette session)

| # | Fichier | Action |
|---|---------|--------|
| 1 | `modules/app/src/test/mocks/supabase.ts` | Create — helper mocks |
| 2 | `modules/app/src/test/mutations.test.ts` | Create — 5 tests |
| 3 | `modules/app/src/test/useCommander.test.ts` | Create — 3 tests |
| 4 | `modules/app/src/test/AuthContext.test.tsx` | Create — 4 tests |
| 5 | `modules/app/src/test/forms.test.tsx` | Create — 4 tests |
| 6 | `CONTEXT.md` | Update — session log + prochaine action |

Total : 5 fichiers crees, 1 modifie, 1 commit final.
