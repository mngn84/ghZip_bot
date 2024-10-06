import { selectedGroups, availableGroups } from '../states';
import { sendToGroups } from '../services/distribService';
import { MyContext } from '../interfaces';
import { createKeyboard } from '../services/keysService';

export const handleGroupKeys = async (ctx: MyContext, page: number = 0) => {
    const keyboard = createKeyboard(page);
    try {
        const keyboardMsg = await ctx.reply('Выберите группы для отправки:', {
            reply_markup: keyboard,
        });

        ctx.session.keysMsgId = keyboardMsg.message_id;
    } catch (err) {
        console.error('Ошибка инлайн-клавиатуры:', err);
        throw err;
    }
}

export const handleGroupSelection = async (ctx: MyContext): Promise<void> => {
    if (!ctx.from || !ctx.callbackQuery) {
        return;
    }

    const userId = ctx.from.id;
    const lastkey = ctx.callbackQuery.data || '';

    try {
        if (lastkey === 'confirm') {
            if (selectedGroups.size === 0) {
                await ctx.answerCallbackQuery({
                    text: 'Группы не выбранны.',
                });
                return;
            }

            const groups: number[] = selectedGroups.get(userId) || [];
            const groupNames: string[] = groups.map(groupId => availableGroups.get(groupId) || '');

            await sendToGroups(ctx);
            await ctx.answerCallbackQuery({
                text: `Отправка в ${groupNames.join(', ')}`,
            });

            await ctx.deleteMessages([ctx.session.keysMsgId]);
            selectedGroups.delete(userId);
        } else {
            const groupId: number = +lastkey.split('_')[1];
            let groups: number[] = selectedGroups.get(userId) || [];

            if (groups.includes(groupId)) {
                groups = groups.filter(group => group !== groupId);
            } else {
                groups.push(groupId);
            }

            selectedGroups.set(userId, groups);
            const groupName: string = availableGroups.get(groupId) || '';

            await ctx.answerCallbackQuery({
                text: `Группа ${groupName} ${groups.includes(groupId) ? "добавлена" : "удалена"}`
            });
        }
    } catch (err) {
        console.error('Ошибка выбора групп для отправки:', err);
        throw err;
    }
}

export const handleGroupPagination = async (ctx: MyContext): Promise<void> => {
    if (!ctx.callbackQuery) {
        return;
    }
    
    const lastkey = ctx.callbackQuery.data;
    
    try {
        if (lastkey && lastkey.startsWith('page_')) {
            const page = +lastkey.split('_')[1];
            const newKeyboard = createKeyboard(page);
            await ctx.editMessageReplyMarkup({
                reply_markup: newKeyboard
            });
        }
    } catch (err) {
        console.error('Ошибка пагинации:', err);
        throw err;
    }
}
