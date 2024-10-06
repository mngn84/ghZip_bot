import { Api, Bot, RawApi } from "grammy";
import { handleHelp, handleAddToGroup } from "../handlers/commandHandlers";
import { handleURLMessage } from "../handlers/messageHandlers";
import { handleAddGroup, handleRemoveGrroup } from "../handlers/groupHandlers";
import { MyContext } from "../interfaces";

export const setListeners = (bot: Bot<MyContext, Api<RawApi>>): void => {
  bot.command('help', handleHelp);
  bot.command('addtogroup', handleAddToGroup);
  bot.hears(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\s+.*)?$/, handleURLMessage);

  bot.on("message:new_chat_members:is_bot", handleAddGroup);
  bot.on("message:left_chat_member:me", handleRemoveGrroup);
}