import { getStorage } from './store'
import $require from './lib'
import { basename } from 'path'

export const json = $require('@module/json');

export function relativePathProject(filename) {
    const { currentProject } = getStorage();
    return filename.replace(currentProject, basename(currentProject));
}