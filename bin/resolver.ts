import * as path from 'path';
import react from '@vitejs/plugin-react'
import * as fs from "fs/promises";

const WORDPRESS_NAMESPACE = "@wordpress/";
const NSEXCLUDE = ["icons", "interface"];
export const wordpressMatch = new RegExp(`^${WORDPRESS_NAMESPACE}(?!(${NSEXCLUDE.join("|")})).*$`);

const external: Record<string, string> = {
    jquery: "window.jQuery",
    "lodash-es": "window.lodash",
    lodash: "window.lodash",
    moment: "window.moment",
    react: "window.React",
    "react-dom": "window.ReactDOM",
    "@babel/runtime/regenerator": "window.regeneratorRuntime",
};


const wpModules = [
    'a11y',
    'annotations',
    'api-fetch',
    'autop',
    'blob',
    'block-directory',
    'block-editor',
    'block-library',
    'block-serialization-default-parser',
    'blocks',
    'components',
    'compose',
    'core-data',
    'customize-widgets',
    'data',
    'data-controls',
    'date',
    'deprecated',
    'dom',
    'dom-ready',
    'edit-post',
    'edit-site',
    'edit-widgets',
    'editor',
    'element',
    'escape-html',
    'format-library',
    'hooks',
    'html-entities',
    'i18n',
    'is-shallow-equal',
    'keyboard-shortcuts',
    'keycodes',
    'list-reusable-blocks',
    'media-utils',
    'notices',
    'nux',
    'plugins',
    'preferences',
    'preferences-persistence',
    'primitives',
    'priority-queue',
    'redux-routine',
    'reusable-blocks',
    'rich-text',
    'server-side-render',
    'shortcode',
    'style-engine',
    'token-list',
    'url',
    'viewport',
    'warning',
    'widgets',
    'wordcount',
];

/**
 * Returns a custom global resolver that maps external libraries and objects to their `window` counterparts
 */
export function resolveGlobals(id: string) {

    if (id in external && external[id]) {
        return external[id];
    }

    if (wordpressMatch.test(id)) {
        return id
            .replace(new RegExp(`^${WORDPRESS_NAMESPACE}`), "window.wp.")
            .replace(/\//g, ".")
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }
}

/**
 * Generates a random hash.
 *
 * @return {string} The randomly generated hash.
 */
function randomHash() {
    return Math.random().toString(36).substring(2, 12)
}

function getModuleNames(modules: string[]): string[] {
    return modules.map(module => {
        if (module.startsWith('@wordpress/')) {
            return `wp-${module.split('/')[1]}`;
        }
        return module;
    });
}

/**
 * Generates a PHP file with an array containing dependencies and a random version hash.
 *
 * @param {Array<string>} externals - An array of strings representing the externals.
 * @return {string} - A PHP file content with an array of dependencies and a random version hash.
 */
function generatePhpFile(externals) {
    const dependencies = getModuleNames(externals)
    // generate a random version hash of 20 chars
    const version = randomHash() + randomHash()
    return `<?php return array('dependencies' => array("${dependencies.join('","')}"), 'version' => '${version}');`;
}

/**
 * Generates a WordPress block with the given configuration.
 *
 * @param {Object} config - The configuration object for the block.
 * @param {string} config.name - The name of the block.
 * @param {string} [config.sourceFolder="src"] - The source folder for the block.
 * @param {string} [config.distFolder="build"] - The destination folder for the block.
 * @param {Array} [config.externals=[]] - An array of external dependencies for the block.
 * @return {Array} An array containing the plugin tools and plugin React components.
 */
export const wpBlock = ({name = "vite-block", sourceFolder = "src", distFolder = "build", externals = []}) => {

    const rootPath = path.resolve(process.cwd());
    const destPath = path.resolve(rootPath, distFolder);

    const pluginTools = {
        name: name + "-block-copy",
        buildStart() {
            this.addWatchFile(path.resolve(rootPath, "*.js,*.cjs,*.mjs,*.jsx,*.ts,*.tsx,*.css,*.scss,*.less,*.php"));
        },
        async closeBundle() {
            const phpFile = generatePhpFile(externals);
            await fs.writeFile(`${destPath}/${name}.asset.php`, phpFile);
        },
    };

    const pluginReact = react({
        jsxRuntime: "classic",
        jsxImportSource: "@wordpress/element"
    });

    return [pluginTools, pluginReact];
};
