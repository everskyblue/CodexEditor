import AppBar from './AppBar'
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


export default async function () {
  const config = await loadConfig();
  const configEditor = getConfigEditor();
  
  const script = `window.monacoConfig = ${JSON.stringify(configEditor)}`;
  
  drawer.enabled = true;
  drawer.background = 'rgba(181,181,181,0.372)'
  contentView.append(
    <$>
      <NavigationView drawerActionVisible stretch toolbarColor="black">
        <AppBar />
        <Page title="SpaceCode" stretch>
          <WebView initScript={script} class="onerun" top="prev()" url="/assets/index.html" stretch />
          <ScrollView class="resultConsole" excludeFromLayout layout={new StackLayout} id="logger" stretchX elevation={8} height={110} bottom={0} background="black" />
        </Page>
      </NavigationView>
    </$>
  );
  
  const wv: WebView = $(WebView).only();
  wv.onLoad(()=> {
    wv.postMessage(JSON.stringify({
        type: '@monaco/config',
        data: configEditor
    }), '*');
  })
  
  wv.onMessage(({data}) => {
    runCode(data)
  });
  
  if (config.currentProject.length === 0) return;
  
  if (!fs.isDir(config.currentProject)) {
    resetConfig();
    return AlertDialog.open('directorio del proyecto no encontrado')
  }
  
  setViewProject(config.currentProject)
}