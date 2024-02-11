import { fs } from "tabris";
//@ts-ignore
import { join } from "path";
import type { FileInfo, FilterFile } from "./types";

export enum TypeFile {
    DIRECTORY = 0,
    FILE = 1,
}

export async function readFile(
    rootfile: string,
    encoding: string = "utf-8"
): Promise<string> {
    const text = await fs.readFile(rootfile, encoding);
    return text;
}

export async function readDir(
    path: string,
    sort: boolean = true
): Promise<FileInfo[] | FilterFile> {
    const files = await fs.readDir(path);
    const joinFiles: FileInfo[] = files.map((name) => {
        const absolutePath: string = join(path, name);
        return {
            name,
            absolutePath,
            type: fs.isFile(absolutePath) ? TypeFile.FILE : TypeFile.DIRECTORY,
        };
    });
    if (!sort) return joinFiles;
    const filterDirs = joinFiles
        .filter((file) => file.type === TypeFile.DIRECTORY)
        .sort();
    const filterFiles = joinFiles
        .filter((file) => file.type === TypeFile.FILE)
        .sort();
    const lists = filterDirs.concat(...filterFiles);
    return {
        directories: filterDirs,
        files: filterFiles,
        lists,
    } as FilterFile;
}
