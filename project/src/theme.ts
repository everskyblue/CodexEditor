import moduleRequire from "./lib";

const applyChangeTheme = new Set<any>();

const handlerTheme = (theme: any) =>
    new Proxy(theme, {
        get(target, key) {
            if (target[key] instanceof Function) {
                return target[key];
            }

            return (ctx: any, typeKey?: string) => {
                if (!ctx) return target[key];

                const changeTheme = () => {
                    ctx[
                        typeKey ?? key === "foreground"
                            ? "textColor"
                            : "background"
                    ] = target[key];
                };

                applyChangeTheme.add(changeTheme);

                try {
                    ctx.once("dispose", () => {
                        applyChangeTheme.delete(changeTheme);
                    });
                } catch {
                    //console.log("error theme disposed");
                }
                return target[key];
            };
        },
        getPrototypeOf() {
            return Function.prototype;
        },
        has(target, key) {
            return key in target;
        },
    });

export const theme = {
    AppBar: handlerTheme({
        background: "black",
    }),
    ActivityBar: handlerTheme({
        background: "transparent",
        foreground: "transparent",
        inactiveForeground: "transparent",
        activeForeground: "transparent",
        activeBackground: "transparent",
        inactiveBackground: "transparent",
    }),
    SideBar: handlerTheme({
        background: "transparent",
        sectionHeader: handlerTheme({
            background: "transparent",
            foreground: "transparent",
        }),
        sectionHeaderTitle: handlerTheme({
            foreground: "transparent",
        }),
    }),
    Tab: handlerTheme({
        background: "#171024",
        foreground: "white",
        activeBackground: "rgb(29,14,58)",
        inactiveBackground: "rgba(5,0,14,0.427)",
        inactiveForeground: "rgba(91,91,91,0.922)",
    }),
};

export const assignTheme = (customTheme: Partial<typeof theme>) => {
    function assign(target: any, obj: any) {
        for (const key in obj) {
            if (key in target) {
                const color = obj[key];
                if (typeof color === "string") {
                    target[key] = color;
                } else {
                    assign(target[key], color);
                }
            }
        }
    }

    assign(theme, customTheme);
};

export const monacoThemes = moduleRequire("@module/theme");
export const monacoThemeLists = Object.keys(monacoThemes).map((text) => ({
    text,
}));
export const getMonacoNameTheme = (index: number) =>
    monacoThemeLists[index].text;
export const getMonacoTheme = (name: string | number) => {
    return monacoThemes[
        //@ts-ignore
        /[0-9]*/.test(name) ? getMonacoNameTheme(name) : name
    ];
};
