/**
 * Foundation OS — Design System
 * Vitest config pour les tests unitaires + a11y des primitives.
 *
 * Environment: jsdom (DOM APIs + window pour React Testing Library + axe)
 * Setup     : test/setup.ts (jest-dom matchers + jest-axe + afterEach cleanup)
 * CSS       : CSS Modules en mode non-scoped pour des classNames predictibles
 *             dans les tests (queryByClassName, etc.)
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    include: ['src/**/*.test.{ts,tsx}']
  }
})
