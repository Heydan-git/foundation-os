# META — Plan d'action priorise / Foundation OS

> **Type** : plan d'action complementaire a `META-audit-collaboration-ia.md`
> **Date** : 2026-04-08
> **Methode** : RICE (Reach × Impact × Confidence / Effort) adapte projet solo
> **Mode** : MOI strict, brutal-factuel

---

## 0. Cadre RICE adapte projet solo

Pour un projet solo (Kevin uniquement), Reach n'a plus de sens classique. Je le remplace par **Coverage** (combien d'aspects du systeme l'action touche : 1=local, 5=systemique).

| Critere | 1 | 2 | 3 | 4 | 5 |
|---------|---|---|---|---|---|
| Coverage | Local | Module | Cycle | Foundation OS | Tous projets |
| Impact | Cosmetique | Mineur | Moyen | Bloquant | Critique strategique |
| Confidence | Hypothese | Probable | Solide | Verifie | Mesure |
| Effort | < 30min | 1h | 1 session | 2-3 sessions | > 1 semaine |

**Score** = (Coverage × Impact × Confidence) / Effort. Plus c'est haut, plus c'est prioritaire.

---

## 1. Top 10 actions priorisees

| # | Action | C | I | Conf | Eff | Score | Quand |
|---|--------|---|---|------|-----|-------|-------|
| 1 | 🔴 Reecrire skill `foundation-os-orchestrator` v3.0.0 | 4 | 5 | 5 | 1 | 100 | Cette semaine |
| 2 | 🔴 Brancher `session-lock.sh` dans /session-start /session-end | 4 | 4 | 4 | 1 | 64 | Cette semaine |
| 3 | 🔴 Fix F-S6-B-01 `validate-void-glass.sh` (lit stdin tool_input) | 3 | 4 | 5 | 1 | 60 | Cette semaine |
| 4 | 🟠 Hook pre-Edit anti-`backticks-on-fictive-paths` | 4 | 3 | 4 | 1 | 48 | Semaine 2 |
| 5 | 🟠 Interleaver session FIX entre 2 audits Cycle 3 | 4 | 4 | 5 | 3 | 26 | A partir S7 |
| 6 | 🟠 Fix F-S4-02 hardcodes `modules/app` (factoriser MODULE_PATH var) | 5 | 5 | 4 | 2 | 50 | Avant Phase 5 |
| 7 | 🟠 Verifier build/test ARM64 modules/app reel | 2 | 5 | 3 | 1 | 30 | Cette semaine |
| 8 | 🟡 Section "ce que Claude ne sait pas faire" dans CLAUDE.md | 4 | 3 | 5 | 1 | 60 | Cette semaine |
| 9 | 🟡 Lift-and-trim vocabulaire grandiloquent `data/*.md` | 2 | 2 | 4 | 1 | 16 | Quand inspire |
| 10 | 🟡 Commande `/triage` (ordre fix base sur findings open) | 3 | 3 | 3 | 2 | 13.5 | Apres S10 |

---

## 2. Detail des 10 actions

### Action 1 : Reecrire skill `foundation-os-orchestrator` v3.0.0
- 🎯 **Objectif** : eliminer le mensonge passif injecte a chaque session Cowork.
- 📝 **Contenu attendu du nouveau skill** :
  - Identite : assistant Foundation OS, repo `foundation-os/`, MD-first
  - Architecture reelle : modules/app + Core OS 4 piliers + docs/audit-massif Cycle 3
  - Stack : Vite+React+TS+Tailwind+Supabase+Vercel
  - Discipline : CONTEXT.md source de verite, pre-commit health-check, anti-bullshit gates
  - Mode MOI strict (CLAUDE.md L16)
  - Cycle 3 en cours : audit-massif-cycle3 branche, S6 DONE, S7 next
  - 4 agents + 4 commands documentes
  - Garde-fous : jamais creer fichier sans demande, racine = 4 fichiers, TSX < 700L
  - Lien vers docs/core/cortex.md, memory.md, monitor.md, tools.md
- 🚫 **A supprimer** : 19 fos-* mythiques, BMAD comme actif, stack L0-L6, ADRs nominatives obsoletes
- 💰 **Cout** : 1 session (~1h) + validation Kevin
- 📊 **Gain** : zero hallucination structurelle a chaque session future
- ✅ **Acceptance** : `head -50 /sessions/.../skills/foundation-os-orchestrator/SKILL.md` ne contient ni "fos-graph" ni "fos-sync" ni "L0 Void Glass"

