const { NavigationView, Page, Action, app, contentView, WebView } = require("tabris");


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
            },
            onMessage(e) {
                console.log(e)
            }
        })
    ))
)