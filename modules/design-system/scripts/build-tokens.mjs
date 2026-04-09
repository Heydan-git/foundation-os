/**
 * Foundation OS — Design System
 * Build script : tokens DTCG source -> CSS variables + JS ESM export + JSON flat
 *
 * Lance via : npm run build:tokens (depuis modules/design-system/)
 * Source   : tokens/source/*.json (format DTCG W3C)
 * Output   : tokens/build/tokens.css + tokens.js + tokens.json
 */

import StyleDictionary from 'style-dictionary'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

/**
 * F-DS1-01 fix : preservation de la precision alpha des couleurs Void Glass.
 *
 * Probleme racine : les transforms predefinies `color/css` et `color/hex` parsent
 * les rgba() via tinycolor2 puis re-serialisent en arrondissant l'alpha :
 *   - `color/css` (group css)  : rgba(255,255,255,0.025) -> "rgba(255,255,255,0.03)"
 *   - `color/hex` (group js)   : rgba(255,255,255,0.025) -> "#ffffff06" (alpha 6/255 = 0.0235)
 *
 * Les couleurs Void Glass canoniques (`docs/design-system.md`) utilisent
 * `rgba(255,255,255,.025)` et `rgba(255,255,255,.055)`. Ces precisions doivent
 * etre preservees a travers tous les outputs (css + js + json).
 *
 * Solution : remplacer les transformGroups par des listes explicites SANS les
 * transforms color/css et color/hex. Les sources sont deja en CSS valide
 * (hex pour les opaques, rgba pour les translucides), donc aucune normalisation
 * n'est necessaire. Les semantic aliases resolvent vers le `value` post-transform
 * de leur primitive, qui reste exact car la transform color/* n'est plus dans
 * la pipeline.
 */
const cssTransformsPreserveAlpha = [
  'attribute/cti',
  'name/kebab',
  'time/seconds',
  'html/icon',
  'size/rem',
  'asset/url',
  'fontFamily/css',
  'cubicBezier/css',
  'strokeStyle/css/shorthand',
  'border/css/shorthand',
  'typography/css/shorthand',
  'transition/css/shorthand',
  'shadow/css/shorthand'
]

// Group `js` predefini = [attribute/cti, name/pascal, size/rem, color/hex]
// On omet color/hex pour preserver les rgba() avec alpha exact.
const jsTransformsPreserveAlpha = [
  'attribute/cti',
  'name/pascal',
  'size/rem'
]

const sd = new StyleDictionary({
  source: [resolve(rootDir, 'tokens/source/**/*.json')],
  platforms: {
    css: {
      transforms: cssTransformsPreserveAlpha,
      buildPath: resolve(rootDir, 'tokens/build/') + '/',
      prefix: 'fos',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: false
          }
        }
      ]
    },
    js: {
      transforms: jsTransformsPreserveAlpha,
      buildPath: resolve(rootDir, 'tokens/build/') + '/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm'
        }
      ]
    },
    json: {
      transforms: jsTransformsPreserveAlpha,
      buildPath: resolve(rootDir, 'tokens/build/') + '/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        }
      ]
    }
  }
})

try {
  await sd.buildAllPlatforms()
  console.log('\n[OK] Design tokens built -> tokens/build/ (tokens.css + tokens.js + tokens.json)')
} catch (err) {
  console.error('\n[FAIL] Style Dictionary build failed:')
  console.error(err)
  process.exit(1)
}
