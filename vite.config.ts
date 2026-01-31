import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  base: "/Points-Progression/",
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "stats.html",
          gzipSize: true,
          brotliSize: true
        })
      ]
    }
  }
});
