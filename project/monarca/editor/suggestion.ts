import {
    Row,
    ScrollView,
    Stack,
    Composite,
    TextView,
    Properties,
} from "tabris";
import { ISnippet } from "./contracts.d";

export enum SnippetTypeBg {
    S = "#161b33", // snippet
    K = "#a30000", // keyword
    C = "#507255", // class
    F = "#488b49", // function
    M = "#f441fa", // method
    P = "#faa641", // private
    V = "#4160fa", // value
}

const props: Properties<Stack> = {
    width: 320,
    elevation: 20,
    centerX: true,
    background: "#ffffff", //5706a1
};

let isVisible = false;

const container = ScrollView(props);

container.onBoundsChanged((evt) => {
    if (evt.value.height > 320) {
        container.height = 320;
    }
});

const ListSuggestion = ({
    type,
    title,
    prefix,
    value,
    placeholder,
    description,
}: ISnippet) => {
    return Composite({
        stretchX: true,
        height: 30,
        top: "prev()",
        onTap: (e) => {
            container.children().dispose();
            container.detach().scrollToY(0);
            isVisible = false;
        },
    }).append(
        TextView({
            id: "suggestion-type",
            text: type,
            stretchY: true,
            background: SnippetTypeBg[type],
            textColor: "white",
            alignment: "centerX",
        }),
        TextView({
            text: prefix,
            id: "suggestion",
            stretchY: true,
            left: "prev()",
        }),
        TextView({
            id: "suggestion-placeholder",
            text: placeholder,
            stretchY: true,
            left: "prev()",
            right: ["#suggestion-doc", 5],
            textColor: "rgba(152,152,152,0.446)",
        }),
        TextView({
            text: "?",
            stretchY: true,
            right: 0,
            id: "suggestion-doc",
            onTap: () =>
                showDocumentation(title, description ?? "not description"),
        })
    );
};

const showDocumentation = (_: string, text: string) => {
    const docContainer = Composite({
        ...props,
        top: 30,
        elevation: 21,
    });
    const closeContainer = TextView({
        text: "X",
        alignment: "right",
        stretchX: true,
        padding: [5, 10],
        background: "#1d7237",
        textColor: "white",
        onTap() {
            isVisible = false;
            docContainer.dispose();
        },
    });
    const textDoc = TextView({
        text,
        top: "prev()",
        stretchX: true,
        padding: 10,
    });
    docContainer.append(closeContainer, textDoc);
    container.parent().append(docContainer);
};

export default Object.preventExtensions({
    get isVisible() {
        return isVisible;
    },
    filter(text: string, suggestionList: ISnippet[]) {
        return suggestionList.filter((sugg: ISnippet) => {
            return sugg.value.includes(text);
        });
    },
    render(parentWidget: any, listSuggestion: ISnippet[]) {
        if (this.isVisible) return;
        isVisible = true;
        container.append(
            listSuggestion.map((suggestion) => ListSuggestion(suggestion))
        );
        container.children().first()?.classList.push("active");
        container.apply("strict", {
            TextView: { padding: [5, 10] },
            ".active": {
                background: "rgba(0, 0, 0, 0.25)",
            },
        });

        return parentWidget.append(container);
    },
});
