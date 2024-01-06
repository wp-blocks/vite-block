import {defineConfig} from 'vite'
import * as process from "process";
import {resolveGlobals, wpBlock} from "./bin/resolver";

import * as path from "node:path";

const blockConfig = {
    name: path.basename(process.cwd()),
    sourcePath: path.resolve(__dirname, "src"),
    distPath: path.resolve(__dirname, "build"),
    externals: ['@wordpress/block-editor', '@wordpress/blocks', "react"]
}

// https://vitejs.dev/config/
export default defineConfig({
    define: {"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`},
    root: '.',
    base: `/wp-content/plugins/${blockConfig.name}/build/`,
    mode: 'development',
    plugins: [wpBlock(blockConfig)],
    build: {
        target: "es2015",
        minify: true,
        cssCodeSplit: false,
        emptyOutDir: true,
        assetsInlineLimit: 0,
        watch: {
            include: ['src/**', 'public/**']
        },
        rollupOptions: {
            input: {
                'vite-block': path.resolve(__dirname, "src/index.tsx")
            },
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == "index.css") return "style.css";
                    return assetInfo.name;
                },
                format: 'iife',
                chunkFileNames: '[name].[ext]',
                entryFileNames: blockConfig.name + '.js',
                dir: path.resolve(__dirname, 'build'),
                globals: resolveGlobals,
            },
            external: blockConfig.externals,
        },
    },
})
