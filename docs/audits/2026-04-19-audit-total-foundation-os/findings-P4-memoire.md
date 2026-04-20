# Findings P4 — Memoire + neuroplasticite (5 tiers + 24 auto-memoires)

> **Phase P4 du D-AUDIT-TOTAL-01** — Audit systeme memoire Foundation OS : 5 tiers + 24 auto-memoires actives + 13 deprecated + 3 pages meta neuroplasticite + 4 reflexes + hot.md + constitution.md coherence.

## Scope audite

| Tier | Support | Count | Status |
|------|---------|-------|--------|
| 1 Session | Conversation Claude | — | Volatile |
| 2 Contexte | CONTEXT.md | 149L | Active |
| 3 Auto-memory | `~/.claude/projects/.../memory/*.md` | **24 actives + 13 deprecated** | Active (last_used auto-tracked) |
| 4 Reference | `docs/core/*.md` | 14 specs | Active |
| 5 Knowledge | `wiki/**/*.md` | 50 pages | Active |

24 auto-memoires lues par sample (4 en profondeur : user_langue_francais, feedback_neuroplasticity, feedback_subagents_context, feedback_plans_ultra_detailles + MEMORY.md descriptions pour les 20 autres).

---

## Findings FORME

### F44 🔴 MEMORY.md dit 12 deprecated, reel = 13 deprecated

**Fait** :
- `MEMORY.md` header "## Deprecated (12, voir _deprecated/)"
- `ls _deprecated/` = **13 fichiers**

**Gap** : 1 memoire deprecated manquante dans MEMORY.md.

**Liste reelle** :
1. feedback_base_ds_no_archive.md
2. feedback_brief_format.md
3. feedback_ds_iso_figma.md
4. feedback_ds_true_iso.md
5. feedback_imperatifs_qualite.md (ajoute 2026-04-17 audit v2)
6. feedback_minimal_files.md (ajoute 2026-04-17)
7. feedback_no_bullshit.md
8. feedback_no_token_limit.md (ajoute 2026-04-17)
9. feedback_tdah_briefs.md
10. project_audit_v2_s3_handoff.md (ajoute 2026-04-17)
11. project_ds_rebuild_plan.md
12. project_ds_refactor_app.md (ajoute 2026-04-17)
13. project_ds_voidglass_plan.md

**Recommendation P11** : recompter MEMORY.md → 13 ou regenerer le count.

### F45 🟢 24 auto-memoires toutes tracked par last_used

**Fait** : 24/24 memoires ont frontmatter `last_used: YYYY-MM-DD`. Mecanique D-INTEG-01 Phase 16 active (memory-last-used-hook.sh PreToolUse Read).

