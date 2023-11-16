'use client'
// import socket from '@/socket';
import Image from 'next/image'
import { use, useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SideBar from '@/components/sidebar/SideBar';
import { Box, Container, IconButton } from '@mui/material';
import ChatContainer from '@/components/chat/ChatContainer';
import Navbar from '@/components/Navbar';
import useWindowSize from '@/custom hooks/useWindowSize';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import useChat from '@/custom hooks/useChat';

export default function Home() {

  const params = useSearchParams();
  const name = params?.get('name');
  const roomId = params?.get('room');

  const {
    messages,
    onlineUsers,
    typingUsers,
    user,
    userJoin,
    sendMessage,
    changeRoom
  } = useChat();


  const size = useWindowSize();
  const secondUser = useAppSelector((state) => state.user.secondUser);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter()


  useEffect(() => {
    auth.onAuthStateChanged((user) => {

      if (user) {
        dispatch(setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoUrl: user.photoURL
        }))
      } else {
        // router.push('/login')
      }
    })

  }, [])




  return (
    <>
      <Box className='relative z-0 flex h-full w-full overflow-hidden'>

        <SideBar changeRoom={changeRoom} onlineUsers={onlineUsers} typingUsers={typingUsers} />



        {secondUser ? <ChatContainer
          messages={messages}
          onlineUsers={onlineUsers}
          typingUsers={typingUsers}
          user={user}
          sendMessage={sendMessage}
        /> : null}

      </Box>
    </>
  )
}
