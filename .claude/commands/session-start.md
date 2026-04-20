# /session-start — Demarrer une session Foundation OS

> **VULGARISATION INTEGRALE OBLIGATOIRE (TDAH-first, D-VULGARIZE-01 2026-04-20)** :
>
> **TOUT le brief v12 est vulgarise, PAS seulement la tuile "En bref" d'entree.** Chaque tuile (SANTE / PLANS / MODULES / CAP / etc.) applique les 9 regles universelles (section 6.0.1 communication.md) : D-XXX-NN traduit en langage naturel, acronymes developpes, termes tech expliques entre parentheses, choix A/B/C avec "a quoi ca sert" + "combien de temps". Regles par tuile : section 6.0.2. Check-list obligatoire avant envoi : section 6.0.3.
>
> **Piege a eviter** : "En bref" vulgarisee mais tuiles suivantes en jargon brut = violation (observe 2026-04-20). Kevin doit pouvoir lire CHAQUE tuile isolement en mode TDAH.
>
> Spec complete : `docs/core/communication.md` section 6.0 (principe + regles + vulgarisation par tuile + check-list + exemples). Kevin = designer TDAH, pas ingenieur tech.

> **IMPERATIF** — tool calls en premier, avant toute reponse texte :
>
> **Tour 1 (parallele, OBLIGATOIRE — pas de limite tokens, Kevin Max x20)** :
> 1. `Read CONTEXT.md`
> 2. `Read wiki/hot.md` (cache flash derniere session, 500 mots)
> 3. `Read wiki/meta/sessions-recent.md` (memoire court terme, 5 sessions)
> 4. `Read wiki/meta/lessons-learned.md` (auto-apprentissage erreurs)
> 5. `Read wiki/meta/thinking.md` (reflexions en cours)
> 6. `Read docs/core/constitution.md` (Constitution FOS ~41 principes P-XX, Layered Loading L2, D-BODY-01)
> 7. `Bash git status --short && git log -1 --format="%cr · %h · %s" && git branch --show-current && git worktree list`
> 8. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 9. `Bash bash scripts/wiki-health.sh 2>&1 | tail -10` (sante wiki : pages, wikilinks, hot.md age)
> 10. `Glob docs/plans/*.md`
>
> **Tour 2 (OBLIGATOIRE)** :
> 11. `Read` chaque plan actif non-archive
> 12. `TodoWrite` avec 1 todo par plan actif (progression visible tasks pane Desktop)
>
> **Tour 3** : produire le brief v12 (format `docs/core/communication.md` section 6.1)
>
> PAS DE BRIEF AVANT TOURS 1-2 EXECUTES. PAS D'INTERPRETATION ALTERNATIVE.

Produit le brief de debut de session au format v12 (TDAH-friendly).

**Format brief** : voir `docs/core/communication.md` section 6.1 (template), 6.3 (regles de rendu), 6.4 (sources de donnees). **SOURCE UNIQUE.** Ne pas dupliquer ici.

## Phase 1 — Collecte automatique (parallele)

> Les tool calls IMPERATIF ci-dessus sont autoritaires. Cette section explique POURQUOI, pas QUOI.

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Worktree actif** : `bash scripts/worktree-list.sh` ou `git worktree list`. Detecter si on est dans un worktree (basename cwd dans `.claude/worktrees/`) ou sur main. Inclure dans le brief v12 cadre Sante.
4. **Health-check** : `bash scripts/health-check.sh` (inclut le build des modules — ne pas relancer le build separement)
5. **Plans actifs** : lire CHAQUE `docs/plans/*.md` non archive (exclut `_template-plan.md`). Extraire pour chaque plan :
   - titre + frontmatter (status, phases_total)
   - section `## Execution log` : compter `[x]` vs `[ ]`, identifier le dernier `[x]` (= hier), le(s) prochain(s) `[ ]`
   - decoupage en sessions/phases pour afficher reste
   - Un plan avec toutes ses cases `[x]` OU status `done`/`closed` → **considerer TERMINE**, proposer l'archivage `mv .archive/plans-done-$(date +%y%m%d)/` (normalement fait par `/session-end` precedent mais fallback si oublie)
