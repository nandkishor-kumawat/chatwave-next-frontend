"use client"
import StartChat from '@/components/chat/StartChat'
import { userActions } from '@/redux/features'
import { useAppDispatch } from '@/redux/store'
import React from 'react'

const Chat = () => {
  const dispatch = useAppDispatch()
  dispatch(userActions.switchUser(null))

  return (
    <StartChat />
  )
}

export default Chat