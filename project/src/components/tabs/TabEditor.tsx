import { theme } from "../../theme";
import {
    ScrollView,
    TextView,
    drawer,
    WebView,
    Composite,
    Stack,
    CompositeAddChildEvent,
    WidgetCollection,
} from "tabris";

export * from "./TabCode";

class TabContent extends Composite {
    constructor() {
        super({
            layoutData: "stretch",
        });
    }
}

const dbl: { interval: any; isTap: boolean } = {
    interval: undefined,
    isTap: false,
};

export class TabEditor extends Stack {
    dblTab(tab: TextView) {
        if (dbl.interval === undefined) {
            dbl.interval = setTimeout(() => {
                if (dbl.isTap) {
                    this.resetOpenFileView(tab);
                    console.log(tab, this.tabContent.find(`.${tab.id}`));
                    this.tabContent.find(`.${tab.id}`).dispose();
                    const positionTab = this.tabRef.children().indexOf(tab);
                    tab.dispose();
                    this.removeEvent(tab);
                    const tabs = this.tabRef.children(TextView);
                    if (tabs.length !== 0) {
                        const totalTabs = tabs.length - 1;
                        tabs[
                            totalTabs < positionTab
                                ? positionTab - 1
                                : positionTab
                        ].trigger("tap");
                    }
                }
                clearTimeout(dbl.interval);
                dbl.interval = undefined;
                dbl.isTap = false;
            }, 550);
        } else {
            dbl.isTap = true;
        }
    }

    addChildEvent = ({ child: tabLink }: CompositeAddChildEvent) => {
        /**
         * previene que se ejecute otra vez si esta activo
         * si hay doble tap en la tab actual se cierra esa tab
         */
        if (this.activeWidget === tabLink) {
            return this.dblTab(tabLink as TextView);
        }

        this.data.activeWidget = tabLink;

        tabLink.siblings(TextView).set({
            // añadir bg inactivo
            background: theme.Tab.inactiveBackground(),
            textColor: theme.Tab.inactiveForeground(),
        });

        // añadir bg activo
        tabLink.background = theme.Tab.activeBackground();
        //@ts-ignore
        tabLink.textColor = theme.Tab.foreground();

        const currentContent = (this.children()[1] as TabContent)
            .find(`.${tabLink.id}`)
            .first();

        currentContent.visible = true;
        currentContent.siblings().set({
            visible: false,
        });
    };

    set widgetTitle(widget: TextView) {
        widget.on("tap", () => {
            this.addChildEvent({
                child: widget,
            } as unknown as CompositeAddChildEvent);
        });
    }

    constructor() {
        super({
            layoutData: "stretch",
        });

        this.append(
            <ScrollView
                id="tab-scroll-editor"
                stretchX
                direction="horizontal"
                background={theme.Tab.background()}
                onAddChild={this.addChildEvent}
            />,
            <TabContent />
        );
    }

    _addChild(child: any, index: number) {
        if (child instanceof ScrollView || child instanceof TabContent) {
            super._addChild(child, index);
        } else if (child instanceof TextView) {
            this.widgetTitle = child;
            this._find(ScrollView).first().append(child);
        } else if (child instanceof WebView) {
            this._find(TabContent).first().append(child);
        }
    }

    closeAll() {
        const scrollChildren = this.tabRef.children(TextView);
        const content = this.tabContent.children(WebView);
        this.removeEvent(scrollChildren);
        scrollChildren?.forEach(this.resetOpenFileView);
        scrollChildren?.dispose();
        content?.dispose();
    }

    resetOpenFileView(tab: TextView) {
        const id = tab.data.file;
        const sidebarFileView = drawer.find(`#${id}`).only();
        sidebarFileView.data.reset = true;
        sidebarFileView.trigger("tap");
    }

    removeEvent(tab: TextView | WidgetCollection<TextView>) {
        tab?.off("tap", this.addChildEvent);
    }

    get activeWidget() {
        return this.data.activeWidget;
    }

    get tabContent() {
        return this._find(TabContent).first();
    }

    get tabRef() {
        return this._find(ScrollView).first();
    }
}
