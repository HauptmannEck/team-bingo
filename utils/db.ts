import {PSDB} from 'planetscale-node';
import {v4} from 'uuid';
import type { IBoard, ICell, IDBCell, IGame, IWord } from './interfaces';

const conn = new PSDB(process.env.NODE_ENV === 'development' ? 'develop' : 'main');

export const getRandomGames = async () => {
    try {
        const [row] = await conn.query('select id, uuid, name from games order by rand()', undefined); // limit 6
        return row.map((item: any) => ({...item})) ?? [];
    } catch (e) {
        return [];
    }
};

export const getAllGameUuids = async (): Promise<string[]> => {
    try {
        const [row] = await conn.query('select uuid, name from games', undefined);
        return row.map((item: any) => item.uuid) ?? [];
    } catch (e) {
        return [];
    }
};

export const createBoard = async (gameUuid: string, name: string, cells: string): Promise<number> => {
    const [insert] = await conn.query('insert into boards (game_uuid, name, cells) values (?, ?, ?)', [gameUuid, name, cells]);
    return insert.insertId;
};

export const createGame = async (name: string, adminCode: string): Promise<string | null> => {
    const uuid = v4().replace(/-/g, '');
    try {
        const [insert] = await conn.query(`insert into games (uuid, name, admin_key) values (?, ?, ?)`, [uuid, name, adminCode]);
        const [row] = await conn.query('select uuid from games where id=?', [insert.insertId]);
        return row[0].uuid;
    } catch (e) {
        return null;
    }
};

export const editGame = async (uuid: string, game: Partial<IGame>): Promise<boolean> => {
    await conn.query('update games set name=?, description=? where uuid=?', [game.name, game.desc, uuid]);
    return true;
};

export const editBoard = async (gameUuid: string, boardId:number, name: string, cells: string): Promise<boolean> => {
    await conn.query('update boards set name=?, cells=? where game_uuid=? and id=?', [name, cells, gameUuid, boardId]);
    return true;
};

export const createGameWord = async (uuid: string, text: string): Promise<boolean> => {
    try {
        await conn.query(`insert into game_words (uuid, text) values (?, ?)`, [uuid, text]);
        return true;
    } catch (e) {
        return false;
    }
};

export const deleteGame = async (uuid: string): Promise<boolean> => {
    try {
        await conn.query('delete from games where uuid=?', [uuid]);
        return true;
    } catch (e) {
        return false;
    }
};

export const getGameWords = async (uuid: string): Promise<IWord[]> => {
    const [row] = await conn.query('select id, text from game_words where uuid=?', [uuid]);
    return row.map((item: any) => ({...item})) ?? [];
};

export const getGame = async (uuid: string): Promise<IGame | null> => {
    try {
        const [row] = await conn.query(`select id, uuid, name, description, pass_key from games where uuid='${uuid}'`, undefined);
        if (row.length > 0) {
            return {
                id: row[0].id,
                uuid: row[0].uuid,
                name: row[0].name,
                desc: row[0].description,
                passKey: !!row[0].pass_key,
            };
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export const getBoard = async (uuid: string, id: number): Promise<IBoard | null> => {
    try {
        const [row] = await conn.query('select id, name, cells from boards where game_uuid=? and id=?', [uuid, id]);
        if (row.length > 0) {
            const dbCells: IDBCell[] = row[0].cells;
            let cells: ICell[] = [];
            if(dbCells.length > 0){
                const [words] = await conn.query('select id, text from game_words where id in (?)', [dbCells.map( item => item.id)]);
                cells = dbCells.map(cell => {
                    const word = ((words as IWord[]) ?? []).find(word => word.id === cell.id);
                    if(word){
                        return {
                            wordId: cell.id,
                            word: word?.text ?? '',
                            selected: cell.selected,
                        };
                    }
                    return null;
                }).filter(Boolean) as any;
            }


            return {
                id: row[0].id,
                gameUuid: uuid,
                name: row[0].name,
                cells,
            };
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export const clearGamesBoards = async (): Promise<void> => {
    try {
        const [oldBoards] = await conn.query('select id from boards where updated_at < now() - interval 30 DAY', []);
        const [oldGames] = await conn.query('select uuid from games where updated_at < now() - interval 30 DAY', []);
        if (oldBoards.length > 0) {
            await conn.query('delete from boards where id in (?)', [oldBoards.map(( board: { id: any; }) => board.id)]);
        }
        if (oldGames.length > 0){
            for(const game of oldGames) {
                const [boards] = await conn.query('select COUNT(*) from boards where game_uuid=?', [game.uuid]);
                if(boards.length === 1 && boards[0]['COUNT(*)'] === 0){
                    await conn.query('delete from game_words where uuid=?', [game.uuid]);
                    await conn.query('delete from games where uuid=?', [game.uuid]);
                }
            }
        }
    } catch (e) {
        console.error(e);
        return;
    }
};
