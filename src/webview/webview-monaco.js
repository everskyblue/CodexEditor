const { Worker, NavigationView, Page, Action, app, contentView, WebView } = require("tabris");

const w = new Worker(__dirname + (__dirname.endsWith('/')?'':'/')+'worker.js');

contentView.append(
    NavigationView({
        stretch: true
    }).append(Action({
        title: "reload",
        placement: "overflow",
        onSelect() {
            app.reload();
        }
    }), Page({
        stretch: true,
        title: "test app"
    }).append(
        WebView({
            stretch: true,
            url: '/editor.html',
            onNavigate: (e) => {
                console.log(e);
            },
            onLoad: (e) => {
                console.log(e)
                w.postMessage({})
            },
            onMessage(e) {
                console.log(e)
            }
        })
    ))
)