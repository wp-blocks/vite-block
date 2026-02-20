// vite.config.js
import { defineConfig, wpBlock } from 'wp-vite-bundler';
import * as path from 'path';
import * as process from 'process';

const blockConfig = {
    name: path.basename(process.cwd()),
    sourceFolder: 'src',
    distFolder: 'build',
    externals: ['react', 'react-dom', 'lodash']
};

export default defineConfig({
    build: {
        cssMinify: true,
        emptyOutDir: true,
    },
    plugins: [
        wpBlock(blockConfig) // The module automatically sets inputs, externals, and copies files
    ]
});
