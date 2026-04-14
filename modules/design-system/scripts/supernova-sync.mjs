#!/usr/bin/env node
// Sync complet Foundation OS DS -> Supernova via SDK.
// - Cree 46 Components (nom + description + status Healthy + isDocumented)
// - Cree 46 Doc pages sous le groupe Components
// - Link Component.documentationLink -> Doc page
// - Idempotent : si un Component existe deja, on update au lieu de creer.
//
// Requis : SUPERNOVA_TOKEN dans env (.env.local).
// Lancer : node scripts/supernova-sync.mjs

import 'dotenv/config';
import pkg from '@supernovaio/sdk';
const { Supernova } = pkg;
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const MANIFEST = [
  ['Form', 'button', 'Button', 'Action principale — declenche une operation. Variants default/secondary/outline/ghost/destructive/link, sizes sm/default/lg/icon.'],
  ['Form', 'input', 'Input', 'Champ texte simple. Types text/email/password/number/search. Etats focus/disabled/invalid.'],
  ['Form', 'textarea', 'Textarea', 'Zone texte multi-lignes. Resize controle, focus-ring DS.'],
  ['Form', 'label', 'Label', 'Libelle associe a un champ via htmlFor.'],
  ['Form', 'checkbox', 'Checkbox', 'Case a cocher binaire ou indeterminee.'],
  ['Form', 'switch', 'Switch', 'Bascule on/off animee, label obligatoire.'],
  ['Form', 'toggle', 'Toggle', 'Bouton bascule visuel (pressed/unpressed). Toolbar formatting.'],
  ['Form', 'toggle-group', 'ToggleGroup', 'Groupe de toggles mutuellement exclusifs ou multiples.'],
  ['Form', 'radio-group', 'RadioGroup', 'Selecteur exclusif parmi N options.'],
  ['Form', 'select', 'Select', 'Menu deroulant de selection. Search, groupes, separators.'],
  ['Form', 'slider', 'Slider', 'Curseur numerique 1D ou range.'],
  ['Form', 'input-otp', 'InputOTP', 'Saisie code a usage unique (OTP/2FA).'],
  ['Form', 'form', 'Form', 'Wrapper React Hook Form + Zod. FormField, FormItem, FormLabel, FormMessage.'],

  ['Feedback', 'alert', 'Alert', 'Message inline (info/warning/error/success). Non-dismiss par defaut.'],
  ['Feedback', 'alert-dialog', 'AlertDialog', 'Confirmation destructive bloquante. Action + Cancel obligatoires.'],
  ['Feedback', 'dialog', 'Dialog', 'Modale generique overlay. Focus trap, Escape ferme.'],
  ['Feedback', 'drawer', 'Drawer', 'Panneau glissant mobile-first (bottom sheet).'],
  ['Feedback', 'sheet', 'Sheet', 'Panneau lateral (left/right/top/bottom).'],
  ['Feedback', 'popover', 'Popover', 'Boite flottante attachee a un trigger. Non-modale.'],
  ['Feedback', 'tooltip', 'Tooltip', 'Aide contextuelle au hover/focus. Delai 300ms.'],
  ['Feedback', 'hover-card', 'HoverCard', 'Preview riche au hover (profil, lien).'],
  ['Feedback', 'sonner', 'Sonner', 'Toast non-bloquant. Success/info/warning/error. Auto-dismiss 4s.'],

  ['Layout', 'card', 'Card', 'Conteneur de groupe semantique. Header/Content/Footer.'],
  ['Layout', 'accordion', 'Accordion', 'Liste repliable. Mode single ou multiple.'],
  ['Layout', 'collapsible', 'Collapsible', 'Bloc repliable isole (1 trigger, 1 content).'],
  ['Layout', 'tabs', 'Tabs', 'Onglets horizontaux. Navigation clavier ArrowLeft/Right.'],
  ['Layout', 'separator', 'Separator', 'Ligne de separation 1px, --ds-border-subtle.'],
  ['Layout', 'aspect-ratio', 'AspectRatio', 'Preserve le ratio d\'un contenu. Evite layout shifts.'],
  ['Layout', 'scroll-area', 'ScrollArea', 'Zone scrollable avec scrollbar personnalisee.'],
  ['Layout', 'resizable', 'Resizable', 'Panneaux redimensionnables par poignee.'],
  ['Layout', 'progress', 'Progress', 'Barre de progression determinee (0-100%).'],
  ['Layout', 'skeleton', 'Skeleton', 'Placeholder de chargement. Pulse 1.5s.'],

  ['Navigation', 'breadcrumb', 'Breadcrumb', 'Fil d\'Ariane. Separator ">" par defaut.'],
  ['Navigation', 'command', 'Command', 'Palette de commandes avec recherche fuzzy. Cmd/Ctrl+K.'],
  ['Navigation', 'context-menu', 'ContextMenu', 'Menu au clic droit. Submenus, raccourcis, checkbox/radio.'],
  ['Navigation', 'dropdown-menu', 'DropdownMenu', 'Menu attache a un trigger bouton.'],
  ['Navigation', 'menubar', 'Menubar', 'Barre de menus style desktop app.'],
  ['Navigation', 'navigation-menu', 'NavigationMenu', 'Nav principale avec dropdowns riches.'],
  ['Navigation', 'pagination', 'Pagination', 'Navigation de pages. Prev/next + numeros, ellipsis > 7 pages.'],
  ['Navigation', 'sidebar', 'Sidebar', 'Barre laterale dashboard. Collapsible, sticky, groups.'],

  ['DataDisplay', 'avatar', 'Avatar', 'Photo de profil. Fallback initiales si image absente.'],
  ['DataDisplay', 'badge', 'Badge', 'Label d\'etat (success/warning/error/info/default). Forme pill.'],
  ['DataDisplay', 'table', 'Table', 'Table semantique. Header + Body + Footer.'],
  ['DataDisplay', 'calendar', 'Calendar', 'Selecteur de date (react-day-picker). Single/range/multiple.'],
  ['DataDisplay', 'chart', 'Chart', 'Wrapper Recharts v3. ChartContainer legend/tooltip.'],
  ['DataDisplay', 'carousel', 'Carousel', 'Slider images/cards horizontal. Autoplay, swipe, dots.']
];

