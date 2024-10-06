import sqlite3 from 'sqlite3';
import { GroupRow } from '../interfaces';
import { availableGroups } from '../states';

const sql = sqlite3.verbose();
const db = new sql.Database('groups.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name TEXT NOT NULL)');
});

export const addGroup = (id: number, name: string): Promise<{id: number, name: string}> => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO groups (id, name) VALUES (?, ?)', [id, name], (err: Error | null) => {
            if (err) {
                reject(err);
            }
            resolve({id, name});
        });
    });
};

export const getGroups = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM groups', (err: Error | null, rows: GroupRow[]) => {
            if (err) {
                reject(err);
            }
            rows.forEach((row: GroupRow) => {
                availableGroups.set(row.id, row.name);
            });
            resolve(rows.map((row: GroupRow) => ({ id: row.id, name: row.name })));
        });
    });
};

export const removeGroup = (id: number): Promise<{id: number}> => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM groups WHERE id = ?', [id], (err: Error | null) => {
            if (err) {
                reject(err);
            }
            resolve({id});
        });
    });
};
