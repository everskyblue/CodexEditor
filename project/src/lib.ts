import { Module } from "tabris"
import { resolve } from 'path';

export const libRequire = Module.createRequire("/libs/");
export const modulesRequire = Module.createRequire('/modules/');

const paths: Record<string, any> = {
    '@lib': libRequire,
    '@module': modulesRequire
}

function moduleRequired(path: string) {
    const roots = path.split('/');
    const alias = roots[0].startsWith('@') ? roots.shift() : null;
    if (alias) {
        if (roots.length === 0) roots.push('index');
        return paths[alias]('.' + resolve('/', ...roots));
    }
    throw new Error("not fount module "+ path);
}

export default moduleRequired;