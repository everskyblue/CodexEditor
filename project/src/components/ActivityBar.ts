import {
    Composite,
    Stack,
    Row,
    ImageView,
    TextView,
    WidgetCollection,
} from "tabris";
import { theme } from "../theme";

class ActivityBarContent extends Composite {
    constructor() {
        super({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        });
    }
}

class ActivityBar$ extends Stack {
    constructor() {
        super({
            top: 0,
            bottom: 0,
            width: 50,
        });
        this.background = theme.ActivityBar.background(this);
    }
}

export class ActivitySideBar extends Row {
    readonly _widgetActivityAction = new ActivityBar$();
    readonly _widgetActivityContent = new ActivityBarContent();
    private readonly _actions: Composite[] = [];
    private _open: number;

    set open(v: number) {
        this._open = v;
    }

    public get open(): number {
        return this._open;
    }

    constructor(props: { open: number } = { open: 0 }) {
        super({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            ...props,
        });
        this.append(this._widgetActivityAction);
        this.append(this._widgetActivityContent);
    }

    toggleExclude(except: ActivityBarContent) {
        this._widgetActivityContent.children().forEach((w) => {
            if (except !== w) {
                w.excludeFromLayout = true;
            }
        });
        except.excludeFromLayout = false;
    }

    setWidgetActivityActions(civ: Composite, abc: Composite) {
        this._actions.push(
            civ.on("tap", () => {
                this.toggleExclude(abc);
                civ.siblings().set({
                    background: theme.ActivityBar.inactiveBackground(),
                });
                civ.background = theme.ActivityBar.activeBackground();
            })
        );
        this._widgetActivityContent.append(abc);
        return this._widgetActivityAction.append(civ), this;
    }

    show() {
        return this._actions[this.open].trigger("tap"), this;
    }
}

type ActivityBarLayoutProps = {
    title: string;
    image: string;
    children?: (Composite | ActivityBarContent)[];
};

export function ActivityBarLayout({
    title,
    image,
    children,
}: ActivityBarLayoutProps) {
    return new WidgetCollection([
        new Composite({
            layoutData: "stretchX",
            highlightOnTouch: true,
            padding: [10, 0],
        }).append(
            new ImageView({
                image,
                layoutData: "stretchX",
                height: 30,
            })
        ),
        new Composite({
            layoutData: "stretch",
            excludeFromLayout: true,
        }).append(
            new TextView({
                text: title.toUpperCase(),
                font: "14px bold",
                padding: 8,
                textColor: theme.SideBar.sectionHeaderTitle.foreground(),
            }),
            ...children
        ),
    ]);
}

export function ActivityBar({
    open,
    children,
}: {
    open: number;
    children: WidgetCollection[];
}) {
    const activity = new ActivitySideBar({ open });
    children.forEach((wc) => {
        const iv = wc.first(Composite);
        const c = wc.last(Composite);
        activity.setWidgetActivityActions(iv as Composite, c as Composite);
    });
    return activity.show();
}
