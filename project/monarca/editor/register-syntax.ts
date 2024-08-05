import { SimpleGrammar } from "./grammar";

const register = new Map<string, SyntaxPlugin>();

export interface PackageDescriptor {
    id: string;
    description: string;
    author: string;
    repo: string;
}

export class Package implements PackageDescriptor {
    description: string;
    author: string;
    repo: string;

    constructor(public readonly id: string) {}
}

export type SyntaxPlugin = {
    packageDescription: Package;
    grammar: SimpleGrammar;
};

export const registerSyntax = (
    id: string,
    fn: (
        existID: boolean,
        $package: Package,
        grammar: SimpleGrammar
    ) => SyntaxPlugin
) => {
    const syntaxPlugin = fn(
        register.has(id),
        new Package(id),
        new SimpleGrammar()
    );

    return syntaxPlugin;
};

export function registerTheme(id: string, fn: (
        existID: boolean,
        $package: Package,
        grammar: SimpleGrammar
    ) => any) {
    
}