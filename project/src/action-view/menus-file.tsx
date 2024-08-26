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
import { renameFile, remove } from "./menu";
import { TabEditor } from "../components/tabs/TabEditor";
import { json, relativePathProject } from "../utils";
import { alert } from "../popup";

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
