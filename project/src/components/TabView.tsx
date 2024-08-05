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
    
    get collapse() { return this._isCollapse; }
    
    set title(value: string) {
        this._title = value;
    }
    
    get name() {
        return this._title;
    }
    
    constructor(props: Properties<Composite> & {name: string}) {
        super({
            ...props,
            layoutData: {
                left: 0,
                right: 0
            },
            top: 'prev()',
            bottom: 'prev()'
        });
        
        const excludeLayout = (showLayout: boolean) => {
            scroll.excludeFromLayout = showLayout;
        }

        this.append(
            <$>
                <Composite stretchX padding={[5, 10]} background='#111827'>
                    <TextView left={10} textColor='#6f6f7d' text={this.name.toUpperCase()} stretchX />
                </Composite>
                <ScrollView
                    top='prev()'
                    bottom={0}
                    left={0}
                    right={10}
                    padding={5}
                    id='scrollTabContent'
                    scrollbarVisible={false}
                >
                    <ScrollView
                        left={0}
                        right={0}
                        baseline
                        id='interactiveHScrollContent'
                        direction="horizontal"
                        padding={5}
                    >
                    </ScrollView>
                </ScrollView>
            </$>
        ).onTap(()=> excludeLayout(!scroll.excludeFromLayout));
        var scroll = this._find('#scrollTabContent').only();
        excludeLayout(this.collapse);
    }
    
    append(...childs: any[]) {
        const elms = childs.length === 1 ? childs[0] : childs;
        if (elms instanceof WidgetCollection && this._children().length === 0) {
            super.append(elms);
        } else {
            this._find('#interactiveHScrollContent').only(ScrollView).append(elms);
        }
        return this;
    }
}

export default TabView;