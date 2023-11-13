'use client'
import { Box } from '@mui/material'
import React from 'react'
import ChatBubble from './ChatBubble'
import { useAppSelector } from '@/redux/store'
import useChat from '@/custom hooks/useChat'

const ChatBody = () => {
    const secondUser = useAppSelector((state) => state.user.secondUser)
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const { messages } = useChat()
    return (
        <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
        }}
            className='scrollbar'
        >
            {/* {Array(13).fill(0).map((_, i) => (
                <ChatBubble key={i} type={Math.round(Math.random()) % 2 === 0 ? 'start' : 'end'} />
            ))} */}
            {messages.filter((data: any) => data.to === secondUser?.id && data.from === currentUser?.id).map((data: any, i: number) => (
                <ChatBubble key={i} data={data} />
            ))}
        </Box>
    )
}

export default ChatBody