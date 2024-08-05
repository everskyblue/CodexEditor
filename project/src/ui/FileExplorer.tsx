import {
    app,
    Action,
    AlertDialog,
    $,
    CollectionView,
    Composite,
    RefreshComposite,
    Constraint,
    EventObject,
    ImageView,
    Page,
    RowLayout,
    TextView,
    fs,
    ScrollView,
    LayoutData
} from "tabris";
import { Voir } from "voir-native";
import { TypeFile, readDir, FileAccess } from "../fs/reader";
import { File, FilterFile } from "../fs/types";
import { resolve } from "path";
import { TypeIcon, getIconPath } from "../icon";
import { saveProject, getStorage, save } from "../storage";
import * as Icon from './Icons'

const updateCell = (cell: CellView, index: number) => {
    return cell.setValues(index);
};

function addDot(fileFilter: FilterFile, path: string) {
    fileFilter.lists.splice(0, 0, {
        name: "..",
        type: TypeFile.DIRECTORY,
        absolutePath: resolve(path, "..")
    });
}

async function read(path: string) {
    const order = (await readDir(path)) as FilterFile;
    if (order.errorAccess === FileAccess.NotFount) {
        AlertDialog.open("directorio no encontrado");
    }
    if (order.errorAccess === FileAccess.NotAllowed) {
        AlertDialog.open(
            "tiempo de espera terminado. puede que el directorio accedido no pueda ser leido."
        );
    }
    if (FileAccess.Allowed) {
        addDot(order, path);
    }
    return order;
}

class CellView extends Composite {
    private file: File;

    constructor(private readonly explore: FileExplore) {
        super({
            layoutData: LayoutData.stretchX,
            highlightOnTouch: true,
            padding: 10,
            layout: new RowLayout({
                spacing: 15
            })
        });
        
        const handlerTap = () => {
            if (this.file.type !== TypeFile.FILE) {
                this.explore.refresh(this.file.absolutePath);
            }
        }
        
        this.append(
            <$>
                <ImageView height={32} width={32} />
                <TextView textColor="#ffffff" centerY />
            </$>
        ).onTap(handlerTap)
    }

    setValues(index: number) {
        const image = this.find(ImageView).only();
        const text = this.find(TextView).only();
        const fileInfo: File = this.file = this.explore.files.lists[index];
        const isFile = fileInfo.type === TypeFile.FILE;
        text.text = fileInfo.name;
        image.image = getIconPath(
            fileInfo.name,
            isFile ? TypeIcon.FILE : TypeIcon.DIRECTORY
        );
    }
}

class FileExplore extends Voir.Render {
    public root!: string;
    public files!: FilterFile;
    
    static onSelectAction = (instance: FileExplore) => () => {
        if (instance.files.errorAccess === FileAccess.Allowed) {
            saveProject(instance.root);
            app.reload();
        } else {
            AlertDialog.open('no puedes seleccionar este directorio');
        }
    };

    async showFiles({ target }: EventObject<Page>) {
        const oldPath = getStorage().fileExplorer;
        this.root = oldPath ?? fs.externalFileDirs.shift();
        this.files = await read(this.root);
        this.breadcrumd(this.root);
        target.append(
            <CollectionView
                stretch
                refreshEnabled
                id="v-files"
                top={Constraint.prev}
                itemCount={this.files.lists.length}
                createCell={() => new CellView(this)}
                updateCell={updateCell}
                onRefresh={()=> this.refresh(this.root)}
            />
        );
    }

    constructor() {
        super();
    }

    async refresh(path: string) {
        const collection = $(CollectionView).only();
        const currentFileLists = this.files.lists;
        let time = 0;
        
        collection.refreshIndicator = true;
        this.root = path;
        this.files = await read(path);
        
        if (this.files.errorAccess === FileAccess.Allowed && JSON.stringify(this.files.lists) !== JSON.stringify(currentFileLists)) {
            time = 500;
            save({
                fileExplorer: path
            })
            this.breadcrumd(path);
            collection.load(this.files.lists.length)
        }
        
        setTimeout(() => {
            collection.refreshIndicator = false;
        }, time);
    }

    private mapFiles(files: FilterFile) {
        //return files.lists.map(file => updateCell(createCell(), file));
    }

    private breadcrumd(root: string) {
        const paths = root.split("/");
        const bread = $("#breadcrumd").only() as ScrollView;
        bread.children().dispose();
        paths.forEach((path, index) => {
            if (path.trim().length === 0) return void 0;
            bread.append(
                <TextView
                    background="#1f2937"
                    textColor="#ffffff"
                    cornerRadius={5}
                    padding={[5, 8]}
                    text={path}
                    left={Constraint.prev}
                    highlightOnTouch
                    onTap={() => event.call(this, index)}
                />
            );
            if (index < paths.length - 1 && index > 0) {
                bread.append(
                    <TextView
                        textColor="#9ca3af"
                        text="⟩"
                        padding={[5, 2]}
                        left={Constraint.prev}
                    />
                );
            }
        });

        function event(index: number) {
            if ($('#v-files').only(CollectionView).refreshIndicator) return;
            const path = paths.slice(0, index + 1).join("/");
            this.refresh(path);
        }
    }
    
    renderAction() {
        return (
            <$>
                <Action
                    title="seleccionar"
                    placement="overflow"
                    onSelect={FileExplore.onSelectAction(this)}
                />
            </$>
        );
    }

    render() {
        return (
            <Page
                stretch
                background="#312c4a"
                title="explorador de archivos"
                onAppear={e => this.showFiles(e)}
            >
                <Composite stretchX padding={[5, 10]}>
                    <Icon.Home onTap={()=> this.refresh(fs.externalFileDirs.shift())} />
                    <ScrollView
                        left={[Constraint.prev, 10]}
                        right={0}
                        direction="horizontal"
                        id="breadcrumd"
                        scrollbarVisible={false}
                    />
                </Composite>
            </Page>
        );
    }

}

export default Voir.factory(FileExplore);
