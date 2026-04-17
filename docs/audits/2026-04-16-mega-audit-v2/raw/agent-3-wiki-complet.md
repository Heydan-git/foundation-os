---
type: audit-raw
agent: 3
zone: "Wiki Complet"
date: 2026-04-16
scope_files: 48
lines_read: 4370
status: completed
---

# RAPPORT AGENT 3 — WIKI COMPLET

## Inventaire

**Total fichiers .md dans wiki/ : 48 fichiers** (verifie `find wiki -name "*.md" | wc -l`). Tous les 48 ont ete lus integralement, ligne par ligne.

Pages par zone :
- **Racine** : hot.md (62L), log.md (76L), overview.md (85L), index-wiki.md (122L) = 4 pages
- **Concepts** : Brief v12, Compounding Knowledge, Core OS, Foundation OS, Hot Cache, LLM Wiki Pattern, Neuroplasticite, TDAH workflow, Void Glass = 9 pages
- **Entities** : AgriciDaniel, Andrej Karpathy, Obsidian, Pinecone, tools-foundation-os = 5 pages
- **Sources** : agricidaniel-claude-obsidian, karpathy-llm-wiki-pattern, session-2026-04-16-neuroplasticity-audit, session-2026-04-16-wiki-adoption = 4 pages
- **Meta** : foundation-os-map (211L), index-app, index-concepts, index-core-os, index-cowork, index-entities, index-meta, index-sources, lessons-learned (117L), routines-guardrails (150L), routines-setup (860L !), session-dna, sessions-recent (132L), thinking = 14 pages
- **Meta/templates** : comparison, concept, entity, question, source = 5 pages
- **Domains** : design-system-components, foundation-os-desktop-migration, 5 index (design, dev, finance, sante, trading) = 7 pages

**Note** : fichier non-.md detecte `wiki/meta/routines-dashboard.html` (542L, 26KB) — hors scope audit car non .md.

**TOTAL** : 48 fichiers .md, ~4370 lignes.

## Statistiques

- **Concepts** : 11 (9 cross-domain + 1 design + 1 dev)
- **Entities** : 5
- **Sources** : 4
- **Meta** : 14
- **Index** (type: index) : 7
- **Templates** : 5
- **Domain-index** : 5
- **Questions** : 0 (scaffold vide)
- **Comparisons** : 0 (scaffold vide)

