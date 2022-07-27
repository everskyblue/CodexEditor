import {
    AlertDialog,
    TextInput,
    Composite,
    Row,
    RowLayout,
    TextView,
    ImageView,
    StackLayout,
    ActionSheet,
    ActionSheetItem,
    ScrollView,
    drawer,
    fs
} from 'tabris'
import {
    join
} from 'path'
import type {
    WidgetCollection
} from 'tabris'
import {
    getConfigProject
} from './load'
import {
    Props,
    FileInfo,
    SRC_IMAGE
} from './model'
import {
    getIconPath,
    TypeIcon
} from './icon'
import {
    copyFile,
    moveFile,
    renameFile,
    TypeFile,
    readDir
} from './fs'
import DialogTextInput from './components/Dialog'

type MapStoreValue = {
    files: string[],
    directory: string[]
}

let actionFile: any;
const storeView = new Map <string, Composite>();
const storeFiles = new Map<string, MapStoreValue>();

type FileOption = {
    path: string,
    type?: TypeIcon,
    left?: number,
    isOpen: boolean,
    isReader: boolean
}

type DataView = FileOption & {name: string};

async function $touchMenuOption({target}) {
    touchMenuOption((target.parent().parent() as Composite))
}

async function touchEvent({target}) {
    const wrapperFile = target.parent().parent() as Composite;
    const dataPath: string = wrapperFile.data.path;
    if (fs.isDir(dataPath)) {
        if (wrapperFile.data.isReader) {
            const wrapParentFolder: WidgetCollection = target.parent().siblings();
            wrapParentFolder.set({
                excludeFromLayout: wrapperFile.data.isOpen
            });
            wrapperFile.data.isOpen = !wrapperFile.data.isOpen;
        } else {
            const files = await fs.readDir(dataPath);
            if (files.length > 0) {
                wrapperFile.append(fileRender(dataPath, files))
                wrapperFile.data.isReader = true;
                wrapperFile.data.isOpen = true;
            }
        }
    } else {
        console.log(wrapperFile.data)
    }
}

