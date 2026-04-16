---
type: source
title: "Session adoption wiki Obsidian (2026-04-15/16)"
source_type: session
author: "Kevin + Claude"
date_published: 2026-04-16
url: ""
confidence: high
key_claims:
  - "Pattern Karpathy LLM Wiki adopte pour Foundation OS"
  - "5 tiers memoire formalises (conversation / CONTEXT / auto-memory / docs / wiki)"
  - "Plugin claude-obsidian v1.4.3 : 10 skills + 4 commands"
  - "PostToolUse auto-commit desactive (respect regle Kevin-valide)"
  - "Vault multi-domaines : trading, finance, sante, design, dev"
  - "Wiki = cerveau autonome de Claude (decision Kevin explicite)"
created: 2026-04-16
updated: 2026-04-16
tags:
  - source
  - session
  - adoption
  - foundation-os
  - wiki
status: mature
related:
  - "[[karpathy-llm-wiki-pattern]]"
  - "[[agricidaniel-claude-obsidian]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Hot Cache]]"
  - "[[Compounding Knowledge]]"
  - "[[Andrej Karpathy]]"
  - "[[AgriciDaniel]]"
  - "[[Obsidian]]"
  - "[[tools-foundation-os]]"
sources: []
---

# Session adoption wiki Obsidian (2026-04-15/16)

## Summary

Session marathon (2 jours) ou Kevin et Claude ont concu, planifie et execute l'adoption complete du plugin claude-obsidian dans Foundation OS. 12 phases, 11 commits, zero regression. Le wiki/ devient le 5e tier memoire de l'OS et le cerveau autonome de Claude.

## Deroulement

1. **Analyse** (2026-04-15) : Kevin partage article Karpathy LLM Wiki + page AgriciDaniel claude-obsidian. Claude explore le repo (1279 stars, 10 skills, 4 hooks). Analyse compatibilite avec Foundation OS existant.

2. **Decision architecture** : Kevin choisit Option B (adoption complete, ambition max). 11 decisions arbitrees (Q1-Q11). Vault multi-domaines pour modules Phase 5 futurs (Finance, Trading auto, Sante conseil multi-agents).

3. **Plan** : 4050 lignes ultra-detaille (skill `superpowers:writing-plans`), 12 phases, 132 steps atomiques. Worktree dedie `wt/wiki-adoption-260415`. Format 6 elements par phase (anti-compactage).

4. **Execution** (2026-04-15/16) : Option B inline sequentiel avec checkpoints Kevin apres chaque phase. 11 commits. Imprevu resolu : SSH plugin install → patch HTTPS via git insteadOf. Health-check whitelist `wiki` ajoutee.

5. **Anti-regression** (Phase 10) : build OK, tests 19/19, refs ameliorees 29→20, zero regression reelle.

6. **Decision finale** (2026-04-16) : Kevin declare "c'est ton cerveau, utilise-le en autonomie". Wiki passe de "outil optionnel" a "extension naturelle de la memoire de Claude".

## Decisions prises

- **D-WIKI-01** : adoption claude-obsidian + 5 tiers memoire
- PostToolUse auto-commit DESACTIVE (regle Kevin-valide)
- 27/29 memoires RESTENT auto-memory (profile + feedback)
- 2/29 migrees wiki/ (desktop-migration + tools-inventory)
- Repo reste PRIVE (Phase 5 donnees perso)
- Obsidian app = vault racine projet (post-merge)
- Wiki = cerveau autonome Claude (feedback_wiki_autonome.md)

## Concepts cles

- [[LLM Wiki Pattern]] — architecture fondamentale
- [[Hot Cache]] — cache 500 mots session-to-session
- [[Compounding Knowledge]] — knowledge compose via cross-refs

## Entities impliquees

- [[Andrej Karpathy]] — createur pattern
- [[AgriciDaniel]] — plugin claude-obsidian
- [[Obsidian]] — editeur vault
- [[tools-foundation-os]] — toolchain mise a jour

## Lecons retenues

1. **SSH vs HTTPS** : `claude plugin install` utilise SSH par defaut → `git config --global url."https://...".insteadOf "git@github.com:..."` cible par repo owner
2. **Health-check whitelist** : tout nouveau dossier racine doit etre ajoute a la whitelist Structure de `scripts/health-check.sh`
3. **Wikilinks avec espaces** : les noms de fichiers avec espaces (ex: `Andrej Karpathy.md`) causent des faux positifs dans wiki-health.sh (amelioration future)
4. **Conventional commits** : `wiki:` n'est pas un type conventionnel → utiliser `feat(wiki):`
5. **Plan ultra-detaille = anti-compactage efficace** : 4050 lignes = reprise possible a n'importe quelle phase meme apres cold restart

## Plan reference

`.archive/plans-done-260416/2026-04-15-wiki-obsidian-adoption.md` (4050 lignes, a archiver).
