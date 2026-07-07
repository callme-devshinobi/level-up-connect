// Standalone Vite config that produces a plain static SPA of the Flow game,
// separate from the TanStack Start build. Run with:
//   bun run build:static
// Output: dist-static/  → upload the contents to cPanel public_html.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "static-src"),
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist-static"),
    emptyOutDir: true,
    target: "es2020",
  },
});
