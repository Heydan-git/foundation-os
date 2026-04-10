/**
 * Foundation OS — Design System
 * WCAG AA contrast check pour les paires SEMANTIC texte/fond Void Glass.
 *
 * Lit tokens/build/tokens.json (flat output, references resolues).
 * Valide les paires semantic critiques (pas les primitives).
 * Exit 1 si une paire < 4.5:1 (text normal) ou < 3:1 (text large).
 *
 * Prerequis : npm run build:tokens execute avant.
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensPath = resolve(__dirname, '../tokens/build/tokens.json')

let tokens
try {
  tokens = JSON.parse(readFileSync(tokensPath, 'utf8'))
} catch (err) {
  console.error('[FAIL] tokens/build/tokens.json introuvable.')
  console.error('       Lance `npm run build:tokens` avant `check:contrast`.')
  process.exit(1)
}

/** Parse #RRGGBB, #RRGGBBAA, or rgba()/rgb() into {r,g,b,a} */
function parseColor(css) {
  const s = String(css).trim()
  if (s.startsWith('#')) {
    const hex = s.slice(1)
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1
      }
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255
      }
    }
  }
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (!m) throw new Error(`Cannot parse color: "${css}"`)
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] !== undefined ? Number(m[4]) : 1
  }
}

/** Alpha composite fg (potentiellement translucide) sur bg (opaque) */
function composite(fg, bg) {
  const a = fg.a
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1
  }
}

/** Luminance relative WCAG */
function luminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrast(c1, c2) {
  const l1 = luminance(c1)
  const l2 = luminance(c2)
  const bright = Math.max(l1, l2)
  const dark = Math.min(l1, l2)
  return (bright + 0.05) / (dark + 0.05)
}

// Keys from tokens.json (flat, CamelCase) — semantic tokens only
const bg = parseColor(tokens.ColorBgCanvas)
const surface = parseColor(tokens.ColorBgSurface)
const textPrimary = parseColor(tokens.ColorTextPrimary)
const textMuted = parseColor(tokens.ColorTextMuted)
const accent = parseColor(tokens.ColorAccentBrand)
const statusWip = parseColor(tokens.ColorStatusWip)
const statusPaused = parseColor(tokens.ColorStatusPaused)
const statusParking = parseColor(tokens.ColorStatusParking)

// Composite les colors translucides sur leur fond reel
const textPrimaryOnBg = composite(textPrimary, bg)
const textMutedOnBg = composite(textMuted, bg)
const surfaceOnBg = composite(surface, bg)
const textPrimaryOnSurface = composite(textPrimary, surfaceOnBg)
const textMutedOnSurface = composite(textMuted, surfaceOnBg)

const AA_NORMAL = 4.5
const AA_LARGE = 3.0

const pairs = [
  { name: 'text.primary  on bg.canvas  ', fg: textPrimaryOnBg, bg, min: AA_NORMAL, level: 'AA normal' },
  { name: 'text.muted    on bg.canvas  ', fg: textMutedOnBg, bg, min: AA_LARGE, level: 'AA large (secondaire)' },
  { name: 'text.primary  on bg.surface ', fg: textPrimaryOnSurface, bg: surfaceOnBg, min: AA_NORMAL, level: 'AA normal' },
  { name: 'text.muted    on bg.surface ', fg: textMutedOnSurface, bg: surfaceOnBg, min: AA_LARGE, level: 'AA large' },
  { name: 'accent.brand  on bg.canvas  ', fg: accent, bg, min: AA_LARGE, level: 'AA large (focus ring)' },
  { name: 'status.wip    on bg.canvas  ', fg: statusWip, bg, min: AA_LARGE, level: 'AA large (status)' },
  { name: 'status.paused on bg.canvas  ', fg: statusPaused, bg, min: AA_LARGE, level: 'AA large (status)' },
  { name: 'status.parking on bg.canvas ', fg: statusParking, bg, min: AA_LARGE, level: 'AA large (status)' }
]

console.log('\n[WCAG Contrast — Void Glass semantic layer]\n')

let failures = 0
for (const { name, fg, bg, min, level } of pairs) {
  const ratio = contrast(fg, bg)
  const pass = ratio >= min
  const tag = pass ? '[OK]  ' : '[FAIL]'
  const ratioStr = ratio.toFixed(2).padStart(5, ' ')
  console.log(`  ${tag} ${name}  ${ratioStr}:1  (min ${min}:1 — ${level})`)
  if (!pass) failures++
}

console.log('')
if (failures > 0) {
  console.error(`[FAIL] ${failures}/${pairs.length} paire(s) sous le seuil WCAG AA.`)
  process.exit(1)
}
console.log(`[OK] ${pairs.length}/${pairs.length} paires semantic passent WCAG AA.`)
