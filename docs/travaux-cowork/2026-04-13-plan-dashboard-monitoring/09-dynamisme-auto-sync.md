# 09 — Dynamisme, auto-sync et reactivite

**Principe cardinal** : le dashboard est un **miroir vivant** de Foundation OS. Jamais Kevin ne doit dire "mets a jour le dashboard". Il reflete automatiquement l'etat reel du filesystem et des artefacts, **sans process lourd, sans daemon permanent, sans doubler les donnees**.

Lentilles mobilisees : lead-dev, devops-specialist, database-architect, foundation-os-orchestrator.

## 1. Regles d'or du dynamisme

| # | Regle | Pourquoi |
|---|-------|----------|
| 1 | **Source unique** : le filesystem (fichiers MD/JSON) est la seule verite | Pas de base a synchroniser, pas de drift |
| 2 | **Zero duplication** | Le dashboard *parse*, il ne *stocke* pas |
| 3 | **Lazy + on-demand** | On lit quand la page s'ouvre, pas en permanence |
| 4 | **Invalidation par signal** | Les changements emettent un signal, on re-parse la zone concernee |
| 5 | **Pas de daemon** | Aucun process tournant en fond en permanence (eviterait overhead et conflits verrou) |
| 6 | **Gracieux degrade** | Si signal manque, fallback polling ultra-faible (30s) sur l'onglet actif uniquement |

## 2. Trois niveaux de reactivite

### Niveau 1 — Parse au chargement (baseline)
A l'ouverture d'une page : parse des fichiers concernes. Cache memoire TTL 5 min.
- Pro : zero overhead quand dashboard ferme
- Con : nouvelle info pas visible si onglet deja ouvert

### Niveau 2 — Watch filesystem (dev)
En mode dev (`npm run dev`), Vite HMR ecoute les fichiers `data/`, `docs/`, `CONTEXT.md`. Tout changement → emit custom event `fos:fs-changed` → re-parse.
- Pro : instantane en dev
- Con : pas dispo en prod (pas de FS watcher browser)

### Niveau 3 — Watchers cibles en prod (le coeur)
En prod (deployee sur Vercel ou en local build), on utilise un **agent leger** :

**Option A — Server-Sent Events (SSE) via API Node co-locale** :
- Endpoint `/api/fos-stream` qui diffuse les events fs (chokidar) au client via SSE
- Client souscrit, reloade la zone concernee au bon moment
- Poids : 1 connexion SSE par onglet ouvert, ~0 CPU quand idle

**Option B — Hooks Git + fichier signal** (preferable pour zero-infra) :
- Git `post-commit` hook ecrit un timestamp dans `.fos-last-change`
- Client lit ce fichier en polling ultra-faible (10s) uniquement si tab actif
- Si timestamp change → re-parse tout
- Pro : aucun serveur, zero infra
- Con : precision limitee au commit (pas aux edits intermediaires)

**Option C — hybride (recommandee)** :
- Dev : HMR Vite (niveau 2)
- Prod : hooks Git + SSE optionnelle si API Node dispo
- Toujours : bouton manuel "Rafraichir" en header pour override

Decision finale : **gate G1 (bloc B9 du plan exec)**.

## 3. Auto-discovery — le dashboard se remet a jour tout seul

### 3.1 Pattern "convention over configuration"

Tout element nouveau dans le filesystem est decouvert automatiquement **a la condition qu'il respecte la convention**. Pas besoin de "register" quoi que ce soit.

| Ajout Kevin fait | Dashboard se met a jour parce que... |
|------------------|--------------------------------------|
| Cree un skill dans `.claude/skills/X/SKILL.md` | Parseur liste `.claude/skills/*/SKILL.md` et affiche |
| Ajoute un outil dans `docs/core/tools/index.json` | JSON re-parse a l'ouverture de /arsenal/tools |
| Ajoute un plan dans `docs/plans/YYYY-MM-DD-X.md` | Parseur liste `docs/plans/*.md` glob + parse frontmatter |
| Cree un module `modules/X/` | Parseur liste `modules/*` et lit `modules/X/package.json` si present |
| Ajoute un dossier `docs/travaux-cowork/YYYY-MM-DD-slug/` | Parseur glob + lit le 00-INDEX.md |
| Modifie CONTEXT.md | Parseur re-lit CONTEXT.md |
| Ajoute une decision (D-XXX) | Extrait via parser CONTEXT.md |
| Ajoute une idea | Dans `data/ideas/*.md`, parseur glob |
| Commit git | `git log` re-read |
| Cree un composant DS | Parseur liste `modules/design-system/src/components/**/*.tsx` |

### 3.2 Regle : **"Si ca suit la convention, c'est visible. Sinon, c'est invisible."**

C'est ca la magie sans overhead : pas de base de donnees, pas d'etape "enregistrer dans le dashboard", juste respecter les conventions **qui existent deja** dans Foundation OS (nomenclature travaux-cowork, glob plans, tools/index.json).

