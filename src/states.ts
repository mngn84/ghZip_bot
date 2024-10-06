import { getGroups } from "./services/sql-services";

export const selectedGroups = new Map<number, number[]>();
export const availableGroups = new Map<number, string>();

export const initGroups = async (): Promise<void> => {
    await getGroups();
}
