import { InlineKeyboard } from 'grammy';
import { availableGroups } from '../states';
import { GROUPS_PER_PAGE } from '../config';

export const createKeyboard = (page: number): InlineKeyboard => {
    try {
        const groupList: [number, string][] = Array.from(availableGroups);
        const totalPages: number = Math.ceil(groupList.length / GROUPS_PER_PAGE);

        const keyboard = new InlineKeyboard();

        for (let i = page * GROUPS_PER_PAGE; i < (page + 1) * GROUPS_PER_PAGE && i < groupList.length; i++) {
            const [id, name] = groupList[i];
            keyboard.text(name, `group_${id}`).row();
        }

        if (page > 0) {
            keyboard.text('◀️ Назад', `page_${page - 1}`);
        }

        if (page < totalPages - 1) {
            keyboard.text('Вперед ▶️', `page_${page + 1}`);
        }

        keyboard.row().text('Подтвердить', 'confirm');

        return keyboard;
    } catch (err) {
        console.error('Ошибка создания клавиатуры:', err);
        throw err;
    }
}