### 3.3 Convention already existante (rappel)
- Plans : `docs/plans/YYYY-MM-DD-nom.md` avec frontmatter `status`, `module`, `blocs`
- Travaux Cowork : `docs/travaux-cowork/YYYY-MM-DD-slug/00-INDEX.md`
- Decisions : lignes `| D-XXX | date | titre |` dans CONTEXT.md
- Tools : entrees dans `docs/core/tools/index.json`
- Modules : dossiers `modules/X/` avec `package.json`
- Skills : dossiers `.claude/skills/X/SKILL.md`
- Plugins : `.claude-plugins.json`
- Ideas : `data/ideas/*.md` avec frontmatter

Aucune convention nouvelle n'est inventee pour le dashboard. **Le dashboard adapte sa lecture aux conventions existantes, pas l'inverse.**

### 3.4 Enrichissement auto (feature cle)

Quand tu (Kevin) ajoutes un outil dans `tools/index.json` avec sa description d'analyse (a quoi il sert), le dashboard l'affiche automatiquement a sa prochaine ouverture de /arsenal/tools.

Demo flow :
1. Tu edites `docs/core/tools/index.json`, ajoutes un outil X avec `description`, `when_to_use`, `category`
2. Tu sauvegardes
3. (Niveau 2 dev : instant) OU (Niveau 3 prod : au prochain commit OU au prochain chargement de page)
4. /arsenal/tools affiche X avec son nouveau detail

Pas de "deploy", pas de "rebuild", pas de commande a lancer.

## 4. Ecosysteme d'events internes

### 4.1 Event bus minimal
Client-side : un mini bus Zustand/Jotai :
- `fos:context-changed` emis quand CONTEXT.md change
- `fos:plan-changed` emis quand un plan change
- `fos:tool-added` emis quand tools/index.json change
- `fos:data-changed` emis quand data/ change
- `fos:git-changed` emis quand un commit arrive
- `fos:health-checked` emis apres re-execution health-check

### 4.2 Abonnements
Chaque page s'abonne uniquement aux events qui la concernent :
- /arsenal/tools : `fos:tool-added`
- /plans : `fos:plan-changed`, `fos:git-changed`
- Home : `fos:context-changed`, `fos:plan-changed`, `fos:health-checked`

Evite le "tout recharger a chaque change".

### 4.3 Propagation
Sources des events :
- Dev (Vite HMR) : ecoute FS changes → emit
- Prod avec SSE : stream serveur → client emit
- Prod sans SSE : polling timestamp toutes les 10s → emit si change
- User-driven : clic "Rafraichir" → emit manuellement

## 5. Sync inter-tete (Cowork <-> CLI)

### 5.1 Le probleme
Claude Code CLI modifie les fichiers pendant qu'un dashboard est ouvert dans Cowork. Comment eviter que le dashboard soit perime ?

### 5.2 La solution
- Pendant qu'une session CLI tourne (verrou actif) : le dashboard passe en **mode lecture explicite** avec banniere "Session CLI en cours. Ecritures Cowork bloquees. Auto-refresh actif."
- A chaque commit CLI → event `fos:git-changed` → re-parse global
- A la fin de session CLI (release verrou) → event `fos:session-ended` → rafraichissement complet + toast "Session CLI terminee. X blocs livres."

### 5.3 Verrou cross-visible
Le verrou `.fos-session.lock` est lu par le dashboard :
- Si verrou pris par CLI → badge jaune dans header
- Si pris par Cowork → idem mais badge bleu
- Si libre → badge vert
- Si TTL expire → badge orange avec CTA "Forcer release"

## 6. Architecture technique dynamisme

### 6.1 Client
```
App (React)
├── Providers
│   ├── DataProvider  (parse initial, cache memory)
│   ├── EventBus      (Zustand store)
│   └── WatcherProvider (selon niveau : HMR hook, SSE client, polling)
├── Pages (subscribe uniquement a ce qui leur sert)
└── Cmd+K (globale, indexe tout au mount, re-index sur events cibles)
```

### 6.2 Parseurs (purs, cachables)
Chaque parseur est une fonction pure :
- Input : content MD/JSON string
- Output : objet type
- Cache : React Query ou SWR avec key = path + mtime (invalidate sur mtime change)

### 6.3 Serveur minimal (si SSE choisie)
- Vercel Edge Function OU Node express leger
- Endpoint `/api/stream` : chokidar watch sur `data/`, `docs/`, `CONTEXT.md` → SSE
- Endpoint `/api/health` : execute `bash scripts/health-check.sh` et cache 30s
- Endpoint `/api/lock` : read `.fos-session.lock`
- Endpoint `/api/write` : ecrit un fichier en respectant verrou Cowork

Poids total : < 100 lignes Node, zero DB, zero queue.

### 6.4 Alternative zero-serveur (chemin preferentiel si deploiement Vercel)
Pre-build au `vercel deploy` :
- Script `prebuild` parse tous les fichiers, genere `public/fos-snapshot.json`
- Client fetch `/fos-snapshot.json` a l'ouverture
- Polling `/fos-snapshot.json` toutes les 30s sur tab actif
- Hook git `post-commit` local trigger re-build prebuild + redeploy (via GitHub Actions ou Vercel webhook)

**Resultat** : dashboard pure static + re-deploy auto a chaque commit = toujours synchro sans infra.

