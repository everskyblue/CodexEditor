import {NAME_STORAGE, type StorageProject} from './model';

export const structStorage: StorageProject = {
  paths: [],
  openedFiles: [],
  pathCurrentProject: ''
}

export function addStructProject(pathProject: string) {
  structStorage.paths.push(pathProject);
  structStorage.pathCurrentProject = pathProject;
  localStorage.setItem(NAME_STORAGE, JSON.stringify(structStorage))
}

export function updateCurrentProject(path: string) {
  structStorage.pathCurrentProject = path;
  localStorage.setItem(NAME_STORAGE, JSON.stringify(structStorage))
}

if (!localStorage.getItem(NAME_STORAGE)){
  localStorage.setItem(NAME_STORAGE, JSON.stringify(structStorage))
} else {
  const {paths, openedFiles, pathCurrentProject} = JSON.parse(localStorage.getItem(NAME_STORAGE)) as StorageProject;
  structStorage.paths = paths;
  structStorage.openedFiles = openedFiles;
  structStorage.pathCurrentProject = pathCurrentProject;
}