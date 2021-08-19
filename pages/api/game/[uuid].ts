// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteGame } from '../../../utils/db';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'DELETE' ) {
        const { uuid } = req.query;

        const success = await deleteGame( uuid as string );

        return res.status( success ? 204 : 400 ).end();
    }

    return res.status( 404 ).end();
};

export default handler;
