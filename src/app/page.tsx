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
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';


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
  const params = useSearchParams()
  const name = params?.get('name')
  const roomId = params?.get('room')
  const { userJoin } = useChat()
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
        userJoin(user.displayName);
      }else{
        router.push('/login')
      }
    })
  }, [])









  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <SideBar size={size} />

        {secondUser ? <ChatContainer /> : null}

      </Box>
    </>
  )
}
