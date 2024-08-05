import {fs} from 'tabris'

const _fs: {[k: string]: any} = fs;

export default (...paths: any[]) => {
  for (let option of paths) {
    if (!Reflect.apply(_fs[option.fn], fs, option.file)) throw "se encontro el archivo o la ruta dada";
  }
}