import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAdminKey} from '../../../../utils/db';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'GET' ) {
        const { uuid } = req.query;
        const key = req.headers['admin-key'] as string;

        const matches = await verifyAdminKey( uuid as string, key );

        return res.status( 200 ).json({matches});
    }

    return res.status( 404 ).end();
};

export default handler;
