import DialogTextInput from "../../components/Dialog";
import { fs } from "tabris";
import { join } from "path";
import { alert } from "../../popup";

export const TYPE_DIR = 1;
export const TYPE_FILE = 0;

export async function createFs(root, typeFs = TYPE_FILE) {
    const typeText = TYPE_FILE === typeFs ? 'Archivo' : 'Carpeta';
    const dialog = DialogTextInput({
        title: `Creación De ${typeText}`,
        message: 'ingresa el nombre',
        btnOk: 'Crear'
    });
    
    const { button, texts: [name] } = await dialog.onClose.promise();
    const nwFile = join(root, name);
    const result = {
        success: false,
        name: name,
        fullPath: nwFile
    };
    if (button !== 'ok') return result;
    if (typeFs === TYPE_DIR && fs.isDir(nwFile) || typeFs === TYPE_FILE && fs.isFile(nwFile)) {
        alert(`${typeText} Existente`);
    } else {
        try {
            result.success = (await (typeFs === TYPE_DIR ? fs.createDir(nwFile) : fs.writeFile(nwFile, ''))) || true;
        } catch {
            alert('Wow Ocurrió un error al crearse, pueda que exista el archivo o carpeta');
        }
    }
    return result;
}