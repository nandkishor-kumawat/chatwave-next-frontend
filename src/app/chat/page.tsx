"use client"
import StartChat from '@/components/chat/StartChat'
import { switchUser } from '@/redux/features/userSlice'
import { useAppDispatch } from '@/redux/store'
import React from 'react'

const Chat = () => {
  const dispatch = useAppDispatch()
  dispatch(switchUser(null))

  return (
    <StartChat />
  )
}

export default Chat