"use client"
import React from 'react'
import { Box } from '@mui/material'
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';
import useChat from '@/hooks/useChat';
import { useAppSelector } from '@/redux/store';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

type PropTypes = {
    messages: any
    onlineUsers: any
    typingUsers: any
    sendMessage: (data: any) => void
}

const ChatContainer = () => {
    const {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage
    } = useChat()
    const pathname = usePathname()
    const secondUser = useAppSelector((state) => state.user.secondUser);


    if (pathname === '/chat' || !secondUser) return null

    return (
        <Box className='relative h-full flex  max-w-full flex-1 overflow-hidden'>
            <Box component={'main'} className='relative h-full w-full flex-1 overflow-hidden transition-width'>
                <Box className='flex h-full flex-col' role='presentation'>
                    <ChatHeader onlineUsers={onlineUsers} typingUsers={typingUsers} />
                    <ChatBody messages={messages} />
                    <ChatForm key={secondUser.id} sendMessage={sendMessage} />
                </Box>
            </Box>
            {/* <Box className='w-[250px] bg-slate-400'>
                <div>hello 1</div>
                <div>hello 2</div>
                <div>hello 3</div>
                <div>hello 4</div>
                <div>hello 5</div>
                <div>hello 6</div>
                <div>hello 7</div>
                <div>hello 8</div>
                <div>hello 9</div>
                <div>hello 10</div>
            </Box> */}
        </Box>
    )
}

export default React.memo(ChatContainer);
