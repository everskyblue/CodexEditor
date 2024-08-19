import { 
    Composite, 
    Stack,
    Row,
    ScrollView,
    ImageView,
    TextView,
    WidgetCollection,
    type Properties 
} from 'tabris'

class ActivityBarContent extends Composite {
    constructor() {
        super({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        })
    }
}

class ActivityBarAction extends Stack {
    constructor() {
        super({
            top: 0,
            bottom: 0,
            width: 50,
            padding: 10,
            spacing: 10,
            background: 'rgba(15,23,42,1)'
        })
    }
}

export class ActivityBar$ extends Row {
    readonly _widgetActivityAction = new ActivityBarAction();
    readonly _widgetActivityContent = new ActivityBarContent();
    private readonly _actions: ImageView[] = [];
    constructor(props: {open: number} = {open: 0}) {
        super({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: 'rgb(30,41,59)'
        })
        this.append(this._widgetActivityAction);
        this.append(this._widgetActivityContent);
    }
    
    toggleExclude(except: ActivityBarContent) {
        this._widgetActivityContent.children().forEach(w => {
            if (except !== w) {
                w.excludeFromLayout = true;
            }
        });
        except.excludeFromLayout = false;
    }
    
    setWidgetActivityActions(tv: TextView, iv: ImageView, abc: Composite) {
        this._actions.push(iv.on('tap', () => {
            this.toggleExclude(abc);
        }));
        this._widgetActivityContent.append(abc);
        return this._widgetActivityAction.append(iv), this;
    }
    
    show() {
        this._actions[1].trigger('tap');
        return this;
    }
}

type ActivityBarLayoutProps = {
    title: string,
    image: string,
    children?: (Composite | ActivityBarContent)[]
}

export function ActivityBarLayout({title: text, image, children}: ActivityBarLayoutProps) {
    return new WidgetCollection([
        new TextView({
            text,
            textColor: 'white',
            background: 'black'
        }),
        new ImageView({
            image,
            width: 30,
            height: 30
        }),
        new Composite({
            layoutData: 'stretch',
            excludeFromLayout: true
        }).append(children)
    ]);
}

export function ActivityBar({open, children}: {open: number, children: WidgetCollection[]}) {
    const activity = new ActivityBar$();
    children.forEach(wc => {
        const iv = wc.first(ImageView);
        const tv = wc.first(TextView);
        const c = wc.first(Composite) as Composite;
        activity.setWidgetActivityActions(tv, iv, c);
    })
    return activity.show();
}