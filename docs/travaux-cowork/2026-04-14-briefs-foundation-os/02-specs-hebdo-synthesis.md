# 02 — Spec Synthese Hebdo FoundationOS (v2 TDAH)

> Livrable hebdomadaire. Declenchement : vendredi 18h (proposition). Duree cible lecture : 5-10 min.
> But : donner a Kevin une retrospective factuelle de la semaine + prospective de la semaine suivante + detection des desyncs (filesystem vs Asana vs CONTEXT) + decisions / blocages / risques.
> Rendu de reference : `05-exemple-hebdo-s15.html` — la spec decrit la logique, l'exemple decrit l'execution visuelle.

## Philosophie de rendu v2 (issue de recherche TDAH + validation Kevin)

- 🗣️ **Titres conversationnels, pas techniques**. "La semaine ou le Design System a fait son retour." plutot que "Hebdo · S15". "Grosse semaine DS. Mais une dette visible tire l'OS vers le jaune." plutot que "Verdict · DEGRADED".
- 🧩 **Sections icon + titre + sous-titre**. Chaque bloc commence par un carre-icone (44 px), un titre h2 evocateur, et une phrase sous-titre qui explique en langage humain ce que tu vas lire.
- 🎨 **Cards avec backgrounds colores**, pas de cadres box-drawing. Vert = OK / fait / progression. Jaune = attention / desync / dette. Rouge = blocage actif. Bleu = cap / focus / plan. Violet = idee / parking.
- 📊 **Progress bars et barres avec gradients**, pas de `████░░░░`. Les barres visualisent trendlines (sante 7 jours), velocite (sessions, commits, blocs) et completion (Asana).
- 🧠 **Vulgarisation prose**. Le jargon ("DTCG 2-tier", "F1-F9", "health DEGRADED") est traduit. Chaque metrique est expliquee : pourquoi elle est importante, ce qui se passe si elle reste a ce niveau.
- ⚖️ **Hick's law sur le CTA**. Jamais plus d'UNE question de cloture. Pas de menu.
- 🪟 **Whitespace genereux**. 820 px max de largeur pour le hebdo (plus large que le morning pour les tableaux Asana / velocite), gap 32 px entre sections, padding card 22-28 px.
- 🎨 **Void Glass dark** : fond `#06070C`, Figtree UI, JetBrains Mono pour les labels courts/kickers, radial gradients discrets en arriere-plan.
- 🔗 **Zero duplication** : on resume, on ne recopie pas. Detail → pointeur vers Asana/CONTEXT/fichier.
- 🪓 **Sections optionnelles** : si rien a signaler (pas de desync, pas de nouvelle decision, pas d'idee fraiche) → section supprimee. Pas de remplissage.
- 📐 **Long par defaut, condense sur demande**. Le hebdo est fait pour un vendredi soir posee : scroll fluide accepte. Condense (sections 1 / 4 / 5 / 10 / 11 uniquement) disponible sur demande explicite Kevin.

## Structure (11 sections, dans l'ordre de lecture)

Ordre optimise pour cerveau TDAH : d'abord verdict global, puis sante, puis ce qui a ete fait, puis Asana, puis desyncs (critique), puis metriques, puis decisions/blocages/idees, puis cap, puis input.

### 1. Header (obligatoire)

- Kicker monospace en haut (ex. `● HEBDO · FOUNDATION OS · S15`)
- Titre h1 evocateur : "La semaine ou le Design System a fait son retour."
- Sous-titre : periode complete (lundi → vendredi), numero semaine, heure de cloture

Regle : le titre raconte la semaine en une phrase lisible. Un TDAH qui ouvre le hebdo doit savoir instantanement ce qui a domine.

### 2. Verdict semaine (obligatoire)

Card pleine largeur, background gradient selon verdict (vert = semaine franche, jaune = semaine mixte, rouge = semaine cassee).

- Label monospace colore : `🎯 VERDICT DE LA SEMAINE`
- Phrase-status h2 : "Grosse semaine DS. Mais une dette visible tire l'OS vers le jaune." (adapter au reel : "Semaine franche, OS vert." / "Semaine bloquante : un incident critique a mobilise 3 jours.")
- Paragraphe prose qui explique : le temps fort (ce qui a domine), la reserve (ce qui traine), la consequence concrete (ce qu'il faut arbitrer la semaine suivante)
- Eventuelle meta-grid : 3-4 chiffres cles (sessions, commits, blocs, completion Asana) en bas de card

Source : CONTEXT.md "Sessions recentes" (filtre 7 jours) + health-check + velocite calculee (section 7).

### 3. Trendline sante OS (obligatoire)

Section `🫀` "Ou en est ta sante OS sur 7 jours ?"

Card avec grid 7 jours (lundi → dimanche) :
- Chaque case : jour + picto couleur + petit label ("OK" / "Degrade" / "Casse" / "—" si pas de donnee)
- Tendance en bas : fleche ▲▶▼ + prose qui explique l'evolution et la cause probable ("Cause : refs cassees accumulees de 41 a 51 entre mercredi et vendredi.")

Regle : jamais plus de 2 lignes de prose. Si la tendance est plate, dire "Stable. Rien a signaler."

Source : archive des sorties `scripts/health-check.sh` du jour (requiert hook `scripts/hooks/health-archive.sh` — a creer phase 2). Fallback si archive absente : derniere mesure connue + note "Donnees partielles".

### 4. Ce que tu as fait (obligatoire)

Section `✅` "Ce que tu as livre cette semaine."

Grid de cards regroupees par theme (Design System / App / Core OS / Cowork / Docs). Chaque card :
- Kicker mono thematique (ex. `DESIGN SYSTEM`)
- Titre card : 1 phrase qui resume le theme ("Rebuild complet depuis zero.")
- Liste d'items : 3-6 points concrets avec icone verte

Regle : jamais plus de 5 themes. Si un theme a moins de 2 items, fusionner avec un autre ou passer sous forme de prose inline dans le verdict.

Source : `git log --since="7 days ago" --pretty=oneline` + CONTEXT.md "Sessions recentes" filtre 7 jours. Regroupement thematique manuel/semi-automatique.

### 5. Asana — etat reel (obligatoire)

Section `📋` "Ou en est ton Asana FoundationOS ?"

Card synthetique (pas de detail tache) avec 4 metriques :
- Completees cette semaine (nombre)
- Restantes (ratio : n / total, %)
- En retard (nombre + code tache si unique)
- Due semaine prochaine (nombre + codes si ≤ 3)

Progress bar gradient vert→bleu : "Progression du setup · X / Y taches · ZZ %"

Source : Asana projet 1213918098666338, `get_tasks` filtre `modified_at >= lundi 00:00` + calcul ratios.

### 6. Desyncs detectees (conditionnel, critique, priorite visuelle forte)

Section `⚠️` "N desyncs Asana attendent ton arbitrage." (N = 1 a 5, jamais plus).

Sous-titre : "Le status Asana ne colle pas avec le reel du repo. Ces arbitrages ne sont jamais automatiques — tu coches toi-meme."

Liste d'items (un par card jaune, bordure jaune forte) :
- Header card : dot jaune + code tache en mono (ex. `e19 · Deploy Vercel`)
- Bloc "Asana dit" : en prose, ce qu'Asana affiche (non coche, due date, owner)
- Bloc "Reel" : en prose, ce que le repo / le deploy / le code montre (URL live, commit SHA, date)
- Action proposee bord-gauche jaune : "Action proposee : cocher eXX. Je ne le fais pas sans ton OK explicite."

Regle IMPERATIVE : **ne jamais cocher sans validation Kevin**. C'est un non-negociable du protocole Foundation OS.

Regle : si aucune desync detectee → section absente. Si desyncs presentes → toujours visibles, jamais noyees dans optionnel.

Source : croisement Asana `get_tasks` + CONTEXT.md "Sessions recentes" + `git log` + deploy status (Vercel API / ping URL). Logique de detection : tache Asana non cochee ET (deploy live OR commit avec scope correspondant ≤ 7 jours) → desync.

### 7. Velocite (obligatoire)

Section `📊` "Ton rythme cette semaine."

Card avec 3 barres gradient :
- Sessions : nombre + moyenne S-1 + fleche tendance
- Commits : nombre + moyenne S-1 + fleche tendance
- Blocs plan executes : nombre + moyenne S-1 + fleche tendance

Chaque barre : progress bar gradient (bleu→violet), label nombre mono, comparaison moyenne inline, prose courte si ecart notable ("2x la moyenne, aligne avec le sprint DS.").

Source : `git log --since="7 days ago" | wc -l` (commits) + comptage sessions dans CONTEXT.md + comptage blocs executes dans plan actif. Moyennes calculees sur la semaine precedente.

### 8. Decisions prises (conditionnel)

Section `🧭` "N decisions actees cette semaine."

Liste compacte. Chaque ligne :
- Badge code decision mono (`D-DS-REBUILD`)
- Titre decision en 1 ligne
- Detail prose court (1-2 phrases, la raison)

Regle : max 5 decisions affichees. Au-dela, lien vers `docs/decisions-log.md`. Si 0 decision cette semaine → section absente.

Source : CONTEXT.md "Decisions" filtre date >= lundi courant.

### 9. Blocages / risques (conditionnel)

Section `🚧` "Ce qui freine encore."

Liste d'items (un par card, couleur selon severite) :
- Rouge (blocage actif) : kicker `🔴 BLOCAGE`, titre, description prose, impact chiffre
- Jaune (attention) : kicker `🟡 ATTENTION`, titre, description prose
- Neutre (note) : kicker `⚪ NOTE`, titre, description prose

Regle : max 6 items. Si 0 blocage/risque → section absente.

Source : COWORK-CONTEXT.md "Patchs en attente" + CONTEXT.md "En attente Kevin" + "Risques" + health-check (si DEGRADED → top rouge avec cause identifiee).

### 10. Idees capturees (conditionnel)

Section `💡` "N idees fraiches dans la semaine."

Max 3 items. Chaque item :
- Bullet violet `▸`
- Titre idee (fort)
- Description prose (conditions, prerequis, statut parking)

Si 0 idee dans la fenetre 7 jours → section absente.

Source : CONTEXT.md "Idees & Parking" filtre date >= lundi courant.

### 11. Cap semaine suivante (obligatoire)

Section `🎯` "Ou tu vas la semaine prochaine."

Card bleue pleine largeur :
- Titre h2 : "Cap S[N+1] : [direction en une phrase]"
- Sous-titre prose : pourquoi ce cap, en quoi il decoule de la semaine ecoulee
- Plan de reference : nom du plan actif + pointeur vers `docs/plans/...`
- Trois cailloux numerotes (pas plus) : chaque caillou = 1 ligne titre + 1 ligne description prose courte
- Eventuel meta-grid en bas : date butoir, owner par caillou

Regle Hick's law : exactement 3 cailloux. Jamais 2, jamais 5. Si le plan impose plus, choisir les 3 plus importants et mentionner "+N autres blocs secondaires" en fin.

Source : CONTEXT.md "Cap" + plan actif + arbitrage Cowork sur les priorites.

### 12. CTA final (obligatoire)

Card verte bordure forte + box-shadow glow.

- Kicker vert : `▶ ARBITRAGE DEMANDE`
- Question principale h2 : la proposition par defaut ("Je coche e19 et e20 dans Asana ?")
- Paragraphe rappel bord-gauche : "Validation requise, non-negociable. Je ne coche rien sans ton OK."

Regle : UNE question claire, jamais zero, jamais deux. Si pas de desync a arbitrer, la question porte sur le cailloux #1 du cap ("On attaque le bloc X lundi matin ?").

## Regles de generation

- **Temporalite** : vendredi 18h. Periode couverte : lundi 00h → vendredi 18h.
- **Archivage** : chaque hebdo sauvegarde en HTML dans `docs/travaux-cowork/briefs-archives/hebdo/SXX-YYYY-MM-DD.html`.
- **Source fraiche** : relire COWORK-CONTEXT + CONTEXT + Asana + health-check + `git log` a chaque generation. Jamais de cache.
- **Longueur** : pas de contrainte "un seul ecran". Scroll fluide accepte pour un vendredi soir. Objectif : toutes les sections obligatoires + conditionnelles actives, le plus court possible pour chacune.
- **Mode condense** : sur demande explicite Kevin, rendre uniquement sections 1 (Header), 2 (Verdict), 5 (Asana), 6 (Desyncs), 11 (Cap), 12 (CTA). Tient en 1 ecran.
- **Jargon** : vulgariser systematiquement. "Tokens DTCG 2-tier" → "Systeme de variables design a deux niveaux (primitives + semantiques)". "F1-F9" → "Phases 1 a 9 du rebuild DS".
- **Ton** : factuel, direct, conversationnel. Tutoiement. Pictos pour structurer. Zero flatterie, zero post-amble, zero "excellente semaine", zero "bon weekend".
- **Livraison** : rendu HTML Void Glass archive + lien computer:// dans la conversation Cowork.
- **Template** : le HTML reference est `05-exemple-hebdo-s15.html`. Toute nouvelle generation utilise exactement les memes classes CSS, les memes tokens de couleur, la meme grid de trendline.

## Anti-patterns (ne JAMAIS faire)

- ❌ Recopier tel quel la section "Sessions recentes" de CONTEXT.md.
- ❌ Dupliquer le detail d'une tache Asana (on pointe, on resume).
- ❌ Cocher une desync detectee sans attendre Kevin.
- ❌ Inventer une moyenne / tendance non calculable (si donnee absente → dire "Donnees partielles").
- ❌ Ajouter une section "felicitations" ou "a continuer comme ca" ou "belle semaine".
- ❌ Noyer les desyncs dans une section optionnelle. Toujours visibles si presentes.
- ❌ Utiliser des cadres box-drawing (`┌─ ... ─┐`) — proscrit en v2. On utilise des cards HTML avec backgrounds et bordures.
- ❌ Utiliser des barres ASCII (`████░░░░`) — proscrit en v2. On utilise des `<div class="vel-bar">` avec gradient CSS.
- ❌ Empiler plus de 5 themes dans "Ce que tu as fait". Au-dela = noyade cognitive TDAH.
- ❌ Proposer plus de 3 cailloux dans le cap. Trois, toujours trois.
- ❌ Proposer plus d'UNE question dans le CTA final.
- ❌ Fermer avec une formule de politesse ou un "on se voit lundi".
