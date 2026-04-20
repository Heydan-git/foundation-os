# Refonte Morning Intelligence — TDAH-first v2

Date ouverture : 2026-04-19
Date refonte v2 : 2026-04-20
Statut : Phase 1 v2 en cours (plan + HTML)
Demandeur : Kevin
Ownership : Cowork
Source de verite post-compactage : ce fichier.

## Historique versions

- v1 (2026-04-19) : structure "Focus funnel" scroll vertical unique, pas d'onglets. Retenue "zero masquage". Abandonnee.
- v2 (2026-04-20) : structure "5 tabs shell alimentable" (Focus / Urgent / Boite / Veille IA / Stats). Le HTML devient un shell permanent, la scheduled task ALIMENTE (pas regenere).

## Pourquoi v1 a ete abandonnee (verbatims Kevin)

Kevin 2026-04-20 msg 2 : "rajoute un systeme de tabs, parce que la, tu as tout mis sur une seule et meme page, et du coup, c'est tres complique a lire."

Kevin 2026-04-20 msg 3 : "pas de regroupement, je veux que tout soit accessible en un clic. Je veux que tu rajoutes les tabs, y compris focus. Que tu reorganises la facon dont on affiche les priorites. T'as oublie aussi la partie todo list checkbox et du coup gagner des points, gamification, parce que la, t'as mis de la gamification mais il n'y a aucun moyen de gagner des points."

Kevin 2026-04-20 msg 4 : "Yes je valide le plan Go. Je veux que la routine utilise ce Morning Intelligence et y ajoute du contenu, sans avoir a le regenerer a chaque fois. L'idee c'est que ca reste la meme chose qu'on alimente."

## Contraintes v2 (non-negociable)

1. **5 tabs par jour**, incluant Focus (pas de section hors tab). Tout accessible en un clic.
2. **Checkbox + points sur CHAQUE item**, pas seulement Urgent et Actions. La Boite et la Veille IA doivent aussi rapporter des points.
3. **Zero masquage INTRA tab**. Une fois un tab ouvert, TOUT son contenu est visible au scroll. Les tabs sont de l'organisation, pas de la troncature. Pas de "+N autres", pas de collapse, pas de pagination.
4. **HTML = shell permanent alimente**, pas regenere quotidien. La scheduled task doit patcher le HTML existant (ajouter un nouveau jour, migrer le jour de la veille, recalculer stats) sans toucher au shell structurel.
5. **Gamification complete** : checkbox par item + barème points par label + paliers Bronze/Argent/Or + lifetime levels (Rookie/Actif/Pro/Master/Legend) + confetti.
6. **Sources de donnees** : Gmail (inbox) + Veille IA (newsletters). Pas d'autres sources pour l'instant.
7. **Design system Void Glass** : dark-only `#030303`, Figtree UI, JetBrains Mono code, tokens `--ds-*`.
8. **HTML standalone** : aucun build, CSS inline, JS inline, ouvrable en double-clic navigateur, localStorage persistent.

## Architecture retenue — "5 tabs shell alimentable"

### Shell permanent (jamais regenere)

```
<header> Title + subtitle + stats row
<alert-banner> (visible si urgent > 0, masque sinon)
<gamif-bar sticky> streak + score jour + lifetime level + progress + badges
<date-nav>                               <!-- DAY-NAV-BEGIN -->
  [boutons par jour, dernier = actif]
                                         <!-- DAY-NAV-END -->
<day-panels>                             <!-- DAY-PANELS-BEGIN -->
  <day-panel data-day="YYYY-MM-DD">
    <tab-shell>
      <tab-nav> 5 boutons : Focus / Urgent / Boite / Veille IA / Stats
      <tab-panels>
        <panel-focus>    top 3 items du jour
        <panel-urgent>   items label=Action-requise OU priority=critical
        <panel-boite>    tous les autres mails (regroupes par label)
        <panel-veille>   newsletters IA, filtres par categorie
        <panel-stats>    stats semaine/mois + lifetime
  </day-panel>
                                         <!-- DAY-PANELS-END -->
<footer>
<script>
```

