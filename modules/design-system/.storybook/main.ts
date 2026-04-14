import { createRequire } from "node:module";
/**
 * Foundation OS — Design System
 * Storybook 8 main config
 *
 * Framework : @storybook/react-vite (React 18 + Vite 5)
 * Stories   : src/**\/*.stories.@(tsx|ts|jsx|js|mdx)
 * Addons    : essentials (controls, viewport, backgrounds, docs) + a11y (axe-core)
 */
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import path, { dirname, join } from 'path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(tsx|ts|jsx|js|mdx)',
    '../../app/src/components/**/*.stories.@(tsx|ts|jsx|js|mdx)'
  ],

  addons: [getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-docs")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, '../../app/src')
    }
    return config
  }
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
