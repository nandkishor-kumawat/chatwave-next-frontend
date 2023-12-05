import { getMessages } from '@/lib/messages';
import type { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const messages = getMessages();
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).end();
    }
}

export default handler;
