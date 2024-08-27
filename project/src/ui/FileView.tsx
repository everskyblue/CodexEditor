import {
    WidgetTapEvent,
    Stack,
    Composite,
    Constraint,
    TextView,
    ImageView,
    fs,
    contentView
} from "tabris";
import { getIconPath, TypeIcon } from "../icon";
import { readDir, readFile } from "../fs";
import type { FilterFile } from "../fs/types";
import { extname, basename } from "path";
import { TabEditor, TabCode } from "../components/tabs/TabEditor";
import { getStorage } from '../store'
import delegateMenu from '../action-view/menus-file'

export default function FileView({ path, filename }: Pick<any, any>) {
    const isFile = fs.isFile(path);
    const handleTap = async ({ target }: WidgetTapEvent<Composite>) => {
        const { isReader, reset, isOpen, isFile } = target.data;
        if (reset) {
            delete target.data.reset;
            target.data.isOpen = false;
            return;
        }

        const srcImg = target.children(ImageView).first().image;

        if (!isFile && !isReader) {
            const filter = (await readDir(path)) as FilterFile;
            const views = filter.lists.map((file) => (
                <FileView path={file.absolutePath} filename={file.name} />
            ));
            target.parent().append(views);
            target.data.isReader = target.data.isOpen = true;
        } else if (!isFile && isReader) {
            target.siblings(Composite).set({
                excludeFromLayout: target.data.isOpen,
            });
            target.data.isOpen = !target.data.isOpen;
        } else if (isFile && !isOpen) {
            const source = await readFile(path);
            const tab = contentView.find(TabEditor).first() as TabEditor;
            tab.append(<TabCode
                file={path}
                image={srcImg}
                source={source}
                title={basename(path)}
            />);
            target.data.isOpen = !target.data.isOpen;
        }
    };

    return (
        <Composite padding={{ left: 24 }} top={Constraint.prev} left={0}>
            <Composite
                highlightOnTouch
                //top={Constraint.prev}
                left={0}
                data={{ file: path, typeNum: isFile ? 0 : 1, type: isFile ? 'file' : 'directory', isOpen: false, isReader: false, isFile }}
                padding={[5, 15, 5, 5]}
                onTap={handleTap}
                id={path}
                onLongPress={delegateMenu}
            >
                <ImageView
                    image={getIconPath(
                        filename,
                        isFile ? TypeIcon.FILE : TypeIcon.DIRECTORY
                    )}
                    width={24}
                    height={24}
                    centerY
                />
                <TextView centerY textColor="#ffffff" text={filename} left="prev() 10" />
            </Composite>
        </Composite>
    );
}
