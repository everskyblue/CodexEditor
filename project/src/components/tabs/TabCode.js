import { TextView, WebView } from "tabris";
import { theme } from "../../theme";
import libs from '../../libraries'

let tabId = 0;

function loadWebView(wv, file) {
    //readFile(file)
}

export function TabCode({title, file, url = '/editor.html'}) {
    const textId = `tab-${++tabId}`;
    const wvId = `tab-ref-${tabId}`;
    return (
        <$>
            <WebView 
                stretch 
                id={wvId} 
                class={textId} 
                url={url}
                onLoad={({target})=> loadWebView(target, file)}
            />
            <TextView 
                highlightOnTouch
                text={title} 
                left='prev()'
                width={100}
                data={{active: true}}
                background={theme.Tab.activeBackground()}
                textColor={theme.Tab.foreground()}
                padding={[8, 16]}
                id={textId}
            />
        </$>
    )
}