import { AlertDialog, Composite } from "tabris";
import type { TextInput } from "tabris"

type OptionButton = {
    ok?: ()=> any,
    cancel?: ()=> any
}

function addEventAndOpenDialog(dialog: AlertDialog, buttons: OptionButton) {
    if (buttons && buttons.ok) 
        dialog.onCloseOk(buttons.ok);
    if (buttons && buttons.cancel) 
        dialog.onCloseCancel(buttons.cancel);
    dialog.open();
}

export function info(msg: string) {
    return AlertDialog.open(msg);
}

/**
 * @param {String} message
 * @param {OptionButton} options
 */
export function alert(message: string, buttons?: OptionButton) {
    const alert = new AlertDialog({
        message,
        title: "Alert",
        buttons: {
            ok: "Aceptar",
            //cancel: "Cancelar"
        }
    });
    
    addEventAndOpenDialog(alert, buttons);
}

type OptionView = {inputs: TextInput[], buttons: OptionButton} 

function prompt(message: string, view: OptionView) {
    const dialog = new AlertDialog({
        message,
        title: "prompt",
        buttons: {
            ok: "Aceptar",
            cancel: "Cancelar"
        },
        //@ts-ignore
        textInputs: Composite().append(view.inputs)
    });
    
    addEventAndOpenDialog(dialog, view.buttons);
}