import {
    fileIcons
} from './fileIcons'
import {
    folderIcons
} from './folderIcons'
import {
    join
} from 'path'

export const SRC_IMAGE = '/assets/img/icons';

export enum TypeIcon {
    DIRECTORY,
    FILE
};

export const getNameIcon = (nameFile: string, resourceType: TypeIcon): string => {
    if (resourceType === TypeIcon.DIRECTORY) {
        const res = folderIcons[0].icons.find(def => def.folderNames.includes(nameFile))
        return (res?.name ?? folderIcons[1].defaultIcon.name);
    }
    const res = fileIcons.icons.filter((def) => {
        if ('fileNames' in def && def.fileNames.includes(nameFile)) {
            return true;
        } else if ('fileExtensions' in def) {
            return def.fileExtensions.some(ext => {
                // comparar si las extensiones son iguales
                return nameFile.substr(nameFile.lastIndexOf(ext) - 1) === (`.${ext}`);
            })
        }
        return false;
    })

    if (res.length === 1) {
        return res[0].name;
    } else if (res.length > 1) {
        // si hay mas coincidencia hace una busqueda a encontrar la extension mas larga
        const sizes: number[] = res.map(res => res.name.length);
        const size: number = Math.max(...sizes);
        const index = sizes.findIndex(len => len === size);
        return res[index].name;
    }

    return fileIcons.defaultIcon.name;
}

export const getIconPath = (nameFile: string, typeIcon: TypeIcon) => join(
    SRC_IMAGE,
    getNameIcon(nameFile, typeIcon).concat('.png')
);