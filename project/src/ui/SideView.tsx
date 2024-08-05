import FileView from "./FileView";
import { getStorage } from "../storage";
import { readDir } from "../fs";
import type { FilterFile } from "../fs/types";

async function getFileView(path: string) {
    if (path.length === 0) return [];
    const files = (await readDir(path)) as FilterFile;
    return files.lists.map((file) => (
        <FileView isTop={true} path={file.absolutePath} filename={file.name} />
    ));
}

export default async function SideView() {
    return await getFileView(getStorage().currentProject);
}
