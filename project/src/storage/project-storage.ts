export type Storage = {
    currentProject: string;
    openedFiles: string[];
    projects: string[];
    fileExplorer?: string | null;
};

const storage: Storage = localStorage.getItem("codex")
    ? getStorage()
    : createStorage();

export function getStorage() {
    return JSON.parse(localStorage.getItem("codex")) as Storage;
}

export function getProjectSettings() {
    return storage;
}

function createStorage() {
    const projectStorage = {
        currentProject: "",
        openedFiles: [],
        projects: [],
        fileExplorer: null
    } as Storage;

    localStorage.setItem("codex", JSON.stringify(projectStorage));

    return projectStorage;
}

export function save(setting: Partial<Storage>) {
    localStorage.setItem(
        "codex",
        JSON.stringify(Object.assign(storage, setting))
    );
}

export function saveProject(path: string) {
    save({
        currentProject: path,
        projects: storage.projects.includes(path) ? storage.projects : storage.projects.concat(path),
    });
}

export function saveOpenedFile(file: string) {
    save({
        openedFiles: storage.openedFiles.concat(file),
    });
}

export function removeOpenedFile(file: string) {
    save({
        openedFiles: storage.openedFiles.filter(
            (openedFile) => openedFile !== file
        ),
    });
}

export function removeProject(path: string) {
    save({
        projects: storage.projects.filter((project) => project !== path),
    });
}
