import { TextView, ImageView, Row, WebView } from "tabris";
import { theme } from "../../theme";
import libs from "../../libraries";
import { encode } from "base-64";
import moduleRequire from "../../lib";
import { getStorage } from "../../store";
import { basename } from "path";

const json = moduleRequire("@module/json");

function loadWebView(wv, file, source) {
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
            ],
        }),
        "*"
    );

    wv.postMessage(
        json.encode({
            action: "@cdx/editorLibs",
            args: [libs],
        }),
        "*"
    );
}

let tabId = 0;
export function TabCode({ title, source, file, image, url = "/editor.html" }) {
    const textId = `tab-${++tabId}`;
    const wvId = `tab-ref-${tabId}`;
    return (
        <$>
            <WebView
                stretch
                id={wvId}
                class={textId}
                url={url}
                onLoad={({ target }) => loadWebView(target, file, source)}
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
                <ImageView 
                    image={image}
                    width={20}
                    height={20}
                />
                <TextView
                    text={title}
                    textColor={theme.Tab.foreground()}
                />
            </Row>
        </$>
    );
}
