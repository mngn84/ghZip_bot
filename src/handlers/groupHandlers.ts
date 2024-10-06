import { Context } from "grammy";
import { availableGroups } from "../states";
import { addGroup, removeGroup, } from "../services/sql-services";

export const handleAddGroup = async (ctx: Context): Promise<void> => {
    if (!ctx.chat || !ctx.chat.title) {
        return;
    }
    try {
        const addedGroup = await addGroup(ctx.chat.id, ctx.chat.title);

        if (addedGroup) {
            availableGroups.set(addedGroup.id, addedGroup.name);
        }

    } catch (error) {
        console.error('Ошибка при добавлении группы:', error);
    }
}
export const handleRemoveGrroup = async (ctx: Context): Promise<void> => {
    if (!ctx.chat) {
        return;
    }
    try {
        const removedGroup = await removeGroup(ctx.chat.id);

        if (removedGroup) {
            availableGroups.delete(removedGroup.id);
        }

    } catch (error) {
        console.error('Ошибка при удалении группы:', error);
    }
}