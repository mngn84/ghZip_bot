import { Api, Bot, RawApi, session } from "grammy";
import dotenv from "dotenv";
import { setListeners } from "./listeners/listeners";
import { setErrorHandler } from "./errorHandlers";
import { initGroups } from "./states";
import { setKeyListeners } from "./listeners/keysListeners";
import { MyContext } from "./interfaces";
import { initial } from "./middlewares/session";
import { privateChat } from "./middlewares/privateChat";

dotenv.config();

const initBot = async (): Promise<void> => {
    if (!process.env.BOT_TOKEN) {
        throw new Error('BOT_TOKEN необходим для работы бота');
    }

    try {
        const bot: Bot<MyContext, Api<RawApi>> = new Bot(process.env.BOT_TOKEN);

        initGroups();
        bot.use(privateChat);
        bot.use(session({ initial }));

        await bot.api.setMyCommands([
            { command: 'help', description: 'помощь' },
            { command: 'addtogroup', description: 'добавить в группу' },
        ], {
            scope: { type: 'all_private_chats' }
        });

        setListeners(bot);
        setKeyListeners(bot);
        setErrorHandler(bot);

        await bot.start();
    } catch (err) {
        console.error('Ошибка при инициализации бота:', err);
    }
}

initBot();