import {NAME_STORAGE, type StorageProject} from './model';
import { setPreference, getValuePreference, existsKeyPreference } from 'voir-native'

export const structStorage: StorageProject = {
  paths: [],
  openedFiles: [],
  pathCurrentProject: ''
}

export function addStructProject(pathProject: string) {
  structStorage.paths.push(pathProject);
  structStorage.pathCurrentProject = pathProject;
  setPreference(NAME_STORAGE, structStorage)
}

export function updateCurrentProject(path: string) {
  structStorage.pathCurrentProject = path;
  setPreference(NAME_STORAGE, structStorage)
}

if (!existsKeyPreference(NAME_STORAGE)){
  setPreference(NAME_STORAGE, structStorage);
} else {
  const {paths, openedFiles, pathCurrentProject} = JSON.parse(getValuePreference(NAME_STORAGE)) as StorageProject;
  structStorage.paths = paths;
  structStorage.openedFiles = openedFiles;
  structStorage.pathCurrentProject = pathCurrentProject;
}