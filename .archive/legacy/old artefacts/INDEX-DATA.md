# INDEX-DATA — Source de vérité Fondation
> BDD du projet. Le JSX (fondation_viewer.jsx) est le contrôleur/UI.
> Workflow : mettre à jour ce MD → syncer le JSX
> Dernière MAJ : 03.04.2026

---

## META

| Clé | Valeur |
|-----|--------|
| Version officielle | v0.1 |
| Phase | 00 — Fondation |
| Conversations | 9 |
| Artifacts JSX | 6 (4 en KB, 2 en outputs) |
| Entrées mémoire Claude | 7 |
| Fichiers MD produits | ~20 |
| JSX size | ~58KB / 100KB safe |
| Dernière activité | 03.04.2026 |

---

## CONVERSATIONS

| ID | UUID (short) | Titre | Date MAJ | Livrables |
|----|-------------|-------|----------|-----------|
| CONV-01 | 1d8fa812 | Salon général | 03.04 | FONDATION_v0.md, fondation_viewer.jsx |
| CONV-02 | 96289709 | Skills et workflow | 03.04 | ios-pipeline-dashboard.jsx, conversation-control.jsx, 12 MD Cowork |
| CONV-03 | d839bc9c | Accès instructions | 02.04 | Aucun fichier (technique Claude) |
| CONV-04 | 690cfa43 | Réutiliser design | 02.04 | DA-PIPELINE-EXTRACT.md, DA-VOID-GLASS-CANONICAL.md |
| CONV-05 | b872a6dc | Idéation | 03.04 | Aucun fichier (3 layers texte) |
| CONV-06 | 0c9239fd | Monitoring | 02.04 | fondation-monitor.jsx, FONDATION_MONITORING.md |
| CONV-07 | b988d394 | Communication | 03.04 | centre-communication.jsx, FONDATION_CENTRE.md |
| CONV-08 | 7354b90b | Plugins & frameworks | 03.04 | FONDATION_FRAMEWORKS.md |
| CONV-09 | e8fe2c92 | Index projet | 03.04 | project-index-dashboard.jsx, DA-FONDATION.md, DA-BOILERPLATE.md |

---

## SECTIONS (onglet Contenu)

### 00 — Manifeste
- Vision long terme : Créer une fondation pour aider le monde
- Vision court terme : Un core + un OS + un workflow (design → app)
- Mode opératoire : Coopération humain-IA, pas exploitation
- Principe cardinal : Traçabilité totale, plan évolutif, garde-fous
- KPI : Phase=00, Statut=Setup, Date=02.04.26
- Tags : coopération, traçabilité, évolutif

### 01 — Journal (16 actions, 9 conv)
| # | Action | Source | Détail |
|---|--------|--------|--------|
| 001 | Déclaration d'intention | CONV-01 | Coopération > exploitation. Respect mutuel |
| 002 | Vision posée | CONV-01 | Long terme = fondation mondiale. Court terme = core/OS/workflow |
| 003 | Cadrage Phase 0 | CONV-01 | Traçabilité, historique, garde-fous, mémoire adaptative |
| 004 | Frameworks identifiés | CONV-01 | Claudify + BMAD analysés, stratégie hybride définie |
| 005 | Document Fondation créé | CONV-01 | FONDATION_v0.md — racine de tout |
| 006 | Technique Claude | CONV-03 | Instructions live reload, memories périodiques, contexte 200K tokens |
| 007 | Skills mapping | CONV-02 | 23 skills, 8 phases pipeline iOS, 12 fichiers MD Cowork |
| 008 | Pipeline dashboard | CONV-02 | ios-pipeline-dashboard.jsx + conversation-control.jsx |
| 009 | Monitoring dashboard | CONV-06 | fondation-monitor.jsx + FONDATION_MONITORING.md |
| 010 | DA Void Glass | CONV-04 | DA-PIPELINE-EXTRACT.md + DA-VOID-GLASS-CANONICAL.md |
| 011 | Index projet | CONV-09 | project-index-dashboard.jsx + DA-FONDATION.md + DA-BOILERPLATE.md |
| 012 | Idéation structure | CONV-05 | 3 layers : Core/OS → Méthode → Projets (texte, pas de fichier) |
| 013 | Frameworks setup | CONV-08 | FONDATION_FRAMEWORKS.md — 4 couches L1→L4, 7 étapes |
| 014 | Centre communication | CONV-07 | centre-communication.jsx + FONDATION_CENTRE.md |
| 015 | Fondation viewer | CONV-01 | fondation_viewer.jsx — DA Pipeline, 5 onglets, CTA IA |
| 016 | Audit & sync données | CONV-01 | Scan 9 conv, vérification croisée, correction inventions |

