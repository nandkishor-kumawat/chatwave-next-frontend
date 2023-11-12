'use client'
// import socket from '@/socket';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SideBar from '@/components/sidebar/SideBar';
import { Box, Container, IconButton } from '@mui/material';
import ChatContainer from '@/components/chat/ChatContainer';
import Navbar from '@/components/Navbar';
import useWindowSize from '@/custom hooks/useWindowSize';
import useChat from '@/custom hooks/useChat';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';


export default function Home() {

  // useEffect(() => {
  //   socket.connect()
  //   socket.emit('newUser', 'currentUser');
  //   socket.on('newUserResponse', (users) => {
  //     console.log(JSON.stringify(users, null, 2))
  //   });
  //   return () => {
  //     socket.disconnect()
  //   }
  // }, [])
  const {
    userJoin
  } = useChat()
  const params = useSearchParams()


  useEffect(() => {
    console.log(params?.get('name'))
    const name = params?.get('name')
    userJoin(name);

  }, [])





  const size = useWindowSize();
  const secondUser = useAppSelector((state) => state.user.secondUser)

  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <SideBar size={size} />

       {secondUser ? <ChatContainer /> : null}

      </Box>
    </>
  )
}
