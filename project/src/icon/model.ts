/**
 * Defines icon packs that can be toggled.
 */
export enum IconPack {
    Angular = 'angular',
    Ngrx = 'angular_ngrx',
    React = 'react',
    Redux = 'react_redux',
    Vue = 'vue',
    Vuex = 'vue_vuex'
}

export interface DefaultIcon {
    /**
     * Name of the icon, e.g. 'src'
     */
    name: string;

    /**
     * Define if there is a light icon available.
     */
    light?: boolean;

    /**
     * Define if there is a high contrast icon available.
     */
    highContrast?: boolean;
}

export interface FolderIcon {
    /**
     * Name of the icon, e.g. 'src'
     */
    name: string;

    /**
     * Define the folder names that should apply the icon.
     * E.g. ['src', 'source']
     */
    folderNames: string[];

    /**
     * Define if there is a light icon available.
     */
    light?: boolean;

    /**
     * Define if there is a high contrast icon available.
     */
    highContrast?: boolean;

    /**
     * Define if the icon should be disabled.
     */
    disabled?: boolean;

    /**
     * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
     */
    enabledFor?: IconPack[];
}

export interface FolderTheme {
    /**
     * Name of the theme
     */
    name: string;

    /**
     * Define the default icon for folders in a theme.
     */
    defaultIcon: DefaultIcon;

    /**
     * Icon for root folders.
     */
    rootFolder?: DefaultIcon;

    /**
     * Defines folder icons for specific folder names.
     */
    icons?: FolderIcon[];
}

export interface FileIcon {
    /**
     * Name of the icon, e.g. 'javascript'
     */
    name: string;

    /**
     * Define the file extensions that should use this icon.
     * E.g. ['js']
     */
    fileExtensions?: string[];

    /**
     * Define if there are some static file names that should apply this icon.
     * E.g. ['sample.js']
     */
    fileNames?: string[];

    /**
     * Define if there is a light icon available.
     */
    light?: boolean;

    /**
     * Define if there is a high contrast icon available.
     */
    highContrast?: boolean;

    /**
     * Define if the icon should be disabled.
     */
    disabled?: boolean;

    /**
     * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
     */
    enabledFor?: IconPack[];
}

export class FileIcons {
    /**
     * Define the default icon for folders.
     */
    defaultIcon: DefaultIcon;

    /**
     * Defines all folder icons.
     */
    icons?: FileIcon[];
}

export interface LanguageIcon {
    /**
     * Icon for the language identifier
     */
    icon: DefaultIcon;

    /**
     * Language ID, e.g. 'javascript'
     *
     * According to official VS Code documentation:
     * https://code.visualstudio.com/docs/languages/identifiers
     */
    ids: string[];

    /**
     * Define if the icon should be disabled.
     */
    disabled?: boolean;

    /**
     * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
     */
    enabledFor?: IconPack[];
}
