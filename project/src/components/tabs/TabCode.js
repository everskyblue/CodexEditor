import { TextView, ImageView, Row, WebView } from "tabris";
import { getMonacoNameTheme, getMonacoTheme, theme } from "../../theme";
import libs from "../../libraries";
import json from "../../json";
import { getStorage, getEditorConfig } from "../../store";
import { basename } from "path";
import { getValuePreference } from "voir-native";
import saveFile from "../../action-view/saveFile";
import { assets_url } from "../../process/server"

function loadWebView(wv, file, source) {
    const indexNameTheme = getValuePreference('currentTheme');
    wv.postMessage(
        json.encode({
            action: "@cdx/set",
            args: [libs, {
                name: indexNameTheme ? getMonacoNameTheme(indexNameTheme).replace("_", "") : '',
                definition: indexNameTheme ? getMonacoTheme(indexNameTheme) : ''
            }],
        }),
        "*"
    );
    
    wv.postMessage(
        json.encode({
            action: "@cdx/editorInit",
            args: [
                file,
                source,
                file.replace(
                    getStorage().currentProject,
                    basename(getStorage().currentProject)
                ),
                getEditorConfig(),
            ],
        }),
        "*"
    );
    if (wv.opacity === 0) {
        wv.opacity = 1;
    }
}

let tabId = 0;
export function TabCode({ title, source, file, image, url = assets_url }) {
    const textId = `tab-${++tabId}`;
    const wvId = `tab-ref-${tabId}`;
    return (
        <$>
            <WebView
                stretch
                id={wvId}
                class={textId}
                url={url}
                opacity={0}
                onLoad={({ target }) => loadWebView(target, file, source)}
                onMessage={saveFile}
            />
            <Row
                highlightOnTouch
                left="prev()"
                background={theme.Tab.activeBackground()}
                padding={[8, 16]}
                data={{ file }}
                id={textId}
                spacing={8}
            >
                <ImageView image={image} width={20} height={20} />
                <TextView text={title} textColor={theme.Tab.foreground()} />
                <ImageView class="img-state-save" visible={false} image='/assets/img/point.png' width={20} height={20} />
            </Row>
        </$>
    );
}
