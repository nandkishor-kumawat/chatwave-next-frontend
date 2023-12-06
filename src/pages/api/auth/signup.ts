import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(422).json({ message: 'Email, password and name are required' });
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

        return res.status(200).json({
            message: "User created successfully",
            data: userDetails,
        });

    } catch (error: any ) {
        if (error.code === 'auth/email-already-in-use') {
            return res.status(422).json({ message: 'Email already in use' });
        }
        res.status(500).json({ error: error.message });
    }
}

export default handler;
