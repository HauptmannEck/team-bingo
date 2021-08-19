// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createGameWord, deleteGame, getGameWords } from '../../../../utils/db';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'GET' ) {
        const { uuid } = req.query;

        const words = await getGameWords( uuid as string );

        return res.status( 200 ).json(words);
    } else if ( req.method === 'POST' ) {
        const { uuid } = req.query;
        const { text } = req.body;

        const success = await createGameWord( uuid as string, text );

        return res.status( success ? 204 : 400 ).end();
    }

    return res.status( 404 ).end();
};

export default handler;
