# Findings P8 — Economie tokens + optimisation automation

> **Phase P8 du D-AUDIT-TOTAL-01** — Audit economie tokens : layered loading L0-L3 enforcement + budget reels vs targets + subagent strategy + pre-compaction snapshot + optimisations specifiques Opus 4.7 1M context.

## Scope audite

| Metric | Cible (thresholds.json) | Reel | Ecart |
|--------|-------------------------|------|-------|
| hot.md tokens (L0) | 200 | ~1478 | **+639% (7.4x)** |
| CONTEXT.md tokens (L1) | 2000 | ~5305 | **+165% (2.6x)** |
| CONTEXT.md lines | 200 | 149 | ✅ |
| sessions-recent.md | — (L1 contributor) | 436L ~10,900 tokens | implicite L1 depasse |
| L2 combine budget | 10,000 | ~15-20k estime | **+50-100% (1.5x)** |
| Pre-compaction snapshots keep | 14 | 3 actuels | ✅ rotation |

---

## Findings FORME

### F84 🔴 hot.md 7.4x au-dessus target L0 (rappel F25 P2)

**Fait** : `wiki/hot.md` = 82 lignes / 5912 chars / ~1478 tokens. Target L0 = **200 tokens strict** (thresholds.json `l0_tokens_max: 200`).

**Impact economie tokens** :
- Chaque SessionStart charge hot.md = +1300 tokens non-budgetes
- Sur 4 invocations /cockpit (session-patterns analytics) = +5200 tokens inutiles
- Multiplie par N sessions => gaspillage significatif

**Cause racine** : hot.md accumule sections (Last Updated narratif long + Plugin State + 10 Key Recent Facts + Recent Changes + Active Threads + Next Action) alors que spec knowledge.md section 2 dit "500 mots ~80L".

**Fix prevu P12** (AskUserQuestion) : compresser hot.md 82L → 25-30L.

### F85 🔴 CONTEXT.md tokens 2.6x au-dessus L1 target

**Fait** : CONTEXT.md = 149L / 21221 chars / ~5305 tokens. Target L1 = **2000 tokens** (with sessions-recent ensemble).

**Observation** : 149L < 200L garde-fou lignes OK, mais poids en tokens excede pouvoir L1 layered loading.

**Cause racine** : chaque session 2026-04-19 entry = 5-8 lignes verbeuses avec Scope/Livrables/Verifs/Decisions/Commits/Revelations. Sur 5 sessions (max) = 30-50L pures "Sessions recentes".

**Fix prevu P12** : reduire verbosite entries Sessions recentes (rappel F49 P4).

### F86 🟡 Layered loading spec existe + thresholds codifies, mais 0 enforcement

**Fait** :
- Spec : `docs/core/communication.md` section 6.5 (4 layers L0-L3)
- Thresholds : `scripts/thresholds.json` section `wiki.layered_loading` existe avec valeurs
- Cette session (audit total) : j'ai lu L0+L1+L2+L3 (41 fichiers) sans verifier budget

**Cause racine** : aucun hook / script ne **mesure** tokens charges en temps reel. Impossible de savoir "je suis a combien de tokens" sans estimation manuelle.

**Impact** : discipline layered loading depend entierement de moi. Cette session, j'ai largement depasse car tache audit le justifie. Mais pour tache triviale, meme pattern = gaspillage.

**Recommendation P12** : script `token-estimate.sh` qui scan sequence de Read calls + somme chars / 4 pour estimation tokens chargees. Affiche dans brief /session-start "Tokens L1 charges : X / 2000 max".

### F87 🟢 Pre-compaction snapshot FONCTIONNE (rotation + worktree suffix)

**Fait** : `.omc/snapshots/` contient :
- `.gitkeep` (19-04 22:54)
- `20260419-2301-condescending-ardinghelli-4d7d0a.md` (7.3K)
- `20260419-2302-condescending-ardinghelli-4d7d0a.md` (7.3K)
- `20260419-2303-condescending-ardinghelli-4d7d0a.md` (7.3K)

3 snapshots 3 minutes consecutives = hook `PreCompact` triggered.

**Validation** :
- Format suffix worktree OK (fix D-CONCURRENCY-01 applique)
- Rotation 14 respecte (3 << 14)
- Taille ~7KB (hot.md + CONTEXT Cap + TodoWrite)

