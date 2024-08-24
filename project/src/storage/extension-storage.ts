import { setPreference, existsKeyPreference, getValuePreference } from 'voir-native';

export type ExtensionStorageObject = {
    title: string
    icon: string
    description: string
    author: string
}

export type ExtensionStorage = {
    installed: ExtensionStorageObject[];
    disabled: ExtensionStorageObject[]
}

if (!existsKeyPreference('extensions')) {
    setPreference('extensions', {
        installed: [],
        disabled: []
    })
}

export const extensionStorage = getValuePreference('extensions') as ExtensionStorage;

if (process.env.NODE_ENV) {
    if (extensionStorage.installed.length == 0) {
        extensionStorage.installed.push({
            title: "mi primera extension",
            icon: "/assets/img/package.png",
            author: "Owen",
            description: "ullamco adipisicing fugiat eiusmod aute minim duis mollit cillum aliqua"
        })
    }

    if (extensionStorage.disabled.length == 0) {
        extensionStorage.disabled.push({
            title: "extension desactivada",
            icon: "/assets/img/package.png",
            author: "owen",
            description: "ullamco adipisicing fugiat eiusmod aute minim duis mollit cillum aliqua"
        })
    }
}
