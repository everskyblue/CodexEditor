const $Worker = window.Worker;

function WorkerBridget(url, opts) {
  console.log(url, opts);
}

WorkerBridget.prototype = {
  postMessage(data) {
    console.log(data, 'post message');
    return this;
  },
  set onmessage(v) {
    return true;
  },
  terminate() {
    return this;
  },
  addEventListener() {},
};

window.Worker = WorkerBridget;

window.MonacoEnvironment = {
  getWorker(workerId, label) {
    console.log(workerId, label, 'get worker');
    return new WorkerBridget();
  },
};

var invoke = {
  "@cdx/editorInit": (file, source, prefixFile) => {
    require.config({ paths: { vs: "/assets/libs/monaco/min/vs" } });
    console.log(file, prefixFile);
    require(["vs/editor/editor.main"], function () {
      //monaco.languages.typescript.typescriptDefaults._compilerOptions.jsx = "react"
      const model = monaco.editor.createModel(
        source,
        undefined,
        monaco.Uri.file(`file:///${prefixFile}`)
      );
      const editor = monaco.editor.create(
        document.getElementById("container"),
        {
          //value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          //language: 'typescript',
          theme: "vs-dark",
          model,
        }
      );
      invoke.$editor = editor;
    });
  },

  "@cdx/editorLibs": (libs) => {
    console.log(libs);
    require(["vs/editor/editor.main"], function () {
      monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs);
      monaco.languages.typescript.javascriptDefaults.setExtraLibs(libs);
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
        getMonacoOptionsTs()
      );
    });
  },

  "@cdx/observerChangeValueModel": (time = 1000) => {
    let data = invoke.$editor.getModel().getValue();
    let interval = setInterval(function () {
      let renew = invoke.$editor.getModel().getValue();
      if (data !== renew) {
        window.parent.postMessage(renew, "*");
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
    window.parent.postMessage(invoke.$editor.getModel().getValue(), "*");
  },
};

function invocableCtx(ctx) {
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
    jsxFactory: "React.createElement",
    jsx: monaco.languages.typescript.JsxEmit.React,
    typeRoots: ["node_modules/@types", "node_modules"],
  };
}
/* 
window.addEventListener("message", function ({ data }) {
  if (typeof data !== "string") return;
  try {
    const decodeData = base64.decode(data);
    if (json.isCdxBriget(decodeData)) {
      invocableCtx(JSON.parse(decodeData));
    }
  } catch (e) {
    console.log(e);
  }
});
 */

var templateSource =  `
  interface Main {
    name: string;
    age: number;
  }
`;

invoke['@cdx/editorInit']('/src/index.ts', templateSource, 'src/index.ts')