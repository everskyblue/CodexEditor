import { CheckBoxPreference, ListPreference, NavigationView, Page, ScreenPreference } from "components-tabris";
import { fs } from "tabris";

function getList() {
    
}

export default function Setting() {
    $(NavigationView).only().append(
        <$>
            <ScreenPreference stretch>
                <CheckBoxPreference 
                    title="auto guardado"
                    summary="guarda los cambios cada segundo"
                    key="autosave"
                    value={true}
                />
                <ListPreference
                    title="temas"
                    summary="seleccionar temas para el editor de codigo"
                    key="currentTheme"
                    arrayObjectList={}
                />
            </ScreenPreference>
        </$>
    )
}