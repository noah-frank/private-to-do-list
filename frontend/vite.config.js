import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      exclude: ["src/main.js", "src/App.vue", "vite.config.js"],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `
          @use '@/assets/scss/variables' as *;
          @use '@/assets/scss/mixins' as *;
          `,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3009",
        changeOrigin: true,
      },
    },
  },
});
