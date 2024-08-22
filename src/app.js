const { Button, app, fs, permission, AlertDialog, TextView, CollectionView, TextInput, contentView } = require('tabris');

const permission_storage = [
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.INTERNET",
    'android.permission.MANAGE_EXTERNAL_STORAGE'
];

try {
    if (!permission.isAuthorized(...permission_storage)) {
        permission.requestAuthorization(...permission_storage).then(result => {
            if (result !== "granted") {
                AlertDialog.open("requiere permisos de almacenamiento");
            }
        });
    }
} catch (e) { }

contentView.background = "rgb(26,14,52)"

const url = getUrls();

contentView.append(
    TextInput({
        left: 50,
        right: 50,
        top: 50,
        font: '24px',
        text: url.current,
        textColor: "white",
        messageColor: "rgba(82,82,82,0.722)",
        borderColor: "rgb(77,29,149)",
        message: "path del proyecto"
    }),
    Button({
        centerX: true,
        top: "prev() 50",
        background: "rgb(146,51,234)",
        text: 'Cargar Aplicación',
        onSelect: () => {
            try {
                const path = $(TextInput).only().text;
                if (fs.isDir(path)) {
                    saveStorage(path);
                    const { main } = require(path + '/package.json');
                    app.reload(path + '/' + main);
                } else {
                    throw new Error("no es un directorio")
                }
            } catch (e) {
                AlertDialog.open(e.message);
            }
        }
    }),
    CollectionView({
        top: "prev() 15",
        bottom: 0,
        right: 50,
        left: 50,
        itemCount: url.projects.length,
        createCell() {
            return TextView({
                stretchX: true,
                alignment: "centerX",
                textColor: "rgb(221,214,254)",
                highlightOnTouch: true,
            });
        },
        updateCell(cell, index) {
            cell.text = url.projects[index];
        }
    })
);

function getUrls() {
    try {
        return JSON.parse(localStorage.getItem("urls"));
    } catch (e) {
        return createStorage();
    }
}

function createStorage() {
    const urls = {
        current: '',
        projects: []
    };
    localStorage.setItem("urls", JSON.stringify(urls));
    return urls;
}

function saveStorage(path) {
    if (!url.projects.includes(path)) url.projects.push(path);
    url.current = path;
    localStorage.setItem('urls', JSON.stringify(url))
}