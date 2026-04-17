# COWORK-CONTEXT

> Fichier proprietaire Cowork. CLI peut le LIRE mais ne DOIT PAS l'ecrire.
> Jumeau de `CONTEXT.md` (proprietaire CLI, Cowork read-only).
> But : permettre travail parallele CLI + Cowork sans collision ni verrou.

## Ownership strict

| Fichier | Proprietaire (write) | Autre tete |
|---------|----------------------|------------|
| `CONTEXT.md` | Claude Code CLI | Cowork = read-only |
| `COWORK-CONTEXT.md` | Cowork | CLI = read-only |

Regles :
- Aucune ecriture croisee. Jamais.
- Aucune duplication d'info. Une info vit dans un seul des deux fichiers.
- Les decisions Cowork qui doivent devenir globales passent par la section "Propositions a acter Kevin" ci-dessous. Kevin valide → CLI integre dans CONTEXT.md. Cowork ne touche jamais CONTEXT.md directement.

## Session Cowork en cours

- **Date** : 2026-04-16
- **Titre** : 🪐 - 📐 ARCHI Prompt Stitch Dashboard Monitoring FoundationOS (2026-04-16)
- **Travail actif** : Redaction d'un prompt MD ultra-detaille a coller dans Google Stitch pour generer le visuel d'un dashboard de monitoring couvrant la totalite de FoundationOS (12 vues hierarchiques, 12 clusters de signaux, 3 verdicts universels SAIN/DEGRADED/BROKEN, zero specification visuelle — Kevin gere couleurs/typo/motion directement dans Stitch).
- **Dossier livrables** : `docs/travaux-cowork/2026-04-16-prompt-stitch-dashboard-monitoring/`

## Derniere action Cowork