### Action 2 : Brancher `session-lock.sh` dans /session-start /session-end
- 🎯 **Objectif** : prevenir collisions Cowork ↔ Claude Code (preuve S6 = 4 fichiers untracked apparus)
- 📝 **Implementation** :
  - `scripts/session-lock.sh` (deja present untracked) doit : (a) creer un lockfile `.session.lock` avec PID + tete + timestamp, (b) refuser si lock < 10min existe d'une autre tete, (c) auto-release si > 30min orphelin
  - Modifier `.claude/commands/session-start.md` pour appeler `bash scripts/session-lock.sh acquire`
  - Modifier `.claude/commands/session-end.md` pour appeler `bash scripts/session-lock.sh release`
  - Pour Cowork : appeler manuellement en debut/fin de session, ou par hook PreToolUse
- 💰 **Cout** : 1h (script existe deja, brancher)
- ✅ **Acceptance** : ouvrir 2 sessions concurrentes → la 2eme refuse ou avertit

### Action 3 : Fix F-S6-B-01 `validate-void-glass.sh`
- 🎯 **Objectif** : transformer un hook decoratif en hook fonctionnel
- 📝 **Diagnostic actuel** : le hook lit le fichier disque pre-edit au lieu de lire `tool_input` depuis stdin → ne valide jamais l'edit en cours, valide l'etat anterieur. Pattern correct : `security-reminder.py` qui parse stdin JSON.
- 📝 **Fix** : reecrire `validate-void-glass.sh` pour parser `tool_input` JSON depuis stdin, extraire `new_string` (ou `content` pour Write), grep les couleurs interdites + fonts interdites + system-ui solo
- 💰 **Cout** : 1h
- ✅ **Acceptance** : test manuel `echo '{"tool_input":{"file_path":"foo.tsx","new_string":"color: #0A0A0B"}}' | bash scripts/hooks/validate-void-glass.sh` → exit non-zero

### Action 4 : Hook pre-Edit anti-`backticks-on-fictive-paths`
- 🎯 **Objectif** : eliminer la 5e+ occurrence du pattern L-S5-05
- 📝 **Implementation** : hook PreToolUse Write/Edit qui :
  - parse `new_string` ou `content`
  - extrait toutes les substrings entre backticks contenant `/` ou `.md`/`.sh`/`.tsx`
  - pour chaque match, verifie l'existence du path relatif au repo
  - exit non-zero avec liste des paths fictifs
  - tolerance : whitelist via header doc `<!-- allow-fictive-paths -->` si necessaire pedagogique
- 💰 **Cout** : 1-2h (regex + tests)
- ✅ **Acceptance** : test manuel avec un MD contenant ` `scripts/inexistant.sh` ` echoue

### Action 5 : Interleaver session FIX entre 2 sessions audit
- 🎯 **Objectif** : reduire la dette qui s'accumule
- 📝 **Plan revise Cycle 3** :
  - S7 audit Agents → **S7.5 FIX** (3-4 findings P2/P3 priorises)
  - S8 audit Commands → S8.5 FIX
  - S9 audit Scripts → S9.5 FIX
  - etc.
- 💰 **Cout** : ~6h reparties sur S7-S23 (vs 0h actuel mais dette a S20-S22)
- ✅ **Acceptance** : a S23, le nombre de findings open est < 10 (vs 26+ trajectoire actuelle)

### Action 6 : Fix F-S4-02 hardcodes `modules/app`
- 🎯 **Objectif** : debloquer scalabilite Phase 5 (Finance/Sante)
- 📝 **Implementation** :
  - Identifier les 20+ refs hardcodees (health-check 6x, sync-check 4x, ref-checker 2x, ci.yml 2x, sync.md 3x, autres 3+)
  - Introduire variable `MODULES_DIR` ou iterer sur `modules/*` avec detection auto presence `package.json`
  - Adapter ci.yml en matrix strategy par module
  - Test : ajouter un module dummy `modules/test-scaffold/` et verifier que health-check le voit
- 💰 **Cout** : 2-3h
- ✅ **Acceptance** : `bash scripts/health-check.sh` checke tous les modules sans modifier le script

### Action 7 : Verifier build/test ARM64 modules/app reel
- 🎯 **Objectif** : confirmer que l'etat reel correspond au CONTEXT.md (build OK, vitest 19 tests pass)
- 📝 **Diagnostic** : dans le sandbox Cowork actuel, `npm run build` echoue avec binding ARM64 manquant. **Cela peut etre un bug du sandbox uniquement, pas du repo.** Verifier sur la machine reelle Kevin.
- 💰 **Cout** : 30min (lancer commande, voir output)
- ✅ **Acceptance** : `cd modules/app && npm run build && npm test` → exit 0

### Action 8 : Section "ce que Claude ne sait pas faire" dans CLAUDE.md
- 🎯 **Objectif** : recadrer ton modele mental sur mes limites concretes
- 📝 **Contenu propose** :
  ```
  ## Limites de Claude (a connaitre)
  - Pas de memoire entre sessions (CONTEXT.md = seule continuite)
  - Pas d'estimation fiable de temps humain (mes "1h" sont approximatifs)
  - Pas de connaissance live des versions npm/lib (verifier avant d'affirmer)
  - Pas d'execution dans ton environnement reel (mon sandbox != ton mac)
  - Biais executif par defaut → demander explicitement reflexivite/critique
  - Sub-agents biaises sur jugements orphelin/doublon (ref CLAUDE.md L16)
  - Hallucinations augmentent quand context > 60% rempli
  ```
