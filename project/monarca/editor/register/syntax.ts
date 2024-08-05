import { RegisterProvider } from "../contracts";
import { SimpleGrammar } from "../grammar";
import { Vendor } from "./vendor";

type SyntaxGrammar = RegisterProvider & {
    grammar: SimpleGrammar
};

const syntax = new Map<string, SyntaxGrammar>();

export function getSyntax(id: string): SyntaxGrammar | null {
    return syntax.get(id);
}

export const createSyntax = (id: string, fn: (existsID: boolean, grammar: SimpleGrammar) => SyntaxGrammar) => {
    const exists = syntax.has(id);
    const pkg = fn(exists, new SimpleGrammar());
    if (!exists) {
        syntax.set(id, pkg);
    }
};
