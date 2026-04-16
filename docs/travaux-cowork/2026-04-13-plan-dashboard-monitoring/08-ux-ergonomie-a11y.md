# 08 — UX, ergonomie et accessibilite

Lentilles mobilisees : ux-ergonome, a11y-specialist, hierarchie-information, copywriter-ux, design:accessibility-review.

## 1. Heuristiques Nielsen appliquees au dashboard

| # | Heuristique | Application concrete |
|---|-------------|----------------------|
| 1 | Visibilite de l'etat systeme | HealthRing toujours visible, session-lock status en footer, indicateur de save inline |
| 2 | Correspondance systeme-monde reel | Vocabulaire projet (modules, blocs, sessions), pas de jargon front (routes, endpoints) |
| 3 | Controle et liberte | Undo sur actions destructives (archive idea, delete note), bouton retour sur modals |
| 4 | Coherence et standards | DS 46 composants shadcn, patterns identiques page a page |
| 5 | Prevention d'erreur | Confirmation avant delete, detection conflit verrou avant ecriture |
| 6 | Reconnaissance vs rappel | Command palette fuzzy, historique dans Lab, recents dans Home |
| 7 | Flexibilite et efficacite | Raccourcis clavier tout, URL deep links, filtres combinables |
| 8 | Design minimaliste | Zone focus active, reste en surface secondaire, pas de decoration vide |
| 9 | Aide erreurs | Messages contextuels (verrou pris par CLI → "session CLI active depuis 12min, attends ou prends a 30min"), propositions d'action |
| 10 | Aide et documentation | `?` ouvre cheat sheet, chaque page a un "?" contextuel qui explique |

## 2. Lois UX cles

### 2.1 Loi de Fitts
Cibles cliquables importantes (start session, end session, Cmd+K, new idea) en coins ou edges de l'ecran. Taille minimale 40x40px (touch-friendly meme si desktop-first).

### 2.2 Loi de Hick
Sidebar limitee a 10 items niveau 1 + 3 zones. Sous-pages en second niveau. Command palette = raccourci 1-clic vers n'importe quoi (contourne Hick).

### 2.3 Loi de Jakob
Patterns familiers : sidebar gauche (comme Linear/Notion), Cmd+K (comme Raycast), Kanban (comme Trello), Card-based (comme Figma). Pas d'innovation UX gratuite.

### 2.4 Loi de Miller
Max 7 (±2) items par groupe visuel. Widgets Home : 7 widgets max. Sidebar zone : 4 items max par zone. Tabs Arsenal : 6 tabs, limite.

### 2.5 Loi de Tesler (complexite conservee)
Le dashboard porte la complexite, pas Kevin. Exemple : rediger un message inbox ne demande pas de savoir ou est le fichier, ni le nommage (auto-genere avec timestamp).

### 2.6 Loi de Doherty
Toute interaction doit retour < 400ms. Donnees pre-parsees au chargement, pas de fetch bloquant post-nav. Loading skeletons pendant parse initial.

## 3. Parcours utilisateur types (user journeys)

### 3.1 Parcours "Reprise apres pause"
1. Kevin ouvre Cowork ou dashboard
2. Home affiche : derniere session (date + resume), prochaine action, verdict sante
3. En 3 secondes il sait ou reprendre
4. Clic "Demarrer bloc suivant" → template CLI en clipboard
5. Ouvre Terminal / Claude Code et colle

**Frictions a eliminer** : ne pas avoir a lire CONTEXT.md, ne pas chercher le plan actif.

### 3.2 Parcours "Capture d'idee sur le pouce"
1. `Cmd+I` n'importe ou
2. Saisit 1-2 phrases
3. Enter → ferme, toast "captured"
4. Temps total : < 10 secondes

**Frictions a eliminer** : choix de module, template complexe, navigation.

### 3.3 Parcours "Investigation bug sante"
1. Home affiche 🔴 DEGRADED
2. Clic ring → /pulse
3. Voit quel indicateur rouge (ex: "CONTEXT.md > 200 lignes")
4. Clic "Compacter" → template / ouvre CONTEXT.md avec highlight sections lourdes

### 3.4 Parcours "Planifier prochain module"
1. /lab/briefs → select brief Finance
2. Edite objectif, metrics, timeline
3. Bouton "Generate initial plan"
4. Plan genere propose dans /lab/inbox → review
5. "Accept" → devient vrai plan dans docs/plans/

### 3.5 Parcours "Review design system"
1. /design-system/composants
2. Voit 46 composants, filtre "form"
3. Clic Input → playground, tous les variants, props edit en live
4. Clic "Usage" → liste les imports Input dans le codebase

