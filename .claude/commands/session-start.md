# /session-start — Démarrer une session Foundation OS

Exécuter ce workflow au début de chaque session de travail dans Claude Code.

## Ce que fait cette commande

1. Lit FOS-SCALE-ORCHESTRATOR-DATA.md → identifie la phase active
2. Lit FOS-MONITORING.md → état de santé actuel
3. Lit FOS-JOURNAL.md → dernière session pour reprendre le fil
4. Annonce l'état en format alignement (Mode 6)

## Output attendu

```
📍 État : [Phase PX · Étape eXX · dernière action]
🎯 Plan : [ce qui est prévu pour cette session]
⏭️ Next  : [prochaine action bloquante]
❓ Alignement : c'est bien ça ?
```

## Rappels automatiques

- Context > 70% → proposer /compact
- Décision importante → appeler @doc-agent
- Changement architecture → appeler @os-architect
- Avant livraison → appeler @review-agent

## Template de réponse

Après avoir lu les fichiers, répondre exactement ainsi :

```
🏗️ FOUNDATION OS — Session [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Phase active : [PX — Label]
   Étape        : [eXX — Label]
   Dernière session : [CONV-XX · titre]

🎯 Objectif session :
   [Ce que tu proposes de faire]

⚠️ Garde-fous actifs :
   R1 MD first · R2 Zéro régression · R7 Zéro nuisance

❓ On y va ?
```
