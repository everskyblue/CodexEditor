const domeditor = document.getElementById('editor');

let editor;

window.addEventListener('message', function (e) {
    const backend = e.data;
    if (typeof backend === 'string') {
        try {
            const received = JSON.parse(backend);
            
            if (received.type === '@monaco/config') {
                const filename = received.data.filename;
                const config = received.data.config;
                const extension = filename.substring(filename.indexOf('.'));
                const langs = monaco.languages.getLanguages();
                const lang = langs.find(lang => {
                    if (lang.extensions.includes(extension)) {
                        return true;
                    }
                    return extension.lastIndexOf('.') > 2
                        ? lang.extensions.includes(
                            extension.substring(extension.lastIndexOf('.'))
                        ) : false;
                });
                
                config.value = base64.decode(config.value);
                
                if (lang) {
                    config.language = lang.id;
                } else {
                    console.info('no se encontro un carador con la extension ' + extension)
                }
                console.log(config.value,lang?.id);
                init(config);
                let data = editor.getModel().getValue();
                setInterval(function() {
                    let renew = editor.getModel().getValue();
                    if (data !== renew) {
                        window.parent.postMessage(renew, '*')
                        data = renew;
                    }
                }, 1000);
            } else if (received.type === '@monaco/get-value') {
                window.parent.postMessage(editor.getModel().getValue(), '*')
            } else if (received.type === '@monaco/set-value') {
                editor.setValue(decodeURIComponent(base64.decode(received.data)));
            } else if (received.type === '@monaco/focus') {
                editor.focus()
            } else if (received.type === '@monaco/blur') {
                document.activeElement.blur()
            }
            
        } catch (e) {
            console.log(e)
        }
    }
})

function init(config) {
    editor = monaco.editor.create(domeditor, config);
}