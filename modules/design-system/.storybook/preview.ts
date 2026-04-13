/**
 * Foundation OS — Design System
 * Storybook 8 preview config
 *
 * - Importe globals.css (Tailwind + tokens + bridge shadcn vars)
 * - Charge Figtree + JetBrains Mono depuis Google Fonts
 * - Fond dark #030303 (ds-surface-0) par defaut
 * - Active addon-a11y avec regle color-contrast obligatoire
 */
import type { Preview } from '@storybook/react'

// Globals DS : Tailwind + tokens + bridge shadcn vars (dark-only)
import '../src/styles/globals.css'

// Charge Figtree + JetBrains Mono depuis Google Fonts pour la preview
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
document.head.appendChild(fontLink)

// Applique le fond et la typo par defaut a l'iframe Storybook
const baseStyles = document.createElement('style')
baseStyles.textContent = `
  body {
    background: var(--color-bg-canvas, #030303);
    color: var(--color-text-primary, rgba(255,255,255,1));
    font-family: var(--font-family-sans, 'Figtree', system-ui, sans-serif);
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
      default: 'dark',
      values: [
        { name: 'dark', value: '#030303' },
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
