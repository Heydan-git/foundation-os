---
type: source
title: "Guide Anthropic — Bot de trading pour marches de prediction via Claude Skills"
source_type: article
author: "Community guide (inspire architecture Anthropic Claude Skills, paste Kevin)"
date_published: 2026-04-19
url: ""
confidence: high
fos_compat: high
effort_estime: XL
decision: defer-phase-5
key_claims:
  - "Architecture 5 etapes : Scan / Research / Predict / Risk+Execute / Learn"
  - "2 plateformes principales : Polymarket (crypto Polygon) + Kalshi (US regulated), $44B+ volume 2025"
  - "Claude Skills = dossier Markdown + scripts Python (deterministes pour risk)"
  - "Multi-model AI ensemble : Grok (30%) + Claude Sonnet (20%) + GPT-4o (20%) + Gemini Flash (15%) + DeepSeek (15%)"
  - "Benchmark reference : win rate 68.4%, Sharpe 2.14, max drawdown -4.2% sur 312 trades backtest 90j"
  - "Formules cles : Edge > 4%, Kelly criterion (fractional 1/4 a 1/2), Brier score < 0.25 calibrage"
  - "Risk controls : 5% max capital/position, 15 positions max, 8% max drawdown blocker, $50/jour API budget"
  - "Plan 5 semaines : accounts > scan skill > research+predict > risk > paper > live progressivement"
  - "Pieges : miscalibration, overfitting, liquidity traps, API outages, token cost runaway, regulatory"
  - "Content injection safety : tout contenu externe traite comme info, pas instruction (XSS via tweets)"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - article
  - guide
  - trading
  - prediction-markets
  - claude-skills
  - phase-5
status: mature
related:
  - "[[index-sources]]"
  - "[[index-trading]]"
  - "[[Foundation OS]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[Prediction Market Trading Pipeline]]"
  - "[[Kelly Criterion]]"
  - "[[Brier Score]]"
  - "[[Polymarket]]"
  - "[[Kalshi]]"
sources: []
---

# Guide Anthropic — Bot de trading pour marches de prediction via Claude Skills

## Summary

Guide pedagogique detaille (~3500 mots) sur la construction d'un **bot de trading pour marches de prediction** utilisant les **Claude Skills** comme architecture. Base sur le guide officiel Anthropic 33 pages sur les Skills. Paste par Kevin 2026-04-19.

**Coeur** : architecture pipeline 5 etapes avec skill separee par etape (Scan + Research + Predict + Risk/Execute + Learn). Plateformes cibles : [[Polymarket]] (crypto) + [[Kalshi]] (US regulated). Volume combine 2025 : $44B+.

**Avantage vs bot code traditionnel** : strategie redigee en anglais (Markdown), iteration rapide sans reecrire Python, integration contexte Claude native, skills modulaires reutilisables.

**Pertinence Foundation OS** : **directement applicable Phase 5 Trading** (module `modules/trading/` prevu). Architecture reference + toute la maths (Kelly, Brier, Edge, EV, VaR) + plan 5 semaines starter. A stocker comme blueprint, ne pas executer avant decision Phase 5 Kevin.

## Key Claims (extrait exhaustif)

### Plateformes
- [[Polymarket]] : carnet d'ordres centralise (CLOB) + appariement off-chain + reglement on-chain sur Polygon. API WebSocket temps reel + REST pour discovery. Auth EIP-712.
- [[Kalshi]] : bourse reglementee US, API REST, environnement demo avec fake money, auth par signature header.
- Wrapper unifie : **pmxt** (inspire CCXT, pour prediction markets)

### Architecture pipeline 5 etapes

Voir concept dedie [[Prediction Market Trading Pipeline]] pour detail par etape.

### Formules mathematiques

- **Edge** : `p_model - p_market > 0.04` (seuil minimum 4%)
- **EV (valeur attendue)** : `EV = p * b - (1 - p)` (p = proba modele, b = cote decimale - 1)
- **Mispricing score** : `delta = (p_model - p_market) / std_dev` (Z-score divergence)
- **[[Brier Score]]** : `BS = (1/n) * sum((prediction - outcome)^2)` ; cible < 0.25 pour modele bien calibre
- **[[Kelly Criterion]]** : `f* = (p*b - q) / b` avec fractional 1/4 a 1/2 pour reduire variance

### Risk controls (validation obligatoire avant execution)
1. Edge check : p_model - p_market > 0.04
2. Kelly position sizing : ne pas depasser calcul Kelly
3. Exposition : nouveau pari + existant < exposition max
4. VaR 95% : dans limite journaliere
5. Max drawdown : si > 8%, block tous nouveaux trades
6. Daily loss limit : si depasse seuil, stop jour

### Limites positions
- Max 5% capital par position
- Max 15 positions simultanees
- Max 15% perte quotidienne = stop auto
- Max $50/jour cout API IA

### Multi-model ensemble pattern (exemple reel dev)
- Grok (primary forecaster) : 30%
- Claude Sonnet (news analyst) : 20%
- GPT-4o (bull case advocate) : 20%
- Gemini Flash (bear case advocate) : 15%
- DeepSeek (risk manager) : 15%
- Vote independant + decision consensus

