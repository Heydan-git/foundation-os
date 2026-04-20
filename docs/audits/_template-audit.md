---
id: YYYY-MM-DD-slug
title: Audit [Scope] (DD-MM-YYYY)
created: YYYY-MM-DD
status: draft
scope: [FORME | FONCTION | META | ALL]
commands_used: []
---

# Rapport [Scope] — [Titre] (YYYY-MM-DD)

> **VULGARISATION INTEGRALE OBLIGATOIRE (D-VULGARIZE-01, 2026-04-20)** : tout le rapport est vulgarise **de bout en bout**, pas seulement la section "En bref" en tete. Chaque section (Methodologie / Findings / Impact / Actions / Conclusion) applique les 9 regles universelles (`docs/core/communication.md` section 6.0.1) : D-XXX-NN traduit en langage naturel, acronymes developpes, termes tech expliques entre parentheses, chaque finding dit "ce que ca veut dire concretement pour Kevin". **Check-list obligatoire avant envoi : section 6.0.3 communication.md** (8 questions cochees sinon reecrire). Zero speculation (memoire `feedback_no_speculation.md`). Chaque ligne = commande de verification.

## En bref (pour Kevin)

[OBLIGATOIRE — 3-6 phrases langage simple, TDAH-first, en tete du rapport.

Structure recommandee :
1. Contexte et raison de l'audit (pourquoi on fait ca)
2. Verdict global (sain / degraded / critique) en mot simple
3. 2-3 trouvailles principales, sans jargon
4. Prochaine etape ou decision Kevin attendue

Exemple :
"Tu m'as demande d'auditer le systeme X parce que tu soupconnais un probleme Y. J'ai tout verifie avec des preuves (commandes + fichiers reels). Verdict : le systeme est globalement SAIN, mais j'ai trouve 3 problemes a corriger (un fichier deplace sans etre committe, 2 references cassees). Pas d'ecrasement de donnees, pas de perte grave. A decider Kevin : est-ce qu'on nettoie tout de suite en 1 session (30 min), ou on garde pour plus tard ?"

Pas de jargon sans traduction. Pas de code D-XXX-NN sans contexte. Pas de listes de fichiers obscurs.]

## 1. Methodologie (evidence-based)

[Comment l'audit a ete fait. Chaque affirmation = commande de verification. Principe : zero speculation (memoire `feedback_no_speculation.md`).

Exemple :
| Categorie | Commande | Resultat utilise |
|-----------|----------|------------------|
| Inventaire fichiers | `find . -name "*.md" \| wc -l` | count |
| Refs cassees | `bash scripts/ref-checker.sh` | liste |
| Branches | `git log main..<branch> --oneline` | commits uniques |
]

## 2. Limites honnetes de cet audit

[Ce qui N'A PAS ete verifie, a lister explicitement. Pourquoi (temps, scope, techniques impossibles). Pour eviter la fausse completude.

Exemple :
- Je n'ai PAS lu chaque ligne des 200+ fichiers du repo. Priorite contenu > surface.
- Je n'ai PAS execute les tests (ils ne sont pas dans le scope de cet audit).
- etc.]

## 3. Findings (par categorie)

[Sections par theme audite. Toujours :
- Verdict 🔴 critical / 🟡 warning / 🟢 OK
- Preuve (commande + sortie)
- Explication simple (jargon traduit)]

### 3.1 [Categorie 1]

- 🟢 [Finding OK] — preuve : `<commande>` retourne `<resultat>`.
- 🟡 [Finding warning] — preuve : `<commande>` retourne `<resultat>`. Action suggeree : [...]
- 🔴 [Finding critical] — preuve : `<commande>` retourne `<resultat>`. Action urgente : [...]

### 3.2 [Categorie 2]

[idem]

## 4. Impact reel

[Traduction non-tech des findings. Ce que ca veut dire concretement pour Kevin :
- Pour le code (tests, build, deploiement) ?
- Pour la memoire projet (CONTEXT.md, hot.md) ?
- Pour les decisions a prendre ?]

## 5. Actions proposees (par priorite)

[Liste ordonnee. Chaque action = scope (petit/moyen/gros) + effort estime + risque + recommandation.

Exemple :
### Priorite 1 — [Action critique, safe]
- **Quoi** : [description simple]
- **Scope** : [petit/moyen/gros]
- **Effort** : [10min / 1h / 3h]
- **Risque** : [faible/moyen/eleve]
- **Recommandation** : [pourquoi OUI ou NON maintenant]

### Priorite 2 — [...]]

## 6. Ce qui est SAIN et verifie

[Contre-partie rassurante. Tout ce qui marche bien. Eviter le piege "surgonfler findings pour paraitre utile" (lesson P-29 constitution).]

## 7. Risques identifies pour chaque action

[Table risque par action. Mitigation pour chaque.]

## 8. Points d'arret — a decider par Kevin

[Questions groupees en fin. Chaque question avec :
- Contexte en 1 phrase
- Options A/B/C claires
- Recommandation par defaut + pourquoi]

## 9. Conclusion honnete

[Verdict synthetique. Ce qui est appris. Ce qu'on fait ensuite. Toujours honnete, jamais surgonfle. Eviter mots interdits (revolution, historique, reference, premier au monde — P-17 constitution).]

---

**Rapport genere** : YYYY-MM-DD, worktree `<nom>`, modele Claude Opus 4.7 1M context.
**Preuve d'execution** : chaque section cite la commande de verification utilisee.
**Zero speculation** — conforme memoire `feedback_no_speculation.md`.
**Vulgarisation obligatoire** — conforme memoire `feedback_vulgarisation_obligatoire.md`.
