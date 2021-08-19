// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import {createGame} from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method !== 'POST') {
    return res.status(404);
  }

  const {name, adminCode} = req.body;

  const createdUuid = await createGame(name, adminCode)

  res.status(201).json({ uuid: createdUuid })
};

export default handler;