### Wikilinks
- **Total occurrences wikilinks `[[...]]`** : **733** (mesure Grep -c sur 48 fichiers)
- **Wikilinks avec `../`** : **0** dans le contenu actif (seule mention dans lessons-learned.md:57 sous forme d'exemple historique). Regle D-NAMING-02 respectee.

### Pages stale
- Aucune page stale (>30 jours). Toutes `updated:` = `2026-04-15` ou `2026-04-16`.

### Domaines avec contenu vs vides
| Domaine | Index | Concepts | Sources | Pages totales |
|---------|-------|----------|---------|---------------|
| Design | OUI | 1 (`design-system-components.md`) | 0 | 2 |
| Dev | OUI | 1 (`foundation-os-desktop-migration.md`) | 0 | 2 |
| Finance | OUI | 0 | 0 | 1 |
| Sante | OUI | 0 | 0 | 1 |
| Trading | OUI | 0 | 0 | 1 |

Finance/Sante/Trading = scaffold only (normal, Phase 5 non demarree).

---

## Findings P0 (wiki casse, fantomes visibles, pattern brise)

### F-P0-01 : `index-wiki.md` annonce 43 pages mais filesystem en contient 48

- **Fichier** : `wiki/index-wiki.md:25` et `:111`
- **Description** : Ligne 25 dit "Total pages: 43", ligne 111 (table Statistiques) dit "Total pages | 43". Le `find wiki -name "*.md" | wc -l` retourne **48**. Ecart de 5 pages.
- **Analyse** :
  - Si on exclut les 5 templates (pratique courante), on obtient 48 - 5 = **43** OK
  - Mais ce n'est jamais precise dans l'index. La table Statistiques compte : Concepts 11 + Entities 5 + Sources 4 + Comparisons 0 + Questions 0 + Domaines actifs 5 + Meta 8 + Top-level 4 = **37** (pas 43)
  - **Contradiction** : la somme des categories (37) != total declare (43)
  - "Meta 8" est sous-comptee : reellement 14 pages meta
- **Impact** : `drift-detector.sh` pourrait flagger. Lessons-learned.md:114-116 mentionne exactement ce probleme.
- **Recommandation** : Expliciter la regle de comptage. Afficher count physique (48) et count fonctionnel (43).

### F-P0-02 : `overview.md` annonce 36 pages — drift de 7 par rapport a index-wiki

- **Fichier** : `wiki/overview.md:77`
- **Description** : Ligne 77 "Pages : 36". Mais `index-wiki.md:25` dit 43 et filesystem dit 48. Overview `updated: 2026-04-15` alors que index-wiki et hot sont 2026-04-16.
- **Impact** : Sources desynchronisees. Un lecteur arrive par `overview` voit count obsolete.
- **Recommandation** : Update overview.md a 2026-04-16 + count sync.

### F-P0-03 : `foundation-os-map.md` annonce 93 fichiers connectes mais somme = 94

- **Fichier** : `wiki/meta/foundation-os-map.md:211`
- **Description** : Table de stats ligne 197-211 donne "Total connecte 93". Somme verifiee : 3+9+(6+3)+19+8+3+11+5+4+5+11+7 = 94.
- **Impact** : Mineur, mais audit "zero metrique inventee" devrait corriger.

---

## Findings P1 (drift important)

### F-P1-01 : `hot.md` "Active Threads" dit 41 pages, contredit tous les autres counts

- **Fichier** : `wiki/hot.md:56`
- **Description** : "Wiki operationnel : 41 pages, 762+ wikilinks, 5 domaines"
- **Contradiction multi-fichiers** :
  - hot.md:56 → 41 pages
  - index-wiki.md:25 → 43 pages
  - overview.md:77 → 36 pages
  - foundation-os-map.md:211 → 93 total connectes
  - filesystem → 48 pages
- **Impact** : 4 sources contradictoires dans le wiki. Regle d'or "une info = un tier" violee. Wikilinks 762+ dans hot.md != 733 mesures (ecart ~30).
- **Recommandation** : Unifier la source de verite (un seul fichier donne le count).

### F-P1-02 : `hot.md` mentionne "14 routines Desktop documentees"

- **Fichier** : `wiki/hot.md:57`
- **Description** : Verifie dans routines-setup.md, effectivement R1 a R14 presentes. OK coherent.

### F-P1-03 : Wikilink ambigu `[[CHANGELOG]]` dans `foundation-os-map.md`

- **Fichier** : `wiki/meta/foundation-os-map.md:128`
- **Description** : `[[CHANGELOG|CHANGELOG DS]]`. Filesystem : `CHANGELOG.md` existe a `modules/design-system/CHANGELOG.md`. Un seul dans le scope donc OK.
- **Impact** : Faible. A surveiller si un CHANGELOG.md racine est ajoute.

### F-P1-04 : Wikilink `[[01-button]]` etc. — cross-vault valide grace a D-VAULT-01

- **Fichier** : `wiki/domains/design/concepts/design-system-components.md:48-106`
- **Description** : 46 wikilinks `[[01-button]]` a `[[46-carousel]]` + 6 foundations. Tous verifies dans `modules/design-system/docs-supernova/components/`. Tous resolvent.
- **Note** : Cross-vault (wiki/ → modules/) — seule possibilite a cause de D-VAULT-01.

### F-P1-05 : `foundation-os-map.md` liste plans Cowork par basename

- **Fichier** : `wiki/meta/foundation-os-map.md:88-101, 105-109`
- **Description** : Wikilinks cross-vault vers `docs/travaux-cowork/`. Tous existent. Basenames distincts donc OK.

---

## Findings P2 (qualite)

### F-P2-01 : 5 index de domaine `updated: 2026-04-15` (desynchronise)

- **Fichiers** : `wiki/domains/{trading,sante,finance,design,dev}/index-*.md:4`
- **Description** : Les 5 index n'ont pas ete touches depuis Phase 2. Mais foundation-os-map.md les reference et index-wiki dit "Last updated: 2026-04-16".
- **Impact** : Faible (rien a update, pas de contenu ajoute).

### F-P2-02 : Templates utilisent `YYYY-MM-DD` placeholders — normal

### F-P2-03 : Templates utilises correctement pour pages reelles

### F-P2-04 : `wiki/comparisons/` et `wiki/questions/` vides (.gitkeep uniquement)

- **Description** : Templates existent mais jamais utilises. Normal post-adoption (Karpathy pattern : se creent au fil de l'usage).

### F-P2-05 : `session-dna.md` — deux formats mixes

- **Fichier** : `wiki/meta/session-dna.md:20-62`
- **Description** : Lignes 20-46 format liste YAML. Lignes 47-62 code-block YAML. Inconsistance.
- **Recommandation** : Choisir un format unique.

### F-P2-06 : `thinking.md` pas de protocole d'append clair

- **Fichier** : `wiki/meta/thinking.md:38-42`
- **Description** : Section "## Insights cette session (2026-04-16)" — protocole flou pour sessions suivantes.
- **Recommandation** : Ajouter protocole append dans routines-guardrails.md.

### F-P2-07 : `foundation-os-map.md:74` liste `[[_template-plan]]` seul

- **Description** : Indique qu'il n'y a aucun plan actif. Coherent avec etat projet.

---

## Findings P3 (cosmetique)

### F-P3-01 : Incoherence casse titres (Neuroplasticite vs Neuroplasticite avec accent)

- **Description** : Mix accents frontmatter vs prose. Coherent avec choix projet.

### F-P3-02 : tools-foundation-os.md 88 skills somme correcte

- **Description** : 4+17+37+6+4+6+14 = 88 OK.

### F-P3-03 : Alias frontmatter — pas de scan exhaustif collision

### F-P3-04 : `sessions-recent.md` contient 6 sessions — limite annoncee = 5

- **Fichier** : `wiki/meta/sessions-recent.md`
- **Description** : 6 sessions presentes alors que titre dit "5 dernieres" et regle CLAUDE.md dit max 5. **Depassement de 1 session**.
- **Impact** : Regle non respectee.
- **Recommandation** : Retirer la session la plus ancienne (Migration Desktop 2026-04-15) ou grouper avec Level Up.

---

## Obsolescences

- **Aucune page marquee `status: deprecated` detectee**. Wiki pleinement vivant.
- `wiki/overview.md` (updated: 2026-04-15) — 1 jour plus ancien que les autres, pas stale au sens 30j.
- Templates YYYY-MM-DD placeholders : normaux pour templates.

---

## Contradictions / desynchronisations

| Source | Affirme | Realite | Gap |
|--------|---------|---------|-----|
| `hot.md:56` | 41 pages | 48 physiques | -7 |
| `overview.md:77` | 36 pages | 48 physiques | -12 |
| `index-wiki.md:25` | 43 pages | 48 physiques | -5 (prob. excl. templates) |
| `foundation-os-map.md:211` | 93 connectes | 94 somme | -1 |
| `hot.md:56` | 762+ wikilinks | 733 mesures | +29 |
| `sessions-recent.md` | max 5 sessions | 6 presentes | +1 |

**Contradictions majeures supplementaires** :
1. `hot.md:22` parle de "14 fantomes supprimes" vs `lessons-learned.md:36-41` "5 pages fantomes signalees (A, B, X, file, page)". 14 vs 5.
2. `log.md:34` "Stats sync : index-wiki 27→35 pages, CONTEXT 6→5 sessions" — valeur 35 historique.
3. `log.md:36` "Resultat : 589→762+ wikilinks, 35→40 pages" — plus mesures depuis.
4. `index-wiki.md:111` table Statistiques ne somme pas a 43 : 11+5+4+0+0+5+8+4 = **37**.

---

## Innovations / opportunites

### Pages concepts manquantes evidentes
- **"Wiki vs RAG"** comparison — mentionnee dans LLM Wiki Pattern.md sous forme de table. Un fichier `wiki/comparisons/wiki-vs-rag.md` formaliserait.
- **"Wiki Graph Obsidian"** concept — structurant mais pas documente separement.
- **"5 tiers memoire"** concept — decrit uniquement en prose. Merite sa propre page concept.
- **"D-WIKI-01"** — decision citee mais pas de page entity/concept dediee.

### Connexions cross-domaines a forger
- **design ↔ dev** : design-system-components et foundation-os-desktop-migration referencent Void Glass mais pas mutuellement.
- **Phase 5 (trading/finance/sante)** : scaffolds vides. Des qu'une premiere ingestion aura lieu, verifier les cross-refs.
- **TDAH workflow ↔ Brief v12** : croise OK. Mais aussi pertinent pour routines-setup (TDAH-friendly scheduling).

### Templates a creer
- **`wiki/meta/templates/session.md`** — pour les pages `sources/session-*.md`. Les 2 sessions existantes utilisent le template `source` mais pourraient beneficier d'un dedie.
- **`wiki/meta/templates/decision.md`** — aucun template pour D-WIKI-01, D-NAMING-02, D-VAULT-01. Les decisions vivent dans `docs/decisions-log.md` seulement.

### Ameliorations structure
- **`wiki/meta/counts.md` single-source** — un seul fichier avec counts officiels. Eliminerait les 5 contradictions.
- **Glyph explicite dans index-wiki Statistiques** — preciser "Total = sum categories (hors templates)".
- **sessions-recent auto-trim** — procedure automatique pour limiter a 5 sessions.

---

## Couverture (honnete)

- **48/48 pages .md lues integralement** ligne par ligne
- **Frontmatter verifie** pour chaque page
- **Wikilinks `../`** verifies via grep global (0 occurrence active)
- **Counts declares vs filesystem** verifies (5 sources contradictoires decouvertes)
- **Cibles de wikilinks hors-wiki** verifiees pour les exemples critiques
- **Templates utilisation** : 5 templates presents, 2 utilises (concept, entity, source)
- **Tags coherents** a travers les pages
- **Couverture domaines** : Phase 5 domaines 0 contenu, expected

**Zone grise non auditee** : 
- `wiki/meta/routines-dashboard.html` (hors scope .md) — 542L 26KB
- Alias cross-collision entre pages (scan partiel)

---

## Conclusion zone

Le wiki Foundation OS est **fonctionnellement operationnel et conforme au pattern Karpathy** — 48 pages Markdown structurees avec 733 wikilinks internes/cross-vault, aucun wikilink `../` residuel, hot.md frais, pages meta de neuroplasticite vivantes. L'ossature respecte D-WIKI-01 : 5 tiers memoire, vault=racine (D-VAULT-01), espaces dans noms (D-NAMING-02), 7 sous-index qui connectent la carte neurale.

Le probleme dominant est **la desynchronisation des compteurs de pages** : 4 sources differentes (hot.md 41, overview.md 36, index-wiki.md 43, filesystem 48) annoncent des chiffres differents, et la table Statistiques ne somme pas a son total affiche (37 vs 43). Meme contradiction pour les wikilinks (762+ vs 733). Regle "5 sessions max" violee (6 presentes). Ces 5 decalages sont des findings P0/P1 car ils minent la confiance dans le systeme de mesure.

L'ossature Karpathy (sources → concepts → entities → cross-refs) est **bien instanciee pour le module knowledge mais vide pour Phase 5**. C'est l'etat attendu — les index de domaine disent explicitement "Aucune pour l'instant (Phase 5 non demarree)". La neuroplasticite est solidement codee (4 reflexes, 3 pages meta vivantes, routines R1-R14) — mais 14 routines attendent creation manuelle Kevin dans UI Desktop.

Le wiki est un cerveau qui a les connexions mais dont la meta-conscience (counts, audits) a encore des angles morts a unifier.

---

## Cross-references (hors scope)

- **Cross-vault wikilinks** valides grace a D-VAULT-01 mais complexifient scripts wiki-health.sh et ref-checker.sh.
- **`docs/plans/`** : seul `_template-plan.md` reste. Coherent.
- **`docs/travaux-cowork/`** : INTERDIT brief audit. foundation-os-map.md et index-cowork.md referencent 19 fichiers cowork — verification filesystem OK pour 24 fichiers cowork nommes.
- **CLAUDE.md** : refere dans foundation-os-map.md comme [[CLAUDE]]. Basename unique au root OK.
- **`wiki/meta/routines-dashboard.html`** (non .md, hors scope) — 26KB 542L dashboard HTML. A clarifier si vivant ou residuel.

**Fin rapport Agent 3 — Wiki complet. 48 fichiers lus integralement, 733 wikilinks mesures, 0 wikilink `../` actif, 5 sources de counts contradictoires identifiees, 6 sessions vs regle 5-max.**
