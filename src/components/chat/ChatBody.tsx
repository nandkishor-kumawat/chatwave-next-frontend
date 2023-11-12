'use client'
import { Box } from '@mui/material'
import React from 'react'
import ChatBubble from './ChatBubble'
import { useAppSelector } from '@/redux/store'

const ChatBody = () => {
    const user = useAppSelector((state) => state.user.secondUser)
    return (
        <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
        }}
            className='scrollbar'
        >
            {Array(13).fill(0).map((_, i) => (
                <ChatBubble key={i} type={Math.round(Math.random()) % 2 === 0 ? 'start' : 'end'} />
            ))}
        </Box>
    )
}

export default ChatBody