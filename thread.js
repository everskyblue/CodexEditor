const invoke = {
    "@cdx/editorInit": (file, source, prefixFile) => {
        require.config({ paths: { vs: '/assets/libs/monaco/min/vs' } });
        console.log(file, prefixFile)
        require(['vs/editor/editor.main'], function () {
            //monaco.languages.typescript.typescriptDefaults._compilerOptions.jsx = "react"
            const model = monaco.editor.createModel(source, undefined, monaco.Uri.file(`file:///${prefixFile}`))
            const editor = monaco.editor.create(document.getElementById('container'), {
                //value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                //language: 'typescript',
                theme: 'vs-dark',
                model
            });
            invoke.$editor = editor;
        });
    },

    "@cdx/editorLibs": (libs) => {
        console.log(libs)
        require(['vs/editor/editor.main'], function () {
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
            value: base64.encode(invoke.$editor.getModel().getValue()), 
        }), '*');
    }
}

function invokableCtx(ctx) {
    if (ctx.action in invoke) {
        invoke[ctx.action].apply(invoke, ctx.args);
    }
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
            invokableCtx(JSON.parse(decodeData))
        }
    } catch (e) {
        console.log(e)
    }
})
