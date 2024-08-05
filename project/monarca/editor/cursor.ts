import { Composite } from "tabris";
import { ICursorConfig } from "./contracts";

export class CursorPosition {
    constructor(public x: number, public y: number) {}

    setPosX(x: number) {
        this.x = x;
        return this;
    }

    setPosY(y: number) {
        this.y = y;
        return this;
    }
}

export class CursorWidget {
    private widget: Composite;

    constructor(
        private config: ICursorConfig,
        public position: CursorPosition
    ) {
        this.widget = Composite({
            left: position.x,
            top: position.y,
            width: config.width,
            height: config.height,
            background: config.color,
            id: "active-cursor",
        });
    }

    updatePosition() {
        this.widget.left = Math.abs(this.position.x - this.config.width);
        this.widget.top = this.position.y;
    }

    renderTo(parent: any) {
        return parent.append(this.widget);
    }
}
