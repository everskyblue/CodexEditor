import addView from 'voir-native'
import {
    CollectionView,
    TextView,
    ImageView,
    RowLayout,
    fs, app,
    Composite,
    permission,
    Action,
    Page,
    AlertDialog
} from 'tabris'
//@ts-ignore
import { resolve, join } from 'path'
import { readDir, TypeFile } from '../fs/reader'
import type { FilterFile, FilterDirInfo } from '../fs/types'
import { getIconPath, TypeIcon } from '../icon'
import { saveConfigProject } from '../load'
import DialogTextInput from './Dialog'

let filesystem: FilterFile;
let currentDirectory: string;

const permission_storage = [
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.INTERNET',
    'android.permission.MANAGE_EXTERNAL_STORAGE'
]

const refreshCollection = (path: string = currentDirectory) => {
    const collection: CollectionView = $(CollectionView).only() as CollectionView;
    read(path).then(() => {
        collection.load(filesystem.lists.length);
        collection.refreshIndicator = false;
    })
}

const loadNewCollection = ({ target }: { target: Composite }) => {
    const collection: CollectionView = target.parent() as CollectionView;
    const item = filesystem.lists[collection.itemIndex(target)];
    if (item.type === TypeFile.FILE) return;
    collection.refreshIndicator = true;
    refreshCollection(item.absolutePath)
}

function addDot(fileFilter: FilterFile, path: string) {
    fileFilter.lists.splice(0, 0, {
        name: '..',
        type: TypeFile.DIRECTORY,
        absolutePath: resolve(path, '../')
    })
}

async function permissionStorage(): Promise<boolean | null | never> {
    try {
        if (permission.isAuthorized(...permission_storage)) {
            return true;
        }
        try {
            // genera un error cuando se solicita y se rechaza la autorizacion
            // y no vuelve preguntar la autorizacion
            const status = await permission.requestAuthorization(...permission_storage);
            if (status === 'granted') {
                return true;
            } else if (status === 'declined') {
                return false;
            }
        } catch (e) { AlertDialog.open(e.message + ' error de permiso') }

        return null;
    } catch (e) {
        AlertDialog.open('permission no permitted, declare permission in config.xml');
    }
}

const read = async (path: string): Promise<FilterFile> => {
    const order: FilterFile = await readDir(path).catch(console.log) as FilterFile;
    addDot(order, path);
    filesystem = order;
    currentDirectory = path;
    return order;
}

const createCell = (): Composite => {
    return (
        <Composite
            padding={10}
            layout={new RowLayout({ spacing: 15 })}
            onTap={loadNewCollection}
            stretchX
            highlightOnTouch
        >
            <ImageView width={32} height={32} scaleMode="stretch" />
            <TextView centerY />
        </Composite>
    )
}

const updateCell = (cell: Composite, index: number) => {
    const image = cell.find(ImageView).only();
    const text = cell.find(TextView).only();
    const item = filesystem.lists[index];
    const isFile = item.type === TypeFile.FILE;
    image.image = getIconPath(item.name,
        isFile
            ? TypeIcon.FILE
            : TypeIcon.DIRECTORY
    );
    text.text = item.name;
}

const createCollection = () => {
    return (
        <CollectionView
            itemCount={filesystem.lists.length}
            createCell={createCell}
            updateCell={updateCell}
            onRefresh={() => refreshCollection()}
            refreshEnabled
            stretch
        />
    )
}

const loadPage = async ({ target }: { target: Page }) => {
    if (filesystem === undefined) {
        await read('/sdcard'); // , fs.externalFileDirs.shift()
    }
    target.append(createCollection());
    try {
        const result = await permissionStorage();
        console.log(result, 'permission')
    } catch (e) {
        console.error(e)
    }
}

const selectFolder = () => {
    saveConfigProject(currentDirectory);
    $(Page).only('#explorer').dispose();
    setTimeout(() => {
        app.reload();
    }, 500);
}

const createFolder = async () => {
    const dialog = DialogTextInput({
        title: 'Nueva Carpeta',
        message: 'nombre',
        btnOk: 'Crear'
    })

    const { texts } = await dialog.onCloseOk.promise() as any;
    const name = texts.shift();
    const collection: CollectionView = $(CollectionView).only();
    const index = filesystem.directories.length;
    if (name.length > 0) {
        const path: string = join(currentDirectory, name)
        if (!fs.isDir(path)) {
            await fs.createDir(path);
            filesystem.directories.push({
                type: TypeFile.DIRECTORY,
                absolutePath: path,
                name
            } as FilterDirInfo)
            filesystem.lists = [].concat(...filesystem.directories, ...filesystem.files);
            addDot(filesystem, currentDirectory);
            collection.load(filesystem.lists.length);
            collection.reveal(index)
        }
    }
}

export default () => {
    addView(
        <Action
            placement='default'
            title='Seleccionar'
            onSelect={selectFolder}
        />,
        <Action
            placement='overflow'
            title='Crear Carpeta'
            onSelect={createFolder}
        />,
        <Page
            id='explorer'
            title='explorador'
            onAppear={loadPage}
            stretch
        >
        </Page>
    )
}
