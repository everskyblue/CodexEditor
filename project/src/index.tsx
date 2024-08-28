import './ui/app-theme'
import './process/initialize'
import { Codex } from "../monarca/editor/codex";
import {
    $,
    Composite,
    contentView,
    Page,
    Action,
    drawer,
    ScrollView,
    Stack,
    WebView,
    app
} from "tabris";
import { CoordinatePage } from "voir-native";
import FileExplore from "./ui/FileExplorer";
import FileView from "./ui/FileView";
import TabView from "./components/TabView";
import { resolve, basename } from "path";
import { getStorage } from "./store";
import { ActivityBar, ActivityBarLayout } from "./components/ActivityBar";
import { ExtensionView } from "./components/ExtensionView";
import { TabEditor } from "./components/tabs/TabEditor";
import { theme } from './theme'
import viewSetting from './action-view/settings'
import actionOpenFile from './action-view/openFile'
import actionCreateProject from './action-view/createProject'
import actionShowProjects from './action-view/showProjects'
import actionSaveFile from './action-view/saveFile'
//devTools.hideUi(); background="#312c4a" 


contentView.append(
    <CoordinatePage
        toolbarColor={theme.AppBar.background()}
        layoutData="stretch"
        drawerActionVisible
    >
        <Action
            title="run"
            image="/assets/img/play48.png"
        />
        
        <Action
            title="Abrir Archivo"
            placement="overflow"
            onSelect={actionOpenFile}
        />
        
        <Action
            title="Guardar"
            placement="overflow"
            onSelect={actionSaveFile}
        />
        
        
        <Action
            title="Cerrar Todo"
            placement="overflow"
            onSelect={() => {
                const tab = contentView.find(TabEditor).first() as TabEditor;
                tab.closeAll();
            }}
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
            title="configuración" 
            placement="overflow" 
            onSelect={viewSetting} 
        />
        
        <Action
            title="Salir"
            placement="overflow"
            onSelect={() => app.close()}
        />
        
        <Page title="CodexEditor" id='uio'>
            <Stack
                stretch
            >
                <Composite excludeFromLayout id="container" stretch></Composite>
                <TabEditor
                    id="tab-editor"
                    stretchX
                    background={theme.Tab.background()}
                >
                </TabEditor>
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
    //const views = await SideView();
    const rootProject = getStorage().currentProject;
    const dirname = basename(rootProject);
    drawer.append(
        <ActivityBar open={0}>
            <ActivityBarLayout title="proyecto" image="/assets/img/file.png">
                <TabView title={`proyecto - ${dirname}`} id="view-project">
                    <ScrollView
                        left={0}
                        right={0}
                        baseline
                        class="interactiveHScrollContent"
                        direction="horizontal"
                        padding={5}
                    >
                        <FileView left={0} path={rootProject} filename={dirname} />
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

contentView.apply({
    "Page": {
        background: "rgba(0,0,0,0.541)"
    }
})
