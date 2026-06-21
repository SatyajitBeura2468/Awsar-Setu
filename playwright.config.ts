import { defineConfig, devices } from "@playwright/test";

const pnpmCommand =
  process.platform === "win32"
    ? "C:\\Users\\subha\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\bin\\pnpm.cmd dev"
    : "pnpm dev";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: pnpmCommand,
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
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
