import { defineConfig } from 'vite';
import { join, parse, resolve } from "path";
import react from '@vitejs/plugin-react-swc';
import tsconfigpaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpaths(), eslint()],
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: "../fileporter/web-ui/",
    assetsInlineLimit: 8192, // 2x the original
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: entryPoints(
        "index.html",
        "404.html",
      ),
    },
  }
})


function entryPoints(...paths) {
  const entries = paths.map(parse).map(entry => {
    const { dir, base, name, ext } = entry;
    const key = join(dir, name);
    const path = resolve(__dirname, dir, base);
    return [key, path];
  });
  
  const config = Object.fromEntries(entries);
  return config;
}
