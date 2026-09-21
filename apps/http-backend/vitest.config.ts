import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Limits test files to execution one after the other
    fileParallelism: false,
    maxWorkers: 1,
    // Target only integration test files
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
