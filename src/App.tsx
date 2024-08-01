import MenuActions from './menu-actions'
//import {runCode} from './playground/run'
import setViewProject from './viewFiles'
import {loadConfig, resetConfig} from './load'
import {CoordinatePage} from 'voir-native'
import {
  drawer,
  contentView,
  ScrollView,
  StackLayout,
  AlertDialog,
  fs,
  Page,
  devTools
} from 'tabris';
import {TabEditor} from './components/TabEditor'

devTools.showUi();

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
      <CoordinatePage drawerActionVisible layoutData="stretch">
        {...MenuActions() as any[]}
        <Page title="SpaceCode" stretch>
            <TabEditor id="tabEditor" background="black" stretch />
            <ScrollView class="resultConsole" excludeFromLayout layout={new StackLayout} id="logger" stretchX elevation={8} height={110} bottom={0} background="black" />
        </Page>
      </CoordinatePage>
  );
  loadViewProject()
}