export interface GrammarLiteralString {
    open:
        | string
        | { token: string; isTemplate?: boolean; isMultiline?: boolean };
    close?: string;
    template?: string;
}

export interface GrammarLiteralOpenClose {
    open: string;
    close?: string;
}

export class SimpleGrammar {
    name = '(^[a-zA-Z_\\$][0-9])';
    keywords: string[] = [];
    contants: string[] = [];
    strings: GrammarLiteralString[] = [];
    comments: (GrammarLiteralOpenClose & { multiline: boolean })[] = [];
    regrex: GrammarLiteralOpenClose[] = [];
    operators: string[] = [];
    punctuators: string[] = [];
    whitespace: string;
    numeric: string;
    
    isName(value: string, tokens: string) {
        return false
    }

    isKeyword(value: string) {
        return this.keywords.includes(value);
    }

    isContants(value: string) {
        return this.contants.includes(value);
    }

    isComment(token: string) {
        const grammarComment = Object.assign(
            { isClose: false, isScape: false },
            this.comments.find(
                (grammarComment) => grammarComment.open === token
            )
        );
        
        const totalLine = grammarComment.open.length;
        let charGrammarCommentOpen = grammarComment.open.at(0);
        
        return {
            checkClose(token: string, nextToken: string) {
                if (token === grammarComment.close && !grammarComment.isScape)
                    grammarComment.isClose = true;
                if (token === "\\" && nextToken != " ") {
                    if (grammarComment.isScape) grammarComment.isScape = false;
                    else grammarComment.isScape = true;
                }

                return grammarComment;
            },
        };
    }
}
