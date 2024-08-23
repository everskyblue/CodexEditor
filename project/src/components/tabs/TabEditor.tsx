import { theme } from "../../theme";
import { ScrollView, Stack } from "tabris";


export class TabEditor extends Stack {
    constructor() {
        super({
            layoutData: 'stretch'
        })

        this.append(
            <ScrollView id="tab-editor" 
                stretchX
                background={theme.Tab.background()} 
            />
        )
    }
}