### Markers HTML pour alimentation

Le HTML contient 2 zones patch-safe delimitees par commentaires :

- `<!-- DAY-NAV-BEGIN -->` ... `<!-- DAY-NAV-END -->` : boutons de navigation jours.
- `<!-- DAY-PANELS-BEGIN -->` ... `<!-- DAY-PANELS-END -->` : contenu des panels.

La scheduled task de 9h lit le HTML, identifie ces zones via regex (simple, balises de commentaire stables), insere le nouveau jour en tete (prepend), et NE TOUCHE PAS au reste. Le shell structurel (header, gamif bar, CSS, JS) reste identique.

Retroactivite : si on veut changer le shell (CSS, JS, structure), on edite le HTML a la main ou via un script one-shot. La scheduled task ne touche jamais le shell.

## Tabs detail

### Tab 1 — Focus (defaut actif a l'ouverture)

Top 3 items du jour selon scoring interne :
- Action-requise avec priority=critical = score max
- Urgent avec priority=high = score moyen
- Fallback : 3 premiers de la queue par ordre chronologique

Affichage : 3 grosses cartes, gros checkbox (22px), CTA "Traiter" visible, barème +30 pts par coche + bonus +100 si les 3 coches.

Raison TDAH : un focus unique a l'ouverture, 3 items max pour respecter la regle de 3 en charge cognitive.

### Tab 2 — Urgent

Tous les items avec label=Action-requise OU data-priority=critical. Plus restrictif que la Boite. Affichage liste type erow, checkbox par ligne, badges.

### Tab 3 — Boite

TOUS les emails du jour hors Urgent/Veille. Regroupes par label (Finance / Sante / FoundationOS / Pro / Perso / A-lire / FYI / Promo). Checkbox par ligne. Ordre : labels a haute valeur points en premier (Finance, Pro, Sante), Promo en dernier.

Zero filtre masquant — si on veut trier, c'est un toggle d'ordre, pas un hide.

### Tab 4 — Veille IA

Newsletters IA regroupees. Filtres par categorie (Dev Web / UX-UI / LLM / Agents / Outils). Filtres en mode "highlight" (baisse opacite des non-matches a 0.3, pas display:none), pour respecter zero-masquage.

