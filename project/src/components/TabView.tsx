import {
    type Properties,
    Composite,
    ScrollView,
    TextView,
    Constraint,
    WidgetCollection,
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

    constructor(props: Properties<Composite> & { title: string }) {
        if (!("bottom" in props)) props.bottom = 0;
        super({
            top: "prev()",
            left: 0,
            right: 0,
            ...props
        });
        console.log(props);
        const excludeLayout = (displayNone: boolean) => {
            widgetCollapse.data.display = !displayNone;
            widgetCollapse.excludeFromLayout = displayNone;
            if (props.bottom !== "auto") return;
            console.log(props.bottom);
            if (displayNone && this.data.start) {
                this.height = "auto";
                widgetCollapse.bottom = "auto";
            }
            if (!this.data.start) {
                this.data.start = true;
            }
        };

        this.once("boundsChanged", async ({ target, value }: any) => {
            const parent = this.parent();
            if (!parent) return;
            if (props.bottom !== "auto") return;
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
            }
        });

        this.append(
            <$>
                <Composite
                    stretchX
                    padding={[5, 10]}
                    onTap={() =>
                        excludeLayout(!widgetCollapse.excludeFromLayout)
                    }
                    background="#111827"
                >
                    <TextView
                        left={0}
                        textColor="#6f6f7d"
                        text={this.name.toUpperCase()}
                    />
                </Composite>
                <ScrollView
                    top="prev()"
                    left={0}
                    right={0}
                    padding={5}
                    class="scrollTabContent"
                    scrollbarVisible={false}
                />
            </$>
        );
        const widgetCollapse = this._find(".scrollTabContent").only();
        if (props.buttom != "auto") {
            widgetCollapse.buttom = 0;
        }
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
