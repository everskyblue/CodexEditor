import { fs } from "tabris";
import checkExists from "./check";

export default async (fileFrom: string, path: string): Promise<boolean> => {
    checkExists({ file: fileFrom, fn: "isFile" }, { file: path, fn: "isDir" });
    const source: ArrayBuffer = await fs.readFile(fileFrom);
    fs.appendToFile(
        path.concat("/", fileFrom.substring(fileFrom.lastIndexOf("/") + 1)),
        source
    );
    return true;
};
