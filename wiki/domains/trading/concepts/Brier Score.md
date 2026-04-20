---
type: concept
title: "Brier Score"
complexity: intermediate
domain: trading
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - trading
  - math
  - calibration
  - forecasting
  - statistics
status: seed
related:
  - "[[index-trading]]"
  - "[[anthropic-prediction-market-bot-guide]]"
  - "[[Prediction Market Trading Pipeline]]"
  - "[[Kelly Criterion]]"
sources:
  - "[[anthropic-prediction-market-bot-guide]]"
---

# Brier Score

## Definition

Metrique mesurant la **calibration accuracy** d'un modele probabiliste. Plus bas = meilleur. Propose par Glenn W. Brier (1950).

**Question repondue** : quand ton modele predit 70% de chance, est-ce que l'evenement arrive vraiment 70% du temps ?

## Formule

```
BS = (1/n) * Σ (prediction - outcome)²
```

Ou :
- **n** = nombre de predictions
- **prediction** = proba predite (0 a 1)
- **outcome** = 1 si evenement s'est produit, 0 sinon

## Interpretation

| Score | Signification |
|---|---|
| **0.00** | Parfait (predictions 100% correctes) |
| **< 0.10** | Excellent (tres bien calibre) |
| **< 0.25** | Bon (threshold minimum pour trading cf [[Prediction Market Trading Pipeline]]) |
| **0.25** | Random sur evenements 50/50 (baseline non-informative) |
| **> 0.25** | Mauvais (le marche bat ton modele) |
| **1.00** | Pire (predit systematiquement 0% pour evenements qui arrivent 100%) |

**Threshold trading (cf guide Anthropic)** : Brier < 0.25. Au-dessus, **ne pas utiliser** le modele pour sizing via [[Kelly Criterion]].

## Exemple chiffre

**10 predictions, resultats reels** :

| # | Prediction | Outcome | Erreur² |
|---|-----------|---------|---------|
| 1 | 0.70 | 1 | 0.09 |
| 2 | 0.85 | 1 | 0.0225 |
| 3 | 0.30 | 0 | 0.09 |
| 4 | 0.40 | 1 | 0.36 |
| 5 | 0.60 | 0 | 0.36 |
| 6 | 0.90 | 1 | 0.01 |
| 7 | 0.10 | 0 | 0.01 |
| 8 | 0.55 | 1 | 0.2025 |
| 9 | 0.25 | 0 | 0.0625 |
| 10| 0.75 | 1 | 0.0625 |

**BS = (0.09 + 0.0225 + 0.09 + 0.36 + 0.36 + 0.01 + 0.01 + 0.2025 + 0.0625 + 0.0625) / 10 = 0.127**

**Score 0.127 = bien calibre** (< 0.25). Le modele est utilisable pour sizing.

## Calibration vs Discrimination

Brier Score **ne distingue pas** 2 types d'erreur :

### Mauvaise calibration
Modele predit toujours 50% → bien discriminee (couvre la fourchette) mais sous-informe. Brier = 0.25 exactement (pour base rate 50%).

### Mauvaise discrimination
Modele predit 60% pour tous les evenements, peu importe le contexte. Meme si base rate = 60%, Brier correct mais modele sans valeur.

**Pour trading** : Brier < 0.25 est necessaire mais pas suffisant. Verifier aussi que ton modele **distingue** les events (variance predictions > 0).

## Decomposition Brier

BS peut etre decompose en 3 composantes (Murphy 1973) :

```
BS = Reliability - Resolution + Uncertainty
```

- **Reliability** : proximite entre predictions et frequences reelles (calibration) — minimiser
- **Resolution** : pouvoir discriminant (events differents → predictions differentes) — maximiser
- **Uncertainty** : variance naturelle des events (fixee par base rate, hors controle)

Un bon modele : **low reliability + high resolution**.

## Application Foundation OS

### Phase 5 Trading (si demarre)
- Tracker Brier Score de chaque skill Predict ([[Prediction Market Trading Pipeline]] etape 3)
- Log dans `wiki/domains/trading/backtests/` ou DB
- Dashboard : evolution Brier sur 30j rolling
- Gate : si Brier > 0.25 sur 50 derniers trades, **pause le bot** jusqu'a recalibration

### Hors trading : autres usages
Le Brier Score est utile partout ou on fait des **predictions probabilistes** :

- **Sante Phase 5** : diagnostic AI confidence — tracker Brier sur verdicts
- **Meta-FOS monitoring** : alerts systemiques (drift-detector, health-check) — calibrer seuils
- **Product discovery** : hypotheses A/B test — quelle est la vraie proba de succes ?
- **Prediction interne FOS** : "cette PR cassera-t-elle les tests ?" — calibrer notre propre intuition

**Meta-usage** : chaque prediction d'un LLM (incluant Claude) peut etre tracked en Brier pour mesurer sa calibration reelle vs claimed confidence.

## Implementation (pseudo)

```python
def brier_score(predictions, outcomes):
    """
    predictions: list of floats in [0, 1]
    outcomes: list of 0 or 1
    """
    n = len(predictions)
    if n == 0:
        return None
    return sum((p - o)**2 for p, o in zip(predictions, outcomes)) / n
```

## Limites

### 1. Ne capture pas l'asymetrie de payoff
Une prediction 90% qui rate cout pareil en Brier qu'une prediction 10% qui rate pour des events rares. En trading, le P&L dependra du sizing ([[Kelly Criterion]]).

### 2. Sensible a extreme predictions
Modele qui predit 99% ou 1% est penalise fort s'il se trompe. Incite a rester pret du milieu. Pour certains usages, Log Score (logarithmique) est preferable.

### 3. Requiert labels binaires
Classique ne gere que outcomes 0/1. Pour events multi-classes, utiliser Brier Score multi-class (sum over classes).

## Alternatives

| Metrique | Usage | Pro/Con |
|---|---|---|
| **Log Score** | Probabilites, penalite exponentielle erreurs extremes | Pro : sensitive tails. Con : explosif si prediction=0 sur event |
| **Calibration Curve** | Visualisation bin-par-bin proba vs freq reelle | Pro : voit clairement ou ca casse. Con : pas un scalaire |
| **AUC** | Classification binaire, classement | Pro : ignore calibration absolue. Con : pas de mesure proba |
| **Reliability Diagram** | Combine Brier + calibration curve | Pro : complet. Con : necessite > 100 predictions |

Pour Phase 5 trading : **Brier + Calibration Curve** = combo standard.

## Sources

- Brier, G. W. (1950). "Verification of Forecasts Expressed in Terms of Probability". Monthly Weather Review.
- Murphy, A. H. (1973). "A New Vector Partition of the Probability Score".
- [[anthropic-prediction-market-bot-guide]] — threshold < 0.25 pour trading

## Notes

**Concept atemporel reutilisable** : pas specifique aux prediction markets ni au trading. S'applique **a toute prediction probabiliste** (meteo, diagnostic medical, fraud detection, ML classification, LLM confidence calibration). Pair naturel avec [[Kelly Criterion]] (Brier calibre la proba, Kelly sizee la decision).
