import {
    addView,
    CheckBoxPreference,
    ListPreference,
    PreferenceScreen,
} from "voir-native";
import { monacoThemeLists } from "../theme";

export default () => {
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
                summary="seleccionar temas para el editor de código"
                key="currentTheme"
                value={0}
                entries={monacoThemeLists}
            />
        </PreferenceScreen>
    );
};
