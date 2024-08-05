import { ISnippet } from "../contracts";
import { Vendor } from "./vendor";

type PackageProvider = { vendor: Vendor; snippets: ISnippet[] };

const Snippets = new Map<string, PackageProvider>();

export function extendSnippet(languageExtend: string, languages: string[], codeSnippetProvider: PackageProvider) {
    const extendSnippets: ISnippet[] = Snippets.has(languageExtend) ? Snippets.get(languageExtend).snippets : [];
    codeSnippetProvider.snippets.push(...extendSnippets);
    createSnippet(languages, codeSnippetProvider);
}

export function createSnippet(languages: string[], codeSnippetProvider: PackageProvider) {
    for (const language of languages) {
        if (!Snippets.has(language)) {
            Snippets.set(language, codeSnippetProvider);
        }
    }
}

export function getSnippet(language: string) {
    return Snippets.get(language);
}