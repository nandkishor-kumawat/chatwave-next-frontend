import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   const id = request.url.split('/').at(-1);
   if (!id) {
      return NextResponse.json({ error: 'User id not found' });
   }

   let data = await getDoc(doc(db, "users", id as string));

   if (!data.exists()) {
      return NextResponse.json({ error: 'User not found' });
   }

   return NextResponse.json({ data: { ...data.data() } });
}

