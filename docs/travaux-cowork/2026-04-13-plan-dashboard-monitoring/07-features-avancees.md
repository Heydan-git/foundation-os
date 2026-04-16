# 07 — Features avancees et innovations

Lentilles mobilisees : product-design-uxui, ui-expert, foundation-os-orchestrator, lead-design, specialiste-ai.

## 1. Philosophie feature

Le dashboard n'est pas une "page d'admin" mais un **cockpit vivant**. Chaque feature doit :
- Informer sans saturer (TDAH-friendly)
- Predire / suggerer / resumer (intelligence)
- Raccourcir les boucles action → feedback
- Etre declenchable au clavier en < 3 touches

## 2. Intelligence embarquee (Assistant contextuel)

### 2.1 Panneau lateral "Claude Copilot"
Panneau escamotable (icone 🔮 en bas a droite, raccourci `Cmd+.`) qui propose en continu :

- 🎯 **Focus suggestion** : analyse CONTEXT.md + plans ouverts → "Tu devrais avancer B7 du plan DS shadcn avant tout". Logique simple en v1 (regle : bloc IN_PROGRESS le plus ancien), IA-driven en v2.
- 🧠 **Context memory** : affiche les 5 dernieres decisions pertinentes pour la page en cours (ex: sur /design-system affiche D-DS-REBUILD).
- ⚡ **Quick ask** : champ text "Demande a Claude" qui ecrit dans `data/inbox/` pour traitement a la prochaine session CLI.
- 🌡️ **Pressure meter** : barre montrant le "risque de compactage" (# tokens CONTEXT.md + longueur session + # files modifies). Rouge au-dessus d'un seuil.

### 2.2 Detection d'anomalies
- Detecteur de duplication : compare titres de decisions, plans, ideas → flag si similarite > 85%
- Detecteur d'orphelins : fichier dans docs/ non reference dans un index ou CONTEXT.md
- Detecteur de stagnation : plan IN_PROGRESS sans commit depuis > 7 jours → badge "stale"
- Detecteur d'incoherence : module active dans CONTEXT.md mais dossier modules/X absent

### 2.3 Resume automatique
Chaque page affiche en header un resume 1 ligne genere (en v1 statique templatable, v2 LLM) :
- Home : "3 modules actifs, 2 plans avancent, 1 bloque, sante SAIN, derniere session il y a 4h"
- Modules : "App Builder 85% livre, Design System 62% sur v2, Finance non demarre"
- Plans : "8 plans totaux, 2 actifs, 3 termines, 3 en backlog"

## 3. Gamification utile (pas de vanity metrics)

### 3.1 Streaks honnetes
- **Build streak** : nombre de jours consecutifs avec au moins 1 commit + build vert
- **Session streak** : nombre de sessions successives sans red flag
- **Focus streak** : jours consecutifs sans changer de plan actif (favorise la finition)

Affichage discret en header, pas de trophees infantilisants.

### 3.2 Progress rings module
Pour chaque module actif, anneau SVG qui se remplit au fur et a mesure des blocs livres. Visuel satisfaisant sans dopamine artificielle.

### 3.3 Historique des victoires reelles
Page `/sessions/wins` : liste auto-generee des sessions ayant ship un bloc (detection : commit avec `feat(...)` + build vert + plan mis a jour). Affiche "quand" et "quoi", pas de score.

## 4. Features par page — approfondissement

### 4.1 Home — widgets additionnels
- **Weather widget** : metaphore meteo de la sante (☀️ SAIN / ⛅ DEGRADED / ⛈️ BROKEN). Plus intuitif qu'un verdict text.
- **Prochain bloc concret** : card avec le prochain bloc du plan actif, bouton "Demarrer" → ouvre une template commit / session-start pre-remplie dans le clipboard.
- **Calendrier mini** : 30 derniers jours avec heatmap d'activite git (style GitHub).
- **Temps de focus** : timer Pomodoro integre qui enregistre dans `data/focus-sessions.md`.
- **Now playing** : nom de la session en cours, depuis quand, verrou actif.

### 4.2 Pulse — au-dela du verdict
- **Timeline des verdicts** : graphique 30 jours SAIN/DEGRADED/BROKEN (stacked area). Donnees : `.fos-health-history.jsonl` append par health-check.
- **MTTR mini** : temps moyen pour revenir a SAIN apres un BROKEN.
- **Budget CONTEXT.md** : jauge visuelle lignes / 150. Lien direct "Compacter CONTEXT.md" qui ouvre une template.
- **Budget SESSION** : tokens consommes session actuelle (estimation parsing .claude), alerte si > 80%.
- **Bottleneck detector** : affiche le module le plus "vieux non touche" et le plus "modifie recemment".
- **Diff depuis last session-end** : liste fichiers changes entre deux markers session.

### 4.3 Modules — vue 360
- **Dependency graph** : visualisation D3/cytoscape des dependances entre modules (imports, shared packages).
- **Lignes de code par module** : histo auto via `cloc` ou `tokei`.
- **Coverage** : si tests presents, % coverage affiche.
- **Brief vs realise** : diff entre le brief initial et l'etat actuel (quels objectifs livres, quels deletes).
- **Timeline module** : frise chronologique des decisions et plans relatifs au module.

### 4.4 Arsenal — exploration enrichie
- **Graphe d'usage** : quel skill invoque quel autre (heatmap), quel outil utilise quel autre. Source : `docs/core/tools/routing.json`.
- **Last used** : timestamp derniere invocation (si tracable via logs).
- **Tag cloud** : tags transversaux (design, data, sante, dev...).
- **Compare skills** : side-by-side de 2 skills (description, triggers, overlap). Detection de doublons.
- **Skill stress test** : formulaire qui genere un prompt test pour verifier le triggering d'un skill.

### 4.5 Plans — Kanban augmente
- **Swimlanes par module** : Kanban split par module pour voir la charge par domaine.
- **Timeline Gantt** : vue calendrier avec deadlines estimees.
- **Burndown chart** : blocs restants sur le temps estime.
- **Bloc detail** : modal avec prerequis, livrable, fin observable, modele, sub-agent Y/N, dependances, commit message propose.
- **Replay plan** : mode "lecture" d'un plan termine avec timeline d'execution reelle (commits associes).

### 4.6 Knowledge — navigation semantique
- **Graphe de connaissance** : noeuds = decisions/specs/docs, aretes = references mutuelles. D3 force-directed.
- **Backlinks** : pour chaque doc, liste des docs qui y referent (style Obsidian / Roam).
- **Recherche semantique** : embeddings locaux (via modele leger cote client ou API OpenAI optionnelle) pour recherche conceptuelle au-dela du keyword.
- **Timeline decisions** : frise chronologique des D-XXX avec filtres statut.
- **Archeologie** : explorateur de `.archive/` avec diff vs actuel.

### 4.7 Lab — creativite

#### Ideas
- **Quadrant d'impact** : placement 2D (effort x impact) drag & drop. Sauvegarde coordonnees.
- **Transformation assistee** : bouton "Transformer en brief" remplit un squelette de brief module et le depose dans `data/briefs/`.
- **Clustering** : regroupement auto par similarite text (cosine simple).
- **Voting self** : tu peux "voter" pour toi-meme sur une idea → remonte en priorite.

#### Notes
- **Editeur MD WYSIWYG** : Tiptap ou CodeMirror avec preview side-by-side.
- **Slash commands** : `/todo`, `/decision`, `/idea`, `/plan-bloc` inserent des templates.
- **Liens bi-directionnels** : `[[nom-module]]` devient lien vers la page module.
- **Export** : une note peut etre "promue" en `docs/specs/` avec un bouton.

#### Inbox bidirectionnelle
- **Threads** : messages groupes par sujet.
- **Tag par module** : chaque message peut etre tague pour filtrer.
- **Reactions** : 👍 🤔 ⭐️ 🚀 pour signaler rapidement a Claude ce qu'on pense d'une proposition.
- **Resume de session** : automatiquement genere par Claude en fin de session, reperable avec une icone speciale.

#### Briefs futurs modules
- **Template structure** : Probleme / Utilisateurs / Jobs / Metrics / Risques / Stack / Timeline.
- **Validation brief** : checklist auto (tous les champs remplis ? conflits avec CONTEXT.md ?).
- **Simulation** : bouton "Genere un plan initial" qui appelle le skill foundation-os-orchestrator pour sketcher un plan.

### 4.8 Design System — feature pro
- **Token inspector** : clic sur un pixel de la page → affiche le token utilise.
- **Contrast checker integre** : selectionne 2 tokens couleur → ratio WCAG.
- **Component playground** : chaque composant DS a sa page avec tous les variants + props editables.
- **Responsive tester** : iframe avec breakpoints toggleable.
- **Export tokens** : bouton pour generer CSS/JSON/iOS/Android.
- **Diff tokens** : compare versions DS (avant / apres) → liste changements.
- **Usage tracker** : ou est utilise chaque composant DS dans modules/.

### 4.9 Sessions — observatoire
- **Heatmap calendaire** : 12 mois, chaque case = 1 jour, intensite = # commits + # sessions.
- **Stats session** : duree moyenne, # blocs / session, modele dominant.
- **Cross-session memory** : que s'est-il passe entre la session X et la session Y ? (diff fichiers + git log).
- **Replay CLI** : si on enregistre les logs .claude/, mini replay des echanges.

### 4.10 Memory — debogage mental
- **CONTEXT.md delta** : visualise les changements CONTEXT.md entre 2 sessions.
- **Budget visualisation** : barre empilee par section (modules, sessions, decisions, cap, ideas, metrics, risks, mcp, tools) pour voir ou le poids part.
- **Cleanup suggestor** : propose sections a archiver (ex: decisions > 15 actives).
- **Auto-memory browser** : liste tous les fichiers dans `.auto-memory/` avec taille et date.
- **Learning graph** : visualise les regles apprises et leur source (feedback_*.md).

## 5. Workflows transverses

### 5.1 Workflow "New decision"
Triggered par `Cmd+Shift+D` ou bouton global :
1. Modal demande : titre, contexte, options considerees, decision, consequences
2. Assignment auto d'un ID D-XXX (chiffre suivant)
3. Ecrit dans CONTEXT.md section Decisions (via API ou file write)
4. Propose commit message `chore(context): add D-XXX ...`

### 5.2 Workflow "New idea"
`Cmd+I` ou bouton :
1. Input rapide (texte court)
2. Frontmatter auto (date, status: inbox, module: undefined)
3. Sauvegarde dans `data/ideas/`
4. Toast "Idea captured" avec lien pour editer plus

### 5.3 Workflow "Start next block"
Depuis /plans/[slug] ou Home :
1. Bouton "Demarrer ce bloc"
2. Ouvre modal avec :
   - Template commit message
   - Rappel : modele, sub-agent Y/N, livrable, fin observable
   - Bouton "Copy pour CLI" → clipboard avec prompt pret pour Claude Code
3. Optionnel : update bloc status en IN_PROGRESS dans le fichier plan

### 5.4 Workflow "Declare session start/end from UI"
Bouton global haut-droite "Start session" :
- Acquire verrou (via API)
- Affiche brief v11 rendu dans un dialog full-screen
- Bouton "OK on y va" rend la main
Bouton "End session" symetrique.

### 5.5 Workflow "Promote" (Idea → Brief → Plan → Module)
Chain d'operations gerable en UI :
- Idea → Brief (copie contenu, structure, cree fichier `data/briefs/module-X.md`)
- Brief → Plan (appel skill pour generer `docs/plans/YYYY-MM-DD-nom.md`)
- Plan → Module (scaffold `modules/X/` via commande `/new-project` pre-rempli)

## 6. Integrations externes (optionnelles, gated)

- **Notion** : sync bidirectionnel /knowledge avec une DB Notion (via MCP Notion deja connecte).
- **Asana** : creer une tache Asana depuis un bloc du plan (MCP Asana).
- **Figma** : embed Figma frame dans /design-system/composants (MCP Figma).
- **GitHub** : ouvrir un PR directement depuis un bloc termine.

Toutes ces integrations sont optionnelles, derriere un toggle settings, lazy-loaded.

## 7. Settings et personalisation

Page `/settings` avec :
- **Densite** : Compact / Confort / Spacieux (affecte spacing tokens)
- **Mode animation** : Reduit / Standard / Riche
- **Mode daltonien** : palette alternative pour status
- **Mode focus** : masque sidebar + header, full screen sur la page active
- **Raccourcis personnalisables** : mapper Cmd+X a une action
- **Timezone** : affichage dates
- **Sections visibles** : toggle modules cards, pulse widgets, etc.
- **Integrations** : on/off Notion/Asana/Figma/GitHub

Settings persistes dans `data/settings.json` (pas en localStorage pour portabilite).

## 8. Features "hidden" (easter eggs utiles)

- `Konami code` : ouvre un mode debug avec tous les fichiers data/ bruts.
- Triple-click sur le logo : re-scan complet + reload forcee.
- `?` global : affiche la cheat sheet raccourcis clavier.
- Long press sur un bloc : affiche son historique complet (modifs frontmatter).

## 9. Criteres d'innovation (check final)

Une feature est OK si :
- [x] Elle fait gagner du temps a Kevin (pas juste esthetique)
- [x] Elle ne saturera pas CONTEXT.md (donnees derivables ou dans data/)
- [x] Elle respecte Void Glass
- [x] Elle est scalable quand d'autres modules arriveront (Finance, Sante)
- [x] Elle est cliquable ou executable au clavier en < 3 touches
- [x] Elle a une raison d'etre ecrite dans ce document

## 10. Priorisation features (v1 vs v2)

**v1 (livraison initiale)** : 10 pages, workflows essentiels (ideas, inbox, briefs), command palette, integration session-start/end, widgets Home basiques.

**v2** : Copilot IA, dependency graph, semantic search, quadrant ideas, Figma/Notion integration, replay plans, component playground.

**v3** : gamification streaks, heatmap activite, learning graph, detection anomalies avancee, mode focus.

Priorisation confirmee au gate G3 (review Home).
