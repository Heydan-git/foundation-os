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

const sd = new StyleDictionary({
  source: [resolve(rootDir, 'tokens/source/**/*.json')],
  platforms: {
    css: {
      transformGroup: 'css',
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
      transformGroup: 'js',
      buildPath: resolve(rootDir, 'tokens/build/') + '/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm'
        }
      ]
    },
    json: {
      transformGroup: 'js',
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
