import {
    AlertDialog,
    Composite,
    Row,
    RowLayout,
    TextView,
    ImageView,
    ActionSheet,
    ActionSheetItem,
    ScrollView,
    drawer,
    fs
} from 'tabris'
//@ts-ignore
import {join} from 'path'
import {encode} from 'base-64'
import type {WidgetCollection} from 'tabris'
import {getIconPath, TypeIcon} from './icon'
import {TypeFile, readFile} from './fs'
import DialogTextInput from './components/Dialog'
import {TabContent} from './components/TabEditor'

type MapStoreValue = {
    files: string[],
    directory: string[]
}
// una accion del menu, como al momento de copiar esta usara la accion de pegar
let actionFile: any;
// ayuda a previr que el menu se abra muchas veces
let isOpenAction: boolean = false;
const storeView = new Map<string, Composite>();
const storeFiles = new Map<string, MapStoreValue>();

type FileOption = {
    path: string,
    type?: TypeFile,
    typeImage?: TypeIcon, 
    left?: number,
    isOpen?: boolean,
    isReader?: boolean
}

type DataView = FileOption & { name: string };

async function $touchMenuOption(evt: any): Promise<void> {
    if (isOpenAction) return;
    touchMenuOption((evt.target.parent().parent() as Composite))
}

async function touchEvent({ target }: {target: Composite}) {
    const wrapperFile = target.parent().parent() as Composite;
    if (wrapperFile.parent() === drawer) return;
    const {path, name, isReader, isOpen} = wrapperFile.data;
    if (fs.isDir(path)) {
        if (isReader) {
            const wrapParentFolder: WidgetCollection = target.parent().siblings();
            wrapParentFolder.set({
                excludeFromLayout: isOpen
            });
            wrapperFile.data.isOpen = !isOpen;
        } else {
            const files = await fs.readDir(path);
            if (files.length > 0) {
                wrapperFile.append(fileRender(path, files))
                wrapperFile.data.isReader = true;
                wrapperFile.data.isOpen = true;
            }
        }
    } else {
        /*if (wrapperFile.data.isReader === false) {
            return;
        }*/
        
        const text = await readFile(path);
        const tab = $('#tabEditor').only() as Composite
        ///const encodeText = encodeURIComponent(encode(text));
        const infoFile = {name, path}
        tab.append(<TabContent file={infoFile} content={encode(text)}  />)
        /*
        ($('.onerun').only() as WebView).postMessage(JSON.stringify({
            type: '@monaco/set-value',
            data: encodeText
        }), '*')*/
        wrapperFile.data.isReader = true;
        drawer.close();
    }
}

function ComponentFileOption({
    path,
    type,
    left = 15,
    isOpen = false,
    isReader = false
}: FileOption): Composite {
    const size = {
        width: 32,
        height: 32
    };
    const name = path.substring(path.lastIndexOf('/') + 1);
    const icon = getIconPath(name, (type ===  TypeFile.DIRECTORY ? TypeIcon.DIRECTORY : TypeIcon.FILE));
    const data: DataView = {
        path,
        name,
        type,
        isOpen,
        isReader,
    };
    const layout = new RowLayout({
        spacing: 10,
        alignment: 'centerY'
    });

    const wrap = (
        <Composite
            data={data}
            padding={{ left }}
            top='prev() 2'
        >
            <Row alignment="bottom">
                <Composite
                    stretch
                    highlightOnTouch
                    onLongPress={$touchMenuOption}
                    onTap={touchEvent}
                    layout={layout}
                    padding={[5, 30, 5, 5]}
                >
                    <ImageView
                        scaleMode='stretch'
                        image={icon}
                        {...size}
                    />
                    <TextView
                        text={name}
                        class="text-filename"
                        textColor="white"
                        
                    />
                </Composite>
            </Row>
        </Composite>
    );
    storeView.set(path, wrap);
    storeFiles.set(path, {
        directory: [],
        files: []
    });

    return wrap;
}

