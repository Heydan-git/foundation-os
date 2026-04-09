/**
 * Foundation OS — Design System
 * Storybook 8 manager config — theme dark Void Glass pour la sidebar et la toolbar
 */
import { addons } from 'storybook/internal/manager-api'
import { create } from 'storybook/internal/theming/create'

const voidGlassTheme = create({
  base: 'dark',
  brandTitle: 'Foundation OS — Design System',
  brandUrl: 'https://foundation-os.vercel.app/',
  appBg: '#06070C',
  appContentBg: '#06070C',
  appPreviewBg: '#06070C',
  appBorderColor: 'rgba(255, 255, 255, 0.055)',
  appBorderRadius: 8,
  barBg: '#06070C',
  barTextColor: 'rgba(255, 255, 255, 0.42)',
  barSelectedColor: '#5EEAD4',
  colorPrimary: '#5EEAD4',
  colorSecondary: '#5EEAD4',
  textColor: 'rgba(255, 255, 255, 0.88)',
  textInverseColor: '#06070C',
  textMutedColor: 'rgba(255, 255, 255, 0.42)',
  fontBase: "'Figtree', system-ui, sans-serif",
  fontCode: "'JetBrains Mono', 'Fira Code', monospace"
})

addons.setConfig({
  theme: voidGlassTheme
})
