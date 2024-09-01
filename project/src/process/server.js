import { app } from "tabris";

const httpd = cordova.plugins?.CorHttpd;

const path_app = app.getResourceLocation();
const dir_app = path_app.substring(path_app.lastIndexOf('/'));

let APP_PORT = 8181;
let PROJECT_PORT = 3030;

const APP_URL = `http://localhost:${APP_PORT}${dir_app}/assets`;
const PROJECT_URL = `http://localhost:${PROJECT_PORT}`;
const assets_url = httpd ? (createServer(APP_PORT), APP_URL) : app.getResourceLocation('assets/index.html');

function createServer(port, path = "") {
    httpd.getURL(function (url) {
        if (url.length > 0 && url.includes(PROJECT_PORT)) return console.info("find url: ", url);
        httpd.startServer({
            'www_root': path,
            'port': port,
            'localhost_only': false
        }, function (url) {
            console.log("start url", url)
        }, function (error) {
            console.log(error, 'error')
        });
    });
}

export {
    httpd,
    createServer,
    assets_url,
    PROJECT_PORT,
    PROJECT_URL
};