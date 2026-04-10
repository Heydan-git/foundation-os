import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:6007',
    screenshot: 'off',
  },
  webServer: {
    command: 'npx http-server storybook-static -p 6007 --silent',
    port: 6007,
    reuseExistingServer: !process.env.CI,
  },
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
})
