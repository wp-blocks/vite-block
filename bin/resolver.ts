import * as path from 'path';
import react from '@vitejs/plugin-react'
import * as fs from "fs";

const WORDPRESS_NAMESPACE = "@wordpress/";
const NSEXCLUDE = ["icons", "interface"];
export const wordpressMatch = new RegExp(`^${WORDPRESS_NAMESPACE}(?!(${NSEXCLUDE.join("|")})).*$`);

const external: Record<string, string> = {
    jquery: "window.jQuery",
    "jsx-runtime": "window.lodash",
    lodash: "window.lodash",
    moment: "window.moment",
    "react-dom": "window.ReactDOM",
    react: "window.React",
};

/**
 * Returns a custom global resolver that maps external libraries and objects to their `window` counterparts
 */
export function resolveGlobals(id: string) {

    if (Object.prototype.hasOwnProperty.call(external, id) && external[id]) {
        return external[id];
    }

    if (id in external) {
        return external[id];
    }

    console.log("resolveGlobals", id);

    if (wordpressMatch.test(id)) {
        return id
            .replace(new RegExp(`^${WORDPRESS_NAMESPACE}`), "wp.")
            .replace(/\//g, ".")
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    return "";
}

/**
 * Generates a random hash.
 *
 * @return {string} The randomly generated hash.
 */
function randomHash() {
    return Math.random().toString(36).substring(2, 22)
}

/**
 * Generates a PHP file with an array containing dependencies and a random version hash.
 *
 * @param {Array<string>} globs - An array of strings representing the dependencies.
 * @return {string} - A PHP file content with an array of dependencies and a random version hash.
 */
function generatePhpFile(globs) {
    // generate a random version hash of 20 chars
    const version = randomHash()
    return `<?php return array('dependencies' => array("${globs.join('","')}"), 'version' => '${version}');`;
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
export const wpBlock = ({name, sourceFolder = "src", distFolder = "build", externals = []}) => {

    const rootPath = path.resolve(__dirname, "..");
    const destPath = path.resolve(rootPath, distFolder);

    const pluginTools = {
        name: name + "-block-copy",
        buildStart() {
            this.addWatchFile(path.resolve(rootPath, "block.json"));
            this.addWatchFile(path.resolve(rootPath, "*.php"));
        },
        closeBundle() {
            const phpFile = generatePhpFile(externals);
            fs.writeFileSync(`${destPath}/${name}.asset.php`, phpFile);
        },
    };

    const pluginReact = react({
        jsxRuntime: "classic",
        jsxImportSource: "@wordpress/element"
    });

    return [pluginTools, pluginReact];
};
