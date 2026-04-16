# 05 — UX et Design System

## 1. Principes UX

### 1.1 TDAH-friendly (regle Kevin)

Le dashboard doit respecter les regles TDAH deja appliquees aux briefs v11 :
- **Zones visuelles distinctes** : cadres, couleurs, respiration
- **Alignement strict** : grilles, padding constant, pas de chaos visuel
- **Labels clairs** : pas de jargon, vulgarisation si technique
- **Progression visible** : barres, pourcentages, status explicites
- **Pas de surcharge** : max 7 elements visibles simultanement par zone
- **Hierarchie evidente** : titre gros, sous-titres, contenu

### 1.2 Zero friction

- **Acces instantane** : Cmd+K partout, raccourcis globaux
- **Actions rapides** : "+ Idee" en 1 clic partout
- **Pas de navigation profonde** : max 2 niveaux
- **Sauvegarde auto** : pas de bouton "Save" pour les notes/idees

### 1.3 Honnetete visuelle

- **Pas de faux positifs** : si une donnee n'est pas disponible, afficher "—" ou "?"
- **Dates reelles** : pas de "il y a quelques minutes" flou, des dates precises
- **Metriques reelles** : si build pas lance, afficher "jamais execute" pas "OK"
- **Status honnetes** : SAIN/DEGRADED/BROKEN pas "Ca roule !"

### 1.4 Densite reglable

- Mode **compact** : toutes les infos en petit, maximum d'info par ecran
- Mode **confortable** (defaut) : espacement genereux, lecture aisee
- Mode **focus** : zoom sur une section, le reste flou

## 2. Integration Void Glass

### 2.1 Tokens utilises

Le dashboard utilise **exclusivement** les tokens DS Void Glass :

```css
/* Surfaces */
--ds-surface-0: #030303;              /* Fond global */
--ds-surface-1: rgba(255,255,255,0.025); /* Cards */
--ds-surface-2: rgba(255,255,255,0.05);  /* Hover */
--ds-surface-3: rgba(255,255,255,0.08);  /* Actif */

/* Bordures */
--ds-border: rgba(255,255,255,0.055);

/* Accents */
--ds-blue: #60a5fa;    /* Info, liens */
--ds-purple: #c084fc;  /* Highlight, focus */
--ds-green: #4ade80;   /* OK, success */
--ds-rose: #f87171;    /* Erreur, critical */
--ds-amber: #fbbf24;   /* Warning */

/* Typo */
--ds-font-ui: Figtree;
--ds-font-mono: 'JetBrains Mono';
```

### 2.2 Effets signatures

- **Glassmorphism** : cards avec `backdrop-filter: blur(20px)` + surface-1
- **Glow cards** : halo colore en arriere-plan (bg-purple-500/10, etc.)
- **Orbes** : blur(80px), opacity 0.09-0.12, animation drift
- **Fade-in staggered** : delays 40ms par element
- **Focus ring** : ring-purple-500/50 en focus-visible

### 2.3 Composants DS utilises

Liste des composants shadcn/ui deja disponibles qu'on va utiliser :

| Page | Composants |
|------|-----------|
| Home | Card, Badge, Progress, Separator |
| Pulse | Card, Progress, Alert, Table |
| Modules | Card, Badge, Tabs, Button |
| Arsenal | Tabs, Card, Badge, Command (command palette), Input |
| Plans | Card, Progress, Badge, Tabs |
| Knowledge | Accordion, Card, Input, Table |
| Lab | Dialog, Textarea, Input, Button, Badge |
| Design System | Tabs, Card, Separator, Tooltip |
| Sessions | Table, Card, Badge |
| Memory | Progress, Card, Accordion |

**Tous les 46 composants shadcn/ui disponibles dans `modules/design-system`**. On ne recree rien, on consomme.

## 3. Composants cles (a ajouter au dashboard)

Composants specifiques au dashboard (pas dans le DS, a creer) :

### 3.1 HealthRing

Cercle anime avec le verdict global et sous-indicateurs.
- SVG anime
- Couleurs selon verdict (green/amber/rose)
- Click pour expand

### 3.2 ModuleCard

Card pour un module avec status, metriques, actions.
- Utilise Card (DS) + Badge + Progress
- Hover : glow
- Click : navigate

### 3.3 PlanCard

Card pour un plan avec progression et blocs.
- Progress bar
- Status badge
- Blocs expandables

### 3.4 IdeaCard

Card editable pour une idee.
- Inline edit (click pour editer)
- Type badge (concrete/future/?)
- Actions : Transformer, Archiver

### 3.5 InboxMessage

Bulle de message avec sender, date, contenu MD.
- Timeline verticale
- Avatar Kevin / Claude
- Status lu/non lu

### 3.6 TokenSwatch

Visualisation d'un token DS avec preview.
- Couleur : swatch + hex + CSS var
- Typo : preview du texte
- Space : preview visual

### 3.7 SearchCommand (Cmd+K)

Command palette avec recherche fuzzy.
- Utilise Command (DS) + Dialog
- Liste filtree en temps reel
- Keyboard navigation

## 4. Interactions cles

### 4.1 Ecriture inline

Pour les idees, notes, briefs :
- Click sur le contenu → edition inline (contenteditable ou textarea)
- Blur ou Cmd+Enter → sauvegarde
- Pas de modal sauf pour creation

### 4.2 Drag & drop

Pour la vue Kanban des plans :
- Drag une carte plan d'une colonne a une autre
- Met a jour le status dans le frontmatter du fichier

### 4.3 Filtres persistents

Les filtres appliques (ex : "skills domaine Sante") persistent en URL params :
- `/arsenal/skills?domain=sante` → partageable, bookmarkable

### 4.4 Hover states

Tout element interactif a un hover state visible (surface-2 ou glow).
Regle Void Glass : les effets sont subtils, jamais agressifs.

## 5. Animations

### 5.1 Transitions

| Element | Animation | Duree |
|---------|-----------|-------|
| Navigation de page | Fade + slide | 200ms |
| Card hover | Glow fade in | 150ms |
| Expand (accordion) | Height + opacity | 200ms |
| HealthRing | Rotation continue subtle | 20s loop |
| Orbes background | Drift infini | 30s loop |
| Fade-in elements | Staggered 40ms | 500ms total |

### 5.2 Motion tokens

Utiliser les tokens motion du DS :
- `--ds-motion-fast: 150ms`
- `--ds-motion-medium: 300ms`
- `--ds-motion-slow: 500ms`
- `--ds-easing-out: cubic-bezier(0, 0, 0.2, 1)`

## 6. Accessibilite

- Contraste WCAG AA minimum sur tous les textes
- Focus visible partout (ring-purple-500/50)
- Labels aria sur tous les boutons icone
- Navigation clavier complete (Tab, Enter, Esc)
- Screen reader friendly (role, aria-live pour notifications)

## 7. Etat vide

Chaque page a un etat vide soigne :
- `/lab/ideas` vide : "Pas d'idee capturee. Cmd+I pour en ajouter une."
- `/lab/inbox` vide : "Pas de message. L'inbox se remplit au fil des sessions."
- `/modules` avec 0 module : "Aucun module. `/new-project` pour en creer un."

## 8. Mode erreur

Si une source de donnees est indisponible :
- Affichage d'une alert en haut de la section concernee
- Le reste du dashboard continue de fonctionner
- Exemple : si `git log` echoue, la section Git affiche "Indisponible" mais Pulse marche toujours
