const {readdirSync, writeFileSync} = require('fs')
const {join} = require('path')

const dirs = readdirSync(
    join(__dirname, 'build'),
    'utf-8'
)

const requireExport = dirs.map(file => `'${file.replace('.json', '')}': require('./build/${file}')`);

writeFileSync(join(__dirname, 'index.js'), 'module.exports = {\n\t' + requireExport.join(',\n\t') +'\n}');