- **2026-04-16** — Creation dossier `docs/travaux-cowork/2026-04-16-prompt-stitch-dashboard-monitoring/` avec 2 livrables : `00-INDEX.md` (sommaire + sources verifiees + ownership) et `01-prompt-stitch-dashboard-monitoring.md` (prompt final, 1207 lignes, 28 sections niveau 2, 143 sections niveau 3, 12 vues hierarchiques, 48 occurrences SAIN/DEGRADED/BROKEN, 0 emoji, frontmatter YAML valide). Verification via subagent general-purpose : verdict SAIN, zero marqueur `END-PART` residuel, terminaison propre sur `<!-- END-PROMPT -->`. Perimetre couvert : modules, plans, Core OS, wiki, worktrees, MCPs, metriques, decisions, risques, sessions, idees. Format : un seul MD a coller integralement dans Google Stitch. Pret a livrer Kevin.
- **2026-04-14 (soir)** — Refonte v2 TDAH des specs ecrites : `01-specs-morning-brief.md` et `02-specs-hebdo-synthesis.md` entierement reecrits. Nouvelle structure alignee sur les HTML v2 (philosophie de rendu, sections HTML cards, classes CSS, interdiction formelle des cadres box-drawing et barres ASCII, Hick's law sur CTA, Vulgarisation prose). Dossier `2026-04-14-briefs-foundation-os/` est maintenant coherent : 4 livrables (01 spec morning v2, 02 spec hebdo v2, 04 exemple morning v2, 05 exemple hebdo v2) + 00-INDEX + 03-sources.
- **2026-04-14 (fin journee)** — Refonte v2 TDAH-friendly des deux HTML d'exemple (`04-exemple-morning-2026-04-14.html` et `05-exemple-hebdo-s15.html`). Nouveau langage visuel : titres conversationnels evocateurs, sections icon+titre+sous-titre, cards backgrounds colores, progress bars / bars de velocite gradient, vulgarisation prose, Hick's law sur les CTA, whitespace genereux. Validation Kevin : "C'est bien mieux. Ok, on part la-dessus."
- **2026-04-14** — Ouverture dossier `2026-04-14-briefs-foundation-os/`. Creation : `00-INDEX.md`, `01-specs-morning-brief.md`, `02-specs-hebdo-synthesis.md`, `03-sources-et-regles.md`, `04-exemple-morning-2026-04-14.html` (v1 puis v2), `05-exemple-hebdo-s15.html` (v1 puis v2). Desyncs Asana e19+e20 detectees. Scheduling non active (phase 2).
- **2026-04-13** — Creation `14-plan-execution-consolide.md` (52 blocs fusionnes, gates G1/G2 arbitres). Patch `06-plan-execution.md` (note tete + gates marques arbitres). Patch `00-INDEX.md` (ajout 14, ordre lecture reajuste).
- **2026-04-13** — Creation de ce fichier `COWORK-CONTEXT.md` + preparation patchs Project Instructions Cowork et CLAUDE.md pour architecture parallele.
- **2026-04-13 (fin session)** — Protocole anti-compactage deploye (3 couches) : auto-memory `feedback_post_compactage.md`, section Checkpoint dans ce fichier, patch §13 Project Instructions Cowork applique par Kevin. Session Cowork close.

## Etat pre/post-compactage

- **Dernier compactage detecte** : 2026-04-16 (session Prompt Stitch, apres redaction Parts 1-2 et verification subagent)
- **Checkpoint post-compactage** : reprise propre via summary fourni par le runtime. Tache pending identifiee = maj COWORK-CONTEXT.md (cette section). Livrable principal deja valide SAIN avant compactage. Aucune divergence detectee entre summary et etat filesystem.
- **A reprendre si nouveau compactage** : livrable `2026-04-16-prompt-stitch-dashboard-monitoring/01-prompt-stitch-dashboard-monitoring.md` est complet et valide (1207 lignes, 28 sections, 12 vues). Reste : session close + lien computer:// livre a Kevin. Patchs CLI (2 et 3) toujours pending cote architecture parallele.

## Checkpoint anti-compactage (lu en priorite apres compactage)

> Si tu lis ce bloc apres un compactage, applique le protocole ci-dessous AVANT toute action non-triviale.

**Protocole obligatoire post-compactage** (redondant avec Project Instructions §Protocole post-compactage et auto-memory `feedback_post_compactage.md`) :

1. STOP toute action non-triviale.
2. Annoncer : "🔄 Compactage detecte. Mode vigilance active."
3. Lire : cette section → "Derniere action Cowork" → `CONTEXT.md` sessions recentes + prochaine action → fichier(s) pointes.
4. Resume de reprise 4 lignes max : dit / manque / verifie / prochaine etape supposee.
5. Poser 1-3 questions ciblees a Kevin. Attendre validation.
6. Mettre a jour "Dernier compactage detecte" ci-dessus avec horodatage.

**Tache en cours au dernier snapshot** : Livrable `2026-04-16-prompt-stitch-dashboard-monitoring/01-prompt-stitch-dashboard-monitoring.md` complet (1207 lignes, 28 sections, 12 vues, 0 emoji) et valide via subagent. Tache pending en cours = maj de ce fichier (Session en cours, Derniere action, Travaux actifs, Checkpoint). Ensuite cloture session + lien computer:// a Kevin.

**Points chauds qui peuvent etre perdus dans un resume de compactage** :
- Kevin veut du parallelisme CLI + Cowork reel, pas un faux parallelisme avec verrou.
- Ownership strict : CLI owne `CONTEXT.md`, Cowork owne `COWORK-CONTEXT.md`. Aucune ecriture croisee.
- `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/14-plan-execution-consolide.md` est la source de verite pour l'execution CLI du plan dashboard (52 blocs, gates G1/G2 arbitres).
- Gate G1 = Option C hybrid zero-server. Gate G2 = MD files dans `modules/app/data/` + YAML frontmatter.
- `CLAUDE.md` dit 97 outils mais `docs/core/tools/index.json` dit 98. CLAUDE.md obsolete mais zone CLI → CLI a patcher.

## Travaux Cowork actifs

| Travail | Dossier | Statut |
|---------|---------|--------|
| Prompt Stitch Dashboard Monitoring | `docs/travaux-cowork/2026-04-16-prompt-stitch-dashboard-monitoring/` | 🟢 Livrable pret a coller dans Stitch (01, 1207 lignes, 28 sections, 12 vues) |
| Briefs FoundationOS (morning + hebdo) | `docs/travaux-cowork/2026-04-14-briefs-foundation-os/` | 🟢 Specs 01/02 + exemples 04/05 alignes v2 TDAH. Scheduling + generator = phase 2. |
| Plan Dashboard Monitoring | `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` | 🟢 Pret handoff CLI (fichier 14 source de verite) |
| Evolution Core OS | `docs/travaux-cowork/2026-04-13-evolution-core-os/` | 🔵 Referentiel |
| Architecture parallele CLI/Cowork | ce fichier + patchs pending | 🟡 En cours (patchs a appliquer) |

## Propositions a acter Kevin (pre-remontee CONTEXT)

Rien en attente pour l'instant cote decisions durables.

Candidats a remonter dans CONTEXT.md apres validation Kevin (CLI applique) :
- `D-CTX-SPLIT` : split contexte CLI / Cowork via COWORK-CONTEXT.md, verrou retire. Date : 2026-04-13.
- Reference livrable `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/14-plan-execution-consolide.md` a pointer dans section Travaux Cowork de CONTEXT.md.
- Reference livrable `docs/travaux-cowork/2026-04-14-briefs-foundation-os/` a pointer dans section Travaux Cowork de CONTEXT.md. Nouveau format recurrent : morning brief quotidien (lundi-vendredi 8h) + hebdo synthesis (vendredi 18h). Scheduling + generateur = phase 2.
- Reference livrable `docs/travaux-cowork/2026-04-16-prompt-stitch-dashboard-monitoring/01-prompt-stitch-dashboard-monitoring.md` a pointer dans section Travaux Cowork de CONTEXT.md. Role : source de verite structurelle/fonctionnelle pour le design Stitch du dashboard de monitoring. Complement narratif du plan 14 (execution) cote visuel.
- 2 desyncs Asana detectees lors de la conception du hebdo : e19 (Deploy Vercel, due 2026-04-14) et e20 (Build Commander, due 2026-04-16) probablement faits mais non coches. Arbitrage Kevin requis avant tout coche.

## Patchs en attente d'application

| Cible | Qui applique | Fichier patch | Statut |
|-------|--------------|---------------|--------|
| Project Instructions Cowork (Cowork Settings) | Kevin (recolle) | section "Patch 1 — Project Instructions Cowork" ci-dessous | 🟡 a valider + coller |
| `CLAUDE.md` | CLI | section "Patch 2 — CLAUDE.md" ci-dessous | 🟡 a valider + appliquer |
| `.claude/commands/session-start.md` + `session-end.md` | CLI | section "Patch 3 — Retrait lock" ci-dessous | 🟡 a valider + appliquer |

### Patch 1 — Project Instructions Cowork

A coller dans Cowork Settings du projet 🪐 FoundationOS. Remplace les sections §3, §4, §5 et ajoute §13.

**Remplacer §3 — Memoire partagee — regle d'or** :

```
🧠 3. Memoire partagee — regle d'or (v2 parallelisable)

Foundation OS a 5 tiers (spec : docs/core/communication.md). Cowork et Claude Code partagent les memes tiers mais avec OWNERSHIP STRICT pour permettre le travail parallele.

Tier                Support                     Proprietaire (write)   Read croise
🔥 Session          Conversation en cours        tete active            non applicable
📌 Contexte CLI     CONTEXT.md a la racine       Claude Code CLI        Cowork = oui
📌 Contexte Cowork  docs/travaux-cowork/COWORK-CONTEXT.md   Cowork      CLI = oui
📚 Reference        docs/ (dont docs/core/, docs/travaux-cowork/)       celui qui change   oui
🗃️ Auto-memory      sessions/.../.auto-memory (Cowork) ET ~/.claude/.../memory (CLI)    chaque tete     non partagee

🔑 Regles d'or parallelisables :
- Aucune ecriture croisee. Cowork ne touche JAMAIS CONTEXT.md. CLI ne touche JAMAIS COWORK-CONTEXT.md.
- Aucune duplication. Une info vit dans un seul des deux fichiers contexte.
- Les decisions Cowork qui doivent devenir globales passent par la section "Propositions a acter Kevin" de COWORK-CONTEXT.md. Kevin valide → CLI les integre dans CONTEXT.md. Jamais d'integration directe Cowork → CONTEXT.md.
- Aucun verrou. Les deux tetes peuvent ecrire en parallele sur leurs fichiers respectifs sans collision puisqu'ils sont disjoints.

🧾 Decisions
- Decisions actives CLI : section "Decisions" de CONTEXT.md (max 15).
- Decisions Cowork en attente validation : section "Propositions a acter Kevin" de COWORK-CONTEXT.md.
- Apres validation Kevin, CLI les deplace dans CONTEXT.md. Cowork supprime sa proposition.
```

**Remplacer §4 — table Architecture (colonne "CONTEXT.md, docs/core/*" remplacee par deux lignes)** :

```
Zone                                Cowork                              Claude Code CLI
.claude/, scripts/*.sh, CLAUDE.md, Git    🚫 read-only / exec                  ✅ proprietaire
modules/app/src/** (code prod)            🚫 sauf demande Kevin                ✅ proprietaire
CONTEXT.md                                🚫 read-only                         ✅ proprietaire
COWORK-CONTEXT.md                         ✅ proprietaire                      🚫 read-only
docs/core/*                               ✅ si Kevin demande                  ✅ proprietaire (par defaut)
docs/travaux-cowork/**, docs/specs/, docs/plans/, docs/audit-massif/    ✅              ✅
MCPs, skills, computer-use, livrables docx/xlsx/pptx/pdf    ✅ proprietaire      🚫
```

**Remplacer §5 — Protocole de session Cowork (retrait verrou)** :

```
🔒 5. Protocole de session Cowork (v2 sans verrou)

Le verrou scripts/session-lock.sh n'est plus utilise en session-start/end. Le parallelisme est garanti par l'ownership strict des fichiers (§3 et §4). Le script reste disponible pour un usage ponctuel si Kevin le demande explicitement (ex. operation risquee sur docs/ qui toucherait aux deux zones).

🟢 Session-start Cowork

1. 📖 Lire COWORK-CONTEXT.md integralement → session Cowork precedente, travaux actifs, patchs en attente, Checkpoint anti-compactage.
2. 📖 Lire CONTEXT.md (read-only) → modules, sessions recentes, cap, prochaine action CLI.
3. 📖 Lire CLAUDE.md (read-only) pour se re-caler.
4. 🔍 ls foundation-os/ → confirmer racine = CLAUDE.md + CONTEXT.md + README.md + .gitignore + dossiers. Orphelin → signaler.
5. 🩺 Optionnel : bash scripts/health-check.sh.
6. 📝 Annoncer en format court :
   Foundation OS (Cowork) — Session [date]
   Travail Cowork actif : ...
   Derniere action Cowork : ...
   Cap CLI en cours : ...
   Patchs en attente : ...
   On y va ?
7. ⏸️ Attendre confirmation Kevin avant tout travail non-trivial.

🛑 Session-end Cowork

1. 📋 Lister les changements (crees / modifies / supprimes) — uniquement dans zone Cowork.
2. 🧪 Si livrables binaires crees (docx, pptx, etc.) : verifier ouvrables, linker en computer://.
3. 📝 Mettre a jour COWORK-CONTEXT.md :
   - "Derniere action Cowork" remplacee
   - "Travaux Cowork actifs" si statut a bouge
   - "Propositions a acter Kevin" si nouvelles decisions a faire remonter
   - "Checkpoint anti-compactage" : horodatage + etat courant
4. 💾 Ne pas committer. Proposer le message au format type(scope): description, laisser Kevin / CLI committer.
5. 🧹 Nettoyer les scratch files.

🔁 Pas de refresh de verrou. Le parallelisme est structurel, pas temporel.
```

**Ajouter §13 — Protocole post-compactage (nouvelle section obligatoire)** :

```
🔄 13. Protocole post-compactage (obligatoire, non-negociable)

Le contexte peut etre compacte a tout moment. Les resumes de compactage sont TOUJOURS insuffisants. Reprendre en yolo apres compactage = risque de derive, regression, repetition de travail deja fait.

🔎 Detection

Si le contexte de demarrage contient le marqueur "This session is being continued from a previous conversation" ou toute trace visible de resume de compactage → protocole obligatoire active.

🛡️ Protocole force

1. STOP toute action non-triviale. Zero tool call non-lecture avant validation Kevin.
2. Annoncer explicitement : "🔄 Compactage detecte. Mode vigilance active."
3. Lire dans l'ordre :
   - COWORK-CONTEXT.md sections "Checkpoint anti-compactage" + "Derniere action Cowork" + "Travaux Cowork actifs"
   - CONTEXT.md sections "Sessions recentes" + "Cap" + "Prochaine action"
   - Le(s) fichier(s) pointes par la derniere action Cowork
4. Produire un resume de reprise en 4 lignes max :
   - Ce que le resume de compactage dit clairement
   - Ce qui manque ou est flou dans le resume
   - Ce que je viens de verifier dans les fichiers
   - Ce que je pense etre la prochaine etape
5. Poser 1 a 3 questions ciblees a Kevin AVANT d'executer :
   - Confirmation de la prochaine etape
   - Verification d'hypotheses non presentes dans les fichiers
   - Alignement sur un point ambigu du resume
6. Attendre validation explicite. Pas de "je suppose que..." sans check.
7. Mettre a jour COWORK-CONTEXT.md section "Etat pre/post-compactage" : horodatage du compactage detecte + verdict de reprise.

🚫 Exceptions

Seule exception : reponse factuelle immediate (1 question, 0 tool call d'ecriture). Des qu'il y a edition, creation, plan, ou decision structurelle → protocole obligatoire sans exception.

⚠️ Limite honnete

Ce protocole depend de la detection du marqueur de compactage. Si Anthropic change le format, la detection peut echouer. Redondance via (a) Project Instructions (cette section), (b) section "Checkpoint anti-compactage" de COWORK-CONTEXT.md, (c) auto-memory feedback_post_compactage.md. Les 3 couches doivent cohabiter.
```

### Patch 2 — CLAUDE.md (pour CLI)

A appliquer par CLI dans `CLAUDE.md`. Cowork ne l'applique jamais lui-meme.

**Ajouter apres la section "Garde-fous (non-negociable)"** :

```
## Parallelisme CLI / Cowork

- Le contexte est split en deux fichiers proprietaires disjoints :
  - `CONTEXT.md` (racine) : proprietaire CLI. Cowork = read-only.
  - `docs/travaux-cowork/COWORK-CONTEXT.md` : proprietaire Cowork. CLI = read-only.
- Regles :
  - CLI ne touche JAMAIS `COWORK-CONTEXT.md`.
  - Les propositions Cowork a integrer dans `CONTEXT.md` sont listees dans la section "Propositions a acter Kevin" de COWORK-CONTEXT.md. CLI lit cette section en session-start apres validation Kevin, integre dans CONTEXT.md, et signale a Kevin que Cowork peut nettoyer sa proposition.
  - Aucun verrou. Le parallelisme est structurel (fichiers disjoints), pas temporel.
- Session-start CLI : lire CONTEXT.md en premier, puis COWORK-CONTEXT.md en read-only pour avoir le contexte travail Cowork.
- Session-end CLI : mettre a jour CONTEXT.md uniquement. Jamais COWORK-CONTEXT.md.
```

**Mettre a jour le compteur outils** :
```
- Ligne "Tools v2 — catalogue 97 outils" → "catalogue 98 outils"
- Verifier `docs/core/tools/index.json` qui dit total_tools: 98 → source de verite.
```

**Retirer toute reference au verrou session-lock** dans CLAUDE.md s'il y en a (a ma connaissance il n'y en a pas directement mais CLI a verifier).