**Sample dates** :
- 17 memoires : `last_used: 2026-04-17` (cluster jour specifique)
- 7 memoires : `last_used: 2026-04-20` (recentes, aujourd'hui session)

**Observation** : aucune memoire stale (< 30 jours seuil). Le hook fonctionne reellement.

### F46 🟢 Tier contradictions : 0 duplication >= 40 chars

**Fait** : `bash scripts/tier-contradiction-check.sh` → "Aucune duplication >= 40 chars detectee (5 tiers scannes)".

**Validation** : les 5 tiers sont DISJOINTS au niveau texte >= 40 chars. Principe "une info = un tier" respecte (avec seuil strict).

**Nuance** : le seuil 40 chars ne detecte pas les redondances conceptuelles (ex. P-01 executer a la lettre est dans CLAUDE.md L10 + constitution.md P-01 = redondance FONCTIONNELLE mais detectee "source tracee" donc pas conflit). Le scan est strict textuel, pas semantique.

### F47 🟡 Categorie deprecated mixe types (feedback vs project)

**Fait** : 13 deprecated = 9 feedback_* + 4 project_*.
- feedback_ : regles comportementales superseded par d'autres feedback ou par CLAUDE.md
- project_ : plans deja executes (DS rebuild, audit S3 handoff, etc.) qui ne sont plus "active"

**Distinction** :
- Les feedback_ deprecated peuvent etre supprimes apres X mois (pas de valeur historique unique)
- Les project_ deprecated sont des snapshot de chantiers executes — valeur historique

**Recommendation P12** : separer `_deprecated/feedback/` et `_deprecated/project/` OU purger les feedback_ anciens (> 90 jours inactifs). Optionnel, pas bloquant.

---

## Findings FONCTION

### F48 🔴 4 reflexes neuroplasticite = discipline manuelle, 0 enforcement

**Fait** (rappel audit v2 mega 2026-04-16) :
- Reflexe 1 : Recall wiki avant reponse technique (API `$CLAUDE_USER_PROMPT` inexistante, lesson 2026-04-17 I-01)
- Reflexe 2 : Consolidation post-ingest (discipline Claude uniquement)
- Reflexe 3 : Lessons learned (discipline + pattern 🎯 to-constitute documente)
- Reflexe 4 : Self-check session-end (inclus dans `/session-end` Phase mais pas d'auto-verification)

**Gap** : aucun hook ne FORCE ces 4 reflexes. Depend totalement de ma discipline session par session.

**Preuve empirique** : session-patterns.md montre ratio delegation Task = 0.0% sur 28 sessions. Signe que meme les patterns documentes (subagents "autorises" feedback) ne sont pas applique systematiquement — encore moins les reflexes wiki.

**Impact cerveau collaboratif** :
- Si je rate reflex 1, je reinvente des solutions pour des problemes deja dans lessons-learned
- Si je rate reflex 3, j'oublie d'ecrire les leçons → futurs Claude retombent dans les memes pieges

**Recommendation** :
- **P12 candidat** : ajouter a chaque /session-start une note "Aujourd'hui tes 4 reflexes sont X/4 activated" (force prise de conscience)
- **Long terme** : investiguer si future Anthropic API expose un moyen d'intercepter prompt (lesson 2026-04-17 I-01 disait non pour hooks, mais SDK ?)

### F49 🟡 3 pages meta neuroplasticite = coherence mais updates inegaux

**Fait** :
| Page | Lignes | Dernier update |
|------|--------|----------------|
| `wiki/meta/thinking.md` | 89 | 2026-04-16 + appends recents |
| `wiki/meta/sessions-recent.md` | 436 | 2026-04-19 (D-PRODUCT-01) |
| `wiki/meta/lessons-learned.md` | 293 | 2026-04-19 |

**Coherence** : les 3 sont mises a jour par Claude lors de /session-end. Mais :
- `thinking.md` est la plus legere (89L) — peu d'insights capitalises
- `sessions-recent.md` croit vite (436L pour 5 sessions recentes seulement = ~87L/session)
- `lessons-learned.md` 293L stable, ajouts ponctuels

**Observation** : sessions-recent.md pourrait accumuler trop. Max 5 sessions impose mais chaque session = 70-100L (pattern D-BODY-01/D-PRODUCT-01 tres detailles).

**Recommendation** : P12 — limiter chaque entry sessions-recent a ~30L (brief resume + threads ouverts), detail dans git log + plan archive.

### F50 🟡 MEMORY.md = index mais duplication possible avec auto-chargement natif

**Fait** : MEMORY.md = 200+ lignes. Liste les 24 actives avec description + pointers. Est charge automatiquement par Claude Code natif au session-start (header system prompt).

**Mecanique** : chaque memoire a frontmatter `name` + `description` utilise pour **relevance matching**. MEMORY.md = navigation manuelle. Potentiellement redondant avec le matching natif.

**Observation** : a chaque nouvelle memoire (via /learner skill ou write manuel), MEMORY.md doit etre updated manuellement. Si oublie, index stale (F44 est un cas).

**Recommendation** : P12 candidat — script `bash scripts/memory-index-sync.sh` qui regenere MEMORY.md depuis les frontmatters. Automatisation qui evite F44 future.

### F51 🟢 feedback_neuroplasticity.md = spec fonctionnelle 5 tiers

**Fait** : memoire `feedback_neuroplasticity.md` (2026-04-19 update) = 40 lignes, synthese complete architecture 5 tiers + 4 reflexes + routines Cloud + regles.

**Validation** : pointe vers `docs/core/knowledge.md` section 8 comme tier canonique. Respect P-30 tier canonique (pas duplication). 🟢 OK.

### F52 🟡 feedback_subagents_context.md lesson pas appliquee cette session (F47 P3 rappel)

**Fait** : memoire `feedback_subagents_context.md` explicite : "Plus le prompt est complet, plus le sous-agent livre juste. Prompt sous-agent minimum (7 points) : 1. Contexte projet 2. Regles absolues 3. Reference pattern 4. Sections source 5. Liste taches 6. Protocole 7. Verification finale."

**Realite session courante** : j'ai respecte les 7 points pour Agent B (reussi) et Agent C (partiellement). Mais Agent A (24 memoires) avait prompt ~1200 mots qui est tombe en thrashing.

**Cause racine** : la memoire dit "prompt complet" mais ne limite pas la taille. Mes 3 prompts avaient 800-2000 mots. Le seuil critique thrash est entre 1200-2000 mots avec scope lecture massive.

**Recommendation** : **mettre a jour feedback_subagents_context.md** avec :
- "Max 500 mots prompt si scope lecture > 15 fichiers"
- "Fallback Read direct si subagent echoue" (ajout)
- "Verifier charge context avant lancer 3 subagents en parallele" (nuance)

**Fix prevu P11/P12** : edit memoire (tier 3 auto-memory) avec nuances session courante.

### F53 🟡 feedback_plans_ultra_detailles.md applique correctement plan courant

**Fait** : memoire specifie 6 elements par phase. Plan D-AUDIT-TOTAL-01 (ce plan) applique les 6 elements strictement pour P0-P13. Validation live.

**Verdict** : discipline respectee. 🟢 Pattern robuste.

### F54 🟢 user_langue_francais = profil coherent + anti-bullshit concret

**Fait** : memoire user_langue_francais.md = 17L. Kevin francais, dev solo, anti-bullshit concret. Inclut regles "ne jamais ecrire REVOLUTION ACHEVEE, reference mondiale" (duplique P-17 constitution mais explicite exemple concret).

**Validation** : j'applique cette memoire de facto (style commits, messages TDAH, mots interdits respectes).

### F55 🟡 Nomenclature feedback_ vs project_ vs user_ vs work_ — asymmetrie

**Fait** : 24 memoires actives repartition :
- `user_` : 1 (user_langue_francais)
- `feedback_` : 20 (majorite)
- `project_` : 2 (planner_phase2, wiki_adoption)
- `work_` : 1 (work_patterns)

**Observation** : `feedback_` sur-represente. Pas d'ecart normatif clair quand utiliser `feedback` vs `work_patterns` vs `user_` (conventions doc mentionnees `docs/core/naming-conventions.md` section 7 mais appliquees faiblement).

**Recommendation** : P12 — reviser naming conventions section 7 avec exemples concrets pour guider classification future. Optionnel.

---

## Findings META

### M8 🔴 Neuroplasticite = theorique 80%, pragmatique 20%

**Fait** : 4 reflexes + 3 pages meta + routines Cloud + loop.md documentes extensivement. Mais :
- Reflexes : discipline manuelle (F48)
- Routines Cloud : 9 documentees / 0 executees (F37 P3)
- loop.md : jamais invoque en session analytics (session-patterns : 0 trace /loop)
- Self-check /session-end : base via hook auto-archive + Phase Kevin-dependante

**Tension** : documentation tres riche, realisation partielle. Le cerveau "devrait" etre actif mais requiert ma discipline active a chaque session.

**Honnetete P-11** : declarer explicitement dans docs/core/knowledge.md section 8 "Actuellement : 4 reflexes = discipline manuelle, routines Cloud = documentees non-actives, enforcement = 0 hooks". Eviter fausse impression d'automation.

**Recommendation P13** : update docs/core/knowledge.md avec section "Actuel vs cible" honnete.

### M9 🟡 Consolidation memoire en wiki = 2 migrations (historique limite)

**Fait** : 2 memoires migrees wiki (2026-04-15 adoption) :
- `project_migration_desktop.md` → `wiki/domains/dev/concepts/foundation-os-desktop-migration.md`
- `tools_inventory.md` → `wiki/entities/tools-foundation-os.md`

27 autres memoires RESTENT dans auto-memory. Decision : profile Kevin + feedback comportement = bon tier.

**Verdict** : OK pragmatique. Migration selectifs prouvee possible.

### M10 🟡 24 memoires = volume managable mais curation nay

**Fait** : 24 memoires actives + 13 deprecated = 37 fichiers memoires historique. Total ~3000-5000 lignes.

**Comparaison** : certains feedbacks sont tres anciens (2026-04-10 a 2026-04-14) et potentiellement redondants avec CLAUDE.md mis a jour depuis.

**Recommendation P12** : passe de curation — merge feedbacks redondants avec CLAUDE.md post-stabilisation. Peut descendre a 15-18 memoires actives.

### M11 🟢 5 tiers clean — test arbitral fonctionne

**Fait** : `docs/core/communication.md` section 1.5 "Test arbitral — quoi va dans quel tier" = 5 questions ordonnees. Applique quand une nouvelle info arrive. Valide empiriquement (zero tier contradiction detectee F46).

**Validation** : pattern discipline fonctionne pour nouveau contenu.

---

## Synthese verdict P4

**Verdict** : 🟡 **DEGRADED** — architecture memoire solide mais FONCTION partielle.

**FORME** :
- 5 tiers bien distincts, 0 contradiction detectee
- 24 memoires actives tracked last_used
- 13 deprecated archivees (1 mismatch count MEMORY.md)
- 3 pages meta neuroplasticite mises a jour

**FONCTION** :
- 4 reflexes neuroplasticite = discipline manuelle, pas enforced
- Routines Cloud 0 executees (9 doc, 0 actif)
- MEMORY.md = index manuel (fragile sync)
- feedback_subagents_context lesson incomplete (seuil taille prompt)

**Livrables P11 identifies** :
1. 🔴 F44 : update MEMORY.md "12 deprecated" → "13"
2. 🟡 F52 : update feedback_subagents_context.md avec nuances thrashing session (max 500 mots prompt + fallback)

**Report P12 refactor** :
- F49 : reduire entry sessions-recent (30L max par session)
- F50 : script memory-index-sync.sh auto-regeneration MEMORY.md
- F55 : reviser naming-conventions section 7 classification memoires
- M8 : honnetete docs/core/knowledge.md "actuel vs cible" neuroplasticite
- M10 : curation deprecated (merge redondances CLAUDE.md)

**Report P13 cloture** :
- M8 : note honnete neuroplasticite actual state

---

## Cross-refs P4 → autres phases

- F44 → **P11 FIX** (edit MEMORY.md)
- F52 → **P11 FIX** (update memoire subagents)
- F48/M8 → **P8 tokens** (reflexes discipline vs enforcement)
- F49/M10 → **P12 REFACTOR** (consolidation + curation)
- F50 → **P12 REFACTOR** (script memory-index-sync)

---

## Cloture Phase P4

**Livrable** : ce fichier + 12 findings (F44-F55 + M8-M11) + 2 fixes P11 + 5 refactors P12 + cross-refs.

**Insight cle** : Foundation OS a un SYSTEME memoire riche (5 tiers, 24 memoires, 4 reflexes, pages meta) mais le **transcoding de ce systeme en FONCTION reelle est partiel**. Discipline manuelle 80% / Enforcement 20%.

**Anti-compactage proof** : fichier sur disque + commit P4/14 incoming.

**Next** : Phase P5 — Historique + decisions + plans archives.

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P4/14 — Claude Opus 4.7 1M context*
