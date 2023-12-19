import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        export: resolve(__dirname, "src/export.js"),
        import: resolve(__dirname, "src/import.js"),
        update: resolve(__dirname, "src/update.js"),
      },
    },
  },
});
