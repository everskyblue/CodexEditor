import type { TypeCodex } from "./codex";

interface Transfer {}

export class SimpleWorker {
    private worker: Worker;
    private stacks: Function[] = [];

    constructor(pathWorker: string, private editor: TypeCodex) {
        this.worker = new Worker(pathWorker);
        this.worker.addEventListener("message", ({ data }) => {
            console.log(data);
        });
    }

    sendMessage(source: string) {
        this.worker.postMessage(source);
    }

    onMessage(fn: (data: any) => any) {
        this.stacks.push(fn);
        return this;
    }
}
