import { ISnippet, Vendor, snippet } from "../register";

console.log('snippets javascript');

const id = "monarca.snippet";
const title = "typescript and javascript snippets";
const description = `create simple snippets`;
const author = "Monarca Editor";

const keywordSnippet: ISnippet[] = [
    "arguments",
    "await",
    "boolean",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "double",
    "else",
    "enum",
    "eval",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
].map(k => ({
    type: "K",
    title: k,
    prefix: k,
    value: k,
}));


keywordSnippet.push({
    type: "S",
    title: "import file",
    prefix: "impf",
    value: 'import {$2} from "$1";',
    placeholder: "import from",
    description: `create import file`,
});


snippet.createSnippet(["javascript"], {
    vendor: new Vendor(id, title, description, author),
    snippets: keywordSnippet,
});