## 4. Hierarchie d'information (par page)

### 4.1 Regle des 3 niveaux
Chaque page a exactement 3 niveaux de hierarchie :
- **N1 — Focus** : ce qui doit etre vu en premier (HealthRing, plan en cours)
- **N2 — Contexte** : supporte N1 (metriques, liste items)
- **N3 — Detail** : accessible sur interaction (modal, drawer, expand)

### 4.2 Poids visuel
- N1 : bold, couleur accent, taille > 24px, position haut-gauche (lecture F-pattern)
- N2 : regular, couleur muted-foreground, taille 14-16px
- N3 : revele sur hover / click, meme poids que N2

### 4.3 Densite reglable
3 modes (spacing tokens variable) :
- **Compact** (~14px base, 4px grid) : power user, voit tout
- **Confort** (~16px base, 8px grid) : defaut, optimise lecture
- **Spacieux** (~18px base, 12px grid) : reading / focus

## 5. Accessibilite WCAG 2.2 AA — checklist exhaustive

### 5.1 Contrastes
- [ ] Texte normal : ratio >= 4.5:1 sur fond (verifier tokens semantic ds-foreground sur ds-surface-0/1/2)
- [ ] Texte large (18px+ ou 14px+ bold) : >= 3:1
- [ ] Composants UI (borders, icons) : >= 3:1
- [ ] Accents (ds-accent) : >= 3:1 sur fond
- [ ] Verifier mode daltonien : status ne repose pas uniquement sur couleur (ajouter icones + texte)

### 5.2 Navigation clavier
- [ ] Tous elements interactifs atteignables en Tab
- [ ] Ordre tab logique (visuel = DOM)
- [ ] Focus visible (ring 2px couleur accent)
- [ ] Skip links : "Skip to main content", "Skip to sidebar"
- [ ] Escape ferme modals/drawers
- [ ] Enter active boutons et links
- [ ] Arrow keys dans listes, Kanban, command palette
- [ ] Cmd+K ouvre palette depuis n'importe ou

### 5.3 Screen readers
- [ ] Labels explicites sur tous les boutons icone (aria-label)
- [ ] Live regions pour notifications (aria-live="polite")
- [ ] Status changes annonces (ex: "Module Design System build green")
- [ ] Tableaux avec thead/tbody + scope col/row
- [ ] Landmarks : header, nav, main, aside, footer
- [ ] Headings hierarchie correcte (h1 -> h2 -> h3, pas de saut)

### 5.4 Visual
- [ ] Zoom 200% sans perte fonctionnelle
- [ ] Responsive tests a 320px (min mobile) 768px 1440px 2560px
- [ ] Pas de contenu uniquement horizontal scroll
- [ ] Texte redimensionnable sans overflow

### 5.5 Motion et cognitif
- [ ] Respect `prefers-reduced-motion` : animations plus courtes ou desactivees
- [ ] Pas de clignotement > 3x/sec
- [ ] Pas de auto-play sans controle
- [ ] Temps de session : pas de timeout agressif, alerte avant expiration verrou
- [ ] Formulaires : messages d'erreur explicites, suggestions

### 5.6 Dyslexie et charge cognitive
- [ ] Police Figtree (OK pour dyslexie), possibilite de switcher Atkinson Hyperlegible
- [ ] Line-height 1.5+ pour body text
- [ ] Max line length 80 chars (prose)
- [ ] Pas de justified text
- [ ] Paragraphes courts, bullets pour listes
- [ ] Icones + texte (pas icone seul)

### 5.7 Tests automatises
- [ ] axe-core dans CI (zero erreur critical/serious)
- [ ] Lighthouse a11y score >= 95
- [ ] Test manuel NVDA (Windows) + VoiceOver (Mac) + TalkBack (Android)
- [ ] Test clavier only (1 heure de navigation sans souris)

## 6. Microcopy — guide ton

