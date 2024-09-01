import { app, AppKeyPressEvent } from "tabris";
import debounce = require("just-debounce-it");
import { AndroidKeyCode } from "./keycodes";
import { command } from "../editor/register";
import type { TypeCodex } from "../editor/codex";

let pressedKeys: number[] = [];

const numerics = [
    AndroidKeyCode.DIGIT_0,
    AndroidKeyCode.DIGIT_1,
    AndroidKeyCode.DIGIT_2,
    AndroidKeyCode.DIGIT_3,
    AndroidKeyCode.DIGIT_4,
    AndroidKeyCode.DIGIT_5,
    AndroidKeyCode.DIGIT_6,
    AndroidKeyCode.DIGIT_7,
    AndroidKeyCode.DIGIT_8,
    AndroidKeyCode.DIGIT_9,
];

const exec: (editor: TypeCodex, keyCodes: number[]) => any = (
    debounce as unknown as Function
)((editor: TypeCodex, keyCodes: number[]) => {
    resetPressedKeys();
    if (keyCodes.every((keyCode) => numerics.includes(keyCode))) return;
    const allCmd = command.getAllCommands();
    const strCmd = keyCodes.join(",");
    if (strCmd in allCmd) {
        allCmd[strCmd](editor);
    }
}, 10);

function onKeyPress(event: AppKeyPressEvent) {
    //event.preventDefault();
    const { keyCode, altKey, ctrlKey, shiftKey, action } = event;
    if (action !== "down") return;
    let keyToAdd = keyCode;
    // priority 3
    if (
        altKey &&
        keyCode == AndroidKeyCode.ALT &&
        !pressedKeys.includes(AndroidKeyCode.ALT)
    ) {
        keyToAdd = AndroidKeyCode.ALT;
    }

    // priority 2
    if (
        ctrlKey &&
        keyCode == AndroidKeyCode.CTRL &&
        !pressedKeys.includes(AndroidKeyCode.CTRL)
    ) {
        keyToAdd = AndroidKeyCode.CTRL;
    }

    // priority 1
    if (
        shiftKey &&
        keyCode == AndroidKeyCode.SHIFT &&
        !pressedKeys.includes(AndroidKeyCode.SHIFT)
    ) {
        keyToAdd = AndroidKeyCode.SHIFT;
    }
    if (!pressedKeys.includes(keyToAdd)) {
        pressedKeys.push(keyToAdd);
    }

    exec(this as TypeCodex, pressedKeys);
}

function resetPressedKeys(): void {
    pressedKeys = [];
}

export const initEvent = (editor: TypeCodex) => {
    app.onKeyPress(onKeyPress.bind(editor));
};
