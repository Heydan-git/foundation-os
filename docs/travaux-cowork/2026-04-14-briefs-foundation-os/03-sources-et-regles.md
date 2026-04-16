# 03 — Sources, regles de generation, arbitrage anti-doublon

> Ce document est la reference pour savoir quelle source nourrit quelle section du morning brief ou du hebdo, et comment arbitrer les conflits (filesystem vs Asana vs CONTEXT vs git).

## 1. Inventaire des sources

| Source | Chemin / ID | Proprietaire | Mise a jour | Utilisee pour |
|--------|-------------|--------------|-------------|---------------|
| CLAUDE.md | `foundation-os/CLAUDE.md` | CLI | rare | ton, garde-fous, stack |
| CONTEXT.md | `foundation-os/CONTEXT.md` | CLI | chaque session CLI | modules, sessions recentes, cap, prochaine action, decisions, metriques |
| COWORK-CONTEXT.md | `docs/travaux-cowork/COWORK-CONTEXT.md` | Cowork | chaque session Cowork | derniere action Cowork, travaux actifs, patchs en attente, propositions |
| docs/plans/*.md | — | CLI + Cowork | par plan | plans actifs, progression |
| docs/specs/*.md | — | CLI + Cowork | par spec | decisions d'architecture |
| docs/core/*.md | — | CLI (par defaut) | rare | routing, memoire, monitor |
| docs/decisions-log.md | — | CLI | rare | archive decisions > 30j |
| `git log` | repo | auto | chaque commit | done cette semaine, velocite commits |
| `scripts/health-check.sh` | — | CLI | on-demand | sante OS, refs cassees |
| Asana projet | ID 1213918098666338 | Kevin + Cowork | par tache | taches actives, desyncs |
| Vercel deploy | foundation-os.vercel.app | auto | par push | sante deploy |
| Supabase | — | auto | manuel | sante DB, ping cron |

## 2. Mapping section → source

### Morning brief

| Cadre | Source principale | Source secondaire | Commande verif |
|-------|-------------------|-------------------|----------------|
| Sante OS | `scripts/health-check.sh` | CONTEXT.md "Metriques" | `bash scripts/health-check.sh` |
| Trajectoire | CONTEXT.md "Sessions recentes" | CONTEXT.md "Cap" + plan actif | `head -60 CONTEXT.md` |
| Cap | CONTEXT.md "Cap" | plan actif | — |
| Asana aujourd'hui | Asana `get_tasks` filtre `due_on<=today + completed=false` | — | MCP Asana |
| Attention | COWORK-CONTEXT "Patchs en attente" | CONTEXT "En attente Kevin" + health | — |
| Dernier travail | COWORK-CONTEXT "Derniere action Cowork" | `git log --oneline -5` | `git log` |
| Idees fraiches | CONTEXT "Idees & Parking" diff 24h | — | `git diff HEAD~1 CONTEXT.md` |
| Input | arbitrage Cowork | — | — |

### Hebdo

| Section | Source principale | Source secondaire | Commande verif |
|---------|-------------------|-------------------|----------------|
| Verdict | agregat | — | — |
| Trendline sante | archive health (phase 2) | snapshot jour | a creer |
| Done | `git log --since="7 days ago"` | CONTEXT sessions recentes | `git log --since` |
| Asana etat | Asana `get_tasks` filtre modifie 7j | — | MCP Asana |
| Desyncs | croisement Asana × CONTEXT × git | — | MCP Asana + git log |
| Velocite | `git log --since --oneline \| wc -l` | plan actif | — |
| Decisions S15 | CONTEXT "Decisions" filtre date | — | `grep` |
| Blocages | COWORK "Patchs" + CONTEXT "En attente" + "Risques" | health | — |
| Idees S15 | CONTEXT "Idees & Parking" diff semaine | — | `git log CONTEXT.md` |
| Cap S16 | CONTEXT "Cap" | plan actif | — |
| Input | arbitrage Cowork | — | — |

## 3. Regles anti-doublon

1. **Une info = un seul endroit source**. Le brief resume, jamais ne recopie.
2. **Si CONTEXT.md contient le detail d'une session** → brief ne cite que titre + date + pointeur.
3. **Si Asana contient le detail d'une tache** → brief cite nom court + due date + lien permalink. Jamais les notes internes.
4. **Si COWORK-CONTEXT.md contient un patch** → brief cite le nom + statut. Le detail reste dans COWORK-CONTEXT.md.
5. **Jamais de contenu genere (resume narratif libre)** sans ancrage source verifiable.

## 4. Arbitrage en cas de conflit

Ordre de priorite (le plus fiable d'abord) :

1. **Reel observable** (repo filesystem, deploy live, tests qui passent) — source de verite ultime.
2. **git log** — historique factuel, non falsifiable.
3. **CONTEXT.md** — etat declare par CLI, mis a jour en fin de session.
4. **COWORK-CONTEXT.md** — etat declare par Cowork.
5. **Asana** — intention / planification, souvent en retard sur le reel.

**Consequence** : si Asana dit "non coche" mais le reel dit "fait" → **desync**, a remonter dans section Desyncs du hebdo. Jamais cocher automatiquement. Toujours attendre OK Kevin.

## 5. Format de restitution

- **Visuel** : HTML standalone Void Glass (inline styles CSS, zero dependance reseau, ouvre dans le navigateur).
- **Archivage** : chaque brief genere archive dans `docs/travaux-cowork/briefs-archives/<type>/YYYY-MM-DD.html` (morning) ou `SXX-YYYY-MM-DD.html` (hebdo).
- **Lien dans conversation** : format `computer://.../path.html`, avec une phrase courte de resume au-dessus.
- **Alternative MD** : pour copier-coller rapide, une version MD peut etre generee en parallele.

## 6. Declenchement (proposition scheduling)

| Brief | Moment | Jours | Duree generation estimee |
|-------|--------|-------|--------------------------|
| Morning | 08:00 | Lundi-vendredi | 30-60 s |
| Hebdo | 18:00 | Vendredi | 90-120 s |

A activer via scheduled task MCP une fois le format stabilise (phase 2). En v1 : declenchement manuel par Kevin dans une conversation Cowork avec trigger `/morning` ou `/hebdo` (a creer comme commandes Cowork plus tard).

## 7. Imperatifs non-negociables (rappels)

- 🚫 Ne jamais cocher une tache Asana sans OK explicite Kevin.
- 🚫 Ne jamais inventer une metrique. Si non-verifiable → pas dans le brief.
- 🚫 Ne jamais ecrire "tout est sous controle" sans lecture health-check.
- 🚫 Ne jamais fermer avec une formule de politesse.
- ✅ Toujours signaler une desync si detectee.
- ✅ Toujours finir par UNE question ouverte (Input).
- ✅ Toujours linker en `computer://` les livrables generes.
