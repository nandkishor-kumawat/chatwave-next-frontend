import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   return NextResponse.json({id:'s'})
//   let data = await getDoc(doc(db, "users", id as string));

//   if (!data.exists()) {
//     return NextResponse.json({ error: 'User not found' });
//   }

//   return NextResponse.json({ data: { ...data.data(), id: data.id } });
}

