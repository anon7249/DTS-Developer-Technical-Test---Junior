import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js",
    globals: true,
    css: false,
    exclude: [...configDefaults.exclude, "node_modules"],
  },
});
