import {fs} from 'tabris'
import checkExists from './check'

export default async (file: string, name: string): Promise<boolean> => {
  const nwFile = (file.substr(0, (file.lastIndexOf('/') + 1)) + name); 
  checkExists({file, fn: 'isFile'});
  try {
    const buffer = await fs.readFile(file);
    await fs.appendToFile(nwFile, buffer);
    return await fs.remove(file);
  } catch (e) {
    return false;
  }
}