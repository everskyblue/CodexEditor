import {fs} from 'tabris'
import {join} from 'path'

const rootSetting = join(fs.filesDir, 'projects.json');
const defaultSetting = {
    currentProject: '',
    projects: [],
    openedFiles: []
};

const setting = Object.create(defaultSetting);

export function resetConfig() {
    fs.writeFile(rootSetting, JSON.stringify(defaultSetting)).catch(e => {
        console.log(e);
    });
}

export async function loadConfig() {
    if (!fs.isFile(rootSetting)) {
        await fs.writeFile(rootSetting, JSON.stringify(setting));
    } else {
        const stringify = await fs.readFile(rootSetting, 'utf-8');
        Object.assign(setting, JSON.parse(stringify));
    }
    return setting;
}

export function saveConfigProject(root_project) {
    setting.currentProject = root_project;
    
    if (!setting.projects.some(project => root_project)) {
        setting.projects.push(root_project);
    }
    
    fs.writeFile(rootSetting, JSON.stringify(setting)).catch(e => {
        console.log(e);
    });
}

export function getSettingProject() {
    return setting;
}

export function getConfigEditor() {
    return require('../config/monaco.json');
}