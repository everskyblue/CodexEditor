import { permission } from "tabris";

const permission_storage = [
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.INTERNET",
    "android.permission.MANAGE_EXTERNAL_STORAGE",
];

export async function permissionStorage(): Promise<boolean | null | never> {
    try {
        if (permission.isAuthorized(...permission_storage)) {
            return true;
        }
        try {
            // genera un error cuando se solicita y se rechaza la autorizacion
            // y no vuelve preguntar la autorizacion
            const status = await permission.requestAuthorization(
                ...permission_storage
            );
            if (status === "granted") {
                return true;
            } else if (status === "declined") {
                return false;
            }
        } catch (e) {}

        return null;
    } catch (e) {
        throw new Error(
            "permission no permitted, declare permission in config.xml"
        );
    }
}
