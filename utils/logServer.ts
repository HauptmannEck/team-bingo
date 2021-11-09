import { Logtail } from '@logtail/node';
import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

let serverLogger: Logtail | undefined;

if ( process.env.LOGTAIL_SOURCE_TOKEN ) {
    serverLogger = new Logtail( process.env.LOGTAIL_SOURCE_TOKEN );
}

export const errorHandler = (handler: NextApiHandler): NextApiHandler => (req: NextApiRequest, res: NextApiResponse) => {
    try {
        return handler(req, res);
    } catch (e) {
        console.error(e);
        if(serverLogger){
            serverLogger.error(e)
                .finally(() => {
                    throw e;
                });
        }
    }
};

export default serverLogger;
