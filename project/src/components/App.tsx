import {
    $,
    app,
    contentView,
    Composite,
    Page,
    Action,
    ScrollView,
    Stack,
    WebView,
    TextView,
    type AppBackNavigationEvent
} from "tabris";
import { CoordinatePage, getValuePreference } from "voir-native";
import { resolve, basename } from "path";

import FileExplore from "../ui/FileExplorer";
import FileView from "../ui/FileView";

import TabView from "./TabView";
import { ActivityBar, ActivityBarLayout } from "./ActivityBar";
import { ExtensionView } from "./ExtensionView";
import { TabEditor } from "./tabs/TabEditor";

import { getStorage } from "../store";
import { theme } from '../theme'

import viewSetting from '../action-view/settings'
import actionOpenFile from '../action-view/openFile'
import actionCreateProject from '../action-view/createProject'
import actionShowProjects from '../action-view/showProjects'
import actionSaveFile from '../action-view/saveFile'
import { PROJECT_PORT, PROJECT_URL, Server } from "../process/server";
import reqLib from "../lib";

const { InAppBrowser } = reqLib("@module/codex-browser");

export function App() {
    const currentProject = getStorage().currentProject;
    const server = Server.create(PROJECT_PORT, currentProject);
    const events = {
        onExit(evt: AppBackNavigationEvent, ctx: typeof InAppBrowser) {
            ctx.dispose();
            evt.preventDefault();
        }
    };
    
    return (
        <CoordinatePage
            toolbarColor={theme.AppBar.background()}
           layoutData="stretch"
            drawerActionVisible
        >
            <Action
                title="run"
                image={{ src: "/assets/img/play48.png", width: 24, height: 24 }}
                onSelect={async () => {
                    const tab = $(TabEditor).only();
                    const file = tab.activeWidget?.data.file;
                    if (file?.endsWith('.html')) {
                        let url = 'file://' + file;
                        if (server.canCreateServer()) {
                            const { error, url: urlProject } = await server.initializeIfNotExists();
                            if (error) console.warn("error al crear el servidor");
                            else url = PROJECT_URL;
                        }
                        contentView.append(
                            <InAppBrowser
                                url={url}
                                events={events}
                            />
                        )
                    }
                }}
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
}

export function NavigationDrawer() {
    const rootProject = getStorage().currentProject;
    const dirname = rootProject ? basename(rootProject) : 'untitled';
    
    return (
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
                        {
                            rootProject  
                                ? <FileView left={0} path={rootProject} filename={dirname} />
                                : <TextView text='no hay proyecto activo' textColor='rgb(11, 224, 196)' />
                        }
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
}