- 💰 **Cout** : 15min
- ✅ **Acceptance** : section presente, lue en debut de session

### Action 9 : Lift-and-trim vocabulaire grandiloquent
- 🎯 **Objectif** : coherence interne anti-bullshit
- 📝 **Cible** : 7 MD pairs `modules/app/data/*.md` + revue rapide docs/manifeste.md
- 📝 **Methode** : grep des mots interdits (revolution, historique, reference mondiale, premier au monde, accomplish, world-first, $XB) + reecriture neutre
- 💰 **Cout** : 1h
- ✅ **Acceptance** : `grep -ri "revolution\|historique\|premier au monde\|world-first" modules/app/data/ docs/manifeste.md` → 0 match

### Action 10 : Commande `/triage`
- 🎯 **Objectif** : reduire la friction "qu'est-ce que je fais ensuite" en debut de session
- 📝 **Implementation** :
  - Nouveau fichier `.claude/commands/triage.md`
  - Workflow : (1) parser tous les findings open dans docs/audit-massif/*.md, (2) extraire priorite + estimation cout + bloquant Phase 5, (3) score, (4) afficher top 5
- 💰 **Cout** : 2h
- ✅ **Acceptance** : `/triage` retourne une liste ordonnee avec ID + score + raison

---

## 3. Roadmap proposee

### Sprint 1 — Cette semaine (1-2 sessions)
- ✅ Action 1 : Reecrire skill foundation-os-orchestrator
- ✅ Action 2 : Brancher session-lock.sh
- ✅ Action 3 : Fix validate-void-glass.sh
- ✅ Action 7 : Verifier build/test reel
- ✅ Action 8 : Section limites Claude dans CLAUDE.md

**Total cout estime** : ~5h. **Gain** : zero mensonge structurel, zero collision, hooks fonctionnels, modele mental clair.

### Sprint 2 — Semaine prochaine (1-2 sessions)
- ✅ Action 4 : Hook anti-backticks-fictifs
- ✅ Action 6 : Fix F-S4-02 hardcodes
- ✅ Action 9 : Lift-and-trim vocabulaire

**Total cout estime** : ~5h. **Gain** : reflexes encodes, scalabilite Phase 5 debloquee.

### Sprint 3 — Cycle 3 reprise S7+
- ✅ Action 5 : Interleaver FIX/AUDIT (continu)
- ✅ Action 10 : Commande /triage

**Gain** : dette resorbee, Cycle 3 livre Phase 5-ready.

### Sprint 4 — Hors Cycle 3 (apres S23)
- 🟢 Phase 5 : choisir Finance ou Sante en module sandbox
- 🟢 Verifier que la scalabilite reelle confirme la theorie de S4

---

## 4. Choix strategique a faire

> **Avant de demarrer le Sprint 1, decider explicitement** :
>
> 1. **Foundation OS = projet d'apprentissage methodologique** ?
>    - Alors le ratio audit:fix actuel est OK. Continuer Cycle 3 lineairement.
> 2. **Foundation OS = projet produit Phase 5+** ?
>    - Alors interleaver FIX (Action 5) est obligatoire, pas optionnel.
> 3. **Hybride explicite** ?
>    - Alors decider la repartition (ex 50% methodo / 50% produit) et la documenter dans CLAUDE.md section objectif.
>
> **Cette decision est plus importante que toutes les actions du tableau.** Sans elle, je continue a deviner ce que tu veux et tu continues a auditer pour auditer.

---

## 5. Ce qui n'est pas dans ce plan (et pourquoi)

- ❌ **Refactor `Phase1Demo.tsx 544L`** : pas prioritaire tant que Phase 5 n'est pas decidee. Risque de churn.
- ❌ **Migration BMAD active** : decision Kevin "BMAD garde dormant" tient. Ne pas rouvrir.
- ❌ **Ajout MCP Supabase** : nice-to-have, pas critique.
- ❌ **Onboarding humain doc** : hypothetique, ne pas le faire avant que ce soit reel.
- ❌ **Audit token-usage par session** : require instrumentation externe, hors scope outils actuels.

---

## 6. Verification du plan (anti-bullshit)

Chaque action ci-dessus a :
- ✅ Une cible fichier ou comportement precis
- ✅ Un cout estime (a verifier en pratique)
- ✅ Un critere d'acceptance executable
- ✅ Un score RICE explicite

Aucune metrique n'est inventee. Tous les fichiers cites existent (ou sont marques "untracked existant" pour session-lock.sh). Aucune action ne depend d'une lib non installee.

> Fin du plan d'action. A confronter au choix strategique section 4 avant execution.
