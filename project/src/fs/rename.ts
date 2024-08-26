import { fs } from "tabris";
import checkExists from "./check";
import { dirname, join } from "path";

export default async (file: string, name: string) => {
    //const nwFile = file.substring(0, file.lastIndexOf("/") + 1) + name;
    const nwFile = join(dirname(file), name);
    checkExists({ file, fn: "isFile" });
    const result = {
        success: false,
        file: nwFile
    };
    
    try {
        const buffer = await fs.readFile(file);
        await fs.appendToFile(nwFile, buffer);
        result.success =  await fs.remove(file);
    } catch (e) {
        result.file = '';
    }
    return result;
};