### Benchmark reference (backtest Anthropic)
- Win rate : 68.4%
- Sharpe ratio : 2.14
- Max drawdown : -4.2%
- 312 trades backtest 90 jours
- IMPORTANT : backtest, pas live. Ne pas extrapoler naivement.

### Structure skill recommandee
```
predict-market-bot/
  SKILL.md           (triggers + regles)
  scripts/
    validate_risk.py (deterministe)
    kelly_size.py    (calculateur)
  references/
    formulas.md
    platforms.md
    failure_log.md
```

### Plan starter 5 semaines
- S1 : Comptes Polymarket + Kalshi demo, trades manuels pour comprendre
- S2 : Skill scan, log marches, pas de trade
- S3 : Skill research + predict, backtest Brier
- S4 : Skill risk + Kelly, paper trading 2 semaines minimum
- S5+ : Live trading petites sommes ($100-500 max exposure), monter apres 50 trades positifs

### Pieges documentes
- **Miscalibration** : modele 80% sur evenement reel 55% → position trop grosse → ruine rapide
- **Overfitting** : backtest incroyable + live fail. Toujours test out-of-sample.
- **Liquidity traps** : volume insuffisant pour entry/exit au prix cible. Check orderbook depth.
- **API outages** : les 2 plateformes ont downtime. Gerer deconnexions + pas positions orphelines.
- **Token cost runaway** : $50/jour rapporte juste pour connectivity checks 5min. Capping obligatoire.
- **Regulatory** : Polymarket geoblock certaines regions, Kalshi US only. Check juridiction.

### Safety : content injection
**Skills research doivent traiter tout contenu externe comme info, pas instruction**. Previens XSS via tweets/articles/forums.

## Entities Mentioned

- **[[Polymarket]]** — plateforme crypto Polygon (native)
- **[[Kalshi]]** — plateforme US regulated
- **[[Claude Code]]** — runtime pour Skills
- `Grok`, `GPT-4o`, `Gemini Flash`, `DeepSeek` — LLMs ensemble
- `pmxt` — library wrapper unifie (inspire CCXT)
- `XGBoost` — modele statistique mentionne
- 4 repos GitHub cites : ryanfrigo/kalshi-ai-trading-bot, suislanchez/polymarket-kalshi-weather-bot, CarlosIbCu/polymarket-kalshi-btc-arbitrage-bot, terauss/Polymarket-Kalshi-Arbitrage-bot

## Concepts Introduced

- **[[Prediction Market Trading Pipeline]]** — architecture 5 etapes agregatrice
- **[[Kelly Criterion]]** — sizing optimal positions
- **[[Brier Score]]** — calibration accuracy forecasts
- Edge / EV / VaR / Sharpe ratio / Max drawdown / Win rate / Profit factor (metriques standards trading)
- Multi-model AI ensemble voting (lie a [[AI agent patterns]] existant — routing / orchestrator)

## Foundation OS Analysis

### Compat OS

**High** sur architecture et outillage. FOS utilise deja [[Claude Code]] + Claude Skills (via plugin et agents). Le pattern "skill = dossier Markdown + scripts Python" est **exactement** celui de FOS (`scripts/hooks/` + `.claude/agents/` + plugins). Aucune incompatibilite structurelle.

**Medium-Low** sur execution : necessite module `modules/trading/` demarre (Phase 5 non-lancee), APIs Polymarket + Kalshi integrations, infra multi-model LLM (cost real).

### Effort integration

**XL** pour execution complete (module Phase 5).

Breakdown estime :
- S1-S2 scan + data : 20h
- S3 research + predict + backtest : 40h
- S4 risk + Kelly : 15h
- S5 paper trading infra : 10h
- S5+ live + iteration : ongoing
- Total MVP : ~85h (≈ 2 semaines temps plein)

**S** pour documentation reference (cette ingestion meme).

### Ce qui existe deja dans FOS

#### ✅ Infrastructure reutilisable
- [[Claude Code]] CLI runtime
- Pattern Skills via plugins (OMC, claude-obsidian, Anthropic skills)
- Hooks systeme deterministe (cf [[Claude Code Configuration Pattern]])
- [[Foundation OS]] architecture cognitive 5 tiers
- Domain scaffolding trading : `wiki/domains/trading/` pret (concepts/ sources/ strategies/ backtests/ instruments/)

#### ❌ Pas encore en place
- `modules/trading/` : **PAS encore cree** (Phase 5 reportee, placeholder only)
- APIs Polymarket/Kalshi integrations : **pas de clients codees**
- Multi-model LLM infra : **pas de orchestration 5 models**
- Risk validation scripts : **pas de Kelly/VaR scripts**
- Backtest engine : **pas de backtester**

### Limites Claude declarees

