import { NextApiRequest, NextApiResponse } from 'next';
import {verifyKey} from '../../../../utils/db';
import {errorHandler} from '../../../../utils/logServer';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'POST' ) {
        const { uuid } = req.query;
        const { key } = req.body;

        const matches = await verifyKey( uuid as string, key );

        return res.status( 200 ).json({matches});
    }

    return res.status( 404 ).end();
};

export default errorHandler(handler);
