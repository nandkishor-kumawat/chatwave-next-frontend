import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
        return NextResponse.json({ message: 'Email, password and name are required' });
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;

        const userDetails = {
            id: user.uid,
            email,
            name,
        }

        await setDoc(doc(db, "users", user.uid), userDetails);

        return NextResponse.json({
            message: "User created successfully",
            data: userDetails,
        });

    } catch (error: any ) {
        if (error.code === 'auth/email-already-in-use') {
            return NextResponse.json({ message: 'Email already exists, try to login' });
        }
        NextResponse.json({ error: error.message });
    }
}

