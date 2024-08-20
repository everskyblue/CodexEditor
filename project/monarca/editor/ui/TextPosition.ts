abstract class TextPosition {
    abstract text: string;

    constructor(private position: number) {}

    setPosition(pos: number) {
        this.position = pos;
        return this;
    }

    public setChar(token: string) {
        this.text = token//this.text.concat(token);
        this.position += 1;
        return this;
    }

    public undoChar() {
        this.text = this.text.slice(0, -1);
        this.position -= 1;
        return this;
    }

    getPosition(): number {
        return this.position;
    }
}

export default TextPosition;
