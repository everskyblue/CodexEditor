import { fs } from 'tabris'

export const remove = (file) =>  {
    return fs.remove(file);
}