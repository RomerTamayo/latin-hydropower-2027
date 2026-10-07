import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Rutas relativas fundamentales para servidores universitarios
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        resumenes: resolve(__dirname, 'resumenes.html'),
        inscripciones: resolve(__dirname, 'inscripciones.html'),
        programa: resolve(__dirname, 'programa.html'),
        conferencistas: resolve(__dirname, 'conferencistas.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
