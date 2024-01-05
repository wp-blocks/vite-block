import { defineConfig } from 'vite'
import * as process from "process";
import {resolveGlobals, wpBlock} from "./bin/resolver";

import * as path from "node:path";

const pluginName = path.basename(process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  define: { "process.env.NODE_ENV": `"${process.env.NODE_ENV}"` },
  root: 'src',
  base: "/",
  mode: 'development',
  appType: 'custom',
  build: {
    watch: {
      include: ['src/**', 'public/**']
    },
    rollupOptions: {
      input: {
        'vite-block': path.resolve(__dirname, "src/index.tsx")
      },
      output: {
        format: 'iife',
        chunkFileNames: '[name].[ext]',
        entryFileNames: pluginName + '.js',
        dir: path.resolve(__dirname, 'build'),
        globals: resolveGlobals,
      },
      external: [ '@wordpress/block-editor', '@wordpress/blocks', "react" ],
    },
    target: "es2020",
    minify: true,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
  plugins: [wpBlock()],
})
