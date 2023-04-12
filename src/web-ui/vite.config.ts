import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigpaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpaths(), eslint()],
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: "../miniserve/web-ui/",
  }
})