function createComponentFileOption(file: string) {
    return <ComponentFileOption
        path={file}
        type={(fs.isFile(file) ? TypeFile.FILE : TypeFile.DIRECTORY)}
    />
}

async function resolveDialogCreate(dialog: AlertDialog): Promise<string | boolean> {
    const { button, texts } = await dialog.onClose.promise();
    if (button === 'ok') {
        return texts[0];
    }
    return false;
}

type TypeKey = 'files' | 'directory';
function setStoreFile(path: string, nwPath: string, key: TypeKey) {
    const listStoreFiles = storeFiles.get(path);
    listStoreFiles[key].push(nwPath);
    listStoreFiles[key].sort();
}

function insertViewTo(path: string, textComponentFile: string, type: TypeFile, excludeLayout: boolean, keyStoreFile: TypeKey) {
    const widgetStore = storeView.get(path);
    const listStoreFiles = storeFiles.get(path);
    // comprobar si es el widget root
    const isRoot = widgetStore === drawer.children().first();
    // su contenedor puede ser el ScrollView ruta principal o Composite ruta anidada
    const container = (isRoot ? drawer.find('#viewFiles').only() : widgetStore)  as Composite
    // obtener los hijos del widget padre
    const collection = isRoot ? container.children() : container.children().slice(1);
    // filtrar widgets donde la data sea de tipo @type
    const filterCollection = collection.filter((child: Composite) => {
        return child.data.type === type;
    });
    const findIndex = filterCollection.toArray().findIndex((child: Composite, index: number) => {
        return child.data.path !== listStoreFiles[keyStoreFile][index];
    });
    const component = createComponentFileOption(textComponentFile);
    component.excludeFromLayout = excludeLayout;
    if (findIndex >= 0) {
        component.insertBefore(filterCollection[findIndex]);
    } else if (filterCollection.length > 0) {
        // insertar en el ultimo elemento debido a que esta en orden los archivos
        component.insertAfter(filterCollection.last());
    } else {
        if (type === TypeFile.DIRECTORY) {
            // insertar antes del archivo
            component.insertBefore(collection.first());
        } else {
            // si no hay concidencia añade al ultimo
            container.append(component);
        }
    }
}

