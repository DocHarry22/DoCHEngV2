import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    pool: "threads",
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    maxWorkers: 2,
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
