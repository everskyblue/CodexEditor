import type {WebView} from 'tabris'
import {Action} from 'tabris'
import actionOpenFile from './actions/openFile'
import actionCreateProject from './actions/createProject'
import actionShowProjects from './actions/showProjects'
import pageExplorer from './components/pageExplorer'
import {ActionContainer} from 'components-tabris'
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

export default () => (<ActionContainer>
    <Action 
      title="run" 
      image="/assets/img/play48.png" 
      width={32} 
      height={32}
      onSelect={bridgetServiceWorker}
    />
      
    <Action
      title="Abrir Archivo" 
      placement="overflow"
      onSelect={actionOpenFile}
    />
    
    <Action
      title="Crear Proyecto" 
      placement="overflow"
      onSelect={actionCreateProject}
    />
    
    <Action
      title="Proyectos" 
      placement="overflow"
      onSelect={actionShowProjects}
    />
    <Action
      title="explorer" 
      placement="overflow"
      onSelect={pageExplorer}
    />
 </ActionContainer>
);
