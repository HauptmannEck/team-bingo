import { Logtail } from '@logtail/node';
import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

const serverLogger = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || '');

export const errorHandler = (handler: NextApiHandler): NextApiHandler => (req: NextApiRequest, res: NextApiResponse) => {
    try {
        return handler(req, res);
    } catch (e) {
        console.error(e);
        serverLogger.error(e)
            .finally(() => {
                throw e;
            });
    }
};

export default serverLogger;