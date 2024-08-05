import { syntax, Vendor } from "../../editor/register";

syntax.createSyntax("javascript", (_, grammar) => {
    grammar.keywords.push(
        "abstract",
        "arguments",
        "await*",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class*",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "double",
        "else",
        "enum*",
        "eval",
        "export*",
        "extends*",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "function",
        "goto",
        "if",
        "implements",
        "import*",
        "in",
        "instanceof",
        "int",
        "interface",
        "let*",
        "long",
        "native",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "super*",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "true",
        "try",
        "typeof",
        "var",
        "void",
        "volatile",
        "while",
        "with",
        "yield"
    );

    grammar.strings.push(
        {
            open: "'",
            close: "'",
        },
        {
            open: '"',
            close: '"',
        },
        {
            open: {
                token: "`",
                isMultiline: true,
                isTemplate: true,
            },
        }
    );

    grammar.comments.push({
        open: "//",
        multiline: false
    });

    grammar.operators.push(
        "+",
        "-",
        "*",
        "/",
        "%",
        "&",
        "|",
        "~",
        "^",
        "=",
        ",",
        "."
    );

    grammar.punctuators.push("(", ")", "[", "]", "{", "}", "?", "!");

    grammar.contants.push("true", "false", "undefined", "null");

    grammar.whitespace = "\\s|\\n|\\t";

    grammar.numeric = "(0x[0-9a-fA-F]+)?|[0-9]+(.[0-9]+)?";

    return {
        grammar,
        package: new Vendor(
            'codex.syntax.javascript',
            'JavaScript Syntax',
            'parse JavaScript',
            'codex'
        ),
    };
});
