// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import { editBoard, getBoard } from '../../../../../utils/db';
import {errorHandler} from '../../../../../utils/logServer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const {uuid, boardId} = req.query;
        const {name, cells} = req.body;

        const success = await editBoard(uuid as string, parseInt(boardId as string), name, JSON.stringify(cells));

        return res.status(success ? 204 : 400).end();
    } else if (req.method === 'GET') {
        const {uuid, boardId} = req.query;

        const board = await getBoard(uuid as string, parseInt(boardId as string));

        return res.status(200).json(board);
    }

    return res.status(404).end();
};

export default errorHandler(handler);