## 7. Auto-enrichissement intelligent

### 7.1 Detection semantique
Quand un nouvel artefact apparait, le dashboard peut enrichir son affichage :
- Nouveau plan detecte → calcule progression via checkboxes, extrait module cible, lie aux decisions referencees
- Nouvel outil → parse description, categorise, detecte triggers mentionnes
- Nouveau composant DS → extrait props via AST TypeScript, genere preview automatique
- Nouvelle decision → extrait tags (module, date, type), lie aux plans/sessions ayant la meme date

Tout ca ne demande pas d'action : parseurs intelligents qui extraient des metadonnees lors du parse initial.

### 7.2 Pas d'enrichissement destructif
Le dashboard **ne modifie jamais les fichiers source** pour les enrichir. Si un detail manque (ex: plan sans module), il affiche "module: non specifie" plutot que d'ajouter un champ.

## 8. Notifications discretes (auto-feedback)

### 8.1 Toasts
Quand un event se produit, toast discret :
- "Plan X passe a DONE"
- "Nouveau bloc ajoute au plan Y"
- "Decision D-038 enregistree"
- "Outil Z ajoute au catalogue"
- "Build vert sur modules/app"

Dismissable, 5s auto, desactivable dans settings.

### 8.2 Badge compteur sidebar
Chaque section sidebar peut porter un badge :
- /lab/inbox [3] messages non lus (de Claude vers Kevin)
- /plans [2] plans avec progression nouvelle
- /pulse [!] si DEGRADED ou BROKEN

Bulle discrete, couleur accent, pas d'animation pulse sauf BROKEN.

## 9. Perf — ne jamais alourdir

### 9.1 Contraintes
- TTFB < 200ms (premier paint du dashboard)
- Parse initial < 500ms meme avec 50 plans, 200 ideas, 98 outils, 46 composants
- Re-parse cible < 50ms (uniquement la zone concernee)
- Memoire client < 50MB

### 9.2 Techniques
- Parsers en Web Worker (offload main thread pour parse gros fichiers)
- Pagination cote UI (virtualized lists pour > 50 items)
- Code splitting par route (lazy load pages)
- Images : webp + dimensions specifiees
- Fonts : preload Figtree + JetBrains Mono avec `font-display: swap`
- Pas de library lourde : Fuse.js (fuzzy) OK (~30kb gzip), pas de lodash entier

### 9.3 Mesure
Lighthouse CI dans pipeline : fail si Performance < 90 sur Home.

## 10. Fallback et resilience

### 10.1 Si filesystem ne repond pas
Banniere "Dashboard hors-ligne (lecture impossible)" avec cache derniere snapshot.

### 10.2 Si parser crash sur un fichier
Log erreur console + affiche le fichier en mode "⚠️ parse error" sans casser le reste.

### 10.3 Si verrou conflit
Modal explicite avec options : attendre, forcer, ouvrir en lecture seule.

### 10.4 Si clock drift
TTL verrou calcule cote serveur si possible, sinon tolerance +/- 30s.

## 11. Ajouts impactes dans le plan execution (fichier 06)

Nouveaux blocs a integrer dans 06-plan-execution.md :

| Bloc | Phase | Description |
|------|-------|-------------|
| **B9bis** | P2 | Watcher FS (Vite HMR dev + polling timestamp prod + SSE optionnelle) |
| **B9ter** | P2 | EventBus Zustand + Providers (DataProvider, WatcherProvider) |
| **B17bis** | P4 | Hook `useFosSnapshot()` : parse automatique tous artefacts au mount |
| **B20bis** | P4 | Auto-sync /arsenal/tools : refresh sur event `fos:tool-added` |
| **B28bis** | P6 | Hook git `post-commit` ecrit `.fos-last-change` + re-genere `public/fos-snapshot.json` |
| **B33bis** | P7 | session-end.md : rappel que le commit suffit pour rafraichir dashboard |

Total : +6 blocs. Ajoute ~3h a l'estimation (passe de 22h a 25h).

## 12. Criteres "dashboard vivant" (check final)

- [ ] J'ajoute un outil dans `tools/index.json` et il apparait sans aucune action manuelle sur le dashboard
- [ ] Je cree un plan dans `docs/plans/` et il apparait dans /plans
- [ ] CLI commit → dashboard refletue dans la minute
- [ ] Aucun daemon Node ne tourne en fond en permanence si Kevin ne veut pas
- [ ] Zero duplication de donnees entre fichiers source et UI
- [ ] Aucune convention nouvelle inventee pour le dashboard
- [ ] Le dashboard ne modifie jamais les fichiers source pour son propre confort
- [ ] Build prod = static files deployables sur Vercel free tier sans backend
- [ ] Si Kevin desactive tous les watchers, tout fonctionne encore en rafraichissement manuel

## 13. Resume en 1 phrase

Le dashboard **ecoute le filesystem**, **parse les conventions deja existantes**, **emet des events cibles**, **ne duplique rien**, **ne necessite aucune action "enregistrer"** de Kevin : chaque ajout respectant les conventions Foundation OS apparait automatiquement.
