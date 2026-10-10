import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests', retries:0, workers:1, timeout:30_000,
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',launchOptions:{executablePath:process.env.NEURALLAB_CHROMIUM}},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
  webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:40_000}
});
