import { fs } from "tabris";
import checkExists from "./check";
import { basename, join } from "path";

export default async (fileFrom: string, path: string) => {
    checkExists({ file: fileFrom, fn: "isFile" }, { file: path, fn: "isDir" });
    const source: ArrayBuffer = await fs.readFile(fileFrom);
    const fileTo = join(path, basename(fileFrom))
    return {
        success: await fs.appendToFile(fileTo,source),
        file: fileTo
    }
};
