
const domeditor = document.getElementById('editor');
let editor;

window.addEventListener('message', function (e) {
    const backend = e.data;
    if (typeof backend === 'string') {
        try {
            const received = JSON.parse(backend);
            
            if (received.type === '@monaco/config') {
                init(received.data);
            } else if (received.type === '@monaco/get-value') {
                window.parent.postMessage(editor.getModel().getValue(), '*')
            } else if (received.type === '@monaco/set-value') {
                editor.setValue(decodeURIComponent(base64.decode(received.data)));
            }
            
        } catch (e) {
            //alert(e)
        }
    }
})

function init(config) {
    editor = monaco.editor.create(domeditor, config);
}