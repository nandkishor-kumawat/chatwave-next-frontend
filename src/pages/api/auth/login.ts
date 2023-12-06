import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'Email and password are required' });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (!docSnap.exists()) return res.status(200).json({ error: 'No user Data available' });
    
    return res.status(200).json({
      message: 'User signed in successfully',
      data: docSnap.data()
    })

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'auth/wrong-password') {
      return res.status(401).json({ error: 'Wrong password' });
    }
    return res.status(500).json({ error: error.message });
  }

}

export default handler;
