import type {
  EventObject,
  Widget,
  Attributes,
  Composite,
  TextView
} from 'tabris'


export const SRC_IMAGE = '/assets/img'; 

export const NAME_STORAGE = 'infoProject';


export enum TypeFile {
  DIR,
  FILE
}

export const TypeIcon = {...TypeFile};

export type StorageProject = {
  paths: string[]
  openedFiles: string[]
  pathCurrentProject: string
}

export type Props = {
  children?: Widget[]
  touchEvent?: (evt: EventObject<Composite>)=> void
  touchMenuOption?: ()=> void
  textView: Attributes<TextView>
  composite?: Attributes<any>
  icon?: string
  storePath?: string
}


export type FileInfo = {
  name: string
  absolutePath: string
}