import type { TypeCodex } from "./codex";
import blockCode from "./ui";
import { TextView, type Composite, type WidgetCollection, type Row } from "tabris";
import type { CursorPosition, CursorWidget } from "./cursor";
import type TextManager from "./ui/TextManager";
import { getLineContent } from "./line-widget";
import { resolve } from 'path';
type BlockSelector = {
    [line: number]: ReturnType<typeof blockCode>[];
};

type CharSizes = {
    text: string;
    width: number;
    height: number;
}

type TotalSize = {
    text: string;
    width: number;
    height: number;
}

type Sizes = {
    totalSize: TotalSize
    charSizes: CharSizes[]
}[]

const worker = new Worker(resolve(__dirname, './workerEditor.js'));

export class ManagerBlock {
    private line: number = 0;
    private currentIndex = 0;
    private current: ReturnType<typeof blockCode>;

    private readonly blocks: BlockSelector = {};

    constructor(private editor: TypeCodex) { }

    async remove() {
        const { block, code, textManager, lineContent } = this.current;
        const collection = block.children();
        const index = collection.indexOf(code);

        if (block.data.line > 1 && collection.length === 1) {
            $(`.bc-${block.data.line - 1}`)
                .only()
                .trigger("tap");
            const previous = getSiblingContent(this.current.block, true);
            block.dispose();
            lineContent.dispose()
            updateNextContent(previous, false);
            //return;
        }
        else if (collection.length > 1) {
            code.dispose();
        }
    }

    createBlock() {
        this.line += 1;
        const block = blockCode(null, getLineContent(this.line));
        block.content.classList.push(`bc-${this.line}`);
        block.content.data = {
            line: this.line,
            lineBefore: this.line,
            indexWidget: 0,
            position: 0,
        };

        block.content.onTap((event) => {
            this.line = block.content.data.line;
            this.current = block;
            const input = this.editor.input;

            // edit
            const { x, y } = event.touches[0];
            const texts = block.code.text.split(/\n/);
            const sizes: Sizes = [];
            worker.postMessage({
                texts, x, y
            })
            texts.forEach((text, line) => {
                const charSizes: CharSizes[] = [];
                for (let index = 0; index < text.length; index++) {
                    const char = text[index];
                    const size = {
                        ...(block.textManager.getTextSize(char)),
                        text: char
                    };
                    if (index !== 0) {
                        const { height, width, text } = charSizes[index - 1];
                        size.width = size.width + width;
                        size.text = text + char;
                    }
                    if (line !== 0) {
                        size.height += sizes[line - 1].totalSize.height;
                    }
                    charSizes.push(size);
                }
                sizes.push({
                    charSizes,
                    totalSize: charSizes.at(-1) ?? {} as TotalSize
                })
            })

            const findSize = sizes.find(({ charSizes, totalSize: size }) => {
                const deference = Math.abs(y - size.height);
                const accumulator = (y + size.height) / 2;
                const percent = (deference / accumulator) * 100;
                //console.log(percent, deference, accumulator, size,y);
                return (Math.floor(percent) < 50 && deference < 12)
            })

            //console.log(JSON.stringify(charSizes));
            if (typeof findSize !== 'undefined') {
                const { charSizes, totalSize: size } = findSize;
                const findTextPosition = charSizes.find(({ width }) => {
                    return (Math.floor(Math.abs(width - x)) < 12)
                })
                //console.log(size.width, "mi tamaño", findTextPosition);
                this.editor.cursorPosition.setPosX(
                    typeof findTextPosition === 'undefined'
                        ? size.width
                        : findTextPosition.width
                ).setPosY(size.height - 16)//.setPosX(size.width)
                this.editor.cursorWidget.updatePosition();
            }
            //console.log(x, y, JSON.parse(JSON.stringify(sizes), null, '\t'));
            if (!input.focused) input.focused = true;
            //console.log(event, this.current.textManager.getTextSize());
            this.editor.receivedCursor((cursor: CursorWidget, position: CursorPosition) => {
                const size = block.textManager.getTextSize();
                //position.setPosY(block.block.bounds.top).setPosX(size.width);
                //cursor.updatePosition();
            });
        });

        if (this.current) {
            // this.current.lineContent = block.lineContent;
        } else {
        }
        this.current = block;
        this.blocks[this.line] = [block];
        return this.current;
    }

    createCode() {
        this.current = blockCode(this.current.block);
        this.blocks[this.line].push(this.current);
        this.currentIndex += 1;
        return this.current;
    }

    public getCurrent() {
        return this.current;
    }

