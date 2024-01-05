import * as path from 'path';
import * as glob from "glob";
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

function generatePhpFile(globs, buildPath) {
  // generate a random version hash of 20 chars
  const version = Math.random().toString(36).substring(2, 22);
  const fileContent = `<?php return array('dependencies' => array("${globs.join('","')}"), 'version' => '${version}');`;

  // Write the file content to the specified file path
  fs.writeFileSync(buildPath, fileContent);
}

export const wpBlock = () => {
  const pluginCopy = {
    name: "vite-wordpress-copy",
    buildStart() {
      const rootPath = path.resolve(__dirname, "..");

      this.addWatchFile(path.resolve(rootPath, "block.json"));
      this.addWatchFile(path.resolve(rootPath, "src/*.php"));
    },
    closeBundle() {
      const rootPath = path.resolve(__dirname, "..");
      this.emitFile({
        type: "asset",
        fileName: "block.json",
        source: "",
      });

      generatePhpFile(['react', 'wp-block-editor', 'wp-blocks'], path.join(rootPath, "build", "vite-block.asset.php"));

      const phpFiles = glob.sync(path.resolve(rootPath, "src/*.php"));
      phpFiles.forEach((phpFile) => {
        const fileName = phpFile.split(path.sep).pop();
        this.emitFile({
          type: "asset",
          fileName: fileName,
          source: "",
        });
      });
    },
  };

  const pluginReact = react({
    jsxRuntime: "classic",
    jsxImportSource: "@wordpress/element",
  });

  return [pluginCopy, pluginReact];
};
