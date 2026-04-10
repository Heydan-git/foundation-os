/**
 * Foundation OS — Design System
 * Vitest test setup — matchers jest-dom + jest-axe + cleanup auto.
 */
import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

// Etend Vitest expect avec jest-axe `toHaveNoViolations`
expect.extend(toHaveNoViolations)

// Cleanup auto du DOM apres chaque test (unmount components)
afterEach(() => {
  cleanup()
})
