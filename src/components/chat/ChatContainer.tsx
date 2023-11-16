import { Box } from '@mui/material'
import React from 'react'
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';

type PropTypes = {
    messages: any
    onlineUsers: any
    typingUsers: any
    user: any
    sendMessage: (data: any) => void
}

const ChatContainer = ({
    messages,
    onlineUsers,
    typingUsers,
    user,
    sendMessage,
}: PropTypes) => {
    return (
        <div className='relative h-full flex  max-w-full flex-1 flex-col overflow-hidden'>
            <main className='relative h-full w-full flex-1 overflow-hidden transition-width'>
                <Box className='flex h-full flex-col' role='presentation'>
                    <ChatHeader onlineUsers={onlineUsers} typingUsers={typingUsers} />
                    <ChatBody messages={messages} />
                    <ChatForm sendMessage={sendMessage} />
                </Box>
            </main>
        </div>
    )
}

export default React.memo(ChatContainer);
