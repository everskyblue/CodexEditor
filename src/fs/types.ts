export type TypeFile = 'FILE' | 'DIRECTORY' | number;

export type FilterDirInfo = {
    type: 'DIRECTORY' | number,
    name: string,
    absolutePath: string
}

export type FilterFileInfo = {
    type: 'FILE' | number,
    name: string,
    absolutePath: string
}

export type FileInfo = {
    type: TypeFile,
    name: string,
    absolutePath: string
}

export type FilterFile = {
    directories: FilterDirInfo[],
    files: FilterFileInfo[],
    lists: FileInfo[]
}