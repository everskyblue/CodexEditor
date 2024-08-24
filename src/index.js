const { contentView, WebView } = require("tabris");


contentView.append(
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
)