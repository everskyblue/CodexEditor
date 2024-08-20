import { SimpleGrammar } from "../grammar";

export type TypeToken =
    | "name"
    | "keyword"
    | "number"
    | "string"
    | "punctuator"
    | "literal"
    | "comment"
    | "operator"
    | "whitespace";

export interface ITypeToken {
    startIndex: number;
    value: string;
    type: TypeToken;
}

export interface ILineTokens {
    line: number;
    tokens: ITypeToken[];
}

export interface ITokens {
    startIndex: number;
    tokens: ITypeToken[];
}

export class Lexer {
    private source: string;
    private index: number;
    private _token: string;
    
    constructor(public grammar: SimpleGrammar) {}

    public get token() : string {
        return this._token;
    }
    
    next() {
        this.index++;
        this._token = this.source[this.index];
        return this;
    }

    createTokens(source: string) {
        this.index = 0;
        this.source = source;
        this._token = this.source[this.index];
        return this.stream();
    }
    
    isNextToken(value: string | undefined) {
        return value === undefined;
    }

    stream() {
        let tokensName = this.name();
        if (tokensName === undefined) {
            this.next();
        } else {
            this.isKeyword(tokensName);
            //console.log(tokensName);
        }
        let tokensNumeric = this.numeric();
        if (tokensNumeric === undefined) {
            this.next();
        } else {
            //
        }
        let tokensStrings = this.strings();
        if (tokensStrings === undefined) {
            this.next();
        } else {
            //
        }
        let tokensRgx = this.regex();
        if (tokensRgx=== undefined) {
            this.next();
        } else {
            //
        }
        let tokensComments = this.comments();
        if (tokensComments === undefined) {
            this.next();
        } else {
            //
        }
        if (this.source.length > this.index) {
            this.stream();
        }
    }

    name(tk?:string) {
        let tokens = "";
        if (this.grammar.isName(this.token, tokens)) {
            tokens+= this.token + this.next().name(this.token)
        }
        return tokens;
    }

    numeric() {
        //
    }

    isKeyword(value: string) {
        return this.grammar.isKeyword(value);
    }

    regex() {
        //
    }

    comments() {
        //
    }

    strings() {
        //
    }
}