    async totalText(editor: TypeCodex) {
        const { block, code, textManager } = this.getCurrent();
        const children = block.children() as WidgetCollection<TextView>;
        const pos = children.indexOf(code);
        const slices = children.slice(0, pos);
        let text: string;
        for (let index = 0; index < slices.length; index++) {
            text += slices[index].text;
        }
        text += code.text.substring(0, textManager.getPosition());
        console.log("total: " + text);
        return text;
    }
    calculateTextSize() {
        const size = this.current.textManager.getTextSize();
        const content = this.current.content;
        this.editor.cursorPosition.setPosX(size.width).setPosY(
            content.bounds.top
        )
        this.editor.cursorWidget.updatePosition();
        /*editor.receivedCursor((cursor: CursorWidget, position: CursorPosition) => {
            position.setPosX(size.width).setPosY(size.height > 20 ? size.height / 2 : 0);
            console.log(size, textManager);
            cursor.updatePosition();
        });*/
    }

}

export async function totalText(editor: TypeCodex) {
    const { block, code, textManager } = editor.managerBlock.getCurrent();
    const children = block.children() as WidgetCollection<TextView>;
    const pos = children.indexOf(code);
    const slices = children.slice(0, pos);
    let text: string;
    for (let index = 0; index < slices.length; index++) {
        text += slices[index].text;
    }
    text += code.text.substring(0, textManager.getPosition());
    console.log("total: " + text);
    return text;
}

export function calculateTextSize(textManager: TextManager, editor: TypeCodex) {
    const size = textManager.getTextSize();
    editor.receivedCursor((cursor: CursorWidget, position: CursorPosition) => {
        position.setPosX(size.width).setPosY(size.height > 20 ? size.height / 2 : 0);
        console.log(size, textManager);
        cursor.updatePosition();
    });
}

async function updateNextContent(contents: WidgetCollection<Composite>, isIncrement: boolean = true) {
    for (let index = 0; index < contents.length; index++) {
        changeDataContent(contents[index], isIncrement);
    }
}

function changeDataContent(widget: Composite, isIncrement: boolean) {
    const line = widget.data.line + (isIncrement ? 1 : -1);
    // cambiar el nombre de la clase
    widget.classList.splice(0, 1, `bc-${line}`)
    widget.data.line = line;
    const value = widget.data;
    //if (value.line !== value.lineBefore) {
    const nameclass = `ln-${value.lineBefore}`;
    // obtiene los widgets y toma su segundo elemento
    const rowLine: Row = $('.' + nameclass).last();
    rowLine.classList.splice(1, 1, `ln-${value.line}`);
    rowLine.children(TextView).first().text = value.line;
    value.lineBefore = line;
    //}
    console.log("text");
}

function getSiblingContent(widget: Composite, isIncrement: boolean = false) {
    const line = widget.data.line + 1;
    const next = widget.siblings(`.bc-${line}`);
    if (next.length === 0) return null;
    const siblings: WidgetCollection<Composite> = widget.siblings();
    const index = siblings.indexOf(next.only());
    return siblings.slice(index + (isIncrement ? 1 : 0));
}

export function managerUI(token: string, editor: TypeCodex) {
    // no añade el salto de linea
    if (/\n/.test(token)) {
        // obtiene el bloque actual del codigo y linea
        const currentContent = editor.managerBlock.getCurrent().content;
        //const rowsLines = $('.codex-row-content') as WidgetCollection<Row>;
        const currentLineWidget = editor.managerBlock.getCurrent().lineContent;
        // crea nuevo bloque de codigo y linea de bloque siguiente
        const nwblock = editor.managerBlock.createBlock();
        // obtiene el elemento siguiente del bloque
        const siblings = getSiblingContent(currentContent);
        //inserta el bloque de codigo y la linea nueva. 
        nwblock.content.insertAfter(currentContent);
        nwblock.lineContent.insertAfter(currentLineWidget);
        // chequea si hay un elemento siguiente para cambia la data
        if (siblings !== null) updateNextContent(siblings, true);
        var id = setTimeout(() => {
            editor.receivedCursor((cursor: CursorWidget, position: CursorPosition) => {
                position.setPosY(nwblock.block.bounds.top).setPosX(0);
                cursor.updatePosition();
            });
            clearTimeout(id);
        }, 100);
        editor.block = nwblock;
    } else {
        const manager = editor.managerBlock.getCurrent().textManager.setChar(token);
        //editor.worker.sendMessage(editor.managerBlock.getCurrent().textManager.text);
        //worker.postMessage(editor.managerBlock.getCurrent().textManager.text)
        editor.managerBlock.calculateTextSize();
        //console.log(token);
    }
}
