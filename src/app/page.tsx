'use client'
import socket from '@/socket';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SideBar from '@/components/SideBar';
import { Box, Container, IconButton } from '@mui/material';
import ChatContainer from '@/components/ChatContainer';
import Navbar from '@/components/Navbar';
import useWindowSize from '@/custom hooks/useWindowSize';

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

  const [open, setOpen] = useState<boolean>(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(prev => !prev);
  };

  const size = useWindowSize();

  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <SideBar open={open} handleDrawerClose={handleDrawerClose} size={size} />

        <ChatContainer />

      </Box>
    </>
  )
}
