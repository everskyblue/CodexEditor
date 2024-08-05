import {fs} from 'tabris'
import copy from './copy'
import checkExists from './check'

export default async (file: string, nwPath: string): Promise<boolean> => {
  checkExists({file, fn: 'isFile'}, {file: nwPath, fn: 'isDir'})
  try {
    await copy(file, nwPath);
    return await fs.remove(file);
  } catch (e) {
    return false;
  }
}