import {
    type Properties,
    Composite,
    ScrollView,
    TextView,
    Constraint,
    WidgetCollection,
    StackLayout,
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
        if (!("buttom" in props)) {
            props.buttom = 0;
        }

        super({
            top: 0,
            left: 0,
            right: 0,
            ...props
        });

        const excludeLayout = async (displayNone: boolean) => {
            widgetCollapse.data.display = !displayNone;
            widgetCollapse.excludeFromLayout = displayNone;
            if (displayNone && this.data.start) {
                this.height = "auto";
            }
            if (!this.data.start) {
                this.data.start = true;
            }
        };

        const changeHeight = async (parent: any) => {
            const { height: boundsHeightScroll } = widgetCollapse.bounds;
            const { height: boundsHeightTab } = this.bounds;
            const parentHeight = this.parent().bounds.height;

            if (
                widgetCollapse.data.display
                //boundsHeightTab !== parentHeight
            ) {
                widgetCollapse.data.calculated = true;
                this.height = parentHeight;
                widgetCollapse.layoutData = "stretchX";
                widgetCollapse.height =
                    parentHeight -
                    widgetCollapse.siblings().first().bounds.height;
                console.log(this.height, widgetCollapse.height);
            }
        };

        this.on("boundsChanged", async ({ target, value }: any) => {
            const parent = this.parent();
            if (!parent) return;
            else if (props.bottom !== "auto") return;
            if (widgetCollapse.data.display === false) return;

            const heightParent = parent.bounds.height;
            const height = value.height;
            const heightScroll = widgetCollapse.bounds.height;
            const heightTv = widgetCollapse.siblings(TextView).first();
            const dv = heightParent / parent.children().length; //Math.abs(height - heightParent);
            if (height > heightParent /*|| heightScroll > heightParent*/) {
                this.height = dv;
                widgetCollapse.data.childs = widgetCollapse
                    .children()
                    .toArray();
                //widgetCollapse.children().detach();
                widgetCollapse.bottom = 0;
            } else {
                //widgetCollapse.append(widgetCollapse.data.childs);
                console.log(dv, heightParent, height, heightScroll);
            }
            if (
                widgetCollapse.data.display &&
                parent.bounds.height === value.height &&
                widgetCollapse.data.calculated
                //0 !== widgetCollapse.bounds.height
            )
                return;
            if (widgetCollapse.data.display == false) return;
            //changeHeight(parent);
        });

        this.append(
            <$>
                <TextView
                    left={0}
                    right={0}
                    textColor="#6f6f7d"
                    background="#111827"
                    padding={[5, 10]}
                    text={this.name.toUpperCase()}
                    onTap={() =>
                        excludeLayout(!widgetCollapse.excludeFromLayout)
                    }
                />
                <ScrollView
                    stretchX
                    top="prev()"
                    background="green"
                    class="scrollTabContent widgetCollapse"
                    scrollbarVisible={false}
                >
                    <Composite stretchX></Composite>
                </ScrollView>
            </$>
        ); //.onTap(() => excludeLayout(!scroll.excludeFromLayout));
        const widgetCollapse = this._find(".scrollTabContent").first();
        if (props.buttom && props.buttom !== "auto") {
            widgetCollapse.buttom = 0;
        }
        excludeLayout(this.collapse);
    }

    append(...childs: any[]) {
        const elms = childs.length === 1 ? childs[0] : childs;
        if (elms instanceof WidgetCollection && this._children().length === 0) {
            super.append(elms);
        } else {
            this._find(".scrollTabContent > Composite").only().append(elms);
        }
        return this;
    }
}

export default TabView;
