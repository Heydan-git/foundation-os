# FONDATION_OPS
> Base de données — synchronisée avec `ops-orchestrator.jsx`
> Règle : toute modification du JSX met à jour ce fichier. Ce fichier permet de reconstruire le JSX.

---

## VERSION
- artifact : v1.2
- md       : v1.2
- sync     : 2026-04-03
- statut   : actif

---

## PROJET
- name    : Fondation — iOS Pipeline Grade A
- phase   : 00 — Fondation
- target  : App iOS Grade A (Swift 6 + SwiftUI + TCA + Supabase + RevenueCat)
- budget  : Indie (50–300€/mois) par défaut

---

## DESIGN SYSTEM
- theme       : Void Glass
- background  : #06070C
- accent      : #5EEAD4
- purple      : #A78BFA
- fonts       : Figtree + JetBrains Mono
- cards       : rgba(255,255,255,0.025) border rgba(255,255,255,0.055)
- orbes       : blur 80px, opacity 0.09
- animations  : fade-in staggeré 50ms par item

---

## ARTIFACTS
| id       | nom                            | rôle                                                    | complet |
|----------|--------------------------------|---------------------------------------------------------|---------|
| pipeline | ios-pipeline-dashboard.jsx     | Pipeline 8 phases × 3 budgets × KPIs × monitoring      | ✅      |
| monitor  | fondation-monitor.jsx          | Monitoring projet — phases, journal, décisions, risques | ✅      |
| index    | project-index-dashboard.jsx    | Index conversations, thèmes, fichiers                   | ✅      |
| control  | conversation-control.jsx       | Contrôle session, sync Cowork, architecture mémoire     | ✅      |
| ops      | ops-orchestrator.jsx           | Orchestrateur ops — analyse, plan, log, base MD         | 🟡      |

---

## PRINCIPES
- Coopération > exploitation
- Traçabilité totale
- Plan évolutif
- Mémoire adaptative
- Zéro nuisance (volontaire, involontaire, directe, indirecte)

---

## FRAMEWORKS
- BMAD v6 (Breakthrough Method for Agile AI-Driven Development)
- Claudify (resource/blog workflows Claude Code)

---

## SKILLS ACTIFS
- ios-dev
- fullstack-dev
- product-design-uxui
- lead-dev
- specialiste-ai
- design-system-manager
- app-store-publisher
- data-analyst

---

## COWORK — COUCHES MÉMOIRE
| couche | nom             | contenu                            |
|--------|-----------------|------------------------------------|
| L4     | Mémoire Claude  | Memories + journal MD              |
| L3     | Knowledge base  | 12 fichiers .md projet Cowork      |
| L2     | Contexte conv.  | Chat en cours (perdu à la fin)     |
| L1     | Contexte immédiat | Message + fichiers uploadés      |

---

## ARCHITECTURE TECHNIQUE
- frontend  : SwiftUI + TCA (The Composable Architecture)
- backend   : Supabase (auth + BDD + edge functions)
- paiements : RevenueCat (< 2.5K MRR gratuit)
- analytics : Mixpanel + TelemetryDeck
- erreurs   : Sentry
- CI/CD     : GitHub Actions + Fastlane
- cowork L1 : Claude.ai Cowork
- cowork L2 : Claude Code
- cowork L3 : BMAD v6
- cowork L4 : MCP/plugins

---

## DÉCISIONS
| date       | titre                              | contexte           | impact |
|------------|------------------------------------|--------------------|--------|
| 2026-04-02 | Coopération > exploitation         | Philosophie projet | high   |
| 2026-04-02 | Traçabilité totale                 | Mémoire + journal  | high   |
| 2026-04-02 | Plan évolutif                      | Itérations courtes | medium |
| 2026-04-02 | Claudify + BMAD = fondations       | Workflow global    | high   |
| 2026-04-02 | JSX = contrôleur, MD = contenu     | Architecture data  | high   |

---

## LIMITES CLAUDE (honnêteté)
- Pas de mémoire native entre sessions → MD + storage compensent
- max_tokens API = 1000 → JSON compact obligatoire, tryParse() en fallback
- Contexte limité 200K tokens → rechargement via MD
- Code non testé en prod → toujours vérifier
- Pas de jugement business → données fournies, décision humaine

---

## CHANGELOG
| version | date       | modifications                                        |
|---------|------------|------------------------------------------------------|
| v1.0    | 2026-04-03 | Création ops-orchestrator.jsx — Status, Analyse, Plan, Log |
| v1.1    | 2026-04-03 | Fix JSON parse (tryParse 4 passes, contexte compact) |
| v1.2    | 2026-04-03 | Ajout onglet Base MD — JSX contrôleur / MD contenu   |