### 02 — Mémoire (4 couches, 3/4 actives)
| Layer | Nom | Desc | Statut |
|-------|-----|------|--------|
| L4 | Persistante | 7 entrées mémoire Claude : vision, principes, frameworks, doc, style, DA, layers | ✅ Actif |
| L3 | Structurée | 3 MD versionnés : FONDATION_v0, MONITORING, FRAMEWORKS | ✅ Actif |
| L2 | Contextuelle | Projet Claude actif : instructions + 4 JSX + knowledge base | ✅ Actif |
| L1 | Exécutive | Cowork : en attente upload 12 fichiers MD | ⏳ En attente |

### 03 — Garde-fous
**DO :**
- ✓ Itérer pas à pas — Valider chaque étape avant d'avancer
- ✓ Tout documenter — Décisions, changements, erreurs — tout est tracé
- ✓ Questionner avant d'agir — En cas d'ambiguïté → poser la question

**DON'T :**
- ✗ Foncer sans validation — Pas de décision structurelle sans accord explicite
- ✗ Supprimer de l'historique — L'historique est sacré — jamais effacé
- ✗ Over-engineer — Pas de complexité avant d'avoir un besoin réel

**Règle d'or :** Quand un doute existe → on pose la question avant d'agir.

### 04 — Frameworks (4 layers)
| Layer | Outil | Statut |
|-------|-------|--------|
| L1 | Cowork | 12 fichiers MD prêts, upload en attente |
| L2 | Claude Code | CLAUDE.md + hooks + skills (à installer localement) |
| L3 | BMAD v6 | npx bmad-method@next install (à exécuter localement) |
| L4 | MCP / Plugins | Figma, Notion, Slack connectés |
| — | Claudify | Ressource/blog pour bonnes pratiques Claude Code |
| — | DA Void Glass | Direction artistique canonique pour tous les artifacts |

### 05 — Instructions (brouillon, 6 blocs)
- Identité : Projet Fondation — Phase 0 — Préparation des bases
- Mode de travail : Coopération, traçabilité totale, plan évolutif, validation
- Mémoire : Consulter Doc Fondation à chaque session, mettre à jour le journal
- Frameworks : Process : BMAD Method — Exécution : Claudify
- Garde-fous : Pas de décision sans validation, pas de suppression d'historique
- Ton : Direct, objectif, sans jugement. Pictos. Pas de flatterie.
- Statut : Brouillon — non vérifié si copié dans Project Instructions

### 06 — Déploiement (3 étapes, 1/3 faite)
| Étape | Desc | Statut |
|-------|------|--------|
| 1 — Projet Claude | Projet actif, 4 JSX en KB. Instructions = non vérifié si copiées. | ✓ Partiel |
| 2 — Cowork | 12 fichiers MD prêts, upload en attente | ⏳ |
| 3 — Phase 1 | App iOS à choisir, stack à valider, BMAD à installer | ⏳ |

### 07 — Versioning
| Version | Date | Desc | Type |
|---------|------|------|------|
| v0.1 | 02.04.26 | Manifeste, journal, mémoire, frameworks, instructions, plan | Officiel |
| → | 02.04.26 | 23 skills, pipeline dashboard, 12 MD, conversation-control | Itération |
| → | 02.04.26 | fondation-monitor.jsx, FONDATION_MONITORING.md | Itération |
| → | 02-03.04.26 | DA Void Glass, project-index-dashboard, DA docs | Itération |
| → | 03.04.26 | 3 layers, FONDATION_FRAMEWORKS.md, 4 couches L1→L4 | Itération |
| → | 03.04.26 | centre-communication.jsx, fondation_viewer.jsx, audit données | Itération |

---

## STRATEGIES (onglet Frameworks)

### BMAD
- Process & gouvernance
- 12+ Agents spécialisés : Analyst, PM, Architect, Dev, QA...
- 4 Phases : Discovery → Planning → Solutioning → Implementation
- Agent-as-Code : Fichiers Markdown/YAML portables
- Workflows YAML : Dépendances inter-tâches
- Party Mode : Multi-agents en session
- Scale-adaptive : Ajuste la profondeur au projet

### Claudify
- Config & exécution
- CLAUDE.md : Fichier racine = règles du projet
- Hooks : Automatisations événementielles
- Skills : Compétences modulaires
- Memory : Persistance cross-sessions
- Workflows : Pipelines AI coding
- Best practices : Blog & ressources communauté

### Hybride (recommandé)
- Process = BMAD : Phases, agents, gouvernance agile
- Exécution = Claudify : CLAUDE.md, hooks, skills
- Traçabilité : Git + versioning artifacts
- Modularité : Agents réutilisables cross-projets
- Scalabilité : Du prototype solo à l'équipe
- Documentation : Auto-générée par les agents

### Matrice comparaison
| Critère | BMAD | Claudify | Hybride |
|---------|------|----------|---------|
| Focus | Cycle de vie complet | Workflow Claude Code | Process + exécution |
| Agents | 12+ spécialisés | Non | 12+ via BMAD |
| Phases | 4 structurées | Libre | 4 + hooks |
| Portabilité | Multi-IDE | Claude Code | Multi-IDE + Claude |
| Courbe d'apprentissage | Moyenne | Faible | Moyenne |
| Maturité | v6 active | Blog/ressource | Combiné custom |

