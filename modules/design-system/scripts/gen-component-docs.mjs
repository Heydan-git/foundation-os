#!/usr/bin/env node
// Genere un fichier Markdown par composant pour Supernova (docs-supernova/components/).
// Source : manifest ci-dessous + storybook-static/index.json pour lister les stories existantes.
// Lancer : node scripts/gen-component-docs.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = join(root, 'docs-supernova/components');
const storybookIndex = join(root, 'storybook-static/index.json');

const MANIFEST = [
  // [category, name, label, purpose]
  ['Form', 'button', 'Button', 'Action principale — declenche une operation. Support icone a gauche/droite, variants default/secondary/outline/ghost/destructive/link, sizes sm/default/lg/icon.'],
  ['Form', 'input', 'Input', 'Champ texte simple. Types text/email/password/number/search. Etats focus/disabled/invalid geres via aria-invalid.'],
  ['Form', 'textarea', 'Textarea', 'Zone texte multi-lignes. Resize controle, focus-ring DS, disabled grise.'],
  ['Form', 'label', 'Label', 'Libelle associe a un champ via htmlFor. Typographiquement cale sur --ds-text-body-sm, weight 500.'],
  ['Form', 'checkbox', 'Checkbox', 'Case a cocher binaire ou indeterminee. Taille 16px, check icone Lucide, support controlled/uncontrolled.'],
  ['Form', 'switch', 'Switch', 'Bascule on/off. Animation slide 120ms. Synonyme de toggle mais visuellement explicite (label obligatoire).'],
  ['Form', 'toggle', 'Toggle', 'Bouton bascule visuel (pressed/unpressed). Utiliser pour toolbar formatting — sinon preferer Switch.'],
  ['Form', 'toggle-group', 'ToggleGroup', 'Groupe de toggles mutuellement exclusifs (single) ou multiples (multiple). Remplace radio-group pour les selecteurs icone.'],
  ['Form', 'radio-group', 'RadioGroup', 'Selecteur exclusif parmi N options. Label obligatoire sur chaque item. Orientation vertical/horizontal.'],
  ['Form', 'select', 'Select', 'Menu deroulant de selection. Support search, groupes, separators. Overlay portal.'],
  ['Form', 'slider', 'Slider', 'Curseur numerique 1D ou range. Pas configurable, valeur affichee en tooltip optionnel.'],
  ['Form', 'input-otp', 'InputOTP', 'Saisie code a usage unique (OTP/2FA). N slots digitals, focus chain automatique.'],
  ['Form', 'form', 'Form', 'Wrapper React Hook Form + resolver Zod. Expose FormField, FormItem, FormLabel, FormMessage.'],

  ['Feedback', 'alert', 'Alert', 'Message inline (info/warning/error/success). Non-dismiss par defaut — utiliser Sonner pour les toasts.'],
  ['Feedback', 'alert-dialog', 'AlertDialog', 'Confirmation destructive bloquante. Action + Cancel obligatoires. Ne fermer qu\'apres decision.'],
  ['Feedback', 'dialog', 'Dialog', 'Modale generique overlay. Focus trap, Escape ferme. Utiliser Sheet pour un panneau lateral.'],
  ['Feedback', 'drawer', 'Drawer', 'Panneau glissant mobile-first (bottom sheet). Alternative a Dialog sur petit ecran.'],
  ['Feedback', 'sheet', 'Sheet', 'Panneau lateral (left/right/top/bottom). Plus riche que Dialog, ferme par overlay ou Escape.'],
  ['Feedback', 'popover', 'Popover', 'Boite flottante attachee a un trigger. Non-modale — utiliser Dialog si interaction bloquante.'],
  ['Feedback', 'tooltip', 'Tooltip', 'Aide contextuelle au hover/focus. Delai 300ms. Jamais porteur d\'information critique.'],
  ['Feedback', 'hover-card', 'HoverCard', 'Preview riche au hover (profil, lien). Non tactile — fallback tap sur mobile.'],
  ['Feedback', 'sonner', 'Sonner (Toast)', 'Toast non-bloquant. Success/info/warning/error. Auto-dismiss 4s, action optionnelle.'],

  ['Layout', 'card', 'Card', 'Conteneur de groupe semantique. Header/Content/Footer. Le building block glassmorphique.'],
  ['Layout', 'accordion', 'Accordion', 'Liste repliable. Mode single (une section ouverte) ou multiple.'],
  ['Layout', 'collapsible', 'Collapsible', 'Bloc repliable isole (1 trigger, 1 content). Plus simple qu\'Accordion.'],
  ['Layout', 'tabs', 'Tabs', 'Onglets horizontaux. TabsList + TabsTrigger + TabsContent. Navigation clavier ArrowLeft/Right.'],
  ['Layout', 'separator', 'Separator', 'Ligne de separation horizontale ou verticale. 1px, `--ds-border-subtle`.'],
  ['Layout', 'aspect-ratio', 'AspectRatio', 'Preserve le ratio d\'un contenu (image, iframe). Evite les layout shifts.'],
  ['Layout', 'scroll-area', 'ScrollArea', 'Zone scrollable avec scrollbar personnalisee. Pas de scrollbar native.'],
  ['Layout', 'resizable', 'Resizable', 'Panneaux redimensionnables par poignee. Utile pour layouts 2-3 colonnes.'],
  ['Layout', 'progress', 'Progress', 'Barre de progression determinee (0-100%). Animation linear 200ms.'],
  ['Layout', 'skeleton', 'Skeleton', 'Placeholder de chargement. Pulse 1.5s. Cacher des l\'arrivee de la donnee.'],

  ['Navigation', 'breadcrumb', 'Breadcrumb', 'Fil d\'Ariane. Separator par defaut ">". Truncate sur overflow.'],
  ['Navigation', 'command', 'Command (CMD-K)', 'Palette de commandes avec recherche fuzzy. Shortcut Cmd/Ctrl+K conventionnel.'],
  ['Navigation', 'context-menu', 'ContextMenu', 'Menu au clic droit. Support submenus, raccourcis clavier, checkbox/radio items.'],
  ['Navigation', 'dropdown-menu', 'DropdownMenu', 'Menu attache a un trigger (bouton). Equivalent clic gauche du ContextMenu.'],
  ['Navigation', 'menubar', 'Menubar', 'Barre de menus (style desktop app). Rare en web — reserver aux apps riches.'],
  ['Navigation', 'navigation-menu', 'NavigationMenu', 'Nav principale avec dropdowns riches. Utilise pour site/app publique, pas dashboard.'],
  ['Navigation', 'pagination', 'Pagination', 'Navigation de pages. Boutons prev/next + numeros. Ellipsis si > 7 pages.'],
  ['Navigation', 'sidebar', 'Sidebar', 'Barre laterale dashboard. Collapsible, sticky, support groups. Composant integre a DashboardLayout.'],

  ['Data', 'avatar', 'Avatar', 'Photo de profil. Fallback initiales si image absente. Tailles sm/md/lg.'],
  ['Data', 'badge', 'Badge', 'Label d\'etat (success/warning/error/info/default). Forme pill, taille unique.'],
  ['Data', 'table', 'Table', 'Table semantique. Header + Body + Footer. Pas de tri/pagination embarques — compose avec TanStack Table.'],
  ['Data', 'calendar', 'Calendar', 'Selecteur de date (react-day-picker). Single/range/multiple. Locale fr par defaut.'],
  ['Data', 'chart', 'Chart', 'Wrapper Recharts v3. ChartContainer fournit legend/tooltip. Voir stories pour examples line/bar/area.'],
  ['Data', 'carousel', 'Carousel', 'Slider images/cards horizontal. Autoplay optionnel, swipe tactile, dots indicator.']
];

