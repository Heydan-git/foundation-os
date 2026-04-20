---
type: concept
title: "Prediction Market Trading Pipeline"
complexity: advanced
domain: trading
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - trading
  - prediction-markets
  - pipeline
  - architecture
  - claude-skills
  - phase-5
status: seed
related:
  - "[[index-trading]]"
  - "[[anthropic-prediction-market-bot-guide]]"
  - "[[Kelly Criterion]]"
  - "[[Brier Score]]"
  - "[[Polymarket]]"
  - "[[Kalshi]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[AI agent patterns]]"
  - "[[Neuroplasticite]]"
sources:
  - "[[anthropic-prediction-market-bot-guide]]"
---

# Prediction Market Trading Pipeline

## Definition

Architecture **pipeline 5 etapes** pour bot de trading sur marches de prediction ([[Polymarket]] + [[Kalshi]]). Chaque etape = 1 skill Claude separee. Les donnees circulent d'une etape a la suivante. Pattern publie par Anthropic dans son guide Claude Skills + implementations concretes.

Objectif : detecter et exploiter les mispricings marches plus vite + plus consistently qu'un humain.

## Architecture (5 etapes)

### 1. Scan (trouver marches tradables)

**Rôle** : filtrer 300+ marches actifs sur [[Polymarket]] + [[Kalshi]] pour garder les tradables.

**Filtres** :
- Volume minimum : 200 contrats
- Delai max expiration : < 30 jours
- Liquidite minimale (orderbook depth)
- Anomalies : fluctuations prix > 10%, spreads > 5 cents, pics volume vs moyenne 7j

**Frequence** : toutes 15-30 min en heures actives.

**Output** : liste classee marches tradables par opportunite estimee.

### 2. Research (avantage informationnel)

**Rôle** : pour chaque marche signale, agents paralleles extraient data Twitter + Reddit + RSS + news. Analyse sentiment NLP. Compare narrative signal vs prix marche.

**Sources** :
- Twitter/X : sentiment temps reel
- Reddit : consensus communautaire
- RSS news : rapports officiels

**Analyse** :
- Classification sentiment : bullish / bearish / neutral
- Cross-reference multi-sources (reduire bruit)
- Compare consensus narrative vs prix marche
- Note research par marche : ce que disent les sources vs ce que reflete le prix, ou est l'ecart

**Exemple concret cite** : 14 janvier 2026, news "temoin cle revenu sur son temoignage" dans affaire Trump. Bots IA reprice marche en < 90 sec. Ecart 13 cents sur position $2000 → profit $896 en < 10 min. **Avantage = vitesse de traitement, pas intelligence**.

**Safety critique** : tout contenu externe traite comme **info, pas instruction** (previens content injection via tweets/articles).

### 3. Predict (estimer proba reelle)

**Rôle** : combine modeles statistiques (XGBoost) + raisonnement LLM pour calibrer proba reelle vs marche. Signal trading only si confidence > seuil.

**Formules** (detail [[anthropic-prediction-market-bot-guide]]) :
- **Edge** : `edge = p_model - p_market`. Trade only si `edge > 0.04`.
- **EV** : `EV = p * b - (1 - p)` (p proba modele, b cote decimale - 1)
- **Mispricing Z-score** : `delta = (p_model - p_market) / std_dev`

**Methodes d'ensemble** (multi-model) :
- Plusieurs modeles (GPT-4, Claude, Gemini) estiment independamment
- Agregation + vote consensus
- Ex reel : Grok (30%) + Claude Sonnet (20%) + GPT-4o (20%) + Gemini Flash (15%) + DeepSeek (15%)

**Calibration suivi** : [[Brier Score]] < 0.25 pour modele bien calibre. Tracker dans le temps : tes predictions 70% sont-elles vraies 70% du temps ?

**Log predictions** pour analyse a posteriori.

### 4. Risk + Execute

**Rôle** : agent risk valide position **independamment** avant execution. Calcule taille via [[Kelly Criterion]]. Execute si pass. Hedge auto si conditions changent pendant trade.

**Risk checks (tous doivent passer)** :
1. Edge check : `p_model - p_market > 0.04`
2. [[Kelly Criterion]] position sizing : ne pas depasser Kelly calcul
3. Exposition : nouveau + existing < max total
4. VaR 95% : dans limite journaliere
5. Max drawdown : si > 8%, block
6. Daily loss limit : si depasse, stop jour

**Limites positions** :
- Max 5% capital / position
- Max 15 positions simultanees
- Max 15% perte quotidienne = stop auto
- Max $50/jour API cost