6. **Plans recemment termines** : `ls .archive/plans-done-*/` pour les 7 derniers jours. Afficher dans brief v12 cadre PLANS ACTIFS : ligne `🟢 <N> plans termines recemment` (ex : `🟢 11 plans termines (2026-04-15)`) sans detail. Permet a Kevin de voir la progression.
7. **TodoWrite initial** (apres Phase 5) : creer un TodoWrite avec une todo par plan actif (1 plan = 1 todo). Kevin voit immediatement l'avancement dans la tasks pane Desktop. Memoire : `feedback_todowrite_systematique.md`.
8. **Routines health** : `git log --grep="routine" --since="7 days ago" --oneline | wc -l` → nombre de commits routine cette semaine. Afficher dans brief cadre SANTE : "Routines: N commits/7j".
9. **Etat externe (opt-in via `OMC_SYNC_EXTERNAL=1`)** : lecture seule MCP.
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

## Phase 2bis — Context momentum (opt-in SMART_CONTEXT=1)

> **Momentum (opt-in SMART_CONTEXT=1)** : si les 5 derniers commits sont tous dans la meme zone (wiki/ ou modules/), prioriser les reads de cette zone dans le brief.
> Source : `git log -5 --name-only --format="" | grep -oE "^[^/]+" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}'`
> Si zone = "wiki" → Read wiki/meta/thinking.md en priorite
> Si zone = "modules" → skip wiki meta reads non-essentiels

## Phase 3 — Produire le brief v12

Appliquer le format **tuiles Markdown** defini dans `docs/core/communication.md` section 6.1 (v12), 6.3 (rendu), 6.4 (sources).

**IMPORTANT : Format tuiles Markdown (PAS box-drawing terminal)**
- Chaque section = 1 blockquote `>` contenant `####` titre + contenu + tables
- Sections separees par `---`
- NE PAS utiliser `┌─┐│└┘╔═╗╚╝` — utiliser `>`, `####`, `| |`, `**bold**`, `---`
- Voir spec communication.md 6.3 pour les 4 niveaux de hierarchie

**14 sections** (ordre fixe, chacune dans une tuile blockquote) :
1. 🏥 SANTE (table 4×2 build/tests/refs/css/wiki/drift + verdict bold)
2. 🔥 HOT (3-5 lignes wiki/hot.md + Next)
3. 🧭 TRAJECTOIRE (table mission/focus/tendance/derniere)
4. 📋 PLANS (progression plans actifs + compteur termines recents)
5. 📚 WIKI (table pages/domaines/ingest/stale + couverture domaines)
   Si pages > 30j non modifiees : afficher "⚠ N stale" (max 3)
6. 📦 MODULES (sous-groupes Code/Meta/Prevu + liens acces)
7. ⚠️ ATTENTION (sous-groupes Alertes + En attente Kevin checklist)
   + 🔄 SYNC optionnel (si drift-detector exit 1)
8. 🔨 DERNIER TRAVAIL (N commits + table batches + decisions)
9. 📊 STATUT (barres progression modules)
10. 💡 IDEES (table emoji + description, 3-5 max)
11. 🤔 REFLEXION (bullets courtes)
12. 📜 HISTORIQUE (table 3 decisions recentes)
13. 🎯 CAP (direction + prochaines actions table)
14. 📥 INPUT (choix A/B/C dans table + "On fait quoi ?")

Les regles de rendu (tuiles blockquote, hierarchie 4 niveaux, emojis, tables) sont **dans communication.md section 6.3 (v12)**. Ne pas reinventer. NE PAS utiliser de box-drawing terminal.

## Phase 4 — Annoncer + ouvrir l'input

Apres affichage du brief, **proposer un input clair** :

- Si Cap a une prochaine action evidente → proposer "On continue X ?"
- Sinon → demander "On fait quoi ?" (langage libre)
- Toujours offrir l'option "/cockpit" si Kevin veut le routing automatique

## Phase 5 — Persistence (uniquement si Kevin valide une direction)

Si Kevin lance une tache : `/cockpit` route vers le bon agent OU le travail demarre direct.
Si Kevin n'est pas pret : laisser le brief afficher, attendre.

## References

- Spec brief v12 : `docs/core/communication.md` section 6 (template + regles + sources)
- Conventions nommage : `docs/core/naming-conventions.md`
- Format session naming : memoire `feedback_sessions_nommage_planete.md` (titre `🪐 ...`)
- TodoWrite : memoire `feedback_todowrite_systematique.md`
- Worktrees actif : memoire `feedback_worktrees_actifs.md` + `docs/core/worktrees.md`
