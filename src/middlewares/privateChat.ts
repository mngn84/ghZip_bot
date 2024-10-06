import { NextFunction } from "grammy";
import { MyContext } from "../interfaces";

export const privateChat = async (ctx: MyContext, next: NextFunction): Promise<void> => {
    if (ctx.chat?.type === "private") {
        await next();
    }
};