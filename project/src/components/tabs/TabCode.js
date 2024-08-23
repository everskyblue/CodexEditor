import { TextView, WebView } from "tabris";
import { theme } from "../../theme";


export function TabCode({title, url}) {
    return (
        <$>
            <TextView 
                highlightOnTouch
                text={title} 
                width={100}
                background={theme.Tab.activeBackground()}
                textColor={theme.Tab.foreground()}
                padding={[8, 16]}
            />
            <WebView stretch url={url} />
        </$>
    )
}