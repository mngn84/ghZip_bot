import { InputFile } from "grammy";
import { ZipParams } from "./interfaces";
import JSZip from "jszip";
import { Readable } from "stream";
import * as cheerio from "cheerio";

const limit: number = process.env.SIZE_LIMIT ? +process.env.SIZE_LIMIT : 20 * 1024 * 1024;

export const sendZip = async (ctx: any, params: ZipParams): Promise<void> => {
    params.description = await getDescription(params);
    const zipSize: number = await getZipSize(params);

    if (zipSize > limit) {
        params.url = `https://api.github.com/repos/${params.owner}/${params.repo}/zipball`;
        const largeZIp = await sendLargeZip(ctx, params);
        if (largeZIp) return;
    }

    const authorization: string = process.env.GH_USER && process.env.GH_TOKEN ? `${process.env.GH_USER}:${process.env.GH_TOKEN}@` : '';
    params.url = `https://${authorization}api.github.com/repos/${params.owner}/${params.repo}/zipball`;

    await ctx.replyWithDocument(new InputFile({ url: params.url }, `${params.repo}.zip`), {
        caption: `<b>${params.title}</b>\n${params.description}`,
        parse_mode: 'HTML',
    });
}

const sendLargeZip = async (ctx: any, params: ZipParams): Promise<Boolean> => {
    const response = await fetch(params.url, {
        headers: {
            'Authorization': `Bearer ${process.env.GH_TOKEN}`,
        }
    });

    const buffer: ArrayBuffer = await response.arrayBuffer();

    const zip: JSZip = new JSZip();
    await zip.loadAsync(buffer);

    let part: JSZip = new JSZip();
    let partSize: number = 0;
    let partNum: number = 1;
    let totalSize: number = 0;

    for (const [path, file] of Object.entries(zip.files)) {
        const content = await file.async('uint8array');

        if (partSize + content.length > limit) {
            await sendZipPart(ctx, part, partNum, params);
            part = new JSZip();
            partSize = 0;
            partNum++;
        }

        part.file(path, content);
        partSize += content.length;
        totalSize += content.length;
    }
   
    if (totalSize < limit) {
        return false;
    }
    return true;
}

const sendZipPart = async (ctx: any, part: JSZip, partNum: number, params: ZipParams): Promise<void> => {
    const buffer: Buffer = await part.generateAsync({ type: 'nodebuffer' });

    await ctx.replyWithDocument(new InputFile(Readable.from(buffer), `${params.repo}_part${partNum}.zip`), {
        caption: `<b>${params.title}</b>\n${params.description}`,
        parse_mode: 'HTML',
    });
}

const getDescription = async (params: ZipParams): Promise<string> => {
    const response: Response = await fetch(params.url);
    const html: string = await response.text();
    const $: cheerio.CheerioAPI = cheerio.load(html);

    return $('article > *')
        .slice(0, $('article > div:first-of-type ~ div').index())
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n');
}

const getZipSize = async (params: ZipParams): Promise<number> => {
     const url: string = `https://api.github.com/repos/${params.owner}/${params.repo}`;
    const response: Response = await fetch(url);
    const data: { size: number } = await response.json();
    return data.size ? data.size * 1024 : 0;
}