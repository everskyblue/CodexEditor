import {
    TextInput,
    TextView,
    Composite,
    ScrollView,
    Properties,
    sizeMeasurement,
} from "tabris";
import { SimpleWorker } from "./simple-worker";
import { lineContainer } from "./line-widget";
import { join } from "path";
import { CodexConfig, ICreateWidget, IEditorEntry } from "./contracts.d";
import { initEvent } from "../event/keyboard";
import * as register from "./register";
import suggestion from "./suggestion";
import { CursorPosition, CursorWidget } from "./cursor";
import blockCode from "./ui";
import { managerUI, ManagerBlock } from "./manager-ui";
import "./commands";
import "./snippets";

export type TypeCodex = Codex;

export const create: ICreateWidget = {
    text(props: Properties<TextView>): TextView {
        return TextView({
            left: "TextView",
            markupEnabled: true,
            font: "16px serif",
            ...(props ?? {}),
        });
    },
    textarea(
        props: Properties<TextInput> = {
            top: 0,
            left: ".codex-container-linenumber",
            right: 0,
            bottom: 0,
            //height: 100,
            keepFocus: true,
            focused: false,
            keyboardAppearanceMode: "onfocus",
            type: "multiline",
            font: "16px serif",
            visible: !!!0,
            elevation: 1
        }
    ): TextInput {
        return TextInput(props);
    },
    on(widget, fnEvent) {},
};

export class Codex {
    containerCode!: ScrollView;
    input!: TextInput;
    worker: SimpleWorker;
    managerBlock = new ManagerBlock(this);
    block: ReturnType<typeof blockCode> = this.managerBlock.createBlock();
    private widget: ICreateWidget = create;
    readonly cursorPosition = new CursorPosition(0, 0);
    readonly cursorWidget: CursorWidget;

    get lenguage() {
        return "javascript" ?? this.config.language;
    }

    get suggestion() {
        return suggestion;
    }

    static get register() {
        return register;
    }

    receivedCursor(
        fn: (cursorWidget: CursorWidget, cursorPosition: CursorPosition) => any
    ) {
        return fn(this.cursorWidget, this.cursorPosition);
    }

    constructor(public parentWidget: any, private config?: CodexConfig) {
        initEvent(this);
        if (!config.cursor) {
            config.cursor = {
                width: 2,
                height: 25,
                color: "red",
                animationType: "fade",
            };
        }
        this.cursorWidget = new CursorWidget(
            config.cursor,
            this.cursorPosition
        );

        this.worker = this.config?.worker
            ? new SimpleWorker(
                  join(
                      this.config.worker.paths[this.config.language],
                      this.config.language,
                      this.config.language + ".worker.js"
                  ),
                  this
              )
            : null;
    }

    addCreateWidget(wg: ICreateWidget) {
        this.widget = wg;
        return this;
    }

    create() {
        this.render(this.parentWidget);
        const area = this.widget.textarea();
        const scrollable: ScrollView = $(".codex-container").only();
        const containerCode: ScrollView = $(".codex-source").only();
        const wrapperSource: ScrollView = $("#codex-wrapper-source").only();
        const containerLinenumber: Composite = $('.codex-container-linenumber').only();
        
        //const $wrapperSource: ScrollView = $(".codex-wrapper-source").only();
        
        containerLinenumber.append(this.block.lineContent);
        containerCode.append(this.block.content);
        scrollable.append(area);
        this.input = area;
        this.cursorWidget.renderTo(wrapperSource);

        this.worker.onMessage(() => {});
        area.onSelect((e) => {
            //console.log(e);
        })
        area.onResize(e => {
            //console.log(e);
        })
        area.onBeforeTextChange((event) => {
            //console.log(event.newValue);
            managerUI(event.newValue, this);
            if (/\n/.test(event.newValue)) {
                scrollable.scrollToY(scrollable.offsetY + 25);
            }
            event.preventDefault();
        });

        setTimeout(() => {
            //area.focused = true;
        }, 1000);
    }

    render(parent: any) {
        const containerComposite = Composite({
            id: "codex-container",
            left: "prev()",
            right: 0,
            top: 0,
            stretchY: true,
            background: "rgba(0,0,0,0.796)",
        }).append(
            ScrollView({
                stretch: true,
                class: "codex-container",
                scrollbarVisible: true,
                onTap() {
                    $(TextInput).only().focused = true;
                },
            })
                .append(
                    lineContainer(),
                    Composite({
                        left: "prev()",
                        right: 0,
                        top: 0,
                        id: "codex-wrapper-source",
                    }).append(
                        ScrollView({
                            top: 0,
                            stretchX: true,
                            direction: "horizontal",
                            class: "codex-scrollable-horizontal codex-source",
                            scrollbarVisible: false,
                        })
                    )
                )
                .onPanLeft((evt) => {
                    const scrollSource: ScrollView = $(".codex-source").only();
                    scrollSource.scrollToX(
                        scrollSource.offsetX + Math.abs(evt.velocityX / 100),
                        {
                            animate: true,
                        }
                    );
                })
                .onPanRight((evt) => {
                    const scrollSource: ScrollView = $(".codex-source").only();
                    scrollSource.scrollToX(
                        scrollSource.offsetX - Math.abs(evt.velocityX / 100),
                        {
                            animate: true,
                        }
                    );
                })
        );

        parent.append(containerComposite);
    }
}
/*
const codex = new Codex({
    worker: {
        paths: {
            javascript: "../syntax",
        },
    },
});*/
export default Codex;
