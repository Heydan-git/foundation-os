# 01 — Spec Morning Brief FoundationOS (v2 TDAH)

> Livrable quotidien. Declenchement : lundi-vendredi 8h (proposition). Duree cible lecture : 60-90 s.
> But : donner a Kevin, en moins d'une minute, l'etat courant de FoundationOS, ce qui est chaud aujourd'hui, et UNE prochaine action concrete.
> Rendu de reference : `04-exemple-morning-2026-04-14.html` — la spec decrit la logique, l'exemple decrit l'execution visuelle.

## Philosophie de rendu v2 (issue de recherche TDAH + validation Kevin)

- 🗣️ **Titres conversationnels, pas techniques**. "Bonjour Kevin. C'est mardi." plutot que "En-tete · 2026-04-14". "Ton OS marche. Il traine une dette visible." plutot que "Sante OS · DEGRADED".
- 🧩 **Sections icon + titre + sous-titre**. Chaque bloc commence par un carre-icone (44 px), un titre h2 evocateur, et une phrase sous-titre qui explique en langage humain ce que tu vas lire.
- 🎨 **Cards avec backgrounds colores**, pas de cadres box-drawing. Vert = OK / action encourageante. Jaune = attention sans urgence. Rouge = blocage. Bleu = focus / cap. Violet = idee / parking.
- 📊 **Progress bars et barres avec gradients**, pas de `████░░░░`. Les barres visualisent l'avancement d'un plan, d'une velocite, d'une progression.
- 🧠 **Vulgarisation prose**. Le jargon ("F8-F9 done", "DTCG 2-tier") est traduit. Chaque metrique est expliquee : pourquoi elle est importante, ce qui se passe si elle reste a ce niveau.
- ⚖️ **Hick's law sur le CTA**. Jamais plus d'UNE question de cloture + UNE alternative possible. Pas de menu.
- 🪟 **Whitespace genereux**. 720 px max de largeur, gap 32 px entre sections, padding card 22-28 px.
- 🎨 **Void Glass dark** : fond `#06070C`, Figtree UI, JetBrains Mono pour les labels courts/kickers, radial gradients discrets en arriere-plan.
- 🔗 **Zero duplication** : on resume, on ne recopie pas. Detail → pointeur vers Asana/CONTEXT/fichier.
- 🪓 **Sections optionnelles** : si rien a signaler (Asana vide, pas d'idee fraiche) → section supprimee. Pas de remplissage.

## Structure (9 sections, dans l'ordre de lecture)

Ordre et poids optimises pour un cerveau TDAH : d'abord contexte, puis focus du jour, puis perimetre, puis action.

### 1. Header (obligatoire)

- Kicker monospace en haut (ex. `● MORNING BRIEF · FOUNDATION OS`)
- Titre h1 evocateur : "Bonjour Kevin. C'est mardi."
- Sous-titre : date complete + numero semaine + jour de la semaine + heure

Regle : le titre mentionne le jour de la semaine en francais. Un TDAH qui ouvre son ordi veut savoir instantanement si c'est lundi ou jeudi.

### 2. Hero sante (obligatoire)

Card pleine largeur, background gradient selon etat (vert = sain, jaune = degrade, rouge = casse).

- Label monospace colore : `🫀 ETAT DE FORME DE L'OS`
- Phrase-status h2 : "Ton OS marche. Il traine une dette visible." (adapter au reel : "Ton OS est au top." / "Ton OS a un probleme bloquant.")
- Paragraphe prose qui explique : ce qui va (build, tests), ce qui traine (health-check), la consequence concrete
- Grid de 5 vitals en bas : Build · Tests · Health · Vercel · Supabase, chaque vital = picto + nom mono + valeur courte

Source : `scripts/health-check.sh` + build modules/app + modules/design-system + `CONTEXT.md` metriques + ping Vercel + ping Supabase.

### 3. Aujourd'hui (obligatoire)

Section avec `🎯` icon + titre evocateur genere dynamiquement.

- Titre h2 : "Aujourd'hui, tu attaques [X]." (X = prochaine action CONTEXT.md)
- Sous-titre : 1 phrase qui situe par rapport au cap ("C'est la suite logique de ton cap en cours. Trois jours de velocite derriere, la piste est chaude.")
- Card bleue (`today-card`) :
  - Phrase principale : ce qu'il y a a faire, en une ligne
  - Pourquoi c'est important, en prose (2-3 phrases)
  - Progress bar gradient bleu→violet : "Avancement du plan · N/N blocs · XX %"
  - Meta-grid : plan actif + ce qui suit apres

Source : CONTEXT.md "Cap" + "Prochaine action" + plan referentiel.

### 4. Hier / Demain (obligatoire)

Section `🧭` "D'ou tu viens, ou tu vas."

Grid 2 colonnes :
- Card Hier : kicker `🟢 Hier · [date]`, titre court, detail prose
- Card Demain : kicker `🔮 Demain · [date]`, titre spec ("Probablement blocs X a Y"), detail prose qui explique la conditionnalite

Source : CONTEXT.md "Sessions recentes" (hier) + plan actif (projection demain).

### 5. Attention (conditionnel, obligatoire si >= 1 item)

Section `⚠️` "N trucs qui te concernent avant midi." (N = 1 a 6, pas plus).

Sous-titre : "Rien de bloquant, mais tant que ces points trainent, l'OS tire vers le jaune."

Liste d'items (un par card) classee du plus urgent au plus lateral :
- Couleur card selon severite : rouge bordure (blocage actif), jaune bordure (attention), neutre (note mentale)
- Chaque card : badge picto (32 px) + titre court + description prose + tag mono (impact, proprietaire, deadline)
- Max 6 items. Au-dela, regrouper ou reporter au hebdo.

Source : COWORK-CONTEXT.md "Patchs en attente" + CONTEXT.md "En attente Kevin" + health-check (si DEGRADED → top de liste rouge).

### 6. Asana (conditionnel)

Section `📋` "Asana dit qu'une tache est due aujourd'hui." (titre s'adapte : "Asana voit X taches dues aujourd'hui." si pluriel, section absente si 0 tache).

Card jaune par tache :
- Header : dot jaune + code tache en mono (ex. `e19 · Deploy Vercel`)
- Phrase-task : le titre Asana tel quel
- Paragraphe "pourquoi j'en parle" : prose qui explique l'etat reel ("Mais foundation-os.vercel.app tourne deja depuis plusieurs jours...")
- Note bord-gauche jaune : "Ce que je fais : je ne coche rien. [explication regle non-negociable]"

Source : Asana 1213918098666338, filtre `completed=false` + `due_on <= today`. Croisement avec CONTEXT.md pour detecter desync.

### 7. Dernier pas, des deux cotes (obligatoire)

Section `🔁` "Dernier pas, des deux cotes."

Grid 2 colonnes (Cowork / CLI) :
- Kicker mono : "Cote Cowork" / "Cote CLI"
- Date monospace bleue
- Phrase-action (ce qui a ete fait en une ligne)
- Meta mono : chemin de fichier ou SHA commit

Source : COWORK-CONTEXT.md "Derniere action Cowork" + `git log --oneline -1`.

### 8. Idees fraiches (conditionnel)

Section `💡` "N idees capturees dans les dernieres 24 h."

Max 3 items. Chaque item :
- Bullet violet `▸`
- Titre idee (fort)
- Description prose (conditions, prerequis, statut parking)

Si 0 idee dans la fenetre 24 h → section absente.

Source : CONTEXT.md "Idees & Parking", filtre diff git des dernieres 24 h.

### 9. CTA final (obligatoire)

Card verte bordure forte + box-shadow glow.

- Kicker vert : `▶ ON COMMENCE PAR QUOI ?`
- Question principale h2 : la proposition par defaut ("Par defaut, on attaque le bloc X.")
- Paragraphe alternative (optionnel) : "Alternative possible : [...]. Trente minutes max, puis on reprend le plan."

Regle : toujours UNE question claire + AU MAX UNE alternative. Hick's law strict. Jamais zero question.

## Regles de generation

- **Temporalite** : genere a 8h lundi-vendredi. Jamais le week-end (sauf demande explicite Kevin).
- **Source fraiche** : relire COWORK-CONTEXT + CONTEXT + Asana + health-check a chaque generation. Jamais de cache.
- **Longueur** : pas de contrainte "un seul ecran". Le scroll fluide est OK pour un TDAH si la hierarchie est claire. Objectif : toutes les sections obligatoires + conditionnelles actives, le plus court possible pour chacune.
- **Jargon** : vulgariser systematiquement. "F8-F9 done" → "Finition DS : linter et tests termines". Kevin est TDAH, pas dev full-time.
- **Ton** : factuel, direct, conversationnel. Tutoiement. Pictos pour structurer. Zero flatterie, zero post-amble, zero "bonne journee".
- **Livraison** : rendu HTML Void Glass archive dans `docs/travaux-cowork/briefs-archives/morning/YYYY-MM-DD.html` + lien computer:// dans la conversation Cowork.
- **Template** : le HTML reference est `04-exemple-morning-2026-04-14.html`. Toute nouvelle generation utilise exactement les memes classes CSS, les memes tokens de couleur, la meme grid de vitals.

## Anti-patterns (ne JAMAIS faire)

- ❌ Recopier tel quel la section "Decisions" de CONTEXT.md.
- ❌ Dupliquer le detail d'une tache Asana (on pointe, on resume).
- ❌ Inventer une metrique non verifiable.
- ❌ Claim "tout est sous controle" sans avoir lu health-check.
- ❌ Fermer avec un "Bonne journee !" ou formule de politesse.
- ❌ Cocher une tache Asana automatiquement.
- ❌ Utiliser des cadres box-drawing (`┌─ ... ─┐`) — proscrit en v2. On utilise des cards HTML avec backgrounds et bordures.
- ❌ Utiliser des barres ASCII (`████░░░░`) — proscrit en v2. On utilise des `<div class="progress-bar">` avec gradient CSS.
- ❌ Empiler plus de 6 items dans Attention. Au-dela = noyade cognitive TDAH.
- ❌ Proposer plus d'UNE question dans le CTA final. Deux choix max (defaut + alternative).
