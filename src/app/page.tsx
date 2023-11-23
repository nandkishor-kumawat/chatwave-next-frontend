'use client'
// import socket from '@/socket';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import ChatScreen from '@/components/ChatScreen';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Loader from '@/components/Loader';


export default function Home() {

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter()

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

  if (!currentUser) {
    return <Loader/>
  }





  return <ChatScreen />
}
