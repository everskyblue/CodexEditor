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
    AppBackNavigationEvent
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
import { httpd, PROJECT_PORT, PROJECT_URL, createServer } from "../process/server";

export function App() {
    return (
        <CoordinatePage
            toolbarColor={theme.AppBar.background()}
            layoutData="stretch"
            drawerActionVisible
        >
            <Action
                title="run"
                image="/assets/img/play48.png"
                onSelect={() => {
                    const tab = $(TabEditor).only();
                    const file = tab.activeWidget?.data.file;
                    if (file?.endsWith('.html')) {
                        let url = 'file://' + file;
                        if (typeof httpd !== 'undefined') {
                            url = PROJECT_URL;
                            createServer(PROJECT_PORT, getStorage().currentProject);
                        }
                        const w = WebView({
                            stretch: true,
                            elevation: 1,
                            url
                        })

                        contentView.append(w)
                        app.once('backNavigation', (e: AppBackNavigationEvent) => {
                            w.dispose();
                            httpd?.stopServer();
                            e.preventDefault();
                        })
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