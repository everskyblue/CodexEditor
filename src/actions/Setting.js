import addView, {
    CheckBoxPreference,
    ListPreference,
    PreferenceScreen
} from "voir-native";
import { fs, Page } from "tabris";
const themes = require('@themes');

const themeLists = Object.keys(themes).map((text, i) => ({text}));

//themeLists.at(0).checked = true;

export default function Setting() {
    addView(
        <PreferenceScreen layoutData="stretch">
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
                defaultValue={0}
                entries={themeLists}
            />
        </PreferenceScreen>
    )
}