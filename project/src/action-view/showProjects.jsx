import {
    ActionSheet,
    ActionSheetItem,
    drawer,
    fs
} from 'tabris'
import {
    getProjectSettings,
    saveProject,
    removeProject
} from '../store'
import { basename } from 'path'
import asideView from '../ui/SideView'

async function showProjects() {
    const projects = getProjectSettings().projects;
    const action = ActionSheet.open(
        <ActionSheet title="Lista de Proyectos Abiertos" message={projects.length === 0 ? 'no hay proyectos' : ''}>
            {projects.map(path => {
                return <ActionSheetItem title={path.substr(path.lastIndexOf('/') + 1)} />
            })}
        </ActionSheet>
    );

    const { index } = await action.onClose.promise();
    const current = projects[index];

    if (!current) return;

    if (!fs.isDir(current)) {
        removeProject(current);
        AlertDialog.open("este proyecto no existe");
    } else {
        saveProject(current)
        const tree = await asideView();
        const tabviewProject = drawer.find('#view-project').first();
        const scrollH = tabviewProject.children('ScrollView').first();
        tabviewProject.title = basename(current);
        scrollH.children().dispose();
        scrollH.append(tree);
    }
}

export default showProjects;