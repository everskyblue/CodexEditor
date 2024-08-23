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
    TextView,
    Stack,
    WebView
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
import viewSetting from './action-view/settings'
import actionOpenFile from './action-view/openFile'
import actionCreateProject from './action-view/createProject'
import actionShowProjects from './action-view/showProjects'
//devTools.hideUi(); background="#312c4a" 

contentView.append(
    <CoordinatePage
        toolbarColor={theme.AppBar.background()}
        layoutData="stretch"
        drawerActionVisible
    >
        <Action
            title="Abrir Archivo"
            placement="overflow"
            onSelect={actionOpenFile}
        />

        <Action
            title="Crear Proyecto"
            placement="overflow"
            onSelect={actionCreateProject}
        />

        <Action
            title="Proyectos Abiertos"
            placement="overflow"
            onSelect={actionShowProjects}
        />
        
        <Action 
            title="explorar" 
            placement="overflow"
            onSelect={FileExplore} 
        />
        
        <Action 
            title="configuracion" 
            placement="overflow" 
            onSelect={viewSetting} 
        />
        
        <Action
            title="Salir"
            placement="overflow"
            onSelect={() => app.close()}
        />
        
        <Page title="CodexEditor">
            <Stack
                stretch
            >
                <ScrollView
                    id="tab-editor"
                    stretchX
                    background={theme.Tab.background()}
                >
                    <TextView
                        highlightOnTouch
                        text="my tab"
                        width={100}
                        background={theme.Tab.activeBackground()}
                        textColor={theme.Tab.foreground()}
                        padding={[8, 16]}
                    />
                </ScrollView>
                <WebView
                    stretch
                    url="/editor.html"
                />
                <Composite id="container" stretch></Composite>
            </Stack>
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

//codex.create();

const side = async () => {
    drawer.background = theme.SideBar.background(drawer);
    const views = await SideView();
    const dirname = basename(getStorage().currentProject);
    drawer.append(
        <ActivityBar open={0}>
            <ActivityBarLayout title="proyecto" image="/assets/img/file.png">
                <TabView title={dirname} id="view-project">
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
};

side();
