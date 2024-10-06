import { ZipParams } from "../interfaces";
import JSZip from "jszip";
import { SIZE_LIMIT } from "../config";
import { MyContext } from "../interfaces";
import { getZipPart } from "./ghService";

export const processZip = async (ctx: MyContext, params: ZipParams): Promise<Boolean> => {
    if (!params.resBuffer) {
        return false;
    }

    try {
        const zip: JSZip = new JSZip();
        await zip.loadAsync(params.resBuffer);

        let part: JSZip = new JSZip();
        let partSize: number = 0;
        let partNum: number = 1;
        let totalSize: number = 0;

        for (const [path, file] of Object.entries(zip.files)) {
            const content = await file.async('uint8array');

            if (partSize + content.length > SIZE_LIMIT) {
                const buffer: Buffer = await part.generateAsync({ type: 'nodebuffer' });

                await getZipPart(ctx, buffer, partNum, params);
                part = new JSZip();

                partSize = 0;
                partNum++;
            }

            part.file(path, content);
            partSize += content.length;
            totalSize += content.length;
        }

        return totalSize >= SIZE_LIMIT
    } catch (error) {
        console.error('Ошибка при обработке частей архива:', error);
        throw error;
    }
}
