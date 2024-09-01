import './ui/app-theme'
import './process/indexing'
import { contentView, drawer } from "tabris"
import { App, NavigationDrawer } from "./components/App"
import { theme } from "./theme"

contentView.append(<App />);
drawer.append(<NavigationDrawer />)
drawer.background = theme.SideBar.background(drawer);
contentView.apply({
    "Page": {
        background: theme.AppBar.background()
    }
})


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
