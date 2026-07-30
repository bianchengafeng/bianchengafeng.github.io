import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        about: fileURLToPath(new URL("./about/index.html", import.meta.url)),
        projects: fileURLToPath(new URL("./projects/index.html", import.meta.url)),
        writing: fileURLToPath(new URL("./writing/index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url))
      }
    }
  }
});
