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

export default function FileView({ path, filename }: Pick<any, any>) {
    const data = {
        isOpen: false,
        isReader: false,
        isFile: fs.isFile(path),
    };

    const handleTap = async ({ target }: WidgetTapEvent<Composite>) => {
        if (target.data.reset) {
            delete target.data.reset;
            data.isOpen = false;
            return;
        }
        
        if (!data.isFile && !data.isReader) {
            const filter = (await readDir(path)) as FilterFile;
            const views = filter.lists.map((file) => (
                <FileView path={file.absolutePath} filename={file.name} />
            ));
            target.parent().append(views);
            data.isReader = data.isOpen = true;
        } else if (!data.isFile && data.isReader) {
            target.siblings(Composite).set({
                excludeFromLayout: data.isOpen,
            });
            data.isOpen = !data.isOpen;
        } else if (data.isFile && !data.isOpen) {
            const source = await readFile(path);
            const tab = contentView.find(TabEditor).first() as TabEditor;
            tab.append(<TabCode 
                file={path} 
                source={source} 
                title={basename(path)} 
            />);
            data.isOpen = !data.isOpen;
        }
    };

    return (
        <Composite padding={{ left: 24 }} top={Constraint.prev} left={0}>
            <Composite
                highlightOnTouch
                //top={Constraint.prev}
                left={0}
                padding={[5, 15, 5, 5]}
                onTap={handleTap}
                id={path}
            >
                <ImageView
                    image={getIconPath(
                        filename,
                        data.isFile ? TypeIcon.FILE : TypeIcon.DIRECTORY
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
