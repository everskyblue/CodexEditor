(function (callback) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        callback(exports, require('base-64'));
    } else {
        callback((this.json = {}), this.base64);
    }
}).call(this, function (exports, base64) {
    exports.string = (data) => {
        return JSON.stringify(data);
    }
    
    exports.encode = data => {
        return base64.encode(exports.string(data))
    }
    
    exports.isJson = (data) => {
        return typeof data === 'string' && data.startsWith('{') && data.endsWith('}');
    }
    
    exports.isCdxBriget = data => {
        return exports.isJson(data) && data.includes('@cdx/');
    }
})