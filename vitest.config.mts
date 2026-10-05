import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/server/server-only-stub.ts", import.meta.url)),
    },
  },
  test: { include: ["src/**/*.test.ts"], testTimeout: 30_000 },
});
