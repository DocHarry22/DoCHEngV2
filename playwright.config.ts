import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/browser-results.json" }],
  ],
  use: {
    baseURL: "http://localhost:43187",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "tablet",
      use: { ...devices["iPad Pro 11"], defaultBrowserType: "chromium" },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start -p 43187",
    url: "http://localhost:43187/api/health",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DOCHENG_DATA_DIR: resolve("../.e2e-data"),
      DOCHENG_ORIGIN: "http://localhost:43187",
      RESEND_API_KEY: "",
      HOSTINGER_MAIL_TOKEN: "",
      DOCHENG_BILLING_MODE: "off",
    },
  },
});
