import { fs } from 'tabris'
import { extname, basename } from 'path'
import { readDir, readFile } from '../fs/reader'
import { getStorage } from '../store'

async function init({ data }) {
    const { method, args } = data;
    if (!method) {
        return console.log("no hay metodo");
    }
    let sendData = Reflect.apply(rb[method], rb, args.concat(data));
    if (sendData instanceof Promise) {
        sendData = await sendData;
    }
    
    if (sendData) window.postMessage(sendData);
}

const libs = [];

const rb = {
    async indexesDirs(path) {
        const files = await readDir(path);
        for (const { absolutePath, name } of files.files) {
            if (absolutePath.endsWith('.d.ts') ||
                absolutePath.endsWith('.ts') ||
                absolutePath.endsWith('.tsx') ||
                absolutePath.endsWith('.js') ||
                absolutePath.endsWith('.jsx')
            ) {
                libs[absolutePath] = await this.indexesFiles(name, absolutePath)
            }
        }
        
        for (const { absolutePath } of files.directories) {
            await this.indexesDirs(absolutePath)
        }
        
        /*return {
            method: 'addLibs',
            args: [libs]
        };*/
    },

    async indexesFiles(name, path) {
        const ext = extname(name);
        const rootProject = getStorage().currentProject;
        const source = (await readFile(path));
        window.postMessage({
            method: 'addLib',
            args: [{
                filePath: 'file://' + (
                    name.endsWith('.d.ts')
                        ? path
                        : path.replace(
                            name,
                            name.replace(ext, '.d.ts'),
                        )
                ).replace(rootProject, ''),
                content: source
            }]
        })
    }
}

tabris.onMessage(init)