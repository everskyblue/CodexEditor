const {readdirSync} = require('fs')
const {join} = require('path')

const filenameListTheme = join(__dirname, 'themes.json');

const dirs = readdirSync(
    join(__dirname, 'build'),
    'utf-8'
)