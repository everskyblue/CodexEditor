
class Semantic {
    private nextIf: string[];

    constructor(private tokenName:string, private typeToken?: string){}

    nextIfToken(...names: string[]) {
        this.nextIf = names;
        return this;
    }
}

type KeySemanticHighlighting = keyof Omit<Highlight, "semanticHighlighting">;

class Highlight implements Record<any, any>{
    keyword: string;
    name: string
    number: string
    operator: string
    punctuator:string
    constant: string
    regex: string
    
    get semanticHighlighting() {
        return new Proxy({} as Record<KeySemanticHighlighting, Semantic[]>, {
            get(target, key: KeySemanticHighlighting){
                if (!(key in target)) {
                        target[key] = [];
                    }
                    return target[key].push(new Semantic(key));
            }
        })
    }
}


export default function highlight(): Highlight {
    return Object.freeze(new Highlight);
}