import type { TextView } from "tabris";
import { sizeMeasurement } from "tabris";
import TextPosition from "./TextPosition";

export default class TextManager extends TextPosition {
    constructor(public widget: TextView) {
        super(0);
    }

    getTextSize() {
        return (
            sizeMeasurement.measureTextsSync([
                {
                    text: this.text.slice(0, this.getPosition()),
                    font: "16px serif",
                    markupEnabled: false,
                },
            ])
        ).shift();
    }

    public get text(): string {
        return this.widget.text;
    }

    public set text(v: string) {
        this.widget.text = v;
    }
}
