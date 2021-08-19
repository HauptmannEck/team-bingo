import {NextApiRequest, NextApiResponse} from 'next';
import {createBoard, getGameWords} from '../../../../../utils/db';
import {sendEmail} from '../../../../../utils/email';
import {sampleSize} from '../../../../../utils/helpers';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {uuid} = req.query;
        const {name, email} = req.body;

        const words = await getGameWords(uuid as string);
        const randomWords = sampleSize(words, 24);
        const cells: { id: number, selected: boolean }[] = randomWords.map(word => ({
            id: word.id,
            selected: false,
        }));
        const cellsString = JSON.stringify(cells);

        const id = await createBoard(uuid as string, name, cellsString);

        if (id && email) {
            const url = `${req.headers.origin}/game/${uuid}/board/${id}`;
            await sendEmail(email, 'Team Bingo Link', `Here is a link to the Game Board you just created.\n${url}`);
        }

        return res.status(201).end({id});
    }

    return res.status(404).end();
};

export default handler;
