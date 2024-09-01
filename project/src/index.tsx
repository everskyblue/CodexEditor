import './ui/app-theme'
import './process/indexing'
import { contentView, drawer, app } from "tabris"
import { App, NavigationDrawer } from "./components/App"
import { theme } from "./theme"
import { httpd } from "./process/server"

contentView.append(<App />);
drawer.append(<NavigationDrawer />)
drawer.background = theme.SideBar.background(drawer);
contentView.apply({
    "Page": {
        background: theme.AppBar.background()
    }
})

app.on("terminate", () => httpd?.stopServer());

/*
const codex = new Codex($("#container").only(), {
    language: "javascript",
    value: `function main(){
        console.log(true); 
    }`,
    worker: {
        paths: {
            javascript: resolve(__dirname, "../monarca/syntax")
        }
    }
});


codex.create();
*/
