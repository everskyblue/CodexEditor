import { Codex } from "../monarca/editor/codex";
import {
    $,
    Setter,
    Composite,
    contentView,
    Page,
    Action,
    drawer,
    ScrollView,
} from "tabris";
import addView, { CoordinatePage } from "voir-native";
import FileExplore from "./ui/FileExplorer";
import SideView from "./ui/SideView";
import TabView from "./components/TabView";
import { resolve, basename } from 'path'
import { getStorage } from "./storage";

contentView.append(
    <CoordinatePage toolbarColor="#000022" layoutData="stretch" drawerActionVisible>
        <Action title="explorar" placement="overflow" onSelect={FileExplore} />
        <Page background="#312c4a" title="CodexEditor">
            <Composite id="container" stretch></Composite>
        </Page>
    </CoordinatePage>
);

const codex = new Codex($("#container").only(), {
    language: "javascript",
    value: `function main(){
        console.log(true); 
    }`,
    worker:{
        paths: {
            javascript: resolve(__dirname, '../monarca/syntax')
        }
    }
});

codex.create();

const side = async () => {
    const views = await SideView();
    const dirname = basename(getStorage().currentProject);
    drawer.background = '#312c4a';
    drawer.append(
        <TabView title={dirname}>
            {views}
        </TabView>
    );
};

side();