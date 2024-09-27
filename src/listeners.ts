import { Api, Bot, Context, RawApi } from "grammy";
import { handleHelp, handleStart, handleURLMessage } from "./handlers";

export const setListeners = (bot: Bot<Context, Api<RawApi>>): void => {
    bot.command('start', handleStart);
    bot.command('help', handleHelp);
    bot.hears(/^https:\/\/github\.com\/[\w-]+\/[\w-]+(\s+.+)?$/, handleURLMessage);
}