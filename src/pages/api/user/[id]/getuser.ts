import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  let data = await getDoc(doc(db, "users", id as string));

  if (!data.exists()) {
    return res.status(200).json({ error: 'User not found' });
  }

  return res.status(200).json({ data: { ...data.data(), id: data.id } });
}

export default handler;
