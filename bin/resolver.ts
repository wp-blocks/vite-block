import * as path from 'path';
import {globSync} from "glob";
import react from '@vitejs/plugin-react'
import * as fs from "fs";

const WORDPRESS_NAMESPACE = "@wordpress/";
const nsExclude = ["icons", "interface"];
export const wordpressMatch = new RegExp(`^${WORDPRESS_NAMESPACE}(?!(${nsExclude.join("|")})).*$`);

const external: Record<string, string> = {
    jquery: "window.jQuery",
    "lodash-es": "window.lodash",
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

    if (wordpressMatch.test(id)) {
        return id
            .replace(new RegExp(`^${WORDPRESS_NAMESPACE}`), "wp.")
            .replace(/\//g, ".")
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    return "";
}

function generatePhpFile(globs) {
    // generate a random version hash of 20 chars
    const version = Math.random().toString(36).substring(2, 22);
    return `<?php return array('dependencies' => array("${globs.join('","')}"), 'version' => '${version}');`;
}

export const wpBlock = ({name, sourceFolder = "src", distFolder = "build"}) => {

    const rootPath = path.resolve(__dirname, "..");
    const sourcePath = path.resolve(rootPath, sourceFolder);
    const destPath = path.resolve(rootPath, distFolder);

    const pluginCopy = {
        name: "vite-wordpress-copy",
        buildStart() {
            this.addWatchFile(path.resolve(rootPath, "block.json"));
            this.addWatchFile(path.resolve(rootPath, sourceFolder + "/*.php"));
        },
        closeBundle() {
            this.emitFile({
                type: "asset",
                fileName: "block.json",
                source: "",
            });

            const phpFiles = globSync(path.resolve(sourceFolder, "/*.php"));
            phpFiles.forEach((phpFile) => {
                const fileName = phpFile.split(path.sep).pop();
                this.emitFile({
                    type: "asset",
                    fileName: fileName,
                    source: "",
                });
            });


            const phpFile = generatePhpFile(['react', 'wp-block-editor', 'wp-blocks']);
            fs.writeFileSync(destPath + "/" + name + ".asset.php", phpFile);
        },
    };

    const pluginReact = react({
        jsxRuntime: "classic",
        jsxImportSource: "@wordpress/element",
    });

    return [pluginCopy, pluginReact];
};
