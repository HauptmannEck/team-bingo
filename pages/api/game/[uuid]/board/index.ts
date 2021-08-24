import { NextApiRequest, NextApiResponse } from 'next';
import { createBoard, getGameWords } from '../../../../../utils/db';
import { sendEmail } from '../../../../../utils/email';
import { sampleSize } from '../../../../../utils/helpers';
import type { IDBCell } from '../../../../../utils/interfaces';
import {errorHandler} from '../../../../../utils/logServer';

const emailTemplate = (gameName: string, boardName: string, link: string) => `
<p><b>Game: ${gameName}</b></p>
<p><b>Sheet: ${boardName}</b></p>
<p><a href="${link}">Click here to return to your sheet</a></p>
<br/>
<p><small>The sheet will be deleted after 30 day of inacvitivty.</small></p>
`;

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
    if ( req.method === 'POST' ) {
        const { uuid } = req.query;
        const { name, email, gameName } = req.body;

        const words = await getGameWords( uuid as string );
        const randomWords = sampleSize( words, 24 );
        const cells: IDBCell[] = randomWords.map( word => ({
            id: word.id,
            selected: false,
        }) );
        const cellsString = JSON.stringify( cells );

        const id = await createBoard( uuid as string, name, cellsString );

        if ( id && email ) {
            const url = `${req.headers.origin}/game/${uuid}/board/${id}`;
            await sendEmail( email, 'Team Bingo Link', {
                html: emailTemplate(gameName,name, url),
            } );
        }

        return res.status( 201 ).json( { id } );
    }

    return res.status( 404 ).end();
};

export default errorHandler(handler);
