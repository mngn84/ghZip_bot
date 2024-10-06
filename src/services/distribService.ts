import { MyContext } from "../interfaces";
import { selectedGroups } from "../states";

export const sendToGroups = async (ctx: MyContext): Promise<void> => {
    if (ctx.chatId && ctx.session.zipMsgId) {
        const groupSelection = selectedGroups.get(ctx.chatId) || [];

        for (const groupId of groupSelection) {
            try {
                ctx.api.forwardMessage(groupId, ctx.chatId, ctx.session.zipMsgId);
            } catch (error) {
                console.error('Ошибка отправки в группы:', error);
                throw error;
            }
        }
    }
}