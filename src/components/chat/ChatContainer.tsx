"use client"
import { Box } from '@mui/material'
import React from 'react'
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';


const ChatContainer = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
                overflow: 'hidden',
                flexDirection: 'column',
            }}
        >
            <ChatHeader />
            <ChatBody />
            <ChatForm />
        </Box>
    )
}

export default React.memo(ChatContainer);
