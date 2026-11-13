import { defineConfig } from "vitest/config";

// Tests contre Supabase LOCAL uniquement (npx supabase start). Jamais contre un projet distant.
export default defineConfig({
  test: { include: ["tests/integration/**/*.integration.js"], testTimeout: 20000, fileParallelism: false },
});
