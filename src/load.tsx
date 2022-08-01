import {fs} from 'tabris'
//@ts-ignore
import {join} from 'path'
import { ConfigProject, MonacoConfig } from './contracts';

const rootSetting: string = join(fs.filesDir, 'projects.json');

const defaultSetting: ConfigProject = {
    currentProject: '',
    projects: [],
    openedFiles: []
};

const setting: ConfigProject = Object.aasign({}, defaultSetting);

export function resetConfig() {
    fs.writeFile(rootSetting, JSON.stringify(defaultSetting)).catch(e => {
        console.log(e);
    });
}

export async function loadConfig() {
    if (!fs.isFile(rootSetting)) {
        await fs.writeFile(rootSetting, JSON.stringify(defaultSetting));
    } else {
        const stringify = await fs.readFile(rootSetting, 'utf-8');
        Object.assign(setting, JSON.parse(stringify));
    }
    return setting;
}

export function saveConfigProject(root_project: string) {
    setting.currentProject = root_project;
    
    if (!setting.projects.includes(root_project)) {
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
    return require('../config/monaco.json') as MonacoConfig;
}