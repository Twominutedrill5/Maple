import { defineConfig } from "vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        services: resolve(import.meta.dirname, "services.html"),
        gallery: resolve(import.meta.dirname, "gallery.html"),
        about: resolve(import.meta.dirname, "about.html"),
        contact: resolve(import.meta.dirname, "contact.html"),
      },
    },
  },
});