### 6.1 Principes de ton
- **Direct, sans jugement** (preference Kevin)
- **Francais 100%** (pas d'anglicisme gratuit)
- **Factuel** (pas de "Super !" ou "Bravo !")
- **Actionnable** (verbe d'action : "Demarrer", "Capturer", "Fermer")
- **Concis** (< 8 mots pour un CTA, < 2 lignes pour un message)

### 6.2 Exemples microcopy

#### Empty states
- Home sans session : "Aucune session active. Demarre quand tu es pret."
- Lab/ideas vide : "Rien dans le lab. Capture ta premiere idee avec Cmd+I."
- Plans vide : "Zero plan actif. Cree un brief ou promeus une idee."

#### Errors
- Verrou pris : "Session CLI active depuis 12 min (Kevin, 2026-04-13 14:32). Attendre ou forcer a 30 min."
- Build echoue : "Build KO sur modules/app. Dernier log : ligne 42 erreur TS."
- Fichier absent : "CONTEXT.md introuvable. Re-scan ? [bouton]"
- Ecriture bloquee : "Ecriture refusee. Verrou detenu par CLI."

#### Confirmations
- Delete idea : "Supprimer cette idee ? Irreversible."
- Archive plan : "Archiver ce plan ? Il passera en lecture seule dans .archive/."
- Force unlock : "Forcer la liberation du verrou CLI ? Risque : collision si CLI ecrit encore."

#### Success (discret)
- Idea captured : "Idee capturee."
- Decision ajoutee : "Decision D-XXX ajoutee a CONTEXT.md."
- Build green : "Build OK en 3.2s."

#### CTA
- Primary : "Demarrer session", "Capturer", "Confirmer", "Publier"
- Secondary : "Annuler", "Plus tard", "Retour"
- Tertiary : "En savoir plus"

### 6.3 Voice guidelines par zone
- **Home** : factuel, oriente action ("Prochain bloc : B7")
- **Pulse** : diagnostic, clinique ("Indicateur : > 80%, status : alerte")
- **Lab** : encourageant sans flagornerie ("Capture libre", "Garde toutes tes idees")
- **Memory** : technique, honnete ("CONTEXT.md : 144/150 lignes, seuil proche")
- **Knowledge** : documentaire ("Decision D-DS-REBUILD — Design System v2 shadcn")

### 6.4 Interdits microcopy
- "Oops!", "Bravo!", "Incroyable !"
- "Juste un instant...", "Bientot..."
- "Notre equipe", "Nous"
- Exclamation points > 1 par page
- Emojis dans les erreurs serious
- Termes vagues : "quelque chose", "un probleme"

## 7. Dark patterns a eviter absolument

- [ ] Pas de confirmation shaming ("Non merci je n'aime pas la productivite")
- [ ] Pas de toggle cache derriere accordion
- [ ] Pas de CTA trompeur (bouton rouge = delete, bouton vert = primary)
- [ ] Pas de "recommended" qui biaise
- [ ] Pas de FOMO fabrique (streaks, "3 jours sans session !")
- [ ] Pas de gamification addictive (trophees, points, levels)

## 8. Personnalisation inclusive

### 8.1 Settings a11y dedies
Page /settings/a11y :
- Animation level : none / reduced / full
- Font size : small / base / large / xl
- Font family : Figtree / Atkinson Hyperlegible / System
- Contrast boost : off / on (surimpose layer pour augmenter contrastes)
- Reading mode : off / on (masque sidebars, widths plus etroites)
- Cursor size : default / large (pour mobilite reduite)
- Underline links : off / on
- Focus ring thickness : 2px / 4px

### 8.2 Support natif OS
Respect des preferences OS :
- `prefers-color-scheme` : dark forcee (Void Glass dark-only) MAIS respect si user force light ? Non, DS est dark-only. A documenter.
- `prefers-reduced-motion` : auto-detect
- `prefers-contrast` : auto-boost si "more"

## 9. Hierarchie info — application par page

### Home (exemple)
- N1 : HealthRing + "Prochaine action" (haut centre)
- N2 : ModuleCards + PlansEnCours + IdeesRecentes (grid 2 cols)
- N3 : clic sur card = drawer detail

### Pulse
- N1 : Verdict global (gigantesque, centre)
- N2 : 9 indicateurs en grid
- N3 : clic indicateur = timeline + commande de re-check

### Modules
- N1 : 3 sections clairement separees (Actifs en haut, Prevus milieu, Idees bas)
- N2 : ModuleCards dans chaque section
- N3 : clic = page detail

### Plans (Kanban)
- N1 : colonnes (IN_PROGRESS au centre visuel)
- N2 : PlanCards
- N3 : clic = plan detail full page

## 10. Validation UX

Process de validation a chaque phase :
- **Apres P1** : Kevin teste la navigation vide, confirme arborescence
- **Apres P3** : revue visuelle de chaque composant custom
- **Apres P4** : parcours complet Observer avec chrono
- **Apres P6** : test des 5 workflows types (section 3)
- **Avant P8** : audit a11y full (axe + VoiceOver + clavier only)

Si un parcours depasse 3x le temps estime ou genere frustration, refacto avant de continuer.

## 11. Zero mental overhead objectif

Le succes UX se mesure : Kevin peut reprendre apres 7 jours d'absence et savoir quoi faire en < 30 secondes. Si plus long → refacto Home.