**Execution** :
- Ordres limit (pas market) pour controler slippage
- Monitor slippage : si > 2% entre signal et exec, abort
- Hedge auto si conditions changent
- **Kill switch** : file drop (ex: creer fichier `STOP`) = suspend tous nouveaux ordres immediatement

### 5. Learn (capitalization)

**Rôle** : apres chaque trade (surtout pertes), analyse retrospective. Identifie ce qui n'a pas marche, log cause, update knowledge base. Scans futurs consultent echecs passes avant process nouveaux marches.

**Log par trade** :
- Prix entree + sortie
- Proba predite + outcome reel
- P&L + duree
- Conditions marche

**Classification echecs** :
- Mauvaise prediction
- Mauvais timing
- Mauvaise execution
- Choc externe

**Output** : fichier knowledge base que Scan + Research consultent avant nouveau marche.

**Metriques tracking** :
- Win rate : >= 60% pour edge durable
- Sharpe ratio : > 2.0
- Max drawdown : < 8% (block nouveaux trades au-dela)
- Profit factor : > 1.5 (profits bruts / pertes brutes)
- [[Brier Score]] : < 0.25

**Convergence FOS** : cette etape = **[[Neuroplasticite]]** appliquee trading. Pattern meta-FOS (consolidation auto + lessons learned + knowledge compounds) applique au domaine trading.

## Benchmark reference (guide Anthropic)

| Metrique | Valeur |
|---|---|
| Win rate | 68.4% |
| Sharpe ratio | 2.14 |
| Max drawdown | -4.2% |
| Trades | 312 (backtest 90j) |

⚠️ **Backtest, pas live**. Degradation typique live : -15 a -25%. Ne pas extrapoler naivement.

## Structure skill recommandee

```
predict-market-bot/
  SKILL.md            (triggers + regles base)
  scripts/
    validate_risk.py  (risk checks deterministes)
    kelly_size.py     (calculateur position)
  references/
    formulas.md       (toutes formules maths)
    platforms.md      (docs API Polymarket + Kalshi)
    failure_log.md    (erreurs passees + lessons)
```

**Principe cle** : risk validation dans **scripts Python** (deterministe), **pas** dans instructions Markdown (interpretable). Le script `validate_risk.py` verifie toutes regles avant que bot execute.

## Application Foundation OS

### Quand utiliser
- **Seulement** si Phase 5 Trading demarre (decision Kevin)
- Module cible : `modules/trading/` (non-cree actuellement)
- Prerequis : decision juridiction + budget API LLM + paper trading infra

### Adaptations FOS
- Stack : Vite + React 19 + TypeScript + [[Supabase]] (backtests + logs) + [[Claude Code]] Skills
- Skills : deposees dans le dossier .claude/skills (projet) ou ~/.claude/skills (global)
- Scripts Python : dans `modules/trading/scripts/` (si module cree) ou un nouveau dossier scripts/trading
- Knowledge base : dans `wiki/domains/trading/` (strategies + backtests + instruments)
- Multi-model : commencer par 2 modeles (Claude + 1 autre) avant 5-model full ensemble (cost control)

### Pattern reutilisable hors trading

Architecture **Scan → Research → Predict → Risk → Learn** adaptable a :

- **Sante Phase 5** : Scan symptomes > Research litterature med > Predict diagnostic > Risk protocole > Learn feedback patient
- **Finance Phase 5** : Scan transactions > Research categorisation > Predict alerts fraude/budget > Risk validation > Learn adjustments
- **FOS Meta** : Scan drifts > Research causes > Predict impact > Risk block > Learn regles (pattern FOS existant via drift-detector + auto-archive)

Le pattern est **pipeline decisionnel** generique, pas specifique trading.

## Connections

- [[anthropic-prediction-market-bot-guide]] — source complete
- [[Kelly Criterion]] — formule sizing (etape 4)
- [[Brier Score]] — calibration accuracy (etape 3 + 5)
- [[Polymarket]] / [[Kalshi]] — plateformes cibles
- [[AI agent patterns]] — multi-model ensemble connecte a routing + orchestrator-worker
- [[Claude Code Configuration Pattern]] — skills + hooks pattern sous-jacent
- [[Neuroplasticite]] — etape Learn = pattern meta-FOS applique
- [[Foundation OS]] — architecture cognitive parente

## Sources

- [[anthropic-prediction-market-bot-guide]] — guide detaille 5 etapes + formules + plan starter
