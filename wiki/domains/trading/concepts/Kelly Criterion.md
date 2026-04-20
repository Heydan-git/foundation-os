---
type: concept
title: "Kelly Criterion"
complexity: intermediate
domain: trading
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - trading
  - math
  - position-sizing
  - risk-management
status: seed
related:
  - "[[index-trading]]"
  - "[[anthropic-prediction-market-bot-guide]]"
  - "[[Prediction Market Trading Pipeline]]"
  - "[[Brier Score]]"
sources:
  - "[[anthropic-prediction-market-bot-guide]]"
---

# Kelly Criterion

## Definition

Formule mathematique optimisant la **taille de position** (combien miser par trade) pour **maximiser la croissance geometrique** du capital sans risquer la ruine. Derive John Kelly Jr (Bell Labs, 1956).

**Objectif** : ni sous-miser (capital croît trop lentement), ni sur-miser (capital detruit par mauvaises sequences).

## Formule

```
f* = (p * b - q) / b
```

Ou :
- **f\*** = fraction du capital a miser
- **p** = probabilite de gain (0 a 1)
- **q** = 1 - p = probabilite de perte
- **b** = cote nette (odds decimal - 1, ex : payout 3x → b=2)

## Exemple chiffre

**Setup** :
- Capital : $10 000
- Trade : proba gain 70% (p=0.7)
- Payout : 2:1 (b=2)

**Full Kelly** : `f* = (0.7 * 2 - 0.3) / 2 = 1.1 / 2 = 0.55` → mise = $5500

⚠️ 55% du capital sur UN trade = volatilite extreme. Sequence de 2-3 pertes = catastrophe.

**Fractional Kelly (quart)** : `f_quart = 0.55 / 4 = 0.1375` → mise = $1375 (14%)

Mais le guide [[anthropic-prediction-market-bot-guide]] utilise un exemple different (proba 70%, risk-reward 2:1) donnant Full Kelly 12%, quart Kelly 3%. Formule identique, parametres differents.

## Pratique : Fractional Kelly

**La plupart des traders professionnels utilisent quart-Kelly (1/4) a demi-Kelly (1/2)**.

**Pourquoi** :
- Full Kelly = mathematiquement optimal mais **extremement volatile**
- Drawdowns intermediaires peuvent atteindre 50%+ avant retour au pic
- Erreurs d'estimation de `p` amplifient le risque (si p reelle est 65% au lieu de 70%, Full Kelly fait exploser)

**Effet Fractional Kelly** :
- 1/2 Kelly : ~88% du rendement Full Kelly avec volatilite divisee par 2
- 1/4 Kelly : ~65% du rendement avec volatilite divisee par 4
- **ROI plus regulier, risque de ruine divise**

## Limites et pieges

### 1. Sensible a l'estimation de `p`
Si tu estimes p=70% mais reel = 55%, Full Kelly te fait **perdre** de l'argent au lieu d'en gagner. Kelly assume une estimation fiable de la proba.

**Fix** : couple Kelly avec [[Brier Score]] tracking pour verifier calibration reelle de tes predictions. Si Brier > 0.25, **ne pas faire confiance a ton Kelly** — calibrer d'abord.

### 2. Assume independance des trades
Si tes trades sont correles (ex : tout trading crypto bull market), la variance reelle > variance Kelly. Reduire la fraction en consequence.

### 3. Hypothese de distribution binaire
La formule classique assume "gain ou perte" binaire. Pour distributions continues (ex : action qui peut faire +0% a +1000%), il faut la version generalisee Kelly.

### 4. Pas de take into account risk of ruin explicite
Kelly max croissance, mais n'ajoute pas de contrainte "max drawdown acceptable". Couple avec contrainte separee (ex : stop si drawdown > 8%).

## Application Foundation OS

### Pour Phase 5 Trading (si demarre)
- Implementer dans `modules/trading/risk/kelly.ts` (TypeScript)
- Config defaut : quart-Kelly (safe starter)
- Paramtres user configurable : fraction (0.25, 0.5, 1.0)
- Tests : comparer rendement simule Full vs Quart Kelly sur historique backtests

### Hors trading : autres usages
Le Kelly criterion s'applique **partout** ou il y a :
- Une decision repetee (bet, allocation, position)
- Une probabilite de succes estimable
- Un payoff asymetrique (gain != perte)

Exemples FOS potentiels :
- **Budget API LLM** : allocation compute multi-model selon confidence (guide cite $50/jour limit, mais Kelly donnerait sizing optimal)
- **Priorisation plan** : allocation temps entre plans actifs selon ROI estime
- **A/B testing** : taille sample selon gain attendu

**Mise en garde** : Kelly est **mathematiquement optimal pour max croissance**, pas pour **max confort**. Si tu as une aversion au risk, utilise toujours fractional.

## Relation avec autres metriques

| Metrique | Role | Relation Kelly |
|---|---|---|
| [[Brier Score]] | Calibration predictions | Gate d'entree (si > 0.25, ne pas trust Kelly) |
| Sharpe ratio | Risque/rendement | Kelly optimise croissance, pas Sharpe directement |
| Max drawdown | Pire perte peak-to-trough | Kelly ne garantit pas max DD acceptable |
| VaR (Value at Risk) | Perte max 95% confidence | Contrainte additionnelle a Kelly |

## Sources

- Kelly, J. L. (1956). "A New Interpretation of Information Rate". Bell System Technical Journal.
- [[anthropic-prediction-market-bot-guide]] — application trading prediction markets avec fractional Kelly

## Notes

**Concept atemporel reutilisable** : pas specifique aux prediction markets. S'applique crypto, stocks, options, arbitrage, poker, business bets. Le **seul vrai risque** de Kelly = mauvaise estimation de `p`. D'ou l'importance critique de la calibration ([[Brier Score]]) et du fractional Kelly comme marge de securite.
