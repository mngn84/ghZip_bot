import { InputFile } from "grammy";
import { ZipParams } from "../interfaces";
import { Readable } from "stream";
import * as cheerio from "cheerio";
import { SIZE_LIMIT } from "../config";
import { Message } from "grammy/types";
import { MyContext } from "../interfaces";
import { processZip } from "./zipService";


export const getZip = async (ctx: MyContext, params: ZipParams): Promise<Message.DocumentMessage | undefined> => {
    try {
        params.description = await getDescription(params);
        params.url = `https://api.github.com/repos/${params.owner}/${params.repo}/zipball`;
        params.resBuffer = await fetchRepo(params.url);

        const zipSize: number = await getZipSize(params);

        if (zipSize > SIZE_LIMIT) {
            const largeZIp = await processZip(ctx, params);
            if (largeZIp) return;
        }

        if (!params.resBuffer) {
            return;
        }

        const buffer = Buffer.from(params.resBuffer);

        return await ctx.replyWithDocument(new InputFile(Readable.from(buffer), `${params.repo}.zip`), {
            caption: `<b>${params.title}</b>\n${params.description}`,
            parse_mode: 'HTML',
        });

    } catch (error) {
        console.error('Ошибка при получении репозитория:', error);
        throw error;
    }
}

export const getZipPart = async (ctx: MyContext, buffer: Buffer, partNum: number, params: ZipParams): Promise<void> => {
    try {
        await ctx.replyWithDocument(new InputFile(Readable.from(buffer), `${params.repo}_part${partNum}.zip`), {
            caption: `<b>${params.title}</b>\n${params.description}`,
            parse_mode: 'HTML',
        });

    } catch (error) {
        console.error('Ошибка при отправке части архива:', error);
        throw error;
    }
}

const fetchRepo = async (url: string): Promise<ArrayBuffer | null> => {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GH_TOKEN}`,
                'Accept': 'application/vnd.github+json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.arrayBuffer();

    } catch (error) {
        console.error('Ошибка при получении репозитория:', error);
        throw error;
    }
}

const getDescription = async (params: ZipParams): Promise<string> => {
    if (!params.url) {
        return '';
    }

    try {
        const response: Response = await fetch(params.url);
        const html: string = await response.text();
        const $: cheerio.CheerioAPI = cheerio.load(html);

        return $('article > *')
            .slice(0, $('article > div:first-of-type ~ div').index())
            .map((_, el) => $(el).text().trim())
            .get()
            .join('\n');

    } catch (error) {
        console.error('Ошибка при получении описания:', error);
        throw error;
    }
}

const getZipSize = async (params: ZipParams): Promise<number> => {
    const url: string = `https://api.github.com/repos/${params.owner}/${params.repo}`;
   
    try {
        const response: Response = await fetch(url);
        const data: { size: number } = await response.json();

        return data.size ? data.size * 1024 : 0;

    } catch (error) {
        console.error('Ошибка при получении размера архива:', error);
        throw error;
    }
}
