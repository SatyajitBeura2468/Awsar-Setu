import { defineConfig, devices } from "@playwright/test";

const pnpmCommand =
  process.platform === "win32"
    ? "node_modules\\.bin\\next.cmd dev -H 127.0.0.1 -p 3000"
    : "pnpm dev -- -H 127.0.0.1 -p 3000";

const webServer =
  process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1"
    ? undefined
    : {
        command: pnpmCommand,
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      };

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
