import { AlertDialog, TextInput } from "tabris";

type DialogComponent = {
    title: string;
    text?: string;
    message: string;
    btnOk?: string;
    btnCancel?: string;
};

export default function DialogTextInput({
    title,
    message,
    text = "",
    btnOk = "ok",
    btnCancel = "cancelar",
}: DialogComponent): AlertDialog {
    return AlertDialog.open(
        <AlertDialog title={title} buttons={{ ok: btnOk, cancel: btnCancel }}>
            <TextInput message={message} text={text} />
        </AlertDialog>
    );
}
