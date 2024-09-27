import { Context } from "grammy";
import { ZipParams } from "./interfaces";
import { sendZip } from "./services";

const activeInChat = new Map<number, boolean>();

export const handleStart = async (ctx: Context): Promise<void> => {
    if (ctx.chat) {
        activeInChat.set(ctx.chat.id, true);
        ctx.reply('Введите URL репозитория и заголовок через пробел.');
        setTimeout(() => {
            if (ctx.chat) {
                activeInChat.set(ctx.chat.id, false);
            }
        }, +(process.env.DEACT_DELAY ?? 15) * 1000);
    }
}
export const handleHelp = async (ctx: Context): Promise<void> => {
    ctx.reply(
        'Доступные команды:\n' +
        '/active_ghbot - Активировать бота ввода URL GitHub и заголовка\n' +
        '/help - Показать это сообщение помощи\n\n' +
        `После активации бота, отправьте URL GitHub репозитория и заголовок через пробел в течение ${process.env.DEACT_DELAY} секунд.\n`
    );
}

export const handleURLMessage = async (ctx: Context): Promise<void> => {
    if (!ctx.chat || !ctx.msg) {
        return;
    }

    if (ctx.msg.text && activeInChat.get(ctx.chat.id)) {
        const text: string = ctx.msg.text;
        const [url, ...titleChars]: string[] = text.split(' ');
        const title: string = titleChars.join(' ');

        const [, , , owner, repo] = url.split('/');
        const args: ZipParams = {
            url,
            owner,
            repo,
            title,
            description: '',
        };

        try {
            await sendZip(ctx, args);
            await ctx.react('👍');
        } catch (err) {
            ctx.reply('Ошибка при отправке архива.');
            ctx.react('😭');
            throw err;
        } finally {
            activeInChat.set(ctx.chat.id, false);
        }
    }
}

