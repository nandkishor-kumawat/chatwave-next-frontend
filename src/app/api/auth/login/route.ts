import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required' });
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (!docSnap.exists()) return NextResponse.json({ error: 'No user Data available' });

        return NextResponse.json({
            message: 'User signed in successfully',
            data: docSnap.data()
        })

    } catch (error: any) {
        // if (error.code === 'auth/user-not-found') {
        //     return NextResponse.json({ error: 'User not found' });
        // }
        // if (error.code === 'auth/wrong-password') {
        //     return NextResponse.json({ error: 'Wrong password' });
        // }
        return NextResponse.json({ error: 'Invalid credentials' });
    }

}

