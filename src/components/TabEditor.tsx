import {
    fs,
    Composite,
    WebView,
    TextView,
    ScrollView,
    WidgetCollection
} from 'tabris'

import {getConfigEditor} from '../load'

type FileProp = {
    name: string,
    path: string
}

interface ITabContent {
    file: FileProp
    content: string
}

let id = 0;
const prefix = '$uuid';
const configEditor = getConfigEditor();

function message(keyValue: string, value: any = ''): string {
    return JSON.stringify({
        type: `@monaco/${keyValue}`,
        data: value
    })
}

function genIdentifier() {
    return (id++, (id + prefix));
}

function loadWebView(fileInfo: FileProp, content: string) {
    return ({target}: {target: WebView})=> {
        target.postMessage(message('config', {
            config: {...configEditor, value: content},
            filename: fileInfo.name
        }), '*');
        // actualizar
        target.onMessage(({data}) => {
            try {
                fs.writeFile(fileInfo.path, data)
            } catch (e) {
                console.log(e)
            }
        })
    }
}

export function TabContent({file, content}: ITabContent) {
    const uuid = genIdentifier();
    return (
        <$>
            <TextView 
                class={uuid} 
                text={file.name} 
                padding={10}
                left='prev()'
                centerY
                highlightOnTouch
            />
            <WebView
                top='#tabHeader'
                class={uuid} 
                background='black'
                url="/assets/index.html"
                stretch
                onLoad={loadWebView(file, content)}
            />
        </$>
    )
}

export class TabEditor extends Composite {
    private _text: string;
    
    private _content: Map<string, WebView> = new Map() 
    
    private readonly scroll = (
        <ScrollView 
            stretchX
            height={30}
            direction='horizontal'
            background='red'
            id='tabHeader'
        />
    )
    
    constructor(attrs: unknown) {
        super(attrs)
        this.append(this.scroll)
    }
    
    get text() {
        return this._text;
    }
    
    set text(str: string) {
        this._text = str;
    }
    
    private hiddenExcept(id: string) {
        const show = this._content.get(id);
        if (show) show.excludeFromLayout = false;
        
        this._content.forEach((value: WebView, key: string) => {
            if (id !== key) {
                //value.opacity = 0;
                value.excludeFromLayout = true;
                //value.postMessage(message('blur'), '*')
            }
        })
        
        if (show) {
            //show.opacity = 1;
            show.postMessage(message('focus'), '*');
        }
    }
    
    append(...childs: any[]) {
        const widget = childs[0];
        if (Array.isArray(widget) || widget instanceof WidgetCollection) {
            const text = (widget[0] as TextView);
            text.onTap(() => {
                this.hiddenExcept(text.class);
            })
            this.hiddenExcept(text.class);
            this._content.set(text.class, widget[1])
            this.scroll.append(text)
            return super.append(widget[1], ...childs.slice(1))
        }
        return super.append(...childs)
    }
}