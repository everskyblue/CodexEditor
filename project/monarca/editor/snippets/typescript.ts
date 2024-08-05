import { Vendor, snippet } from "../register";

console.log('snippets typescript');


snippet.extendSnippet('javascript', ['typescript'], {
    vendor: new Vendor(
        'monarca.snippets.typescript',
        'Monarca Snippet TypeScript',
        'create snippets typescript',
        'Monarca Editor',
    ),
    snippets: []
})