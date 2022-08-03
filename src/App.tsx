import MenuActions from './menu-actions'
import {runCode} from './playground/run'
import setViewProject from './viewFiles'
import {loadConfig, resetConfig, getConfigEditor} from './load'
import {Page, NavigationView} from 'components-tabris'
import {
  drawer,
  WebView,
  contentView,
  ScrollView,
  StackLayout,
  AlertDialog,
  fs
} from 'tabris';

function configDrawer() {
    drawer.enabled = true;
    drawer.background = 'rgba(181,181,181,0.372)'
}

function configWebView() {
    const configEditor = getConfigEditor();
    const wv: WebView = $(WebView).only();
    const sendData = {
        type: '@monaco/config',
        data: configEditor
    };
    
    wv.onLoad(()=> {
        wv.postMessage(JSON.stringify(sendData), '*');
    })
    
    wv.onMessage(({data}) => {
        runCode(data)
    });
}

async function loadViewProject() {
    const config = await loadConfig();
    
    if (config.currentProject.length === 0) return;
    
    if (!fs.isDir(config.currentProject)) {
        resetConfig(); // dev
        return AlertDialog.open('directorio del proyecto no encontrado')
    }
    
    setViewProject(config.currentProject)
}

export default function () {
  configDrawer();
  
  contentView.append(
    <$>
      <NavigationView drawerActionVisible stretch>
        <Page title="SpaceCode" stretch>
            <MenuActions />
            <WebView class="onerun" top="prev()" url="/assets/index.html" stretch />
            <ScrollView class="resultConsole" excludeFromLayout layout={new StackLayout} id="logger" stretchX elevation={8} height={110} bottom={0} background="black" />
        </Page>
      </NavigationView>
    </$>
  );
  
  configWebView()
  loadViewProject()
}