import { AndroidKeyCode } from "../../event/keycodes";
import { TypeCodex } from "../codex";

const commands = new Map<string, (editor: TypeCodex) => any>();

export function checkGetCommand(
    command: string | AndroidKeyCode[]
): TypeError | AndroidKeyCode[] {
    const cmd = Array.isArray(command) ? command : resolveCommand(command);

    if (cmd instanceof TypeError) {
        return cmd;
    }

    const strCmd = cmd.join(",");

    if (commands.has(strCmd)) {
        return new TypeError("command existed!");
    }

    return cmd;
}

export function resolveCommand(command: string): number[] | TypeError {
    const invalids: any = [];
    const parts: string[] = command.split("+");
    const keyCodes: number[] = parts.map((part: string) => {
        if (part.toLowerCase() === "ctrl") {
            return AndroidKeyCode.CTRL;
        } else if (part.toLowerCase() === "alt") {
            return AndroidKeyCode.ALT;
        } else if (part.toLowerCase() === "shift") {
            return AndroidKeyCode.SHIFT;
        } else {
            const code: number = AndroidKeyCode[
                part.toUpperCase() as any
            ] as unknown as number;
            if (code !== undefined) {
                return code;
            } else {
                invalids.push(part);
                return -1;
            }
        }
    });

    if (keyCodes.some((keycode) => keycode === -1))
        return new TypeError(`invalid key ${invalids}`);

    return keyCodes;
}

export function setCommand(
    command: string | AndroidKeyCode[],
    fn: (editor: TypeCodex) => any
) {
    const cmd = checkGetCommand(command);

    if (Array.isArray(cmd)) {
        commands.set(cmd.join(","), fn);
    } else {
        return cmd;
    }
}

export function getAllCommands() {
    const cmds: Record<string, Function> = {};

    for (const [key, value] of commands.entries()) {
        cmds[key] = value;
    }

    return cmds;
}
