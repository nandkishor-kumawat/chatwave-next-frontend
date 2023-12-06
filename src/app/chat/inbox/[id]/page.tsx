"use client"
import ChatContainer from '@/components/chat/ChatContainer';
import useChat from '@/hooks/useChat';
import { db } from '@/firebase';
import { switchUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

import { doc, getDoc } from 'firebase/firestore';
import { CircularProgress, Container } from '@mui/material';
import Loader from '@/components/progress/Loader';

const Inbox = () => {
  const params = useParams();
  const secondUser = useAppSelector((state) => state.user.secondUser);
  const onlineUsers = useAppSelector((state) => state.user.onlineUsers);
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!params?.id) return

    if (secondUser) return;

    setIsLoading(true)
    async function fetchUser(id: string) {
      const userRef = doc(db, 'users', id);
      const userData = await getDoc(userRef);
      const user = userData.data();
      if (user) {
        dispatch(switchUser({
          id: user.uid,
          name: user.name,
          email: user.email,
        }));
      }
      setIsLoading(false)
    }
    fetchUser(params.id as string)

  }, [params?.id, dispatch, secondUser])

  if (isLoading) {
    return <Loader/>
  }

  if (!secondUser) {
    return <div className="text-white h-full w-full flex justify-center items-center flex-col">
      <NoAccountsIcon sx={{ fontSize: 150 }} />
      <h1 className="text-3xl">No user found</h1>
    </div>
  }


  return (
    <>

    </>
  )
}

export default React.memo(Inbox);