import { TextView, Row, Composite, Constraint } from "tabris";

export function lineContainer() {
    return Composite({
        class: "codex-container-linenumber",
        padding: {
            right: 5,
            left: 5,
        },
        top:0,
        left: 0,
        bottom: 0,
        background: 'white',
        elevation: 8
    });
}

export function getLineContent(linenumber: string | number): Row {
    return Row({
        stretchX: true,
        top: Constraint.prev,
        class: "codex-row-content ln-" + linenumber,
    }).append(
        TextView({
            class: "codex-text-number",
            text: linenumber.toString(),
            font: '16px serif'
        })
    );
}
