import type {
    Properties,
    TextInput,
    TextInputInputEvent,
    TextView,
} from "tabris";

export type Color = `#${string}` | string;

export interface TokenColor {
    name: Color;
    regex: Color;
    keyword: Color;
    numeric: Color;
    strings: Color;
    comments: Color;
    punctuator: Color;
    identifier: Color;
    functionName?: Color;
}

export interface SemanthicTokenColor {}

export interface WidgetLineNumberColor {
    background: Color;
    text: Color;
}

export type TextEditorTheme = {
    widgetLineNumberColor?: WidgetLineNumberColor;
    widgetCodeColor?: Color;
    lineCodeActiveColor?: Color;
    cursorColor?: Color;
    selectionColor?: Color;
    tokenColor: TokenColor;
    semanthicTokenColor: SemanthicTokenColor;
};

/*------------------- EDITOR ---------------------------------*/

export type fnAppend<T> = (...children: T[]) => T;

export type fnEventReceived<TypeEvent> = (event: TypeEvent) => any;

export type SupportLanguage = "text" | "html" | "javascript" | "css";

export interface ConfigWorker {
    paths?: Record<string, string> | any;
    root?: string;
    getWorkerUrl?: (id: string) => string;
}

export type CodexConfig = {
    worker?: ConfigWorker;
    cursor?: ICursorConfig;
} & IEditorEntry;

export type IEditorEntry = {
    value: string;
    language: SupportLanguage;
};

export interface ICreateWidget {
    text(props?: Properties<TextView>): TextView;
    textarea(props?: Properties<TextInput>): TextInput;
    on(widget: TextInput, fnEvent: fnEventReceived<TextInputInputEvent>): any;
}

/*--------------------------------------*/

export interface IVendor {
    readonly packageID: string;
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly repo?: string;
    readonly aditionalInfo?: any;
}

export type RegisterProvider = {
    package: IVendor;
};

export type RegisterProviderTheme = RegisterProvider & { highlighted: any };

/*------------------- suggestion -------------------*/

export type SnippetType = "S" | "K" | "C" | "F" | "M" | "P" | "V";

export interface ISnippet {
    type: SnippetType;
    title: string;
    value: string;
    prefix: string;
    placeholder?: string;
    description?: string;
}

/*------------------- Cursor -------------------*/
type CursorTypeAnimation = "fade" | "fade-out";

export interface ICursorConfig {
    width: number;
    height: number;
    color: string;
    animationType: CursorTypeAnimation;
}
