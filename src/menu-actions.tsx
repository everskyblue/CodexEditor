import { Action, app, type WebView } from 'tabris'
import actionOpenFile from './actions/openFile'
import actionCreateProject from './actions/createProject'
import actionShowProjects from './actions/showProjects'
import actionSetting from './actions/Setting'
import pageExplorer from './components/pageExplorer'
/*
let u = 'https://unpkg.com/react@16.7.0/?meta'
fetch(u, {
    method: 'GET'
  }).then(res => res.json()).then(console.log);
*/

function bridgetServiceWorker() {
    ($('.onerun').only() as WebView).postMessage(JSON.stringify({
        type: '@monaco/get-value'
    }), '*')
}

export default () => [
    <Action
        title="run"
        image="/assets/img/play48.png"
        width={32}
        height={32}
        onSelect={bridgetServiceWorker}
    />,

    <Action
        title="Abrir Archivo"
        placement="overflow"
        onSelect={actionOpenFile}
    />,

    <Action
        title="Crear Proyecto"
        placement="overflow"
        onSelect={actionCreateProject}
    />,

    <Action
        title="Proyectos Abiertos"
        placement="overflow"
        onSelect={actionShowProjects}
    />,

    <Action
        title="explorador"
        placement="overflow"
        onSelect={pageExplorer}
    />,

    <Action
        title="Ejecutar NPM"
        placement="overflow"
        onSelect={null}
    />,

    <Action
        title="Descargar Archivos"
        placement="overflow"
        onSelect={() => console.log('descargar')}
    />,

    <Action
        title="Configuracion"
        placement="overflow"
        onSelect={actionSetting}
    />,

    <Action
        title="Salir"
        placement="overflow"
        onSelect={() => app.close()}
    />
];
