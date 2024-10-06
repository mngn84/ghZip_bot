import { MyContext } from "../interfaces";

export const handleHelp = async (ctx: MyContext): Promise<void> => {
    try {
        ctx.reply(
            'Доступные команды:\n' +
            '/help - Показать это сообщение помощи\n' +
            '/addtogroup - Добавить бота в группы\n\n' +
            'Для загрузки архива с GitHub отправьте URL репозитория и заголовок через пробел.\n' +
            'Далее выберите группы для рассылки'
        );
    } catch (err) {
        console.error('Ошибка при отправке сообщения помощи:', err);
        throw err;
    }
}

export const handleAddToGroup = async (ctx: MyContext): Promise<void> => {
    if (!ctx.from || !ctx.from.username) {
        return;
    }
    try {
        const botUserName: string = ctx.me.username;
        const url = `https://t.me/${botUserName}?startgroup=true`;
        await ctx.reply(`Для добавления бота в группы перейдите по ссылке: ${url}`);

    } catch (err) {
        console.error('Ошибка добавления бота в группы:', err);
        throw err;
    }
}