function loadStorybookIndex() {
  try {
    const raw = readFileSync(storybookIndex, 'utf8');
    const idx = JSON.parse(raw);
    const byComponent = new Map();
    for (const entry of Object.values(idx.entries || {})) {
      if (entry.type !== 'story') continue;
      const [cat, name] = entry.title.split('/');
      const key = (name || '').toLowerCase();
      if (!byComponent.has(key)) byComponent.set(key, []);
      byComponent.get(key).push(entry.name);
    }
    return byComponent;
  } catch {
    return new Map();
  }
}

const stories = loadStorybookIndex();

function renderDoc({ category, name, label, purpose, storyNames }) {
  const variantsList = storyNames && storyNames.length
    ? storyNames.map((s) => `- \`${s}\``).join('\n')
    : '- (stories a ajouter)';

  return `# ${label}

> ${category} · \`${name}\` · Foundation OS DS

## Role

${purpose}

## Import

\`\`\`tsx
import { ${label.replace(/\s.*$/, '')} } from '@foundation-os/design-system';
\`\`\`

## Variants / Stories disponibles

${variantsList}

## Usage

Consulter le Storybook hebergé pour le rendu interactif :
https://storybook.supernova.io/design-systems/790241/alias/foundation-os-ds/index.html

## Do

- Respecter le pattern semantique (header/body/footer quand applicable).
- Utiliser les props de variants exposees plutot que des overrides CSS.
- Associer un label accessible (\`aria-label\` ou \`<Label htmlFor>\`) a tout controle sans texte visible.
- Tester au clavier : Tab, Shift+Tab, Enter/Space, Escape, ArrowKeys si pertinent.

## Don't

- Reimplementer un composant equivalent avec du Tailwind brut — enrichir celui-ci.
- Detourner le composant vers un usage hors-perimetre (ex: utiliser Tooltip comme Popover interactif).
- Remplacer une icone Lucide par une autre librairie iconographique.

## Code

Source : \`modules/design-system/src/components/ui/${name}.tsx\`
Stories : \`modules/design-system/src/components/ui/${name}.stories.tsx\`

## Voir aussi

- Foundations · Colors · Typography · Spacing · Radius · Motion · Icons
`;
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

let written = 0;
for (const [category, name, label, purpose] of MANIFEST) {
  const storyNames = stories.get(name.replace(/-/g, '').toLowerCase()) || stories.get(name) || [];
  const md = renderDoc({ category, name, label, purpose, storyNames });
  const file = join(outDir, `${String(written + 1).padStart(2, '0')}-${name}.md`);
  writeFileSync(file, md, 'utf8');
  written++;
}

console.log(`[gen-component-docs] ${written} fichiers ecrits dans docs-supernova/components/`);
console.log(`[gen-component-docs] manifest : ${MANIFEST.length} composants`);