---

## MONITORING

### Mémoire
| Métrique | Cible | Outil | Critique |
|----------|-------|-------|----------|
| Mémoire Claude | 7 entrées | Memory edits | ✅ |
| Doc Fondation | v0.1 ✓ | FONDATION_v0.md | ✅ |
| Doc Monitoring | v1 ✓ | FONDATION_MONITORING.md | — |
| Doc Frameworks | v1 ✓ | FONDATION_FRAMEWORKS.md | — |
| DA Canonical | v1 ✓ | DA-VOID-GLASS-CANONICAL.md | — |

### Artifacts
| Nom | Statut | Emplacement | Critique |
|-----|--------|-------------|----------|
| ios-pipeline-dashboard | ✓ En KB | /mnt/project/ (40K) | ✅ |
| fondation-monitor | ✓ En KB | /mnt/project/ (33K) | ✅ |
| project-index-dashboard | ✓ En KB | /mnt/project/ (23K) | ✅ |
| conversation-control | ✓ En KB | /mnt/project/ (27K) | — |
| centre-communication | ⚠️ Outputs seul | Pas en KB projet | — |
| fondation_viewer | ⚠️ Outputs seul | Ce dashboard | ✅ |

### Frameworks
| Métrique | Cible | Outil | Critique |
|----------|-------|-------|----------|
| BMAD v6 recherché | ✓ Fait | Web search | ✅ |
| Claudify recherché | ✓ Fait | Web search | ✅ |
| Stratégie hybride | ✓ Définie | Comparatif | ✅ |
| 4 couches formalisées | ✓ Fait | FRAMEWORKS.md | ✅ |
| BMAD installé | ⏳ Local | npx bmad-method | — |
| CLAUDE.md créé | ⏳ Local | Claude Code | — |

### Déploiement
| Métrique | Cible | Outil | Critique |
|----------|-------|-------|----------|
| Projet Claude | ✓ Actif | Claude Projects | ✅ |
| Instructions copiées | ⚠️ Non vérifié | Projet | ✅ |
| KB artifacts | ✓ 4 JSX | /mnt/project/ | ✅ |
| KB docs MD | ⏳ 0 uploadés | Projet | — |
| Cowork 12 fichiers | ⏳ Upload | Cowork | — |
| App iOS cible | ⏳ À définir | Idéation | — |

---

## PRIORITÉS

### P0 — Bloquant
- Choisir l'app iOS cible
- Vérifier si instructions copiées dans Projet
- Uploader centre-comm + viewer en KB

### P1 — Prioritaire
- Uploader 12+ fichiers MD sur Cowork
- Installer BMAD localement (npx)
- Créer CLAUDE.md

### P2 — Moyen terme
- Phase 00 — Validation marché
- Formaliser Core/OS (Layer 1)
- Aligner DA sur tous artifacts

---

## ROADMAP

| Version | Titre | Items | Phase |
|---------|-------|-------|-------|
| v0.1 | Fondation posée | Manifeste ✓, Journal ✓, Mémoire 4 couches ✓, Garde-fous ✓, Frameworks analysés ✓ | ✅ Done |
| — | Outillage construit | 6 dashboards JSX ✓, ~20 fichiers MD ✓, DA Void Glass ✓, 3 layers identifiés ✓ | ✅ Done |
| — | En attente utilisateur | Choisir app iOS, Upload Cowork, Installer BMAD, Créer CLAUDE.md | 🟡 Active |
| v0.2 | Core défini | App iOS choisie, Stack validée, Workflow BMAD actif, Phase 00 Validation | ⏳ Next |
| v1.0 | Premier produit | Pipeline complet exécuté, App publiée, Métriques en place | ○ Future |
| v2.0 | Fondation active | Revenus générés, Méthode reproductible, Impact mesuré | ○ Future |

---

## VISION (onglet Vision — données spécifiques)

### Métriques d'état
| Label | Valeur | Sous-label |
|-------|--------|------------|
| Phase | 00 | Fondation |
| Conversations | 9 | 03.04.2026 |
| Mémoire | 7 | entrées Claude |
| Artifacts | 4+2 | 4 en KB · 2 outputs |

### À définir
| Sujet | Détail | Statut |
|-------|--------|--------|
| Le core | 3 layers identifiés (Core/OS → Méthode → Projets). Contenu à affiner. | En cours |
| Le public cible | Pour qui ? Solo ? Équipe ? Clients ? | En attente |
| L'app iOS cible | Quelle première app ? Quel problème ? Quel budget tier ? | Bloquant |
| La stack technique | Swift 6 + SwiftUI + TCA + Supabase pressentie | Esquissé |

---

*Ce fichier est la BDD. Le JSX est le contrôleur. Toujours mettre à jour ici d'abord.*
