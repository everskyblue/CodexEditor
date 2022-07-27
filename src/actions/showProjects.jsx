import {
    ActionSheet,
    ActionSheetItem,
    drawer
} from 'tabris'

import {
    getSettingProject,
    saveConfigProject
} from '../load'

import setViewFiles from '../viewFiles'

async function showProjects() {
    const projects = getSettingProject().projects;
    const action = ActionSheet.open(
        <ActionSheet title="Proyectos" message={projects.length === 0 ? 'no hay proyectos': ''}>
            {projects.map(path => {
                    return <ActionSheetItem title={path.substr(path.lastIndexOf('/') + 1)} />
            })}
        </ActionSheet>
    );

    const {index} = await action.onClose.promise();
    const current = projects[index];
    
    if (index !== null) {
        drawer.children().dispose();
        saveConfigProject(current)
        setViewFiles(current);
    }
}

export default showProjects;