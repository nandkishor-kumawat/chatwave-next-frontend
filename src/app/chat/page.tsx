'use client'
import socket from '@/socket';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import SideBar from '@/components/sidebar/SideBar';
import { Box, Container, IconButton } from '@mui/material';
import ChatContainer from '@/components/chat/ChatContainer';
import useWindowSize from '@/custom hooks/useWindowSize';

export default function Home() {

  useEffect(() => {
    socket.connect()
    socket.emit('newUser', 'currentUser');
    socket.on('newUserResponse', (users) => {
      console.log(JSON.stringify(users, null, 2))
    });
    return () => {
      socket.disconnect()
    }
  }, [])


  const size = useWindowSize();

  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <SideBar size={size} />

        <ChatContainer />

      </Box>
    </>
  )
}
