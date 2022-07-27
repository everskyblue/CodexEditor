import {join} from 'path'
import {fs, app} from 'tabris'
import {saveConfigProject} from '../load'
import DialogTextInput from '../components/Dialog'

const externalFileDir = fs.externalFileDirs.find(external => external.includes('emulated/0'));

export default () => {
    const dialog = DialogTextInput({
        title: 'nuevo proyecto',
        btnOk: 'crear',
        message: 'nombre del proyecto'
    })

    dialog.onClose(async event => {
        const dirname = event.texts.shift();
        const pathProject = join(externalFileDir, dirname);
        if (event.button === 'ok' && dirname.length > 0) {
            if (!fs.isDir(pathProject)) {
                await fs.createDir(pathProject);
                saveConfigProject(pathProject);
                app.reload()
            }
        }
    })
}