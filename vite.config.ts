import {defineConfig} from 'vite'
import * as process from "process";
import {resolveGlobals, wpBlock} from "./bin/resolver";

import * as path from "node:path";

export const SOURCEFOLDER = 'src'
export const BUILDFOLDER = 'build'
export const ENTRYPOINT = 'index.tsx'

const blockConfig = {
    name: path.basename(process.cwd()),
    sourcePath: path.resolve(__dirname, SOURCEFOLDER),
    distPath: path.resolve(__dirname, BUILDFOLDER),
    externals: ['@wordpress/block-editor', '@wordpress/blocks', "react"]
}

// https://vitejs.dev/config/
export default defineConfig({
    root: '.',
    base: `/wp-content/plugins/${blockConfig.name}/${BUILDFOLDER}/`,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
        wpBlock(blockConfig)
    ],
    server: {
        hmr: true,
        watch: {
            usePolling: true
        }
    },
    build: {
        target: "es2016",
        cssMinify: true,
        minify: "terser",
        terserOptions: {
            ecma: 2016,
            mangle: true,
            compress: true,
        },
        cssCodeSplit: false,
        emptyOutDir: true,
        sourcemap: true,
        assetsInlineLimit: 0,
        watch: {
            include: [SOURCEFOLDER+'/**', 'public/**']
        },
        rollupOptions: {
            input: {
                [blockConfig.name]: path.resolve(__dirname, SOURCEFOLDER, ENTRYPOINT)
            },
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == blockConfig.name + ".css") return "style.css";
                    return assetInfo.name;
                },
                format: 'iife',
                chunkFileNames: '[name].[ext]',
                entryFileNames: blockConfig.name + '.js',
                dir: path.resolve(__dirname, BUILDFOLDER),
                globals: resolveGlobals,
            },
            external: blockConfig.externals,
        },
    },
})
