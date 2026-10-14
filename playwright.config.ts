import { defineConfig, devices } from "@playwright/test";

const port = 4324;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  // Multi-route/viewport scenarios include real GPU setup; performance budgets remain separate.
  timeout: 90_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off"
  },
  webServer: {
    command: process.env.PLAYWRIGHT_USE_EXISTING_BUILD
      ? `npm run preview -- --ignore-lock --host 127.0.0.1 --port ${port}`
      : `npm run build && npm run preview -- --ignore-lock --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: process.env.PLAYWRIGHT_BROWSER === "webkit"
    ? [{ name: "webkit", use: { ...devices["Desktop Safari"] } }]
    : [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
