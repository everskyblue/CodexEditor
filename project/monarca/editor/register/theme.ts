import { RegisterProvider } from "../contracts.d";

const themes = new Map<string, any>();

export default (id: string, fn: (existsID: boolean) => RegisterProvider) => {
        const exists = themes.has(id);
        const pkg = fn(exists);
        if (!exists) {
            themes.set(pkg.package.packageID, pkg)
        }
    }