🟢 OK design.

### F88 🟡 .omc/sessions/ = 70 fichiers / 280K = metadata light

**Fait** : `.omc/sessions/` contient 70 fichiers JSON pour 280K total = ~4K par fichier = metadata session (pas transcripts).

**Rappel lesson** (session-patterns analytics) : **les vrais transcripts** sont dans `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` (58.1MB, 28 sessions analysees). `.omc/sessions/*.json` = metadata only.

**Observation** : 70 fichiers pour 28 sessions analysees = ~2.5 fichiers par session (un par start + end probablement).

**Verdict** : OK normal. Pas de fix.

---

## Findings FONCTION

### F89 🟡 Strategy subagents = coûts élevés mal anticipés

**Fait session courante** :
- Agent A (24 memoires) : thrashing Autocompact → échec = 1 cycle Input + output perdu
- Agent B (commands/agents/settings) : succès = ~2500 tokens input + ~600 output = ~3100 tokens
- Agent C (inventaire + cross-worktree) : bloqué = ~2000 tokens input gaspillés

**Cost estime session subagents** : ~10-15k tokens alloues (3 agents), ~3k produits réellement utilisable. **Ratio utile ~25%**.

**Cause racine** : prompts trop longs + scope ambitieux. Lesson M7 P3 documentee.

**Recommendation forward P9** : module Model Awareness doit inclure section "Strategie subagents Opus 4.7 1M" avec :
- Max 500 mots prompt strict
- Scope precis (lister files par agent)
- Budget tokens estime par agent < 5k input / 2k output
- Fallback Read direct prioritaire

### F90 🟡 Max x20 = discipline sans metric

**Fait** : memoire feedback_neuroplasticity dit "Max x20 = JAMAIS se brider sur les tokens". Foundation OS designe pour Kevin Max x20 plan Anthropic = pas de cap pratique.

**Cette session** : 8 commits, ~50 fichiers lus, 3 subagents, 8 phases audit livrees. Budget consomme **inconnu precisement**.

**Tension** : "no limit" en theorie ≠ "no cost" en pratique. Chaque session contribue a compactage cumul. Session tres longue (cette session ~4h cumulative) risque compactage tardif.

**Recommendation** :
- P9 Module Awareness : documenter "no limit tokens ≠ no strategy"
- P12 candidat : `token-usage-report.sh` qui lit .omc/sessions metadata et estime consommation sur 7j

### F91 🟢 Pre-compaction snapshot = mitigation reelle compactage

**Fait** : 3 snapshots dump `hot.md + CONTEXT.md Cap + TodoWrite actif` dans `.omc/snapshots/`. Si compactage arrive, recovery possible via `cat $(ls -t .omc/snapshots | head -1)`.

**Validation** : fonctionnalite livree D-INTEG-01 Phase 2 active. 🟢 OK.

### F92 🟡 Anti-compactage proof plan D-AUDIT-TOTAL-01 = validation live

**Fait** : ce plan audit total applique STRICTEMENT les 8 principes anti-compactage (commits atomiques par phase + livrables findings-Px sur disque + state.json + dual-path plan + TodoWrite live + stubs forward + pas de subagent write-critical + pre-compaction active).

**Test implicite** : si compactage arrive pendant cette session, Kevin peut :
1. cat `.omc/audit-total/state.json` → phase courante
2. Lire plan + findings-Px deja commit
3. Reprendre a phase suivante

**Validation** : pattern **fonctionne** (cette session en est preuve empirique). 🟢 OK pattern.

---

## Findings META

### M21 🔴 Cerveau collaboratif = cost token non-mesure systematiquement

**Fait** : Foundation OS a riche infrastructure tokens (thresholds, layered loading spec, pre-compaction, subagents) mais **aucune metrique de consommation reelle**.

**Analogie** : on a un speedometre (thresholds), un accelerateur (subagents, Read, Bash), mais pas de jauge kilometrage (tokens consommes/session).

**Impact** :
- Kevin ne sait pas "cette session coute X$" ou "j'ai consomme N% de Max x20 cap theorique"
- Impossible de mesurer gains optimisation (ex. compression hot.md = -1000 tokens/session = economie reelle combien ?)

