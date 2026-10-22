import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4399',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4399 --ignore-lock',
    url: 'http://127.0.0.1:4399',
    reuseExistingServer: !process.env.CI,
  },
});
