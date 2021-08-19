import { PSDB } from 'planetscale-node';
import { v4 } from 'uuid';

const conn = new PSDB( process.env.NODE_ENV === 'development' ? 'develop' : 'main' );

export const getRandomGames = async () => {
    try {
        const [row] = await conn.query( 'select id, uuid, name from games order by rand()', undefined ); // limit 6
        return row.map( ( item: any ) => ({ ...item }) ) ?? [];
    } catch ( e ) {
        return [];
    }
};

export const getAllGameUuids = async (): Promise<string[]> => {
    try {
        const [row] = await conn.query( 'select uuid, name from games', undefined );
        return row.map( ( item: any ) => item.uuid ) ?? [];
    } catch ( e ) {
        return [];
    }
};

export const createGame = async ( name: string, adminCode: string ): Promise<string | null> => {
    const uuid = v4().replace( /-/g, '' );
    try {
        const [insert] = await conn.query( `insert into games (uuid, name, admin_key) values ('${uuid}', '${name}', '${adminCode}')`, undefined );
        const [row] = await conn.query( `select uuid from games where id=${insert.insertId}`, undefined );
        return row[0].uuid;
    } catch ( e ) {
        return null;
    }
};

export const createGameWord = async ( uuid: string, text: string ): Promise<boolean> => {
    try {
        await conn.query( `insert into game_words (uuid, text) values ('${uuid}', '${text}')`, undefined );
        return true;
    } catch ( e ) {
        return false;
    }
};

export const deleteGame = async ( uuid: string ): Promise<boolean> => {
    try {
        await conn.query( `delete from games where uuid='${uuid}'`, undefined );
        return true;
    } catch ( e ) {
        return false;
    }
};

export const getGameWords = async ( uuid: string ): Promise<boolean> => {
    const [row] = await conn.query( `select id, text from game_words where uuid='${uuid}'`, undefined );
    return row.map( ( item: any ) => ({ ...item }) ) ?? [];
};

export const getGame = async ( uuid: string ) => {
    try {
        const [row] = await conn.query( `select id, uuid, name from games where uuid='${uuid}'`, undefined );
        return row.length > 0 ? { ...row[0] } : null;
    } catch ( e ) {
        return null;
    }
};
