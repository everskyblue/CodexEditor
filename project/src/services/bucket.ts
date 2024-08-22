import { AlertDialog } from "tabris";
import { client } from "./connection"

export async function uploadFile(content: any[], filename: string, type: string) {
    const file = new File(content, filename, { type })
    const { data, error } = await client.storage
        .from(process.env.BUCKET_NAME)
        .upload(filename, file);

    AlertDialog.open(error ? 'Error al subir el archivo: ' + error.message : 'Archivo subido:' + data.Key);

    return {
        data,
        error
    }
}

export async function listFilesInDirectory(options?: any) {
    const { data: files, error } = await client.storage
        .from(process.env.BUCKET_NAME)
        .list( 'test/'/*{ prefix /*, limit: 10 } */ ) as {error: boolean, data: object[]};
    if (error) console.log('Error al obtener la lista de archivos:', error)
    //const filesInDirectory = files.filter((file: File) => file.name.startsWith(directory))
    return {
        error,
        files
    }
}

async function deleteFile() {
    const { data, error } = await client.storage
        .from('nombre-de-tu-bucket')
        .remove('carpeta/archivo.txt')
    if (error) return console.log('Error al eliminar el archivo:', error.message)
    console.log('Archivo eliminado:', data.Key)
}

async function deleteFolder() {
    const { data: files, error } = await client.storage
        .from('nombre-de-tu-bucket')
        .list({ prefix: 'carpeta/' })
    if (error) return console.log('Error al obtener la lista de archivos:', error.message)
    const deletePromises = (files as File[]).map(file => client.storage.from('nombre-de-tu-bucket').remove(file.name))
    await Promise.all(deletePromises)
    const { data, error: folderError } = await client.storage
        .from('nombre-de-tu-bucket')
        .remove('carpeta/')
    if (folderError) return console.log('Error al eliminar la carpeta:', folderError.message)
    console.log('Carpeta eliminada:', data.Key)
}