### Patch 3 — Retrait lock dans commands CLI

A appliquer par CLI dans `.claude/commands/`.

**`.claude/commands/session-start.md`** :
- Retirer tout bloc qui appelle `bash scripts/session-lock.sh acquire`.
- Remplacer par : `# Lock desactive (v2 parallelisme structurel). Script conserve pour usage ponctuel.`
- Ajouter une lecture read-only de `docs/travaux-cowork/COWORK-CONTEXT.md` apres la lecture de CONTEXT.md.

**`.claude/commands/session-end.md`** :
- Retirer tout bloc qui appelle `bash scripts/session-lock.sh release`.
- Remplacer par : `# Lock desactive (v2 parallelisme structurel).`
- Ajouter check : "Si je viens de toucher COWORK-CONTEXT.md → ERREUR, je n'aurais jamais du. Rollback immediat et signaler Kevin."

**`scripts/session-lock.sh`** : conserver tel quel pour usage ponctuel eventuel. Ne pas supprimer. Ajouter un commentaire en tete : `# Script conserve pour usage ponctuel. Par defaut non appele en session-start/end depuis v2 (parallelisme structurel via ownership).`

## Test en cours — parallelisme CLI + Cowork

Objectif : prouver que CLI et Cowork peuvent ecrire simultanement sans collision.

