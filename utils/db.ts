import {PSDB} from 'planetscale-node';
import { v4 } from 'uuid';

const conn = new PSDB(process.env.NODE_ENV === 'development' ? 'develop' : 'main');

export const getRandomGames = async () => {
  try {
    const [getRows] = await conn.query('select id, uuid, name from games order by rand()', undefined); // limit 6
    return getRows.map((item: any) => ({...item})) ?? [];
  } catch (e) {
    return [];
  }
};

export const getAllGameUuids = async (): Promise<string[]> => {
  try {
    const [getRows] = await conn.query('select uuid, name from games', undefined);
    return getRows.map((item: any) => item.uuid) ?? [];
  } catch (e) {
    return [];
  }
};

export const createGame = async (name: string, adminCode: string): Promise<string | null> => {
  const uuid = v4().replace(/-/g, '');
  try {
    const [insert] = await conn.query(`insert into games (uuid, name, admin_key) values ('${uuid}', '${name}', '${adminCode}')`, undefined);
    const [row] = await conn.query(`select uuid from games where id=${insert.insertId}`, undefined);
    return row[0].uuid;
  } catch (e) {
    return null;
  }
};

export const deleteGame = async (uuid: string): Promise<boolean> => {
  try {
    await conn.query(`delete from games where uuid='${uuid}'`, undefined);
    return true;
  } catch (e) {
    return false;
  }
};

export const getGame = async (uuid: string): Promise<string | null> => {
  try {
    const [row] = await conn.query(`select id, uuid, name from games where uuid='${uuid}'`, undefined);
    return {...row[0]};
  } catch (e) {
    return null;
  }
};
