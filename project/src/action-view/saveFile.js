import { TabEditor } from "../components/tabs/TabEditor";
import moduleRequire from "../lib";
import { decode } from "base-64";
import { fs, WebView } from "tabris";

const json = moduleRequire("@module/json");

function writeFile({ data }) {
    try {
        const { action, value, file } = JSON.parse(data);
        if (!json.isCdxBriget(data)) return;
        fs.writeFile(file, decode(value));
    } catch (e) {
        console.error(e)
    }
}

/**
 * @param {import('tabris').WebViewMessageEvent | any} event
 */
function saveFile(event) {
    const tabEditor = $(TabEditor).only();
    if (!tabEditor.data.activeWidget) return;
    if (event && event.target instanceof WebView) return writeFile(event);
    if (tabEditor.activeWidget) {
        const wv = tabEditor.data.activeWebView;
        //const { isEventCreated } = wv.data;
        wv.postMessage(
            json.encode({
                action: "@cdx/sendValue",
                args: [],
            }),
            "*"
        );
    }
}

export default saveFile;
