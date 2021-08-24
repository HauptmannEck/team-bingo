import { NextApiRequest, NextApiResponse } from 'next';
import { clearGamesBoards } from '../../../utils/db';
import {errorHandler} from '../../../utils/logServer';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method !== 'GET' ) {
        return res.status( 404 ).end();
    }

    await clearGamesBoards();

    res.status( 204 ).end();
};

export default errorHandler(handler);
