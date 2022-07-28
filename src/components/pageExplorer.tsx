import {Page, NavigationView} from 'components-tabris'
import {
    CollectionView, 
    TextView,
    ImageView,
    RowLayout,
    //fs,
    Composite,
    permission
} from 'tabris'
//@ts-ignore
import {resolve} from 'path'
import {readDir, TypeFile} from '../fs/reader'
import type {FilterFile} from '../fs/types'
import {getIconPath, TypeIcon} from '../icon'

let filesystem: FilterFile;

const permission_storage = [
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.INTERNET',
    //'android.permission.STORAGE',
    //'android.permission.MANAGE_EXTERNAL_STORAGE'
]

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
        } catch (e) {}
        
        return null;
    } catch (e) {
        throw new Error('permission no permitted, declare permission in config.xml');
    }
}

const read = async (path: string): Promise<FilterFile> => {
    const order: FilterFile = await readDir(path) as FilterFile;
    order.lists.splice(0, 0, {
        name: '..',
        type: TypeFile.DIRECTORY,
        absolutePath: resolve(path, '../')
    })
    filesystem = order;
    return order;
}

const createCell = (): Composite => {
    return  (
        <Composite 
            padding={10}
            layout={new RowLayout({spacing: 15})}
            stretchX
            highlightOnTouch
            onTap={async ({target})=> {
                const collection: CollectionView = target.parent() as CollectionView;
                const item = filesystem.lists[collection.itemIndex(target)];
                if (item.type === TypeFile.FILE) return;
                collection.refreshIndicator = true;
                await read(item.absolutePath);
                setTimeout(()=> {
                    collection.load(filesystem.lists.length);
                    collection.refreshIndicator = false;
                }, 500)
            }}
        >
            <ImageView />
            <TextView centerY />
        </Composite>
    )
}

const updateCell = (cell: Composite, index: number)=> {
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
            stretch
        />
    )
}

const loadPage = async ({target}: {target: Page})=> {
    if (filesystem === undefined) {
        await read('/storage/emulated/0'); // fs.externalFileDirs.shift()
    }
    target.append(createCollection());
    try {
        const result = await permissionStorage();
        console.log(result)
    } catch (e) {}
}

export default () => {
    $(NavigationView).only().append(
        <Page 
            title='explorador'
            onAppear={loadPage}
            stretch
        />
    )
}