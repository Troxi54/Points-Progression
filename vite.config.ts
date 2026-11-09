import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

/// <reference types="vitest/config" />

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === "analyze"
      ? [
          visualizer({
            filename: "stats.html",
            gzipSize: true,
            brotliSize: true,
            sourcemap: true,
          }),
        ]
      : []),
  ],
  base: "./",
  server: {
    port: 5173,
    host: "127.0.0.1",
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 600,
    ...(mode === "analyze" && {
      sourcemap: true,
    }),
  },
  test: {
    environment: "jsdom",
    include: ["**/*.test.ts"],
    benchmark: {
      include: ["benchmarks/**/*.bench.ts"],
    },
  },
}));
