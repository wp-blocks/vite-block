import { defineConfig } from 'vite'
import * as process from "process";
import {resolveGlobals, wpBlock} from "./bin/resolver";

import * as path from "node:path";
import {configs} from "@typescript-eslint/eslint-plugin";



const blockConfig = {
    name: path.basename(process.cwd()),
    sourcePath: path.resolve(__dirname, "src"),
    distPath: path.resolve(__dirname, "dist"),
}

// https://vitejs.dev/config/
export default defineConfig({
  define: { "process.env.NODE_ENV": `"${process.env.NODE_ENV}"` },
  root: '.',
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
        entryFileNames: blockConfig.name + '.js',
        dir: path.resolve(__dirname, 'build'),
        globals: resolveGlobals,
      },
      external: [ '@wordpress/block-editor', '@wordpress/blocks', "react" ],
    },
    target: "es2015",
    minify: true,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
  plugins: [wpBlock(blockConfig)],
})
