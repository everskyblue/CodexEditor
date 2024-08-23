import {fs} from 'tabris'
//@ts-ignore
import {join} from 'path'
import type {File, FilterFile, FileInfo, FilterFileInfo, FilterDirInfo} from './types'

export enum TypeFile {
    DIRECTORY = 0,
    FILE = 1
}

export enum FileAccess {
    NotFount,
    NotAllowed,
    Allowed
}

class FileEntry {
    constructor(
        readonly name: string,
        readonly fullPath: string,
        readonly isFile: boolean,
        readonly isDirectory: boolean
    ) {}
}

export async function readFile(rootfile: string, encoding: string = 'utf-8'): Promise<string> {
    const text = await fs.readFile(rootfile, encoding);
    return text;
}

export async function readDir(path: string, sort: boolean = true): Promise<FileInfo | FilterFile> {
    const response = await new Promise((resolve, reject) => {
        let isWait = true;
        
        fs.readDir(path).then(dirs => {
            isWait = false;
            resolve(dirs);
        }).catch(()=> resolve(FileAccess.NotFount));
        
        const tout = setTimeout(()=> {
            if (isWait) {
                resolve(FileAccess.NotAllowed);
                clearTimeout(tout);
            }
        }, 2500);
    });
    const errorAccess: FileAccess = Array.isArray(response) ? FileAccess.Allowed : response as FileAccess;
    const files: string[] = Array.isArray(response) ? response : [];
    const joinFiles: File[] = files.map(name => {
        const absolutePath: string = join(path, name);
        const isFile = fs.isFile(absolutePath);
        //const entry = new FileEntry(name, absolutePath, isFile, !isFile);
        return {
            name,
            absolutePath,
            type: isFile ? TypeFile.FILE : TypeFile.DIRECTORY
        }
    });
    if (!sort) return {errorAccess, files: joinFiles} as FileInfo;
    const filterDirs = joinFiles.filter(file => file.type === TypeFile.DIRECTORY).sort();
    const filterFiles = joinFiles.filter(file => file.type === TypeFile.FILE).sort();
    const lists = [...filterDirs, ...filterFiles];
    return {
        errorAccess,
        directories: filterDirs,
        files: filterFiles,
        lists
    } as FilterFile
}