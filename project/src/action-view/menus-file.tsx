import {
    fs,
    ActionSheetItem,
    ActionSheet,
    Row,
    type WidgetCollection,
    TextView,
    WidgetLongPressEvent,
    Composite,
    WebView,
} from "tabris";
import { basename } from "path";
import { renameFile, remove, createFs, TYPE_DIR, TYPE_FILE } from "./menu";
import { TabEditor } from "../components/tabs/TabEditor";
import { json, relativePathProject } from "../utils";
import { alert } from "../popup";
import FileView from "../ui/FileView";
const sizeImage = {
    width: 20,
    height: 20,
};

let options: any;

async function dispose(target: Composite, file: string) {
    const isFile = fs.isFile(file);
    const success = await remove(file);
    if (!success) return alert("no se pudo eliminar");
    const parent = target.parent();
    if (parent.children().length === 1 || !isFile) parent.dispose();
    else target.dispose();
}

function insertViewTo(
    target: Composite,
    fullPath: string,
    name: string,
    type: number
) {
    if (!target.data.isOpen) return;
    // filtrar widgets donde la data sea de tipo @type
    const filterCollection = target
        .siblings(Composite)
        .toArray()
        .filter((child: Composite) => {
            return child.children().first().data.typeNum === type;
        });

    const stringCollection = filterCollection.map(
        (child) => child.children().first().data.file
    );
    stringCollection.push(fullPath);
    stringCollection.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    const fIndex = stringCollection.findIndex((path) => path === fullPath);
    const fWidget = filterCollection[fIndex] ?? filterCollection.at(-1);
    const component = FileView({ path: fullPath, filename: name });
    if (fIndex === filterCollection.length)component.insertAfter(fWidget);
    else component.insertBefore(fWidget);
}

function menuOptionPaste(
    targetParent: Composite,
    currentPath: string,
    title: string,
    callback: any
) {
    return async (target: Composite, dir: string) => {
        const actionSheet = ActionSheet.open(
            <ActionSheet>
                Ejecutar Acción
                <ActionSheetItem
                    title={title}
                    image={{ src: "/assets/img/clipboard.png", ...sizeImage }}
                />
                <ActionSheetItem
                    title="cancelar"
                    image={{
                        src: "/assets/img/clipboard-off.png",
                        ...sizeImage,
                    }}
                />
            </ActionSheet>
        );

        const { index } = await actionSheet.onClose.promise();

        if (index === 1) {
            options = undefined;
        }
    };
}

async function menuOptionFile(target: Composite, file: string) {
    const actionSheet = ActionSheet.open(
        <ActionSheet title={basename(file)}>
            Opciones de Archivo
            <ActionSheetItem
                title="Renombrar"
                image={{ src: "/assets/img/edit.png", ...sizeImage }}
            />
            <ActionSheetItem
                title="Eliminar"
                image={{ src: "/assets/img/trash-x.png", ...sizeImage }}
                style="destructive"
            />
            <ActionSheetItem
                title="Copiar"
                image={{ src: "/assets/img/copy.png", ...sizeImage }}
            />
            <ActionSheetItem
                title="Mover"
                image={{
                    src: "/assets/img/transfer-in.png",
                    ...sizeImage,
                }}
            />
            <ActionSheetItem
                title="Cancelar"
                image={{ src: "/assets/img/cancel.png", ...sizeImage }}
                style="cancel"
            />
        </ActionSheet>
    );

    let { index } = await actionSheet.onClose.promise();

    if (index === 0) {
        const { success, file: nwFile } = await renameFile(file);
        if (success) {
            const name = basename(nwFile);
            const tabEditor: TabEditor = $(TabEditor).first();
            const tabsHeader: Row[] = tabEditor.tabRef.children(Row).toArray();

            for (let index = 0, tab; (tab = tabsHeader[index]); index++) {
                if (tab.data.file !== file) continue;
                tab.data.file = nwFile;
                tab.children(TextView).first().text = name;
                tabEditor.tabContent.children(WebView)[index].postMessage(
                    json.encode({
                        action: "@cdx/changeModel",
                        args: [relativePathProject(nwFile)],
                    }),
                    "*"
                );
                break;
            }

            target.data.file = target.id = nwFile;
            target.children(TextView).first().text = name;
        }
    } else if (index === 1) {
        dispose(target, file);
    } else if (index === 2) {
        // copiar
        options = menuOptionPaste(target, file, "pegar", () => {});
    } else if (index === 3) {
        // mover
        options = menuOptionPaste(target, file, "move aqui", () => {});
    }
}

async function menuOptionDir(target: Composite, file: string) {
    const actionSheet = ActionSheet.open(
        <ActionSheet title={basename(file)}>
            Elegir Opciones de Carpeta
            <ActionSheetItem
                title="Crear Archivo"
                image={{ src: "/assets/img/file-plus.png", ...sizeImage }}
            />
            <ActionSheetItem
                title="Crear Carpeta"
                image={{
                    src: "/assets/img/folder-plus.png",
                    ...sizeImage,
                }}
            />
            <ActionSheetItem
                title="Eliminar"
                image={{ src: "/assets/img/trash-x.png", ...sizeImage }}
                style="destructive"
            />
            <ActionSheetItem
                title="Cancelar"
                image={{ src: "/assets/img/cancel.png", ...sizeImage }}
                style="cancel"
            />
        </ActionSheet>
    );

    let { index } = await actionSheet.onClose.promise();
    if (index === 2) dispose(target, file);
    else if (index === 0 || index === 1) {
        const { success, fullPath, name } = await createFs(file, index);
        if (!success) return;
        insertViewTo(target, fullPath, name, index);
    }
}

async function delegateMenu({ target }: WidgetLongPressEvent<Composite>) {
    const { file, isOpenDialog } = target.data;
    if (isOpenDialog) return;
    target.data.isOpenDialog = true;
    if (options) await options(target, file);
    else if (fs.isFile(file)) await menuOptionFile(target, file);
    else await menuOptionDir(target, file);
    target.data.isOpenDialog = false;
}

export default delegateMenu;
