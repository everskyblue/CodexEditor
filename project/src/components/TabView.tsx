import {
    type Properties,
    Composite,
    ScrollView,
    TextView,
    Constraint,
    WidgetCollection,
    Stack,
    $
} from "tabris";

class TabView extends Composite {
    private _title: string;
    private _isCollapse: boolean = false;

    set collapse(isCollapse: boolean) {
        this._isCollapse = isCollapse;
    }

    get collapse() {
        return this._isCollapse;
    }

    set title(value: string) {
        this._title = value;
    }

    get name() {
        return this._title;
    }

    constructor(
        props: Properties<Composite> & { title: string; collapse?: boolean }
    ) {
        super({
            top: "prev()",
            bottom: 0,
            left: 0,
            right: 0,
            ...props
        });

        const excludeLayout = async (displayNone: boolean) => {
            widgetCollapse.data.display = !displayNone;
            widgetCollapse.excludeFromLayout = displayNone;
            if (displayNone && this.data.start)
                this.bottom = this.height = "auto";
            if (!this.data.start) {
                this.data.start = true;
            }
        };

        const changeHeight = async (parent: any) => {
            const { height: boundsHeightScroll } = widgetCollapse.bounds;
            const { height: boundsHeightTab } = this.bounds;
            const parentHeight = this.parent().bounds.height;

            if (
                widgetCollapse.data.display &&
                boundsHeightTab !== parentHeight
            ) {
                //widgetCollapse.data.calculated = true;
                this.height = parentHeight - 10;

                widgetCollapse.set({
                    layoutData: { left: 0, right: 0, top: "prev()", bottom: 0 }
                });
            }
        };

        this.on("boundsChanged", async ({ target, value }: any) => {
            const parent = this.parent();
            if (!parent) return;
            if (
                widgetCollapse.data.display &&
                parent.bounds.height === value.height &&
                0 !== widgetCollapse.bounds.height
            )
                return;
            if (widgetCollapse.data.display == false) return;
            changeHeight(parent);
        });

        this.append(
            <$>
                <TextView
                    left={0}
                    right={0}
                    textColor="#6f6f7d"
                    padding={[5, 10]}
                    background="#111827"
                    text={this.name.toUpperCase()}
                    onTap={() =>
                        excludeLayout(!widgetCollapse.excludeFromLayout)
                    }
                />
                <ScrollView
                    bottom={0}
                    padding={5}
                    stretchX
                    top="prev()"
                    class="widgetCollapse"
                    //id='scrollTabContent'
                    class="scrollTabContent"
                    scrollbarVisible={false}
                ></ScrollView>
            </$>
        ); //.onTap(() => excludeLayout(!scroll.excludeFromLayout));
        const widgetCollapse = this._find(".scrollTabContent").first();
        excludeLayout(this.collapse);
    }

    append(...childs: any[]) {
        const elms = childs.length === 1 ? childs[0] : childs;
        if (elms instanceof WidgetCollection && this._children().length === 0) {
            super.append(elms);
        } else {
            this._find(".scrollTabContent").only(ScrollView).append(elms);
        }
        return this;
    }
}

export default TabView;
