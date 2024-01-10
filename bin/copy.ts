import * as path from 'path';
import * as fs from "fs/promises";
import {Stats} from "node:fs";
import fg from 'fast-glob';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const BUILD_DIR = path.resolve(process.cwd(), 'build');


// a regex to match all the php files
const phpFileMatch = /\.php$/

/**
 * Returns a custom global resolver that maps external libraries and objects to their `window` counterparts
 */
export function copy(id: string) {
    console.log("🔗 copyFiles ", id);
    // if the file exists in the build folder and the modification time is newer than the source file
    fs.access(path.join(BUILD_DIR, id))
        .then(async () => {
            // Get the modification time of the file in the build folder
            const buildStat: Promise<Stats> = fs.stat(path.join(BUILD_DIR, id));
            // Get the modification time of the file in the source folder
            const srcStat: Promise<Stats> = fs.stat(path.join(SRC_DIR, id));
            // Wait for both promises
            await Promise.all([buildStat, srcStat])
                .then(([buildStat, srcStat]) => {
                    // if the modification time of the file in the build folder is newer than the source file
                    console.log("🔗 copyFiles old ", buildStat.mtimeMs, "new", srcStat.mtimeMs, "file", id);
                    // Copy the file to the build folder
                    if (buildStat.mtimeMs > srcStat.mtimeMs) {
                        // copy the file to the build folder
                        fs.copyFile(path.join(SRC_DIR, id), path.join(BUILD_DIR, id));
                    }
                })
        })
}


export const wpCopy = (args?: { targets: string[] }) => {

    let config;

    let targets = args?.targets ?? ['**/*.php', 'block.json'];
    const outDir = path.resolve(__dirname, 'build');

    // console.log("🔗 config", config);
    const copyTargets = fg(targets, {cwd: SRC_DIR })
        .then(files => files
            .map(file => path
                .join(config.root, 'src', file)));

    const pluginTools = {
        name: "File-copy",


        configResolved(resolvedConfig) {
            // store the resolved config
            config = resolvedConfig
            console.log("🔗 targets", targets);
        },

        buildStart() {
            const target = copyTargets
                console.log(target)
            target.then(res => res.forEach( file => copy(path.join(config.root, 'src', file))));
        }
    };

    return [pluginTools];
};
