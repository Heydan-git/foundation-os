/**
 * Foundation OS — Design System
 * Storybook 8 manager config — theme dark pour la sidebar et la toolbar
 */
import { addons } from 'storybook/internal/manager-api'
import { create } from 'storybook/internal/theming/create'

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Foundation OS — Design System',
  brandUrl: 'https://foundation-os.vercel.app/',
  appBg: '#030303',
  appContentBg: '#030303',
  appPreviewBg: '#030303',
  appBorderColor: 'rgba(255, 255, 255, 0.055)',
  appBorderRadius: 8,
  barBg: '#030303',
  barTextColor: 'rgba(255, 255, 255, 0.42)',
  barSelectedColor: '#60a5fa',
  colorPrimary: '#60a5fa',
  colorSecondary: '#60a5fa',
  textColor: 'rgba(255, 255, 255, 0.88)',
  textInverseColor: '#030303',
  textMutedColor: 'rgba(255, 255, 255, 0.42)',
  fontBase: "'Figtree', system-ui, sans-serif",
  fontCode: "'JetBrains Mono', 'Fira Code', monospace"
})

addons.setConfig({
  theme: darkTheme
})
