import MenuActions from './menu-actions'
//import {runCode} from './playground/run'
import setViewProject from './viewFiles'
import {loadConfig, resetConfig} from './load'
import {Page, NavigationView} from 'components-tabris'
import {
  drawer,
  contentView,
  ScrollView,
  StackLayout,
  AlertDialog,
  fs
} from 'tabris';
import {TabEditor} from './components/TabEditor'

function configDrawer() {
    drawer.enabled = true;
    drawer.background = 'rgba(181,181,181,0.372)'
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
            <TabEditor id='tabEditor' stretch />
            <ScrollView class="resultConsole" excludeFromLayout layout={new StackLayout} id="logger" stretchX elevation={8} height={110} bottom={0} background="black" />
        </Page>
      </NavigationView>
    </$>
  );
  
  loadViewProject()
}