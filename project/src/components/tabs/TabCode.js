import { TextView, WebView } from "tabris";
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
export function TabCode({ title, source, file, url = "/editor.html" }) {
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
            <TextView
                highlightOnTouch
                text={title}
                left="prev()"
                data={{ file }}
                background={theme.Tab.activeBackground()}
                textColor={theme.Tab.foreground()}
                padding={[8, 16]}
                id={textId}
            />
        </$>
    );
}
