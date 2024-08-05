import { TypeCodex } from "../codex";
import { command, snippet } from "../register";
import { calculateTextSize } from "../manager-ui";

command.setCommand("Ctrl+Space", (editor: TypeCodex) => {
    const vendor = snippet.getSnippet(editor.lenguage);
    editor.suggestion.render(editor.parentWidget, vendor.snippets);
});

command.setCommand("delete", (editor: TypeCodex) => {
    const { code, block, textManager } = editor.managerBlock.getCurrent();
    const { text } = code;
    if (text.length === 0) {
        // remueve el TextView
        editor.managerBlock.remove();
    } else {
        // eliminar un caracter y luego calcular el tamaño del texto
        calculateTextSize(textManager.undoChar(), editor);
    }
});
