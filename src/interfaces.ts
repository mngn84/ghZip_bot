import { Context, SessionFlavor } from "grammy";

export interface ZipParams {
    url?: string;
    owner: string;
    repo: string;
    title: string;
    description?: string;
    resBuffer?: ArrayBuffer | null;
}

export interface GroupRow {
    id: number;
    name: string;
}

export interface SessionData {
    zipMsgId: number;
    keysMsgId: number;
}

export type MyContext = Context & SessionFlavor<SessionData>;