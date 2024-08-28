const { contentView, Stack, app, Button } =  require('tabris')

contentView.background = 'black';

contentView.append(Stack({
    centerX: true,
    centerY: true
}).append(
    Button({
        text: 'webview monaco',
        centerX: true,
        onSelect() {
            const root =  app.getResourceLocation('src/webview/package.json');
            app.reload(root)
        }
    }), Button({
        text: 'load project',
        centerX: true,
        onSelect() {
            const root =  app.getResourceLocation('src/project');
            app.reload(root)
        }
    })
))