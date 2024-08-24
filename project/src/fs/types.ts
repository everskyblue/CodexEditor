export type TypeFile = "FILE" | "DIRECTORY" | number;

export type FilterDirInfo = {
    type: number | "DIRECTORY";
    name: string;
    absolutePath: string;
};

export type FilterFileInfo = {
    type: number | "FILE";
    name: string;
    absolutePath: string;
};

export type File = {
    type: TypeFile;
    name: string;
    absolutePath: string;
    //rootType?: TypeFile,
    //fullPath?: string
};

export type FileInfo = {
    errorAccess: number;
    files: File[];
};

export type FilterFile = {
    errorAccess: any;
    directories: FilterDirInfo[];
    files: FilterFileInfo[];
    lists: File[];
};
