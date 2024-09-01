import { fs } from "tabris";
import { encode } from "base-64";
import * as JSZIP from "jszip";

async function openFile() {
    try {
        const files = await fs.openFile({
            type: "*/*",
            quantity: "multiple",
        });
        
        if (files.length === 0) return;

        const zip = new JSZIP();

        zip.loadAsync(await files[0].arrayBuffer()).then(async (zi) => {
            Object.keys(zi.files).forEach(async (f) => {
                console.log(f);
                //f._data.then(text => console.log(text))
                //if (!(f._data instanceof Promise))
                //console.log(await zip.file(f).async('text'))
                //return f.file(f.name).async('string')
            }); //.then(console.log)
        });
        //const text: string = await files[0].arrayBuffer();
        //console.log(text)
        return;
        //$('.onerun').only().postMessage(encode(encodeURIComponent(text)), '*');
    } catch (e) {
        console.log(e);
    }
}

export default openFile;
