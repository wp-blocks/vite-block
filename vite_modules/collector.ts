import fg from 'fast-glob';
import * as fs from "fs";
import * as path from "node:path";

function getEntryPoints(jsonBlock: Record<string, any>): string[] {
    let entryPoints: string[] = [];
    // for each type of entry point
    ['editorScript', 'editorStyle', 'script', 'style', 'viewScript'].forEach(type => {
        // see if the type is in the block
        if (type in jsonBlock.src) {
            // get the entry points for that type
            const entries = (jsonBlock[type] as string[]).map( entry => path.resolve(process.cwd(), entry))
            // if there are any entries add them
            if (entries.length > 0) entryPoints.map( entry => entryPoints.push(
                path.resolve(process.cwd(), entry )
            ))
        }
    })
    // return the entry points
    return entryPoints
}

export default function blockCollector(args = { src: '', build: ''}): any {
    if ( ! args.src ) {
        args.src =path.join(process.cwd(), 'src' );
    }
    if ( ! args.build ) {
        args.build = path.join(process.cwd(), 'build' );
    }

    function jsonConfig(): Record<string, any>[] {
        const jsonConfig = fg.sync('**/block.json', {
            cwd: process.cwd(),
            absolute: true
        })

        return jsonConfig.map(jsonPath => {
            let blockConfig = JSON.parse(fs.readFileSync(path.resolve(jsonPath), {encoding: 'utf8'})) as Record<string, any>[];
            blockConfig.path = jsonPath
            return blockConfig
        });
    }

    return {
        name: 'blockCollector',
        config: () => {
            const jsonBlocks = jsonConfig()
            let entryPoints = jsonBlocks.map( block => getEntryPoints(block) )
            let entries ;
            entryPoints.forEach(entry => {
                entries[entry.name] = entry.path
            })

            const blocks = jsonBlocks.map( block => return {
                build: {
                    rollupOptions: {
                        input: entries,
                        output: {
                            format: 'iife',
                            chunkFileNames: '[name].[ext]',
                            entryFileNames: block.name + '.js',
                            dir: path.resolve(__dirname, args.build),
                        },
                    },
                },
            })
    }}
}