Checkbox + points par newsletter (5 pts base + 5 si categorie matching l'interet du jour).

### Tab 5 — Stats

Affichages pour donner de la visibilite longue duree :

- Scorecard semaine : barres jour par jour des 7 derniers jours (score quotidien, visualisation type mini-histogramme).
- Repartition labels : donut ou barres empilees des labels traites cette semaine (combien de Finance, Pro, etc.).
- Top senders : 5 expediteurs les plus frequents (info utile pour creer des filtres Gmail).
- Budget temps : somme des est-time (minutes estimees de traitement) vs temps reel (si dispo). Plus tard.
- Streak visuel : calendrier type GitHub contributions, 4 semaines.
- Veille IA themes : wordcloud / top themes des newsletters du mois.
- Lifetime level : progression vers le prochain palier (Rookie -> Actif -> Pro -> Master -> Legend).

Source des donnees Stats : calcul cote scheduled task (snapshot quotidien dans un JSON persistent `morning-intelligence-stats.json`) injecte dans le panel via le meme mecanisme de markers.

## Bareme de points

Par coche (somme possible par item) :

| Label / Tag        | Points base |
|--------------------|-------------|
| Urgent (priority=critical) | 50 |
| Action-requise     | 30 |
| Pro                | 20 |
| FoundationOS       | 20 |
| Finance            | 15 |
| Sante              | 15 |
| Perso              | 10 |
| A-lire             | 10 |
| FYI                | 5  |
| Newsletter         | 5  |
| Promo              | 2  |

Si un email a plusieurs labels, on prend le max.

Bonus :
- Focus 3/3 coche : +100 pts
- Inbox Clear (100% du jour) : +100 pts
- Palier Bronze (5 items coches) : +25 pts one-time
- Palier Argent (10 items coches) : +50 pts one-time
- Palier Or (tous coches, = Inbox Clear) : bonus deja compte ci-dessus
- Streak > 7 jours : +10 pts bonus streak par jour

## Lifetime levels

Seuil cumul score depuis la naissance (score lifetime dans localStorage `mi_lifetime_score`) :

| Niveau | Seuil pts cumules |
|--------|-------------------|
| Rookie | 0 |
| Actif  | 500 |
| Pro    | 2 000 |
| Master | 5 000 |
| Legend | 10 000 |

Affichage : badge + progress bar vers le niveau suivant, en permanence visible dans la gamif bar.

## Data model DOM enrichi

Attributs sur chaque ligne email / card :

- `data-tid` : identifiant unique (email) — EXISTE DEJA
- `data-aid` : identifiant unique (action) — EXISTE DEJA
- `data-from` : expediteur complet
- `data-subject` : sujet
- `data-snippet` : preview premiere ligne
- `data-date` : ISO complet
- `data-origin` : divers | pro | hexlander
- `data-label` : un des 10 labels taxonomie (Action-requise, A-lire, FYI, Newsletter, Pro, Perso, Promo, Finance, Sante, FoundationOS)
- `data-priority` : critical | high | medium | low
- `data-est-time` : minutes estimees (2, 5, 15...)
- `data-reply-needed` : true | false
- `data-attachment` : true | false
- `data-points` : points rapportes par la coche (calcule cote task, redondance visible pour debug)

Affichage sur la ligne :

- Priority bar verticale (3px, couleur selon priority)
- Sender + subject
- Snippet tronque 1 ligne
- Badge label colore
- Date + heure
- Icones reply (fleche retour) et attachment (trombone) si applicables
- Estimation temps (format `~5 min`)
- Badge "+N pts" visible en bout de ligne
- Checkbox "Traiter" 18px

## Gamification comportement

Persistence localStorage :

- `mi_treated_YYYY-MM-DD` : liste des id traites ce jour (existe deja)
- `mi_paliers_YYYY-MM-DD` : paliers atteints ce jour (bronze / argent / or) pour eviter de re-donner le bonus
- `mi_lifetime_score` : score cumule depuis la naissance
- `mi_active_tab_YYYY-MM-DD` : tab actif pour ce jour (persistence entre refresh)

Effets visuels :

- Coche : animation check + transition opacity 1 -> 0.38 en 300ms
- Palier atteint : flash gamif bar couleur palier 1s, confetti canvas leger
- Inbox Clear : confetti long + pulse-green bar + badge "Inbox Clear"
- Streak > 7 : respiration permanente de la bar (animation lente infinite)
- Level up : flash gold + message "Nouveau niveau : X"

## Scheduled task — comportement alimentation (Phase 2)

Pas implemente dans cette session (Phase 1 = HTML shell).

Specification attendue :

1. Fetch Gmail inbox newer_than:1d.
2. Fetch Veille IA newsletters.
3. Classifier via taxonomie 10 labels.
4. Generer le bloc `<div id="day-YYYY-MM-DD" class="day-panel">...</div>` complet pour aujourd'hui (avec les 5 tabs remplis).
5. Lire le HTML existant.
6. Identifier la zone `<!-- DAY-PANELS-BEGIN -->...<!-- DAY-PANELS-END -->` via regex.
7. Verifier si un panel pour aujourd'hui existe deja (date = today). Si oui : REMPLACER. Si non : PREPEND (en premiere position).
8. Mettre les jours precedents en `.active` = false, aujourd'hui en `.active`.
9. Identifier la zone `<!-- DAY-NAV-BEGIN -->...<!-- DAY-NAV-END -->`. Ajouter bouton pour aujourd'hui (ou mettre a jour). Garder les 7 derniers jours, supprimer les plus anciens.
10. Generer snapshot stats (score jour precedent, repartition labels, streak) et remplacer le contenu du panel-stats de tous les jours affiches.
11. Ecrire le HTML patche.
12. NE PAS toucher au shell (header, gamif bar structure, CSS, JS).

Garantie : si la task plante au milieu, le HTML reste ouvrable (CSS et JS shell intacts). Au pire, le jour du plantage est incomplet mais les jours precedents sont preserves.

## Phases d'execution

Phase 1 v2 (AUJOURD'HUI, en cours) : HTML shell v2 complet avec contenu reel 2026-04-20 migre.

Phase 2 (prochaine session) : updater le prompt de la scheduled task `morning-intelligence` pour alimentation via markers, pas regeneration.

Phase 3 (plus tard) : routines hebdo (digest semaine dimanche 20h) + mensuelle (bilan 1er du mois 9h).

Phase 4 (tributaire Gmail) : filtres Gmail web pour auto-application des 10 labels.

## Garde-fous non-negociables

- Ne pas perdre la gamification existante (localStorage `mi_treated_*`).
- Ne pas perdre le contenu 2026-04-20 (11 items) deja present dans le HTML actuel.
- HTML doit rester standalone. Zero dependance build.
- Scheduled task tourne demain 9h. Phase 2 pas obligatoire aujourd'hui mais a faire avant prochaine execution qui ecraserait notre v2. Risque : si la task regenere sans connaitre les markers, elle detruit tout. Mitigation : soit desactiver la task le temps de phase 2, soit updater la task immediatement.
- Retrocompatibilite data. localStorage existant doit etre lisible par le nouveau JS.

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Task 9h demain ecrase notre v2 (regeneration) | HIGH | Desactiver task ce soir OU phase 2 avant demain 9h |
| Regex markers fail si structure HTML modifiee a la main par Kevin | MEDIUM | Markers stables + fallback "si marker absent, regenere completement" |
| Confetti canvas trop lourd sur mobile | LOW | Throttle + nombre particules limite |
| localStorage satures apres N mois | LOW | TTL 90 jours sur cles `mi_treated_*` |
| Palier bonus re-gagne a chaque refresh | HIGH | Cle `mi_paliers_*` verifie avant d'ajouter le bonus |

## Content reel migrer (2026-04-20, extrait HTML actuel)

1 Urgent :
- Amundi ESR / Bulletin Devoteam 156,95 € / tid `19da9a8487e1183d` / label Finance / 06:51

4 Actions :
1. Saisir bulletin d'option Devoteam 156,95 € (Amundi ESR) — high
2. Verifier recu 3Commas Pro 50 € (Paddle) — medium
3. Rapprocher transferts Binance->BingX 194,96 USDT — medium
4. Verifier prochaine commande iHerb (J-6) — low

0 Veille IA.

6 Boite :
- BingX — Depot 194,96 USDT credite — NOTIF
- Binance — Retrait 194,96 USDT effectue — NOTIF
- BingX — Depot 194,96 USDT en cours — NOTIF
- PrimeXBT — Newsletter quotidienne Trading Central — PROMO
- Paddle — Recu 3Commas Pro 50 € TTC — NOTIF
- iHerb — Prochaine commande auto J-6 — INFO

Gamif actuel : streak=1, score=0, 5 checkboxes (1 urgent + 4 actions). Les 6 Boite n'ont pas de checkbox = 0 points possibles.

Post-refonte v2 : 11 items = 11 checkboxes, points potentiels = 50 + 4x30 + 3x5(Promo) + 2x15(Finance) + 1x15(Perso) = ~250 pts base (fourchette).

## Validation attendue Kevin

Plan v2 validé par Kevin le 2026-04-20 msg 4 : "Yes je valide le plan Go". Execution immediate.
