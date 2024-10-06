import { SessionData } from "../interfaces";

export const initial = (): SessionData => {
    return {
        zipMsgId: 0,
        keysMsgId: 0
    }
};
