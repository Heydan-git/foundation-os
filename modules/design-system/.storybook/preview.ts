/**
 * Foundation OS — Design System
 * Storybook 8 preview config
 *
 * - Importe tokens.css globaux (CSS vars Void Glass --fos-*)
 * - Charge la police Figtree depuis Google Fonts (Storybook = dev tool, OK)
 * - Applique le fond Void Glass #06070C par defaut a l'iframe preview
 * - Active addon-a11y avec regle color-contrast obligatoire
 */
import type { Preview } from '@storybook/react'

// CSS vars Void Glass (--fos-*) — output du build Style Dictionary
// (relative path car self-import workspace pas garanti pour fichiers non-exports)
import '../tokens/build/tokens.css'

// Charge Figtree + JetBrains Mono depuis Google Fonts pour la preview
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
document.head.appendChild(fontLink)

// Applique le fond Void Glass et la typo par defaut a l'iframe Storybook
const baseStyles = document.createElement('style')
baseStyles.textContent = `
  body {
    background: var(--fos-color-bg-canvas, #06070C);
    color: var(--fos-color-text-primary, rgba(255, 255, 255, 0.88));
    font-family: var(--fos-font-family-sans, 'Figtree', system-ui, sans-serif);
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`
document.head.appendChild(baseStyles)

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'void-glass',
      values: [
        { name: 'void-glass', value: '#06070C' },
        { name: 'white', value: '#FFFFFF' }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    layout: 'padded'
  }
}

export default preview
