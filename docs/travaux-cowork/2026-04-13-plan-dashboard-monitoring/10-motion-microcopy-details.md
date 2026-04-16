# 10 — Motion design et microcopy detaille

Lentilles mobilisees : motion-designer, copywriter-ux, ui-expert, design:ux-copy.

## 1. Principes motion Void Glass

### 1.1 Ton motion
- **Subtil, jamais spectaculaire** : motion supporte l'UX, n'attire pas l'attention
- **Toujours fonctionnel** : chaque animation a une raison (feedback, hierarchie, continuite)
- **Respect prefers-reduced-motion** : bascule en fade simple ou cut sec
- **Duree courte** : 120ms (micro), 200ms (standard), 400ms (large transitions)
- **Easing naturel** : cubic-bezier(0.16, 1, 0.3, 1) = ease-out pour arrivee, cubic-bezier(0.7, 0, 0.84, 0) pour sortie

### 1.2 Tokens motion proposes (a ajouter au DS)
```
--ds-motion-duration-instant: 0ms;
--ds-motion-duration-fast: 120ms;
--ds-motion-duration-base: 200ms;
--ds-motion-duration-slow: 400ms;
--ds-motion-duration-breath: 1200ms;
--ds-motion-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ds-motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
--ds-motion-ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
--ds-motion-ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## 2. Catalogue d'animations

### 2.1 Entrees de page (navigation)
- Fade + translate Y (12px) sur 200ms
- Stagger enfants : 20ms delay par item, max 8 items (au-dela = batch fade)

### 2.2 Cards et widgets
- Au hover : translateY(-2px) + shadow souple sur 120ms
- Au click : scale(0.98) sur 80ms (feedback tactile visuel)
- Apparition : fade-in + scale(0.95 → 1) sur 200ms

### 2.3 HealthRing
- Rotation continue : 20s par tour, linear
- Si verdict change : morph couleur sur 400ms, pulse (scale 1 → 1.05 → 1) sur 600ms
- Si BROKEN : pulse rouge toutes les 2s (rappel discret)

### 2.4 Progress bars
- Remplissage : 400ms ease-out apres mount
- Update : transition 200ms sur width

### 2.5 Modals / Dialogs
- Backdrop : fade 200ms
- Content : slide-up 12px + fade 200ms
- Close : reverse, 150ms

### 2.6 Drawers / Sheets (lateral)
- Slide 250ms ease-out
- Backdrop simultane fade 200ms

### 2.7 Toasts
- Slide-in depuis bas-droite + fade 200ms
- Auto-dismiss 5s + fade-out 300ms
- Stack : si plusieurs, decalage 8px

### 2.8 Command palette (Cmd+K)
- Apparition : fade + scale(0.96 → 1) + blur backdrop 200ms
- Resultats : stagger fade-in 20ms par item
- Navigation arrow keys : highlight glide 120ms

### 2.9 Kanban drag & drop
- Card pickup : scale(1.02) + shadow + slight rotation (2deg) + 120ms
- Drop zone highlight : border pulse 800ms cycle
- Drop : snap to position + scale(0.98 → 1) 200ms

### 2.10 Badges et indicateurs
- Nouveau badge : scale-in (0 → 1) + rotate(-10deg → 0) 300ms
- Disparition : fade 150ms

### 2.11 Skeletons (loading states)
- Shimmer : linear-gradient anime 1.5s infini
- Fade-out skeleton → fade-in contenu : 200ms crossfade

### 2.12 Orbes background (ambiance)
- Deux orbes blur(100px) flottant : translation lente 30s ease-in-out loop
- Opacity 0.15 max, couleurs accent DS
- Hidden en mode reduced-motion

### 2.13 Typewriter (fun usage, rarement)
- Premier mount de Home : "Bonjour Kevin" apparait lettre par lettre (50ms/char)
- Une fois par session uniquement, pas de repetition

### 2.14 Number animations
- Counters (nombre ideas, plans, commits) : tween de 0 a valeur sur 800ms ease-out

### 2.15 Tab switches
- Content crossfade 200ms
- Indicator slide 250ms cubic-bezier

### 2.16 Accordion / Collapsible
- Height transition via FLIP technique 200ms
- Chevron rotate 90deg 150ms

### 2.17 Checkbox / Toggle
- Check : scale (0 → 1.2 → 1) 200ms avec pop spring
- Toggle : slide knob 150ms + color fade

### 2.18 Focus ring
- Apparition : fade + scale(0.8 → 1) 100ms
- Couleur accent DS avec offset 2px

### 2.19 Error / Success
- Error : shake horizontal (x: 0 → -4 → 4 → 0) 300ms
- Success : check icon draw (path stroke-dasharray) 400ms

### 2.20 Transitions complexes
- Plan → Plan detail : shared layout animation (card expand to full page) via Framer Motion layoutId

## 3. Bibliotheque recommandee

**Framer Motion** pour l'essentiel :
- Variants pour reuse
- AnimatePresence pour entry/exit
- layoutId pour transitions partagees

**@formkit/auto-animate** (alternative legere) pour listes/grids simples.

**CSS transitions** pour les micro (hover, focus, click feedback).

## 4. Motion guidelines par page

### Home
- Orbes background actives
- Stagger 8 widgets en apparition
- HealthRing rotation + pulse
- Counters animes

### Pulse
- Verdict : morph couleur sur changement
- Timeline : dessin SVG anime au scroll-into-view
- Jauges : fill 400ms

### Modules
- Cards stagger
- Hover : elevate
- Click : transition shared layout vers detail

### Arsenal
- Tabs crossfade
- Grid items stagger (max 8)
- Filter : re-layout animated (Framer layout prop)

### Plans
- Kanban drag & drop
- Cards stagger sur filter change
- Burndown chart : draw path on mount

### Knowledge
- Accordion smooth
- Graph knowledge : force simulation naturelle

### Lab
- Ideas : drag & drop quadrant
- Inbox : message fade-in, lu = opacity 0.7
- Notes editor : no animation (focus ecriture)

### Design System
- Composant preview : hover highlight
- Token swatch : click to copy feedback

### Sessions
- Heatmap : fade-in cells staggered (max 30)
- Timeline scrub : smooth

### Memory
- Budget bars : fill animate
- Delta view : diff lines highlight

## 5. Microcopy — bibliotheque complete

### 5.1 Labels de navigation (sidebar)
- Home → "Cockpit"
- Pulse → "Sante"
- Modules → "Modules"
- Arsenal → "Arsenal"
- Plans → "Plans"
- Knowledge → "Connaissance"
- Lab → "Atelier"
- Design System → "Design"
- Sessions → "Sessions"
- Memory → "Memoire"

Alternative (libre) : "Carte" au lieu de "Cockpit" si trop militaire.

### 5.2 Headings page
- Home : "Cockpit" + subtitle "Etat de Foundation OS en un coup d'oeil"
- Pulse : "Sante" + subtitle "Verdict et indicateurs"
- Modules : "Modules" + subtitle "Ce que tu construis, ce qui vient, ce qui germe"
- Arsenal : "Arsenal" + subtitle "Outils, skills, agents a disposition"
- Plans : "Plans" + subtitle "Ce que tu fais, ce qui t'attend"
- Knowledge : "Connaissance" + subtitle "Specs, decisions, historique"
- Lab : "Atelier" + subtitle "Capturer, ecrire, dialoguer"
- Design System : "Design" + subtitle "Void Glass, tokens, composants"
- Sessions : "Sessions" + subtitle "Rythme et historique du travail"
- Memory : "Memoire" + subtitle "CONTEXT.md, auto-memory, apprentissages"

### 5.3 CTAs par contexte

#### Actions primaires (buttons bg accent)
- "Demarrer session"
- "Terminer session"
- "Nouvelle idee"
- "Capturer"
- "Nouveau plan"
- "Nouvelle decision"
- "Rafraichir"
- "Envoyer"
- "Sauvegarder"
- "Confirmer"
- "Continuer"

#### Actions secondaires (outline ou ghost)
- "Annuler"
- "Retour"
- "Plus tard"
- "Voir detail"
- "Modifier"
- "Archiver"
- "Dupliquer"
- "Exporter"

#### Actions destructives (rouge)
- "Supprimer"
- "Forcer liberation"
- "Reset"

### 5.4 Tooltips (reveler juste ce qu'il faut)
- HealthRing : "Verdict sante global. Clic pour detail."
- Verrou icon : "Verrou CLI actif depuis 12 min. TTL 30 min."
- Cmd+K : "Recherche globale (Cmd+K)"
- Module card : "Clic pour detail. Raccourci M pour ouvrir module actif."
- Plan card : "Clic pour detail. Drag pour changer status."
- Decision : "D-038 enregistree 2026-04-13. Clic pour lire contexte."

### 5.5 Placeholders inputs
- Recherche globale : "Chercher un plan, decision, outil, skill..."
- Nouvelle idee : "Balance ton idee en une phrase..."
- Note : "Ecris librement. Slash pour commandes."
- Inbox : "Message pour Claude..."
- Brief : "Decris le probleme, les utilisateurs, les objectifs..."
- Search plans : "Filtrer par titre, module, status..."

### 5.6 Messages de confirmation (toasts)
- "Idee capturee"
- "Decision D-038 ajoutee"
- "Message envoye"
- "Plan archive"
- "Session demarree"
- "Session terminee. Resume disponible dans l'atelier."
- "Build vert (3.2s)"
- "Brief sauvegarde"
- "Note promue en spec"

### 5.7 Messages d'erreur (factuels, actionnables)
- "Verrou CLI actif. Ecriture Cowork refusee."
- "CONTEXT.md introuvable. Verifie le repertoire racine."
- "Build KO. Voir log `npm run build`."
- "Parsing echoue sur docs/plans/X.md ligne 12. Frontmatter invalide ?"
- "Health-check timeout (> 10s). Scripts/health-check.sh present ?"
- "Connexion filesystem perdue. Rafraichissement manuel uniquement."

### 5.8 Empty states
- Plans vide : "Aucun plan actif. Cree un brief dans l'atelier, puis promeus-le en plan."
- Ideas vide : "Atelier vide. Cmd+I pour capturer ta premiere idee."
- Inbox vide : "Aucun message. Claude t'ecrira en fin de session."
- Decisions vide (pre-init) : "Premiere decision a venir. Le projet debute."
- Sessions history vide : "Pas encore d'historique. La premiere session arrive."

### 5.9 Labels metriques
- "X plans actifs" (pas "X active plans")
- "Il y a X minutes" / "hier" / "2026-04-13" (format relatif < 24h, absolu apres)
- "Build vert" / "Build KO" (pas "passing/failing")
- "Progression 67%" (avec barre visuelle)
- "X lignes / 150 max" (CONTEXT.md)
- "Session active depuis 34 min"
- "X commits aujourd'hui"
- "X idees en attente"

### 5.10 Labels statut
- SAIN / DEGRADED / BROKEN (garder l'existant health-check)
- IDEE / BACKLOG / IN_PROGRESS / DONE / ARCHIVED (statuts plan)
- ACTIF / PREVU / IDEE (statuts module)
- LIBRE / VERROUILLE (verrou)

### 5.11 Microcopy coaching (discret)
Affichage contextuel ponctuel, jamais intrusif :
- Si CONTEXT.md > 140L : "CONTEXT.md approche du seuil. Envisage un compactage."
- Si > 5 decisions dans la semaine : "Beaucoup de decisions prises. Pense a archiver les plus anciennes."
- Si plan stagne > 7 jours : "Plan X n'a pas bouge depuis 7 jours. Ecarter ou relancer ?"
- Si > 3 ideas sans status : "3 idees en attente depuis > 14 jours. Quadrant d'impact ?"

**Important** : maximum 1 coaching visible a la fois. Dismissable. Pas de harcelement.

## 6. Phrasing specifique aux dialogues Claude <-> Kevin

### 6.1 Messages Claude vers Kevin (inbox)
Format : concis, structure, jamais condescendant.

Exemples :
- "Session terminee. 2 blocs livres (B5, B6). Build vert. Prochain : B7 parsing tools."
- "Attention : CONTEXT.md passe de 140 a 154 lignes. Je propose un compactage section Sessions (archives J-14)."
- "Decision D-038 prise en session : rebase daily sur main, pas de merge. J'ai ajoute dans CONTEXT.md."

### 6.2 Messages Kevin vers Claude
Libre. Le dashboard n'impose aucun format.

## 7. Regles typo et lisibilite (copywriting)

- Phrases courtes : max 20 mots
- Preferer verbes d'action aux substantifs
- Pas de passif ("Il a ete decide que" → "Decision : ...")
- Francais 100%, pas d'anglicismes paresseux ("check" → "verifier", "ship" → "livrer", "deployer" OK)
- Chiffres : < 10 en lettres, >= 10 en chiffres
- Dates : format YYYY-MM-DD dans les fichiers, "2026-04-13" ou "13 avril" dans UI selon contexte
- Pas de capitalisation de tout ("DEMARRER" → "Demarrer")

## 8. Ton voice — matrice courte

| Situation | Ton |
|-----------|-----|
| Success | Discret, factuel |
| Error | Direct, proposition d'action |
| Warning | Neutre, donnees concretes |
| Empty state | Pedagogique, CTA clair |
| Coaching | Suggestion, jamais ordre |
| Instructions | Imperatif court |
| Dialogues Claude | Collaboratif, pair |

## 9. Accessibilite copywriting

- Pas de metaphores culturelles (ex: "mettre la charrue avant les boeufs")
- Pas d'ironie (screen readers ne la portent pas)
- Pas de phrase qui depend de la couleur ("le vert signifie OK") → toujours ajouter icone/label
- Abreviations : expliquer au 1er usage (ex: "TTL (time to live)")

## 10. Checklist microcopy avant livraison

- [ ] Tous les labels en francais
- [ ] Tous les CTA sont des verbes d'action
- [ ] Tous les empty states ont une action proposee
- [ ] Tous les messages d'erreur sont actionnables
- [ ] Aucune exclamation > 1 par ecran
- [ ] Aucun emoji dans les erreurs serious
- [ ] Aucun "Nous" / "notre"
- [ ] Aucun jargon front expose
- [ ] Validation par Kevin sur tone of voice final
