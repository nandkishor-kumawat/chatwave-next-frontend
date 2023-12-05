"use client"
import ChatContainer from '@/components/chat/ChatContainer';
import useChat from '@/hooks/useChat';
import { rdb } from '@/firebase';
import { switchUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { onValue, ref } from 'firebase/database';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import SideBar from '@/components/sidebar/SideBar';
import StartChat from '@/components/chat/StartChat';

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
    return onValue(ref(rdb, '/users/' + params.id), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(switchUser({ ...data, id: params.id }))
        console.log(1)
      }
      setIsLoading(false)
    }, {
      onlyOnce: true
    });

  }, [])

  if (isLoading) {
    return
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