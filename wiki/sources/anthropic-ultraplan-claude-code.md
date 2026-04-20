---
type: source
title: "Ultraplan — Planification cloud Anthropic Claude Code (research preview)"
source_type: feature-doc
author: "Anthropic (Claude Code team, research preview)"
date_published: 2026-04-19
url: ""
confidence: high
fos_compat: medium
effort_estime: S (test) / complexe (integration workflow)
decision: stocker-ref-tester-plus-tard
key_claims:
  - "Feature Claude Code native (pas OMC, pas plugin tiers)"
  - "Status : research preview (breaking changes possibles sans preavis)"
  - "Deplace phase planification dans le cloud Anthropic (CCR = Cloud Container Runtime)"
  - "Agent Opus 4.6 dedie dans session cloud, 30 min compute max"
  - "Snapshot repo synchronise vers CCR pour analyse codebase"
  - "Libere le terminal pendant la planification (vs blocage local)"
  - "Interface web review : inline comments, emoji reactions, outline sidebar"
  - "3 methodes lancement : /ultraplan direct, mot-cle dans prompt, depuis plan local"
  - "2 options execution : cloud direct OU teleport terminal"
  - "Pre-requis : compte Claude Code on the web + repo GitHub connecte + CLI a jour"
  - "Limite plateforme : GitHub uniquement (pas GitLab/Bitbucket)"
  - "Remote Control se deconnecte auto au lancement Ultraplan"
  - "Statuts terminal : ◇ ultraplan (en cours) / ◆ ultraplan ready (pret review)"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - feature-doc
  - claude-code
  - anthropic
  - planning
  - cloud
  - research-preview
  - meta-os
status: mature
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[Foundation OS]]"
  - "[[claude-code-config-guide-2026-04]]"
sources: []
---

# Ultraplan — Planification cloud Anthropic Claude Code (research preview)

## Summary

**Ultraplan = feature native Claude Code** (pas OMC, pas plugin tiers) qui deplace la **phase de planification dans le cloud Anthropic** via Cloud Container Runtime (CCR). Un agent Opus 4.6 dedie analyse un snapshot du repo pendant 30 min max et genere un plan structure reviewable dans une interface web (inline comments + emoji reactions + outline sidebar).

**Principal atout** : **libere le terminal pendant la planification** (vs blocage local classique). Plans souvent plus profonds grace a dedicated compute Opus 4.6 + surface review web riche.

**Status** : **research preview** — comportement et API peuvent changer sans preavis.

## Key Claims (extraction exhaustive)

### Workflow technique
1. **Snapshot du repo** : copie ponctuelle du repo synchronisee vers CCR cloud
2. **Session cloud** : CCR demarre une session dediee avec Opus 4.6, 30 min compute, acces complet via snapshot
3. **Planification** : agent analyse codebase, identifie fichiers/dependances/ordre exec/edge cases, genere plan structure avec sections commentables
4. **Statuts terminal** pendant traitement :
   - `◇ ultraplan` — Claude analyse et redige
   - `◆ ultraplan ready` — plan pret a reviewer en web

### Methodes de lancement (3)
1. **Commande directe** : `/ultraplan <demande>` (ex: `/ultraplan migrate the auth service from sessions to JWTs`) → boite de dialogue confirmation → lancement
2. **Mot-cle dans prompt** : inclure `ultraplan` n'importe ou (ex: "J'aimerais qu'on fasse un ultraplan pour refactorer le systeme de paiement")
3. **Depuis plan local** : apres un plan local classique, choisir "No, refine with Ultraplan on Claude Code on the web" dans la boite validation

### Interface web review (3 outils)
1. **Inline comments** : surligner passage, laisser commentaire, Claude integre + propose version revisee, iterable
2. **Emoji reactions** : reagir section avec emoji pour approbation/vigilance sans commentaire complet
3. **Outline sidebar** : navigation entre sections (utile plans longs multi-composants)

### Options d'execution (2)
1. **Executer sur le web** : click "Approve Claude's plan and start coding" → Claude implemente dans meme session cloud → terminal affiche confirmation, indicateur disparait → diff reviewable + PR createable en web
2. **Teleporter terminal** : click "Approve plan and teleport back to terminal" → session web archivee (evite parallelisme) → terminal affiche plan avec 3 choix :
   - **Implement here** : injecte plan dans conversation actuelle + continue
   - **Start new session** : affiche `claude --resume` pour revenir conversation precedente
   - **Cancel** : sauve plan dans fichier sans executer

