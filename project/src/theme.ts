const applyChangeTheme = new Set<any>();

const handlerTheme = (theme) => new Proxy(theme, {
    get(target, key) {
        if (target[key] instanceof Function) {
            return target[key];
        }
        
        return (ctx: any, typeKey?: string) => {
            if (!ctx) return target[key];
            
            const changeTheme = () => {
                ctx[typeKey ?? key === 'foreground' ? 'textColor' : 'background'] = target[key];
            };
            
            applyChangeTheme.add(changeTheme);
            
            try {
                ctx.once('dispose', () => {
                    applyChangeTheme.delete(changeTheme);
                });
            } catch {
                //console.log("error theme disposed");
            }
            return target[key];
        }
    },
    getPrototypeOf() {
        return Function.prototype;
    },
    has(target, key) {
        return key in target;
    }
})

export const theme = {
    AppBar: handlerTheme({
        background: "black"
    }),
    ActivityBar: handlerTheme({
        background: 'transparent',
        foreground: 'transparent',
        inactiveForeground: 'transparent',
        activeForegound: 'transparent',
        activeBackground: "transparent",
        inactiveBackground: "transparent"
    }),
    SideBar: handlerTheme({
        background: 'transparent',
        sectionHeader: handlerTheme({
            background: 'transparent',
            foreground: 'transparent'
        }),
        sectionHeaderTitle: handlerTheme({
            foreground: "transparent"
        })
    })
}

export const assignTheme = (customTheme: Partial<typeof theme>) => {
    function assign(target: any, obj: any) {
        for (const key in obj) {
            if (key in target) {
            const color = obj[key];
            if (typeof color === "string") {
                    target[key] = color;
                } else {
                    assign(target[key], color)
                }
            }
        }
    }
    
    assign(theme, customTheme)
}