function ComponentFileOption({
    path, 
    type, 
    left = 15,
    isOpen = false,
    isReader = false
}: FileOption) {
    const size = {
        width: 30,
        height: 30
    };
    const name = path.substr(path.lastIndexOf('/') + 1);
    const icon = getIconPath(name, type);
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
            stretchX
            padding={{ left }}
            top={5}
            layout={new StackLayout()}
        >
            <Row height={size.height} stretchX alignment="bottom">
                <Composite
                    stretch
                    highlightOnTouch
                    onLongPress={()=> console.log(wrap)}
                    onTap={touchEvent}
                    layout={layout}
                >
                    <ImageView
                        image={icon}
                        {...size}
                    />
                    <TextView
                        text={name}
                        class="text-filename"
                        textColor="white"
                    />
                </Composite>
                <ImageView
                    highlightOnTouch
                    onTap={$touchMenuOption}
                    image={SRC_IMAGE.concat('/menu-vert48-white.png')}
                    {...size}
                />
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

function createComponentFileOption(file) {
    return <ComponentFileOption
        path={file}
        type={(fs.isFile(file) ? TypeIcon.FILE: TypeIcon.DIRECTORY)}
        />
}

async function resolveDialogCreate(dialog: AlertDialog): string | boolean {
    const {button, texts} = await dialog.onClose.promise();
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
    const container = isRoot ? drawer.find('#viewFiles').only() : widgetStore;
    // obtener los hijos del widget padre
    const collection = isRoot ? container.children() : container.children().slice(1);
    // filtrar widgets donde la data sea de tipo @type
    const filterCollection = collection.filter(child => {
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
    /**
    * cuando hay una accion de copiar o cortar
    * previene que el menu se abra cuando la seleccion es un archivo
    */
    if (actionFile && path && !fs.isDir(path)) return;
    
    const widgetStore = storeView.get(path);
    const fileListStore = storeFiles.get(path);
    
    const actionsheet = {
        title: actionFile ? path : 'Elejir Accion',
        message: actionFile ? name: `accion para el archivo: ${name}`,
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
                    console.log(nwFile)
                    try {
                        await fs.writeFile(nwFile, '');
                        setStoreFile(path, nwFile, 'files');
                        if (!isReader) return;
                        insertViewTo(path, nwFile, TypeFile.FILE, !isOpen, 'files');
                    } catch(e) {
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
                        console.log(nwPath)
                        try {
                            await fs.createDir(nwPath);
                            setStoreFile(path, nwPath, 'directory');
                            if (!isReader) return;
                            insertViewTo(path, nwPath, TypeFile.DIRECTORY, !isOpen, 'directory');
                        } catch (e) {console.log(e)
                            AlertDialog.open('ocurrio un error al crear el directorio');
                        }
                    }
                }
            })
        } else if (type === TypeFile.FILE) {
            actionsheet.items.push({
                title: 'renombrar',
                async action() {
                    const dialog = DialogTextInput({
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
        action(){}
    })
    
    const actionSheet = ActionSheet.open(
        <ActionSheet title={actionsheet.title.toCapitalize()}>
            {actionsheet.message}
            {actionsheet.items.map(item => <ActionSheetItem title={item.title} style={item.style??'default'} />)}
        </ActionSheet>
    );

    let {index, action} = await actionSheet.onClose.promise();
    
    if (action === null) return;
    
    return actionsheet.items[index].action();
    
    if (totalItems === 2) {
        if (index === 0) {
            actionFile.exec(path);
        }
        return (actionFile = undefined);
    }

    // para los botones de crear
    if (totalItems === 5) index += 2;
    // para el boton cancelar
    if (totalItems === 6 && index === 5) index += 1;

    const viewFS: Composite = storeView.get(path);
    // new file, directory. rename file, directory
    if (index === 0 || index === 1 || index === 5) {
        const textTitle = index <= 1 ? (`Nombre del ${!index ? 'archivo': 'directorio'}`): 'Cambiar nombre';
        const btnOk = index <= 1 ? 'Crear': 'Renombrar';

        const dialog = AlertDialog.open(
            <AlertDialog title={textTitle} buttons={ { ok: btnOk, cancel: 'Cancelar' }}>
        <TextInput keyboard="ascii" text={index === 5 ? name: ''} message="nombre" />
      </AlertDialog>
        );

        const {
            button,
            texts
        } = await dialog.onClose.promise();

        if (button !== 'ok') return;

        const nwFileInfo = {
            name: texts[0],
            path: path.concat('/', texts[0])
            
        };
        
        if (index === 1) {
            if (fs.isDir(nwFileInfo.path)) {
                return AlertDialog.open('ya existe un directorio con el mismo nombre');
            }
            await fs.createDir(nwFileInfo.path);
        } else {
            if (fs.isFile(nwFileInfo.path)) {
                return AlertDialog.open('archivo existente');
            }
            // Renombrar
            if (index === 5) {
                await renameFile(path, nwFileInfo.name);
                // modificar valores de la vista
                const nwRoot = path.split('/').slice(0, -1).concat(nwFileInfo.name).join('/');
                storeView.delete(path);
                storeView.set(nwRoot, view);
                view.children().first().find('.text-filename').only().text = (view.data.name = nwFileInfo.name);
                view.data.path = nwRoot;
                view.data.name = nwFileInfo.name;
                return;
            } else {
                await fs.appendToFile(nwFileInfo.path, '');
            }
        }

        const component = createComponentFileOption(nwFileInfo.path);

        // si el archivo se crea en la ruta del proyecto
        if (viewFS.parent() === drawer) return (drawer.find('#viewFiles').only() as ScrollView).append(component);

        if (viewFS.data.isReader) {
            component.excludeFromLayout = !viewFS.data.isOpen;
            viewFS.append(component);
        }
    } else if (index === 2) {
        // eliminar
        console.log(path, name)
        const isDelete: boolean = await fs.remove(path);
        if (isDelete) {
            viewFS.dispose();
            storeView.delete(path);
        } else {
            AlertDialog.open('no se pudo eliminar')
        }
    } else if (index === 3 || index === 4) {
        // copiar y cortar
        actionFile = {
            widget: (<ActionSheetItem title={index === 3 ? 'pegar': 'mover aqui'} />),
            exec(nwPath: string) {
                const isDirProject = typeof nwPath === 'undefined';
                if (isDirProject) nwPath = getConfigProject().currentProject;
                const filename = nwPath.concat('/', name);
                // copy file
                if (index === 3) {
                    copyFile(path, nwPath)
                } else {
                    // move file
                    // widget directory
                    const widgetDir = storeView.get(nwPath);
                    moveFile(path, nwPath);
                    storeView.delete(path);

                    if (widgetDir.data.isReader || isDirProject) {
                        if (isDirProject) (drawer.find('#viewFiles').only() as ScrollView).append(view);
                        else widgetDir.append(view);
                        view.excludeFromLayout = isDirProject ? false: !widgetDir.data.isOpen;
                        view.data.path = filename;
                        storeView.set(filename, view);
                    } else {
                        view.dispose();
                    }
                }
            }
        }
    } else {
        // renombrar index 5
    }
}

function fileRender(path: string, files: string[]): ComponentFileOption[] {
    const joinFiles = files.map(filename => join(path, filename));
    const filterDirs = joinFiles.filter(file => fs.isDir(file)).sort();
    const filterFiles = joinFiles.filter(file => fs.isFile(file)).sort();
    const listStoreFiles = storeFiles.get(path);
    if (typeof listStoreFiles !== 'undefined')  {
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
                type={TypeIcon.DIRECTORY}
                left={0}
                isOpen={true}
                isReader={true}
            />
            <ScrollView 
                id="viewFiles" 
                top="prev() 5" 
                layout={new StackLayout()}
                padding={10}
                stretch 
            >
                {fileRender(path, files)}
            </ScrollView>
        </$>
    )
}
// mateo 25:29 rv60
export default setViewProject;