### Prerequis
- Compte Claude Code on the web actif
- Repository GitHub connecte (pas GitLab/Bitbucket)
- Claude Code CLI installe et a jour

### Limitations declarees
- **Research preview** : comportement peut changer sans preavis
- **30 minutes max** par session de planification
- **GitHub uniquement** (pas GitLab/Bitbucket)
- **Remote Control se deconnecte** auto au lancement Ultraplan (memes interface web claude.ai/code)

## Entities Mentioned

- **Anthropic** — createur Claude Code et feature Ultraplan
- **[[Claude Code]]** — produit parent
- **Cloud Container Runtime (CCR)** — infra Anthropic pour sessions cloud
- **Opus 4.6** — modele de l'agent de planification cloud
- **GitHub** — seul VCS supporte actuellement

## Concepts Introduced

- **Cloud-offloaded planning** — pattern : deporter phase lourde de planif (analyse codebase + generation plan) vers cloud pendant que terminal reste libre
- **Snapshot-based remote execution** — snapshot repo synchro cloud permet agent distant d'operer sans acces continu filesystem local
- **Web-reviewable plan format** — plan structure avec sections commentables (pas juste markdown plat)
- **Teleport-back pattern** — transferer plan cloud vers conversation locale terminal

## Foundation OS Analysis

### Compat OS

**Medium**. Pertinent conceptuellement, mais **frictions reelles** :

| Aspect | Situation FOS | Compat Ultraplan |
|---|---|---|
| Repo GitHub | ✅ FOS sur GitHub (foundation-os-vercel deploy) | OK |
| Claude Code on the web | ❓ **A verifier** (Kevin Desktop principal, pas forcement web) | Bloquant si non |
| Workflow plan FOS | `/plan-os` orchestrateur local + dual-path le pattern de nommage docs/plans/YYYY-MM-DD-slug.md + 6 elements stricts | **Incompatible direct** — Ultraplan genere brut cloud, pas format FOS |
| Data safety | Memoires personnelles, idees business, notes wiki dans repo | **Snapshot cloud Anthropic** — Kevin OK avec ça ? |
| Research preview status | FOS cherche stabilite (zero regression) | **Risque breaking changes** |
| Duree 30min max | Plans FOS typiques 5-15 phases | Devrait suffire, mais edge cases plans majeurs = limite |

### Effort integration

**Divise en 3 scenarios** :

#### A. Usage manuel occasionnel (test)
**Effort : S**. Kevin teste `/ultraplan` une fois sur un chantier complexe (ex: plan Phase 5 Trading). Verifier output reel, comparer a `/plan-os` local. Pas de modif FOS.

#### B. Integration alternative dans `/plan-os`
**Effort : M-L**. Modifier `.claude/commands/plan-os.md` pour proposer Ultraplan comme option si plan > 15 phases ou refactor multi-modules. Workflow : `/plan-os` → detecte complexity → propose `/ultraplan` → retour plan → format FOS dual-path.
**Probleme** : plan Ultraplan est cloud-brut, devrait etre **post-processed** pour format FOS (6 elements par phase, frontmatter, slug naming). Effort non-trivial.

#### C. Remplacement pur de `/plan-os` par `/ultraplan`
**Effort : XL**. Reecriture complete du workflow. **NE PAS FAIRE**. Perdrait conventions FOS + dual-path + format 6 elements + versioning.

### Ce qui existe deja dans FOS

FOS a **deja un workflow de planification mature** :
- `/plan-os` : orchestrateur skills (brainstorming / writing-plans / ralplan) + EnterPlanMode natif + dual-path versioning
- le pattern de nommage docs/plans/YYYY-MM-DD-slug.md : plan canonique (convention date-slug)
- `~/.claude/plans/<slug>.md` : mirror persist
- 6 elements stricts par phase (pre-conditions, etat repo, actions atomiques, verification, rollback, commit)
- Integration `/session-start` + `/session-end` (plans actifs detectes)
- Memory `feedback_plans_ultra_detailles.md` : convention anti-compactage

Ultraplan ne **remplace pas** ce workflow. Il pourrait le **complementer** pour cas tres specifiques.

