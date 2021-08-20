import { NextApiRequest, NextApiResponse } from 'next';
import { clearGamesBoards } from '../../../utils/db';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method !== 'GET' ) {
        return res.status( 404 );
    }

    await clearGamesBoards();

    res.status( 204 ).end();
};

export default handler;
