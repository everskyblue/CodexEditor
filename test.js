let json = require('./config/monaco.json')

const loop= (o)=> {
    let types = {};

    for (const key in o) {
        if (typeof o[key] === 'object') {
            types[key] = loop(o[key]);
        } else {
            types[key] = typeof o[key];
        }
    }

    return types;
}

console.log(loop(json));