### Limites Claude declarees

- **Training** : je ne connais pas Ultraplan par mon training. Tout vient de la source paste Kevin.
- **Pas teste** : n'ai pas execute `/ultraplan` moi-meme. Verdict "Medium compat" base sur la description.
- **Research preview** : Anthropic peut changer l'API a tout moment. Verdict peut devenir obsolete rapidement.
- **Snapshot privacy** : je ne connais pas les details exactes des garanties privacy Anthropic pour les snapshots CCR. Kevin doit verifier docs officielles.
- **Pricing compute** : 30 min Opus 4.6 compute n'est pas gratuit certainement (included Claude Pro ? extra charge ?). Non-documente dans source.

### Risques / pieges

1. **Research preview volatile** : breaking changes possibles, attention fragilite si integre dans workflow critique FOS
2. **Snapshot cloud = data exposition** : contenu repo envoye Anthropic. FOS contient memoires, idees strategiques, notes privees — verifier garanties privacy
3. **30 min limite** : plans FOS Phase 5 (Trading bot complet 5 etapes + sizing Kelly + tests + deployment) pourraient flirter avec limite
4. **Format output non-compatible FOS** : plan cloud-brut != 6 elements FOS. Post-processing manuel necessaire
5. **GitHub lock-in** : si FOS bascule jamais GitLab/Bitbucket (improbable mais possible), Ultraplan devient inutilisable
6. **Remote Control deconnecte** : si Kevin utilise Remote Control, Ultraplan le coupe — friction
7. **Dependency decentree** : plus FOS depend de features Anthropic cloud, plus fragile si Anthropic change strategie

### Verdict

**Stocker ref, tester plus tard** (decision Kevin actuelle).

**Si Kevin teste** (quand opportunite se presente) :
1. Choisir un chantier FOS de **moyenne complexite** (5-10 phases, 1 module) comme test
2. Lancer `/ultraplan` sur ce chantier en parallele de `/plan-os` local
3. Comparer les 2 plans : qualite, profondeur, integration FOS-friendly
4. Si Ultraplan plus riche → considerer integration partielle (scenario B)
5. Si equivalent ou moins bon → skip adoption

**Ne pas** : integrer dans flow automatique sans test reel, changer `/plan-os` pour utiliser Ultraplan comme backend, rendre FOS dependant de cette feature research preview.

### Questions ouvertes (pour futur test)

- Pricing : 30 min Opus 4.6 cloud compute = inclu Claude Pro/Team/Enterprise ou cost additionnel ?
- Privacy : snapshot repo envoye cloud, duree retention Anthropic, purge sur demande ? Docs officielles ?
- Plans longs (>30 min estimes) : fallback ? Reprise ? Ou echec ?
- Integration format FOS : possible d'injecter template 6 elements FOS dans le prompt Ultraplan pour que l'output sorte deja formate ?
- Comparaison qualite : Ultraplan (Opus 4.6 cloud) vs `/plan-os` local (Opus ou Sonnet selon routing) — benchmark reel existe quelque part ?
- Ultra Q&A / Ultra Review / Ultra Word : meme famille research preview ? Source detaillee a trouver.

## Raw Source

- Paste texte par Kevin 2026-04-19
- Source primaire : docs Anthropic (URL non fournie dans paste, probablement docs.claude.com ou blog Anthropic)
- Links cites dans source :
  - Documentation officielle Ultraplan (URL non copiee dans paste)
  - Claude Code on the web (claude.ai/code probable)
  - Plan mode (local) — feature FOS actuelle via `/plan-os`

## Notes

**Pattern a retenir meta-FOS** : cloud-offloaded planning = signal direction Anthropic vers **remote agents persistants** plutot que **CLI local ephemere**. Si tendance se confirme, l'architecture FOS (tres CLI-centric) pourrait devoir evoluer a terme.

**Complement a suivre** : Ultra Q&A / Ultra Review / Ultra Word (meme famille Anthropic research preview probable). A ingerer quand Kevin balance les sources detaillees.

**Stocke uniquement en reference**. Pas d'integration FOS maintenant. Re-evaluation quand :
1. Kevin teste manuellement
2. Research preview passe stable
3. Phase 5 FOS demarre (plans complexes = candidats Ultraplan)
