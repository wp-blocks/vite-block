import {defineConfig} from 'vite'
import * as process from "process";
import {resolveGlobals, wpBlock} from "./bin/resolver";

import * as path from "node:path";
import {wpCopy} from "./bin/copy";

export const HOST = 'http://localhost:8888' // or leave empty
export const SOURCEFOLDER = 'src'
export const BUILDFOLDER = 'build'
export const PUBLICFOLDER = 'public'
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
    base: `${HOST}/wp-content/plugins/${blockConfig.name}/${BUILDFOLDER}/`,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
        wpCopy(),
        wpBlock(blockConfig),
    ],
    server: {
        host: '0.0.0.0',
        port: 8880,
    },
    build: {
        cssMinify: true,
        minify: "terser",
        terserOptions: {
            mangle: true,
            compress: true,
        },
        cssCodeSplit: false,
        emptyOutDir: true,
        sourcemap: false,
        assetsInlineLimit: 0,
        watch: {
            include: [ "./"+SOURCEFOLDER + '/**',  "./"+PUBLICFOLDER + '/**']
        },
        rollupOptions: {
            input: {
                [blockConfig.name]: path.resolve(__dirname, SOURCEFOLDER, ENTRYPOINT)
            },
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == blockConfig.name + ".css") return "style.css";
                    return assetInfo.name as string;
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
