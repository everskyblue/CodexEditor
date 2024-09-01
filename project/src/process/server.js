import { app } from "tabris";

const httpd = cordova.plugins?.CorHttpd;

const path_app = app.getResourceLocation();
const dir_app = path_app.substring(path_app.lastIndexOf('/'));

let APP_PORT = 8181;
let PROJECT_PORT = 3030;

const APP_URL = `http://localhost:${APP_PORT}${dir_app}/assets`;
const PROJECT_URL = `http://localhost:${PROJECT_PORT}`;
const assets_url = httpd ? (createServer(APP_PORT), APP_URL) : app.getResourceLocation('assets/index.html');

function createServer(port, path = "", handler = null) {
    httpd.getURL(function (url) {
        if (url.length > 0 && url.includes(PROJECT_PORT)) return console.info("find url: ", url);
        httpd.startServer({
            'www_root': path,
            'port': port,
            'localhost_only': false
        }, function (url) {
            console.log("start url", url)
            if (typeof handler === "function") handler(false, url);
        }, function (error) {
            console.log(error, 'error')
            if (typeof handler === "function") handler(true, url);
        });
    });
}

class Server {
    constructor(port, path, handler){
        this.path = path;
        this.port = port;
        this.handler = handler;
        this.initialized = false;
    }
    
    canCreateServer() {
        return typeof httpd === 'object' && httpd !== null;
    }
    
    setPath(path) {
        this.path = path;
        return this;
    }
    
    _callHandler(error, url, resolve) {
        this.initialized = true;
        this.url = url;
        resolve({error, url});
        if (typeof this.handler === "function")
            this.handler.call(null, error, url);
    }
    
    initializeIfNotExists() {
        return new Promise(resolve => {
            if (!this.initialized) createServer(this.port, this.path, (error, url) => {
                this._callHandler(error, url, resolve);
            });
            else resolve({error: false, url: this.url});
        })
    }
    
    static create(port, path, handler) {
        return new Server(port, path, handler);
    }
}

export {
    httpd,
    createServer,
    assets_url,
    PROJECT_PORT,
    PROJECT_URL,
    Server
};