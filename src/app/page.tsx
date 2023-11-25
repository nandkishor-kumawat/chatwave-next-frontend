'use client'
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import ChatScreen from '@/components/ChatScreen';
import { useEffect, useState } from 'react';
import LinearProgressBar from '@/components/progress/LinearProgressBar';


export default function Home() {

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) return router.push('/login')

      dispatch(setCurrentUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL
      }))
    })

  }, [])


  return (
    <>
      {!isUser && <LinearProgressBar onEnd={() => setIsUser(true)} />}
      {currentUser && <ChatScreen />}
    </>
  )
}
