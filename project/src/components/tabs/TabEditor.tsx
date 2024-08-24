import { theme } from "../../theme";
import { ScrollView, TextView, drawer, WebView, Composite, Stack, CompositeAddChildEvent } from "tabris";

export * from './TabCode'

class TabContent extends Composite {
    constructor() {
        super({
            layoutData: 'stretch'
        })
    }
}

export class TabEditor extends Stack {
    addChildEvent = ({child: tabLink}: CompositeAddChildEvent) => {
        tabLink.siblings(TextView).set({
            //data: { visible: false },
            // añadir bg inactivo
            background: theme.Tab.inactiveBackground(),
            textColor: theme.Tab.inactiveForeground()
        })

        // añadir bg activo
       tabLink.background = theme.Tab.activeBackground();
       //@ts-ignore
       tabLink.textColor = theme.Tab.foreground();
        
        const currentContent = (this.children()[1] as TabContent)
            .find(`.${tabLink.id}`)
            .first();

        currentContent.visible = true;
        currentContent.siblings().set({
            visible: false
        });
    }
    
    set widgetTitle(widget: TextView) {
        widget.on('tap', () => {
            this.addChildEvent({child: widget} as unknown as CompositeAddChildEvent);
        })
    }

    constructor() {
        super({
            layoutData: 'stretch'
        })

        this.append(
            <ScrollView id="tab-scroll-editor" 
                stretchX
                direction='horizontal'
                background={theme.Tab.background()} 
                onAddChild={this.addChildEvent}
            />,
            <TabContent />
        )
    }

    _addChild(child: any, index: number) {
        if (child instanceof ScrollView || child instanceof TabContent) {
            super._addChild(child, index);
        } else if (child instanceof TextView) {
            this.widgetTitle = child;
            this._find(ScrollView).first().append(child)
        } else if (child instanceof WebView) {
            this._find(TabContent).first().append(child);
        }
    }
    
    closeAll() {
        const scrollChildren = this._find(ScrollView).first().children(TextView);
        const content = this._find(TabContent).first().children(WebView);
        scrollChildren?.forEach(tv => {
            const id = tv.data.file;
            console.log(id, tv)
            const sidebarFileView = drawer.find(`#${id}`).only();
            sidebarFileView.data.reset = true;
            sidebarFileView.trigger('tap');
        })
        scrollChildren?.dispose();
        content?.dispose();
    }
}