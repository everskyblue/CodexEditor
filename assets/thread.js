const mainEditor = callback => require(['vs/editor/editor.main'], callback);
require.config({ paths: { vs: './libs/monaco/min/vs' } });

const invoke = {
    file: null,
    $currentModel: null,
    $editor: null,

    "@cdx/editorInit": (file, source, prefixFile, config = {}) => {
        invoke.file = file;
        mainEditor(function () {
            const model = invoke.$currentModel = monaco.editor.createModel(source, undefined, monaco.Uri.file(`file:///${prefixFile}`))
            invoke.$editor = monaco.editor.create(document.getElementById('container'), {
                ...config,
                model
            });
            model.onDidChangeContent(invoke["@cdx/sendValue"])
        });
    },

    "@cdx/editorLibs": (libs) => {
        console.log(libs)
        mainEditor(function () {
            monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs);
            monaco.languages.typescript.javascriptDefaults.setExtraLibs(libs);
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions(getMonacoOptionsTs());
        })
    },

    "@cdx/observeChangeValueModel": (time = 1000) => {
        let data = invoke.$editor.getModel().getValue();
        let interval = setInterval(function () {
            let renew = invoke.$editor.getModel().getValue();
            if (data !== renew) {
                invoke["@cdx/sendValue"]();
                data = renew;
            }
        }, time ?? 1000);
    },

    "@cdx/focusEditor": () => {
        invoke.$editor.focus();
        document.activeElement.blur();
    },

    "@cdx/updateValueModel": (value) => {
        invoke.$editor.setValue(value);
    },

    "@cdx/sendValue": () => {
        window.parent.postMessage(json.string({
            type: '@cdx/writeFile',
            file: invoke.file,
            value: base64.encode(invoke.$currentModel.getValue()), 
        }), '*');
    },
    
    "@cdx/changeModel": (filename) => {
        const model = invoke.$editor.getModel();
        const nwModel = monaco.editor.createModel(model.getValue(), undefined, monaco.Uri.file('file:///' +filename));
        invoke.$editor.setModel(nwModel);
    },

    "@cdx/set": (libs, theme) => {
        mainEditor(function () {
            invoke['@cdx/editorLibs'](libs);
            console.log(theme, "tema")
            if (theme.name.length === 0) return;
            monaco.editor.defineTheme(theme.name, theme.definition);
        });
    }
}

function invocableCtx(ctx) {
    if (ctx.action in invoke) {
        invoke[ctx.action].apply(invoke, ctx.args);
    }
    
    console.log("action to ", ctx.action)
}

function getMonacoOptionsTs() {
    return {
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        allowJs: true,
        esModuleInterop: true,
        reactNamespace: "React",
        jsxFactory: 'React.createElement',
        jsx: monaco.languages.typescript.JsxEmit.React,
        typeRoots: ["node_modules/@types", "node_modules"]
    }
}

window.addEventListener("message", function ({ data }) {
    if (typeof data !== 'string') return;
    try {
        const decodeData = base64.decode(data);
        if (json.isCdxBriget(decodeData)) {
            invocableCtx(JSON.parse(decodeData))
        }
    } catch (e) {
        console.log(e)
    }
})
