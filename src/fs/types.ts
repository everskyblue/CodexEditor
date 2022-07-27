export type TypeFile = 'FILE' | 'DIRECTORY' | number;

export type FilterDirInfo = {
    type: 'DIRECTORY',
    name: string,
    absolutePath: string
}

export type FilterFileInfo = {
    type: 'FILE',
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