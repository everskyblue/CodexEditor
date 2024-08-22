import './ui/app-theme'
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
    devTools,
    TextView
} from "tabris";
import { addView, CoordinatePage } from "voir-native";
import FileExplore from "./ui/FileExplorer";
import SideView from "./ui/SideView";
import TabView from "./components/TabView";
import { resolve, basename } from "path";
import { getStorage } from "./storage";
import { ActivityBar, ActivityBarLayout } from "./components/ActivityBar";
import { ExtensionView, FilterView } from "./components/ExtensionView";
import { theme } from './theme'
//devTools.hideUi(); background="#312c4a" 

contentView.append(
    <CoordinatePage
        toolbarColor={theme.AppBar.background()}
        layoutData="stretch"
        drawerActionVisible
    >
        <Action title="explorar" placement="overflow" onSelect={FileExplore} />
        <Page title="CodexEditor">
            <Composite id="container" stretch></Composite>
        </Page>
    </CoordinatePage>
);

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

const side = async () => {
    drawer.background = theme.SideBar.background(drawer);
    const views = await SideView();
    const dirname = basename(getStorage().currentProject);
    drawer.append(
        <ActivityBar open={1}>
            <ActivityBarLayout title="proyecto" image="/assets/img/file.png">
                <TabView title={dirname}>
                    <ScrollView
                        left={0}
                        right={0}
                        baseline
                        class="interactiveHScrollContent"
                        direction="horizontal"
                        padding={5}
                    >
                        {views}
                    </ScrollView>
                </TabView>
            </ActivityBarLayout>
            <ActivityBarLayout
                title="extensiones"
                image="/assets/img/packages.png"
            >
                <ExtensionView />
            </ActivityBarLayout>
        </ActivityBar>
    );

    drawer.open();
};

side();
