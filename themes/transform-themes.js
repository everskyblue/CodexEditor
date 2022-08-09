const parseTmTheme = require('monaco-themes').parseTmTheme;
const fs = require('fs')
const {join, basename, extname} = require('path')

const rootBuildThemes = join(__dirname, 'build');
const rootThemes = join(
    __dirname, 
    'node_modules',
    'spacecode-themes'
)

if (!fs.existsSync(rootBuildThemes)) {
    fs.mkdirSync(rootBuildThemes);
}

function readDirThemes(path, isConcatDirTheme = true) {
    return fs.readdirSync(path, {
        encoding: 'utf-8',
        withFileTypes: true
    }).filter(dirent => isConcatDirTheme ? dirent.isDirectory() : dirent.isFile())
    .map(dirent => ({
        name: dirent.name,
        absolutePath: join(path, dirent.name, isConcatDirTheme ? 'themes' : '')
    }))   
}



for (const {absolutePath} of readDirThemes(rootThemes)) {
    if (!fs.existsSync(absolutePath)) continue;

    const {name, absolutePath: file} = readDirThemes(absolutePath, false).shift();
    const tmContent = fs.readFileSync(file, 'utf-8')

    try {
        const parse = parseTmTheme(tmContent);
        fs.writeFile(
            join(rootBuildThemes, `${basename(name, extname(name))}.json`),
            JSON.stringify(parse, null, 2),
            'utf-8',
            (error) => {
                if (error) throw error;
            }
        )
    } catch (error) {
        console.error(`error parse ${file} - ${error.message}`);
    }
}

console.log('has be created!');