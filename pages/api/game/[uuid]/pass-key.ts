import { NextApiRequest, NextApiResponse } from 'next';
import {
    getGamePassKey,
    verifyAdminKey,
} from '../../../../utils/db';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'GET' ) {
        const { uuid } = req.query;
        const key = req.headers['admin-key'] as string;

        const matches = await verifyAdminKey( uuid as string, key );

        if(matches){
            const passKey = await getGamePassKey( uuid as string );

            return res.status( 200 ).json({passKey});
        }

        return res.status( 401 ).end();
    }

    return res.status( 404 ).end();
};

export default handler;
