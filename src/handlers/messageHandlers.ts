import { ZipParams } from "../interfaces";
import { getZip } from "../services/ghService";
import { handleGroupKeys } from "./keysHandlers";
import { MyContext } from "../interfaces";

export const handleURLMessage = async (ctx: MyContext): Promise<void> => {
    if (!ctx.chat || !ctx.msg || !ctx.msgId || !ctx.msg.text) {
        return;
    }

    const text: string = ctx.msg.text;
    const [url, ...titleChars]: string[] = text.split(' ');
    const title: string = titleChars.join(' ');
    const [, , , owner, repo] = url.split('/');
    const args: ZipParams = {
        url,
        owner,
        repo,
        title,
    };

    const zipMsg = await getZip(ctx, args);

    if (zipMsg?.message_id) {
        ctx.session.zipMsgId = zipMsg.message_id;
    }

    try {
        await handleGroupKeys(ctx);
        await ctx.react('👍');

    } catch (err) {
        ctx.reply('Ошибка при отправке архива.');
        ctx.react('😭');
        throw err;
    }
}