Protocole propose (a executer apres deploiement des patchs) :

1. Kevin ouvre une session CLI (terminal) et lance un petit travail reel (ex. grep + lecture de fichier, pas d'ecriture CONTEXT.md immediate).
2. En parallele, Kevin reste dans cette session Cowork. Cowork ecrit une ligne dans COWORK-CONTEXT.md (ex. incrementer "Derniere action Cowork").
3. CLI termine son travail et ecrit dans CONTEXT.md (ex. ajouter une ligne de session).
4. Verifier :
   - Aucune erreur "file locked" cote Cowork ni cote CLI
   - `git status` montre 2 fichiers modifies, aucun conflit
   - CLI peut commiter ses changements, Cowork propose son diff sans opposition
   - Les deux tetes ont bien lu l'autre fichier en read-only au demarrage
5. Resultat attendu : 🟢 zero collision, parallelisme operationnel.

Apres le test, consigner le verdict ici :

- **Date test** : _a executer_
- **Verdict** : _a remplir_
- **Observations** : _a remplir_

## Pointeurs

- `CONTEXT.md` — source de verite FoundationOS (CLI)
- `CLAUDE.md` — instructions CLI (CLI)
- `docs/travaux-cowork/` — livrables Cowork
- `/sessions/zealous-epic-mendel/mnt/.auto-memory/` — memoire Cowork (auto)
- `.claude/` — agents et commandes CLI
