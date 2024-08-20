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

//devTools.hideUi();

contentView.append(
    <CoordinatePage
        toolbarColor="#000022"
        layoutData="stretch"
        drawerActionVisible
    >
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
    worker: {
        paths: {
            javascript: resolve(__dirname, "../monarca/syntax")
        }
    }
});

codex.create();

const side = async () => {
    const views = await SideView();
    const dirname = basename(getStorage().currentProject);
    drawer.background = "#312c4a";
    /*drawer.append(
        <TabView title={dirname}>
            {views}
        </TabView>
    );*/
    drawer.append(
        <ActivityBar open={1}>
            <ActivityBarLayout title="proyecto" image="/assets/img/file.png">
                <TabView title={dirname}>
                    <ScrollView
                        left={0}
                        right={0}
                        baseline
                        //id='interactiveHScrollContent'
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
