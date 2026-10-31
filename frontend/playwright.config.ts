import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.MANTALINK_BASE_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
});
