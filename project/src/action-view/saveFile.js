import { TabEditor } from '../components/tabs/TabEditor'
import moduleRequire from '../lib'
import { decode } from 'base-64'
import { fs } from 'tabris'

const json = moduleRequire('@module/json');

function saveFile() {
    const tabEditor = $(TabEditor).only();
    if (tabEditor.activeWidget) {
        const wv = tabEditor.data.activeWebView;
        const { isEventCreated } = wv.data;
        const { file } = tabEditor.activeWidget.data;
        wv.postMessage(json.encode({
            action: '@cdx/sendValue',
            args: []
        }), '*');
        
        if (isEventCreated) return;
        
        wv.onMessage(({data}) => {
            const { action, value } = JSON.parse(data);
            if (!json.isCdxBriget(data)) return;
            fs.writeFile(file, decode(value));
        }).data.isEventCreated = true;
    }
}

export default saveFile;