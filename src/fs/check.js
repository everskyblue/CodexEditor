import {fs} from 'tabris'

export default (...paths) => {
  for (let option of paths) {
    if (!fs[option.fn](option.file)) throw "se encontro el archivo o la ruta dada";
  }
}