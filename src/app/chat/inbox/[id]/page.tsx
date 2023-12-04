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

const Inbox = () => {
  const params = useParams();
  const secondUser = useAppSelector((state) => state.user.secondUser);
  const onlineUsers = useAppSelector((state) => state.user.onlineUsers);
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    messages,
    typingUsers,
    sendMessage,
    changeRoom,
  } = useChat();

  useEffect(() => {
    if (params?.id) {
      return onValue(ref(rdb, '/users/' + params.id), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          dispatch(switchUser({ ...data, id: params.id }))
        }
        setIsLoading(false)
      }, {
        onlyOnce: true
      });
    }
  }, [params?.id])

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
    <ChatContainer
      messages={messages}
      onlineUsers={onlineUsers}
      typingUsers={typingUsers}
      sendMessage={sendMessage}
    />
  )
}

export default Inbox