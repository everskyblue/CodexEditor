import { Composite, TextView } from "tabris";
import TextManager from "./TextManager";
import { getLineContent } from "../line-widget";

export default (parent?: Composite, lineContent?: ReturnType<typeof getLineContent>) => {
    const block =
        parent ??
        Composite({
            stretchX: true,
            top: "prev()",
        });

    const code = TextView({
        font: "16px serif",
    });

    return {
        block,
        code,
        textManager: new TextManager(code),
        content: block.append(code),
        lineContent
    };
};
