// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {NextApiRequest, NextApiResponse} from 'next';
import {deleteGame, editGame, verifyAdminKey} from '../../../../utils/db';
import {errorHandler} from '../../../../utils/logServer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'DELETE') {
        const {uuid} = req.query;

        const key = req.headers['admin-key'] as string;

        const matches = await verifyAdminKey(uuid as string, key);

        if (matches) {
            const success = await deleteGame(uuid as string);
            return res.status(success ? 204 : 400).end();
        }

        return res.status(401).end();
    } else if (req.method === 'PUT') {
        const {uuid} = req.query;

        const key = req.headers['admin-key'] as string;

        const matches = await verifyAdminKey(uuid as string, key);

        if (matches) {
            const success = await editGame(uuid as string, req.body);
            return res.status(success ? 204 : 400).end();
        }

        return res.status(401).end();
    }

    return res.status(404).end();
};

export default errorHandler(handler);
