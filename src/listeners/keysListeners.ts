import { Bot, Api, RawApi } from "grammy";
import { handleGroupPagination, handleGroupSelection } from "../handlers/keysHandlers";
import { MyContext } from "../interfaces";

export const setKeyListeners = (bot: Bot<MyContext, Api<RawApi>>): void => {
    bot.callbackQuery(/^group_-?\d+$/, handleGroupSelection);
    bot.callbackQuery(/^confirm$/, handleGroupSelection);
    bot.callbackQuery(/^page_\d+$/, handleGroupPagination);
}
