# 12 — Roadmap produit, metrics et futur

Lentilles mobilisees : product-management:roadmap-management, product-management:metrics-tracking, product-management:feature-spec, lead-design, foundation-os-orchestrator.

## 1. Vision produit a 12 mois

Le dashboard doit devenir le **point d'entree unique** de Foundation OS. Aujourd'hui : sidebar + cockpit command-line. Demain : interface vivante qui rend visibles tous les modules (Finance, Sante inclus) et connecte Kevin, Claude Code CLI et Cowork en un seul organisme.

### 1.1 Non-objectifs
- Pas un outil SaaS vendable
- Pas de multi-utilisateur
- Pas de dashboard "generique" reutilisable par d'autres
- Pas un remplacement de GitHub / Vercel / Linear (il reflete, il n'orchestre pas a leur place)

### 1.2 North star
**Temps entre "je reprends" et "je sais quoi faire"** < 30 secondes.

Secondary metric : **taux de decisions capturees** (vs oubliees). Objectif : > 95% des decisions prises finissent dans CONTEXT.md sans action manuelle longue.

## 2. Roadmap par horizons (Now / Next / Later)

### 2.1 NOW — v1.0 (0-3 semaines, ~25h)
Livrer le plan d'execution (fichier 06 + B*bis du fichier 09) :
- 10 pages fonctionnelles avec donnees reelles
- Auto-sync dashboard (pre-build snapshot + hook post-commit)
- Workflows essentiels : ideas, inbox, briefs, new decision
- Command palette Cmd+K
- Integration session-start/session-end
- Theme Void Glass applique
- A11y WCAG AA
- Deploy Vercel privee

**KPI sortie v1** :
- [ ] Kevin peut ouvrir le dashboard et demarrer en < 30s
- [ ] Ajouter un outil dans tools/index.json → visible sans action
- [ ] 100% des composants DS Void Glass respectes
- [ ] Lighthouse Perf > 90, A11y > 95

### 2.2 NEXT — v1.5 (3-8 semaines, ~15h)
- Copilot contextuel (assistant escamotable)
- Recherche semantique (embeddings)
- Quadrant d'impact ideas
- Kanban plans avec swimlanes par module
- Graphe de connaissance /knowledge
- Replay plan (timeline d'execution reelle)
- Mobile / tablette responsive poussee
- Integrations Notion (readonly sync decisions)
- Detection anomalies (orphelins, stagnation, duplicates)

**KPI sortie v1.5** :
- [ ] Recherche semantique trouve resultat conceptuel en < 100ms
- [ ] 3 anomalies detectees automatiquement sur le corpus actuel
- [ ] Mobile utilisable sur iPhone 15 (safari)

### 2.3 LATER — v2.0 (> 8 semaines)
- Modules Finance et Sante integres (leurs briefs valides → plans → code)
- Gamification utile (streaks reels)
- Heatmap activite 12 mois
- Learning graph (auto-memory visualisation)
- Component playground interactif
- Integrations Asana bidirectionnelle
- Mode collaboratif (si jamais plusieurs humains)
- Multi-theme (si DS evolue : Light variant pour impression, Focus mode)
- Export rapports (PDF synthese hebdo)

## 3. Metriques de succes

### 3.1 Metriques produit (utilisation)

| Metrique | Source | Cible v1 | Cible v2 |
|----------|--------|----------|----------|
| Ouvertures dashboard / semaine | Vercel analytics | > 7 (1/jour) | > 14 |
| Pages visitees / session | Vercel analytics | > 3 | > 5 |
| Temps median session dashboard | Vercel | 3-5 min | 5-8 min |
| Ideas capturees / semaine | fichier count | > 3 | > 7 |
| Messages inbox / semaine | fichier count | > 5 | > 10 |
| Utilisation Cmd+K / semaine | event client | > 10 | > 30 |
| Taux features utilisees | event client | > 60% | > 80% |

### 3.2 Metriques sante systeme

| Metrique | Source | Seuil vert |
|----------|--------|------------|
| Uptime (si deploy) | Vercel | > 99.5% |
| TTFB Home | Lighthouse | < 200ms |
| JS bundle size main | build | < 300kb gzip |
| Parse time initial | perf.now | < 500ms |
| A11y errors | axe-core | 0 critical |
| Test coverage | vitest | > 80% lib/ |
| Lighthouse Perf | CI | > 90 |

### 3.3 Metriques Foundation OS globales (visibles dashboard)

| Metrique | Affichage | Seuils |
|----------|-----------|--------|
| Verdict health | HealthRing | SAIN/DEG/BROKEN |
| CONTEXT.md lignes | jauge | < 150 OK, 150-200 warn, > 200 alert |
| Plans actifs | badge | < 3 sain, > 5 dispersion |
| Decisions actives | compteur | < 15 OK, > 15 compacter |
| Derniere session | delta temps | < 48h warm, > 7j cold |
| Verrou | badge | libre/actif |
| Build status | badge Home | vert/rouge |
| Tests coverage (si run) | jauge | > 80% |

### 3.4 Metriques qualitatives (sondage Kevin)
Tous les trimestres, auto-question dans inbox :
- "Dashboard toujours utile ? 1-5"
- "Feature la plus utilisee ?"
- "Feature la plus penible ?"
- "Manque-t-il quelque chose ?"

Resultats dans `data/feedback/` deviennent idees v-next.

## 4. Priorisation framework — RICE applique

Chaque feature candidate est scoree :
- **Reach** : freq usage estime par semaine
- **Impact** : massive(3), high(2), medium(1), low(0.5)
- **Confidence** : 100/80/50%
- **Effort** : heures estimees

Score = (R × I × C) / E

Exemples v1 :
- HealthRing : R=7 I=2 C=100 E=4h → 3.5
- Cmd+K global : R=20 I=3 C=100 E=6h → 10
- /lab/ideas : R=5 I=2 C=80 E=5h → 1.6
- Graphe connaissance : R=3 I=2 C=50 E=15h → 0.2 (repousse v1.5)

Tous les scores v1 > 1.0. En dessous = report.

## 5. MoSCoW v1

### Must have (sans quoi v1 n'est pas utile)
- 10 pages accessibles
- Parsing CONTEXT.md, plans, tools
- Home avec health + session + modules
- Command palette
- Creation ideas/notes/messages
- Auto-sync basic (post-commit)
- Void Glass integrale

### Should have (quasi indispensable)
- Pulse detail
- Modules detail
- Arsenal tous tabs
- Design System pages
- Integration session-start/end

### Could have (bonus v1)
- Kanban plans
- Graphe relationnel basique
- Streaks

### Won't have (v2)
- Copilot IA
- Semantic search
- Integrations externes bidirectionnelles
- Gamification complete

## 6. Dependances inter-features

```
Parsers (P2)
  ├── Home (P4)
  ├── Pulse (P4)
  ├── Modules (P4)
  ├── Arsenal (P4)
  └── Command palette (P3)

Providers/EventBus (P2)
  └── Auto-sync (P4+)

Composants custom (P3)
  └── Toutes pages (P4-P6)

data/ infra (P6)
  ├── Lab ideas
  ├── Lab inbox
  ├── Lab notes
  └── Lab briefs

Hooks git (P7)
  └── Auto-refresh prod

QA + A11y (P8)
  └── Deploy (P8)
```

## 7. Risques produit et mitigations

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Kevin n'ouvre plus le dashboard apres 2 semaines | Moyenne | Haut | v1 vraiment utile (pas gadget), metrics suivre |
| Auto-sync genere trop d'evenements, UI laggy | Faible | Moyen | Throttle events 200ms, re-parse cible uniquement |
| Data/ grossit et ralentit parse | Faible | Moyen | Pagination + archivage auto > 90j |
| Dependance Vercel (si change de provider) | Faible | Faible | Static build portable partout |
| DS evolue, tokens break le dashboard | Moyenne | Moyen | DS en module separe, contrat stable |
| CLI et Cowork entrent en collision | Moyenne | Haut | Protocole verrou existe deja, repete ici |
| Dashboard devient lui-meme une charge a maintenir | Moyenne | Haut | Periodic check : est-il encore utile ? desactivation module possible |

## 8. Strategie de sunset (prevention)

Le dashboard doit etre **desactivable sans casser Foundation OS**. Verification :
- Retirer `modules/app/` de Vercel ne doit pas impacter CLI
- Parsers ne sont pas importes depuis autre modules
- CONTEXT.md, plans, tools fonctionnent sans dashboard (c'est deja le cas)
- `data/` est utile meme sans dashboard (consulter en MD direct)

Si un jour plus utile : archive simple, pas de migration.

## 9. Feuille de route d'apprentissage

### 9.1 Semaine 1 apres v1
- Observer usage reel 7 jours
- Lister friction points dans `data/feedback/`
- Priorisation v1.1 patch

### 9.2 Mois 1 apres v1
- Sondage Kevin (rapide, inbox)
- Stats utilisation auto
- Decision v1.5 : quelles features NEXT ?

### 9.3 Trimestre 1
- Retrospective : dashboard a rempli sa mission ?
- Re-ajustement north star si besoin
- Planification v2 features Finance/Sante integrations

## 10. OKRs trimestre Q2-2026 (proposes)

### Objectif 1 — Livrer un cockpit vivant et fiable
- KR1 : v1 deployee avec 10 pages et auto-sync en < 3 semaines
- KR2 : Lighthouse Perf 90+, A11y 95+, coverage 80+
- KR3 : Zero regression Void Glass sur tout le dashboard

### Objectif 2 — Reduire le "temps de reprise"
- KR1 : Temps median reprise mesure < 30s apres 1 semaine d'usage
- KR2 : 90% des decisions capturees sans action manuelle > 10s
- KR3 : 100% des ajouts tools/plans/decisions apparaissent sans Kevin demande refresh

### Objectif 3 — Favoriser la finition sur la dispersion
- KR1 : Blocs IN_PROGRESS > 7j detectes et signales
- KR2 : Ideas inbox > 30j signalees pour triage
- KR3 : Plan actif principal visible en permanence

## 11. Rythmes et rituels (dashboard integre)

### 11.1 Rituel quotidien
- Ouverture : Home, verifier HealthRing + prochaine action (30s)
- Cloture : session-end ecrit message dans inbox si pertinent

### 11.2 Rituel hebdomadaire
- Tous les vendredi : regarder /sessions/history semaine
- Identifier 3 wins, 1 friction
- Mettre dans `data/feedback/` si utile pour evolution

### 11.3 Rituel mensuel
- Regarder /plans vue Timeline : ce qui a avance, ce qui stagne
- Archiver ce qui ne bougera pas
- Promouvoir 1-2 ideas en briefs

### 11.4 Rituel trimestriel
- Retro dashboard
- Evaluation metrics sante
- Decision v-next scope

## 12. Learnings attendus

Hypotheses a valider :
- **H1** : le dashboard reduit la friction de reprise (vs CLI cockpit seul)
- **H2** : capturer ideas dans le lab > que dans CONTEXT.md directement
- **H3** : la visibilite des plans augmente la finition
- **H4** : Cmd+K devient le point d'entree principal apres 2 semaines
- **H5** : l'auto-sync evite toute alerte "dashboard obsolete"

Chaque hypothese a une metrique associee (section 3). Re-evaluation a 1 mois.

## 13. Message a Claude Code CLI (handoff)

Claude, quand tu prendras ce plan pour construire :
- Lis `06-plan-execution.md` comme source de verite d'execution
- Lis `09-dynamisme-auto-sync.md` pour les regles de reactivite (elles ajoutent 6 blocs)
- Les autres fichiers (01-05, 07-08, 10-12) sont references pour detailler des choix
- Respecte les gates (G1 a G5), n'avance pas sans validation Kevin
- Decoupe strictement : 1 bloc = 1 livrable = 1 commit
- Si tu doutes : read, ne code pas
- Si CONTEXT.md doit etre touche : pose la question
- Si le plan te semble errone a un moment : signale, ne bricole pas

Bonne construction.
