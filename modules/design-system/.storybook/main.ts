/**
 * Foundation OS — Design System
 * Storybook 8 main config
 *
 * Framework : @storybook/react-vite (React 18 + Vite 5)
 * Stories   : src/**\/*.stories.@(tsx|ts|jsx|js|mdx)
 * Addons    : essentials (controls, viewport, backgrounds, docs) + a11y (axe-core)
 */
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|ts|jsx|js|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}

export default config
