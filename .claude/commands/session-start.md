# /session-start — Demarrer une session Foundation OS

> **IMPERATIF** — tool calls en premier, avant toute reponse texte :
>
> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Read CONTEXT.md`
> 2. `Bash git status --short && git log -1 --format="%cr · %h · %s" && git branch --show-current && git worktree list`
> 3. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 4. `Glob docs/plans/*.md`
>
> **Tour 2 (OBLIGATOIRE)** :
> 5. `Read` chaque plan actif non-archive
> 6. `TodoWrite` avec 1 todo par plan actif (progression visible tasks pane Desktop)
>
> **Tour 3** : produire le brief v11 (format `docs/core/communication.md` section 6.1)
>
> PAS DE BRIEF AVANT TOURS 1-2 EXECUTES. PAS D'INTERPRETATION ALTERNATIVE.

Produit le brief de debut de session au format v11 (TDAH-friendly).

**Format brief** : voir `docs/core/communication.md` section 6.1 (template), 6.3 (regles de rendu), 6.4 (sources de donnees). **SOURCE UNIQUE.** Ne pas dupliquer ici.

## Phase 1 — Collecte automatique (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Worktree actif** : `bash scripts/worktree-list.sh` ou `git worktree list`. Detecter si on est dans un worktree (basename cwd dans `.claude/worktrees/`) ou sur main. Inclure dans le brief v11 cadre Sante.
4. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
5. **Health-check** : `bash scripts/health-check.sh`
6. **Plans actifs** : lire CHAQUE `docs/plans/*.md` non archive (exclut `_template-plan.md`). Extraire pour chaque plan :
   - titre + frontmatter (status, phases_total)
   - section `## Execution log` : compter `[x]` vs `[ ]`, identifier le dernier `[x]` (= hier), le(s) prochain(s) `[ ]`
   - decoupage en sessions/phases pour afficher reste
   - Un plan avec toutes ses cases `[x]` OU status `done`/`closed` → **considerer TERMINE**, proposer l'archivage `mv .archive/plans-done-$(date +%y%m%d)/` (normalement fait par `/session-end` precedent mais fallback si oublie)
7. **Plans recemment termines** : `ls .archive/plans-done-*/` pour les 7 derniers jours. Afficher dans brief v11 cadre PLANS ACTIFS : ligne `🟢 <N> plans termines recemment` (ex : `🟢 11 plans termines (2026-04-15)`) sans detail. Permet a Kevin de voir la progression.
7. **TodoWrite initial** (apres Phase 6) : creer un TodoWrite avec une todo par plan actif (1 plan = 1 todo). Kevin voit immediatement l'avancement dans la tasks pane Desktop. Memoire : `feedback_todowrite_systematique.md`.
8. **Etat externe (opt-in via `OMC_SYNC_EXTERNAL=1`)** : lecture seule MCP.
   - Asana : `mcp__claude_ai_Asana__get_my_tasks` workspace `1213280972575193` → 3 taches ouvertes top priorite + derniere modif
   - Notion : `mcp__claude_ai_Notion__notion-search` workspace user `4f1b99db` → 3 pages modifiees < 48h
   - Affichage : cadre `┌─ ETAT EXTERNE ─┐` apres PLANS ACTIFS. Jamais d'ecriture en session-start.
   - Si MCP indisponible ou variable absente → skip silencieusement, ne pas bloquer.

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — Verification structure (rapide)

- Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json (+ dossiers)
- Pas de fichiers orphelins a la racine (sinon signaler)
- Modules dans CONTEXT.md correspondent a `modules/` sur le filesystem
- CONTEXT.md < 200 lignes (sinon warning "CONTEXT.md trop long, compresser les sessions/decisions anciennes")

## Phase 3 — Produire le brief v11

Appliquer le template + regles de rendu definis dans `docs/core/communication.md` section 6.1 (debut de session), 6.3 (regles rendu), 6.4 (sources donnees → quelle section vient d'ou).

**Sections du brief debut de session** (ordre, voir spec) :
1. Sante (health-check + build + worktree actif)
2. Trajectoire (mission + focus + tendance + derniere decision)
3. Plans actifs (1 sous-cadre par plan actif avec progression + hier + prochain + reste)
4. Modules (Code + Meta + Prevu) + Acces
5. Attention (alertes + rappels + en attente Kevin)
6. Dernier travail (commits + bullets vulgarises)
7. Statut projet (modules + chantier en cours)
8. Idees (3-5 max recentes)
9. Reflexion (1-3 lignes optionnelles)
10. Historique (3 decisions recentes)
11. Cap (direction + prochaine action)
12. Input (question ouverte ou choix structure)

Les regles de cadres (`┌─ TITRE ─┐ ... └─┘` 42 chars), entete double trait, espacement, alignement, emojis couleur, barres 12 blocs, etc. sont **dans communication.md section 6.3**. Ne pas reinventer.

## Phase 4 — Annoncer + ouvrir l'input

Apres affichage du brief, **proposer un input clair** :

- Si Cap a une prochaine action evidente → proposer "On continue X ?"
- Sinon → demander "On fait quoi ?" (langage libre)
- Toujours offrir l'option "/cockpit" si Kevin veut le routing automatique

## Phase 5 — Persistence (uniquement si Kevin valide une direction)

Si Kevin lance une tache : `/cockpit` route vers le bon agent OU le travail demarre direct.
Si Kevin n'est pas pret : laisser le brief afficher, attendre.

## References

- Spec brief v11 : `docs/core/communication.md` section 6 (template + regles + sources)
- Conventions nommage : `docs/core/naming-conventions.md`
- Format session naming : memoire `feedback_sessions_nommage_planete.md` (titre `🪐 ...`)
- TodoWrite : memoire `feedback_todowrite_systematique.md`
- Worktrees actif : memoire `feedback_worktrees_actifs.md` + `docs/core/worktrees.md`