async function main() {
  if (!process.env.SUPERNOVA_TOKEN) {
    throw new Error('SUPERNOVA_TOKEN absent. Ajouter dans modules/design-system/.env.local');
  }
  const sn = new Supernova(process.env.SUPERNOVA_TOKEN);
  const me = await sn.me.me();
  const ws = (await sn.workspaces.workspaces(me.id))[0];
  const ds = (await sn.designSystems.designSystems(ws.id))[0];
  const av = await sn.versions.getActiveVersion(ds.id);
  const brands = await sn.brands.getBrands({ designSystemId: ds.id, versionId: av.id });
  const brandId = brands[0].id;
  const ident = { designSystemId: ds.id, versionId: av.id };
  const identWs = { ...ident, workspaceId: ws.id };

  console.log(`[supernova-sync] DS=${ds.id} version=${av.id} brand=${brandId}`);

  // NOTE : plan Supernova Free = limite 20 doc pages. On ne cree PAS de page par composant.
  // Les composants eux-memes sont illimites et remplissent la section Components de l'UI.

  // Index existing components by name
  const existingComponents = await sn.components.getComponents(ident);
  const componentsByName = new Map(existingComponents.map((c) => [c.name, c]));

  // Lookup component properties
  const props = await sn.components.getComponentProperties(ident);
  const propByCode = new Map(props.map((p) => [p.codeName, p]));
  const isDocumentedProp = propByCode.get('isDocumented');
  const statusProp = propByCode.get('status');
  const repoProp = propByCode.get('repository');

  let createdComponents = 0;
  let updated = 0;

  for (const [category, slug, label, description] of MANIFEST) {
    const name = label;

    // 1. Create or find Component
    let comp = componentsByName.get(name);
    if (!comp) {
      const local = sn.components.createLocalComponent(av.id, brandId);
      local.name = name;
      local.description = `[${category}] ${description}`;
      await sn.components.createComponent(ident, local);
      createdComponents++;
      console.log(`[component] + ${name}`);
    } else {
      console.log(`[component] = ${name}`);
    }

    // 2. Set status + isDocumented + repository
    const freshComponents = await sn.components.getComponents(ident);
    const freshComp = freshComponents.find((c) => c.name === name);
    if (freshComp) {
      try {
        if (statusProp) {
          await sn.components.updateComponentPropertyValue(ident, 'status-healthy', freshComp, statusProp);
        }
        if (isDocumentedProp) {
          await sn.components.updateComponentPropertyValue(ident, true, freshComp, isDocumentedProp);
        }
        if (repoProp) {
          const repoUrl = `https://github.com/Heydan-git/foundation-os/blob/main/modules/design-system/src/components/ui/${slug}.tsx`;
          await sn.components.updateComponentPropertyValue(ident, repoUrl, freshComp, repoProp);
        }
        updated++;
      } catch (e) {
        console.warn(`[prop]      ! ${name}: ${e.message}`);
      }
    }
  }

  console.log('\n[supernova-sync] RESUME');
  console.log(`  Components crees : ${createdComponents}`);
  console.log(`  Props maj        : ${updated}`);
}

main().catch((e) => {
  console.error('[supernova-sync] FAIL:', e.message);
  process.exit(1);
});