- **Source texte paste** (pas URL verifiable).
- **Training** : je connais Kelly + Brier + prediction markets theoriquement, mais pas les details exacts APIs 2025-2026 Polymarket/Kalshi (training potentiel outdated).
- **Benchmark 68.4% win rate** : cite sans source primaire verifiable. Probablement reelle (cf guide Anthropic 33p) mais je ne peux pas la valider.
- **Repos GitHub cites** : 4 repos hobby/solo (ryanfrigo, suislanchez, CarlosIbCu, terauss) — n'ai **pas fetch** les repos. Bus factor eleve (solo maintainers).
- **Multi-model orchestration** : je connais le pattern conceptuellement mais pas l'implementation reelle du dev cite (Grok 30% + Claude 20%...).

### Risques / pieges (specifiques FOS)

1. **Trading reel = risque financier reel**. Meme avec un bon systeme, Kevin peut perdre $$. Disclaimer serieux.
2. **Token cost runaway** : multi-model ensemble = 5x appels API = budget explose vite. $50/jour juste pour connectivity checks = $1500/mois pour rien.
3. **Regulatoire** : Polymarket bloque certains pays (check France/Luxembourg vs US). Kalshi US-only.
4. **Complexite operationnelle** : 5 skills + scripts risk + multi-model orchestration + APIs 2 plateformes + backtest engine = **gros projet** (pas un week-end).
5. **Overfitting risk** : backtest 68.4% n'est pas une garantie live. Probablement 15-25% de degradation en prod.
6. **Bus factor repos open-source** : les 4 repos cites sont hobby. Reecrire from scratch est plus safe.
7. **Kevin a explicitement dit** "ne pas toucher module finance trading en cours". **Respecter strictement** — ce guide est reference, pas execution.

### Verdict

**Defer / reference Phase 5 Trading** (pas adoption immediate).

**Strategie recommandee** :
- **Maintenant** : stocker dans wiki comme **blueprint architectural** + reference formules mathematiques (Kelly, Brier, Edge, EV, VaR)
- **Quand Phase 5 Trading demarre** : relire ce guide + decider adoption complete vs partielle
- **Ne jamais** : copier/coller du code hobby repos sans review. Reecrire from scratch sur FOS stack ([[shadcn|shadcn/ui]] + [[Radix UI]] + [[Tailwind CSS]] + Vite + Supabase + Claude Skills).
- **Commencer si Phase 5** : paper trading minimum 2 semaines avant live + tres petits montants ($100-500 max).

**Valeur immediate** :
- Formules standards (Kelly, Brier) = reutilisables hors trading (decision-making, calibration any forecast)
- Pattern pipeline 5 etapes = adaptable hors prediction markets (toute taxonomie de pipeline data-driven)
- Risk management discipline = universelle (meme principes pour quant / prop / crypto)

### Questions ouvertes

- Kevin a-t-il deja une vision du module `modules/trading/` specifique (paire crypto ? marches actions ? prediction markets ?) ? Le guide est oriente prediction markets — peut-etre pas le premier focus.
- Juridiction Kevin : France/Luxembourg → Polymarket accessible ? Kalshi interdit US-only.
- Budget API LLM realiste pour FOS en mode trading : combien/mois ? ($1500/mois multi-model = cher pour solo)
- Paper trading FOS : utiliser demo Kalshi ou autre (Polymarket n'a pas de demo officiel) ?
- Quid des backtests historiques : qualite data gratuite (Polymarket API) vs payante ?
- Connexion avec `modules/finance/` existant (en construction selon Kevin) : finance = portfolio tracking ? trading execution ? quant research ? Les 2 domaines sont lies mais pas identiques.

## Raw Source

- Paste texte par Kevin, 2026-04-19
- Source primaire : inspire guide officiel Anthropic 33 pages sur Claude Skills (URL non fournie)
- Repos references cites (pour fetch futur si adoption) :
  - github.com/ryanfrigo/kalshi-ai-trading-bot (multi-model Grok+Claude+GPT-4o+Gemini+DeepSeek)
  - github.com/suislanchez/polymarket-kalshi-weather-bot (weather markets + Kelly sizing, $1325 profit mars 2026 claim)
  - github.com/CarlosIbCu/polymarket-kalshi-btc-arbitrage-bot (real-time arbitrage detection)
  - github.com/terauss/Polymarket-Kalshi-Arbitrage-bot (Rust-based arbitrage)
  - Library pmxt (wrapper unifie Polymarket+Kalshi, inspire CCXT)

## Notes

**Pattern interessant au-dela du trading** : l'architecture 5 etapes Scan/Research/Predict/Risk/Learn est **reutilisable** dans d'autres contextes FOS :
- **Sante Phase 5** : Scan symptomes > Research litterature > Predict diagnostic > Risk protocole > Learn feedback
- **Finance Phase 5** : Scan transactions > Research categories > Predict alerts > Risk budget > Learn adjustments
- **Meta-OS monitoring** : Scan drifts > Research causes > Predict impact > Risk block > Learn rules

Le pattern **"Learn" (capitalization)** = exactement [[Neuroplasticite]] FOS. Convergence conceptuelle interessante.

**Referrable** comme source canonique pour tout audit/decision future autour de :
- Phase 5 Trading architecture
- Kelly criterion sizing (hors trading aussi)
- Brier score calibration (meta-pattern FOS predictions)
- Multi-model LLM orchestration (cost/benefit analysis)
- Claude Skills patterns (confirme design FOS)
