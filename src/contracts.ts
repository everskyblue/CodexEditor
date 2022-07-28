export interface ConfigProject {
    currentProject: string,
    projects: string[],
    openedFiles: string[]
}

export interface MonacoConfig {
    value: string,
    language: string,
    theme: string,
    renderWhitespace: string,
    tabSize: number,
    minimap: { enabled: boolean },
    lineDecorationsWidth: number,
    lineNumbersMinChars: number,
    readOnly: boolean,
    scrollbar: {
        useShadows: boolean,
        verticalHasArrows: boolean,
        horizontalHasArrows: boolean,
        vertical: string,
        horizontal: string,
        verticalScrollbarSize: number,
        horizontalScrollbarSize: number,
        arrowSize: number
    }
}