import { Api, Bot, Context, RawApi } from "grammy";
import dotenv from "dotenv";
import { setListeners } from "./listeners";
import { setErrorHandler } from "./errorHandlers";

dotenv.config();

const initBot = async (): Promise<void> => {
    try {
        if (!process.env.BOT_TOKEN) {
            throw new Error('BOT_TOKEN необходим для работы бота');
        }

        const bot: Bot<Context, Api<RawApi>> = new Bot(process.env.BOT_TOKEN);

        await bot.api.setMyCommands([
            { command: 'start', description: 'активировать бота в чате' },
            { command: 'help', description: 'помощь' },
        ]);

        setListeners(bot);
        setErrorHandler(bot);

        await bot.start();
    } catch (err) {
        console.error('Ошибка при инициализации бота:', err);
    }
}

initBot();