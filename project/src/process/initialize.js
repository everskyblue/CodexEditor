import { fs } from 'tabris'
import worker from '../thread/main'
import { getStorage } from '../storage/project-storage'

const currentProject = getStorage().currentProject;

if (currentProject && fs.isDir(currentProject)) {
    worker.postMessage({
        method: 'indexesDirs',
        args: [
            currentProject
        ]
    })
}
