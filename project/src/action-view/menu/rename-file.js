import { basename } from "path";
import DialogTextInput from "../../components/Dialog";
import rename from "../../fs/rename";
import { Toast } from "voir-native";
import { alert } from "../../popup";

export async function renameFile(filename) {
    const currentName = basename(filename);
    const dialog = DialogTextInput({
        title: 'renombrar',
        message: currentName,
        text: currentName,
        btnOk: 'Cambiar'
    });
    
    const result = {
        file: '',
        success: false
    }

    const { button, texts: [text] } = await dialog.onClose.promise();
    
    if (button === 'ok') {
        if ((currentName !== text && text.trim().length === 0) || currentName === text) return result;
        Object.assign(result, await rename(filename, text));
        if (!result.success) {
            alert('error al crear el archivo');
        }
    }
    
    if (result.success) {
        Toast.makeText('archivo renombrado').show();
    }

    return result;
}