**Recommendation P12 fort** :
- Parser metadata `.omc/sessions/*.json` + `.omc/sessions-patterns/*.json` (si existent) → script qui estime tokens consommes
- Ou : integrer avec API Anthropic usage endpoints (si accessible)

### M22 🟡 Opus 4.7 1M context = double-edged sword

**Fait** : Opus 4.7 a 1M context window. Cette session = ~50-100k tokens estimes, loin du limit 1M. Mais :
- **Plus de context = plus de latence** (chaque tool call reprocesse tout)
- **Plus de context = compactage plus rare mais quand arrive = plus violent**
- **Plus de context ≠ meilleures reponses** (pattern "lost in the middle" documente)

**Recommendation P9 forte** : documenter dans `docs/core/model.md` les trade-offs Opus 4.7 1M :
- Points forts : subagents paralleles, planifications complexes, audits exhaustifs (comme celui-ci)
- Points faibles : latency, degradation attention mid-context, cost elevated

### M23 🟢 Pattern Option C ambitieuse + anti-compactage = validated live

**Fait** : Audit total = test live anti-compactage sur session longue (4h+ cumulees). Jusqu'ici 8/14 phases livrees sans compactage observable.

**Validation** : combinaison **discipline structurelle (6 elements par phase) + livrables intermediaires (findings-Px) + pre-compaction active + Opus 4.7 1M** permet sessions longues sans degradation.

---

## Synthese verdict P8

**Verdict** : 🟡 **DEGRADED** — infrastructure tokens riche + enforcement absent + gaspillage hot.md/CONTEXT.

**FORME** :
- Thresholds codifies dans thresholds.json (L0 200 / L1 2000 / L2 10000 / snapshots 14)
- Pre-compaction snapshots fonctionnent (3 recents rotation 14 OK)
- hot.md 7.4x au-dessus L0 target, CONTEXT 2.6x au-dessus L1

**FONCTION** :
- 0 mesure tokens consommes par session
- Subagents cost ~75% gaspillage cette session (1/3 thrash)
- Anti-compactage proof pattern fonctionne (preuve empirique audit total)

**Livrables P11 identifies** :
Aucun fix P11 quick-wins (P8 = analyse, pas structurel fixe)

**Report P12 majeurs** :
- F84 : compresser hot.md 82L → 25-30L (AskUserQuestion Kevin)
- F85 : reduire verbosite CONTEXT.md Sessions recentes entries
- F86 : script token-estimate.sh pour mesure layered loading
- F89/M21 : subagent strategy formalisee dans docs/core/model.md P9

**Report P9 critical** :
- F89 : strategie subagents Opus 4.7 (max 500 mots prompt + scope + fallback)
- F90/M22 : trade-offs Opus 4.7 1M context (forces/faiblesses reels)

---

## Cross-refs P8 → autres phases

- F84 → **P12 REFACTOR** (compresser hot.md, AskUserQuestion)
- F85 → **P12 REFACTOR** (reduire verbosite CONTEXT.md)
- F86/M21 → **P12** (script token-estimate)
- F89/F90/M22 → **P9 Model Awareness** (strategie subagents + trade-offs Opus 4.7)
- F91/F92/M23 → **P13 rapport-master** (validation anti-compactage pattern)

---

## Cloture Phase P8

**Livrable** : ce fichier + 11 findings (F84-F92 + M21-M23) + 3 refactors P12 + 3 elements critiques P9.

**Insight cle** : Foundation OS a infrastructure tokens complete (thresholds + layered loading + snapshots) mais **enforcement nul**. hot.md 7.4x au-dessus target L0 = symbole. Pattern "declaratif non-enforced" se confirme (consistent P4 M8 neuroplasticite + P6 M15 feedback loop + P7 M18 tools registry).

**Validation live** : pattern anti-compactage D-AUDIT-TOTAL-01 **fonctionne** (8/14 phases sans thrash Opus 4.7 1M).

**Anti-compactage proof** : fichier sur disque + commit P8/14 incoming.

**Next** : Phase P9 — **Nouveau module Core OS 10e Model Awareness** (creation + recherche doc Anthropic v4.7).

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P8/14 — Claude Opus 4.7 1M context*
