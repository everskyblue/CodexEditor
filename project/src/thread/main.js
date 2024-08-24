import { Worker } from 'tabris'
import { resolve } from 'path'
import libs from '../libraries'

const worker = new Worker(resolve(__dirname, './cdxEditorWorker.js'));

const received = {
    addLib(lib) {
        libs.push(lib)
    }
}

worker.addEventListener('message', ({ data }) => {
    const { method, args } = data;
    if (method in received) {
        Reflect.apply(received[method], received, args.concat(data));
    }
})

export default worker;