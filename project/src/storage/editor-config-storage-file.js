import { fs, Module } from 'tabris'
import { join } from 'path'

let editorConfig;
const pathConfig = join(fs.filesDir, 'monaco.json');
const defConfig = {
    "theme": "vs-dark",
    "renderWhitespace": "all",
    "tabSize": 4,
    "minimap": {
        "enabled": false
    },
    "lineDecorationsWidth": 10,
    "lineNumbersMinChars": 3,
    "readOnly": false,
    "scrollbar": {
        "useShadows": false,
        "verticalHasArrows": false,
        "horizontalHasArrows": false,
        "vertical": "hidden",
        "horizontal": "hidden",
        "verticalScrollbarSize": 1,
        "horizontalScrollbarSize": 1,
        "arrowSize": 0
    }
}
/*
const saveEditorConfigFile = async () => {
    const res = await fetch('/modules/config/monaco.json');
    const text = await res.text();
    fs.writeFile(pathConfig, text);
}*/

if (!fs.isFile(pathConfig)) updateConfigEditor();

export const getEditorConfig = () => {
    return editorConfig ?? (editorConfig = Module.readJSON('file://' + pathConfig));
}

export function updateConfigEditor(config = {}) {
    return fs.writeFile(pathConfig, JSON.stringify(Object.assign(
        editorConfig ?? defConfig, 
        config
    ), null, 4));
}