import { Api, Bot, BotError, Context, GrammyError, HttpError } from "grammy";

export const setErrorHandler = (bot: Bot<Context, Api>): void => {
    bot.catch((err: BotError) => {
        const ctx: Context = err.ctx;
        console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);

        const e: unknown = err.error;

        if (e instanceof GrammyError) {
            console.error("Ошибка в запросе:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Не удалось связаться с Telegram:", e);
        } else {
            console.error("Неизвестная ошибка:", e);
        }
    });
}