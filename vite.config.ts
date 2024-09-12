import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import circleDependency from 'vite-plugin-circular-dependency';

export default defineConfig({
  root: './src',
  base: './',
  resolve:{
    alias:{
      '@' : resolve(__dirname, './src')
    },
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: ['src/index.html', 'src/Worker/gameLoop.ts', 'src/Utils/MapRenderer/index.html', 'src/Utils/MixViewer/index.html',],
    }
  },
  plugins: [
    circleDependency({outputFilePath: './circleDep'})
  ],
  test: {
    dir: './tests'
  },
});