async function touchMenuOption(view: Composite): Promise<any> {
    const {
        name,
        path,
        type,
        isReader,
        isOpen
    }: DataView = view.data;
    
    isOpenAction = true;
    
    /**
    * cuando hay una accion de copiar o cortar
    * previene que el menu se abra cuando la seleccion es un archivo
    */
    if (actionFile && path && !fs.isDir(path)) return;

    const widgetStore = storeView.get(path);
    //const fileListStore = storeFiles.get(path);

    type OptionStyle = 'destructive'|'cancel'| 'default'

    type ItemsActionSheet = {
        title: string,
        style?: OptionStyle,
        action(): Promise<any>
    }

    type ConstructorActionSheet = {
        title: string,
        message: string,
        items: ItemsActionSheet[]
    }

    const actionsheet: ConstructorActionSheet = {
        title: actionFile ? path : 'Elejir Accion',
        message: actionFile ? name : `accion para el archivo: ${name}`,
        items: []
    }

    if (typeof actionFile === 'undefined') {
        if (type === TypeFile.DIRECTORY) {
            actionsheet.items.push({
                title: 'Crear Archivo',
                async action() {
                    const name = await resolveDialogCreate(DialogTextInput({
                        title: 'nuevo archivo',
                        message: 'nombre.txt',
                        btnOk: 'crear'
                    }));
                    if (typeof name !== 'string') return;
                    const nwFile = join(path, name);
                    if (fs.isFile(nwFile)) return AlertDialog.open('archivo existente');
                    try {
                        await fs.writeFile(nwFile, '');
                        setStoreFile(path, nwFile, 'files');
                        if (!isReader) return;
                        insertViewTo(path, nwFile, TypeFile.FILE, !isOpen, 'files');
                    } catch (e) {
                        console.log(e)
                        AlertDialog.open('error al crear el archivo');
                    }
                }
            }, {
                title: 'Crear Carpeta',
                async action() {
                    const name = await resolveDialogCreate(DialogTextInput({
                        title: 'nuevo directorio',
                        message: 'nombre',
                        btnOk: 'crear'
                    }))
                    if (typeof name === 'string') {
                        const nwPath = join(path, name);
                        if (fs.isDir(nwPath)) {
                            return AlertDialog.open('ya existe un directorio con el mismo nombre');
                        }
                        try {
                            await fs.createDir(nwPath);
                            setStoreFile(path, nwPath, 'directory');
                            if (!isReader) return;
                            insertViewTo(path, nwPath, TypeFile.DIRECTORY, !isOpen, 'directory');
                        } catch (e) {
                            console.log(e)
                            AlertDialog.open('ocurrio un error al crear el directorio');
                        }
                    }
                }
            })
        } else if (type === TypeFile.FILE) {
            actionsheet.items.push({
                title: 'renombrar',
                async action() {
                    DialogTextInput({
                        title: 'renombrar',
                        message: name,
                        btnOk: 'cambiar'
                    })
                }
            })
        }
        actionsheet.items.push({
            title: 'eliminar',
            style: 'destructive',
            async action() {
                const isDelete: boolean = await fs.remove(path);
                if (isDelete) {
                    widgetStore.dispose();
                    storeFiles.delete(path);
                    storeView.delete(path);
                } else {
                    AlertDialog.open('no se pudo eliminar')
                }
            }
        }, {
            title: 'copiar',
            async action() {

            }
        }, {
            title: 'cortar',
            async action() {

            }
        })
    } else {
        actionsheet.items.push({
            title: 'pegar',
            async action() {

            }
        })
    }

    actionsheet.items.push({
        title: 'cancelar',
        style: 'cancel',
        async action() { }
    })

    const items: ActionSheetItem[] = actionsheet.items.map(item => {
        return <ActionSheetItem title={item.title} style={item.style ?? 'default'} />
    })

    const actionSheet = ActionSheet.open(
        <ActionSheet title={actionsheet.title.toCapitalize()} actions={items}>
            {actionsheet.message}
        </ActionSheet>
    );

    let { index, action } = await actionSheet.onClose.promise();
    isOpenAction = false;
    if (action === null) return;
    return actionsheet.items[index].action().then(()=> {
        actionFile = undefined;
    });
}

function fileRender(path: string, files: string[]): Composite[] {
    const joinFiles = files.map(filename => join(path, filename));
    const filterDirs = joinFiles.filter(file => fs.isDir(file)).sort();
    const filterFiles = joinFiles.filter(file => fs.isFile(file)).sort();
    const listStoreFiles = storeFiles.get(path);
    if (typeof listStoreFiles !== 'undefined') {
        listStoreFiles.directory = filterDirs;
        listStoreFiles.files = filterFiles;
    }
    return filterDirs.concat(...filterFiles).map(file => {
        return createComponentFileOption(file)
    })
}

async function setViewProject(path: string) {
    if (!fs.isDir(path)) return AlertDialog.open('project not exists');

    const files: string[] = await fs.readDir(path);

    drawer.append(
        <$>
            <ComponentFileOption
                path={path}
                type={TypeFile.DIRECTORY}
                left={5}
                isOpen={true}
                isReader={true}
            />
            <ScrollView
                top="prev() 5"
                stretch
            >
                <ScrollView
                    id="viewFiles"
                    direction='horizontal'
                    padding={{left: 5, bottom: 15}}
                    left={0}
                    right={0}
                    baseline
                >
                    {fileRender(path, files)}
                </ScrollView>
            </ScrollView>
        </$>
    )
}

export default setViewProject;