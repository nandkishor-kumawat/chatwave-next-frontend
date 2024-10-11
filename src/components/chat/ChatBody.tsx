'use client'
import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import ChatBubble from './ChatBubble'
import { useAppSelector } from '@/redux/store'
import { Conversation } from '@prisma/client'


type PropTypes = {
    messages: Conversation[];
}

const ChatBody = ({ messages }: PropTypes) => {
    const { secondUser } = useAppSelector((state) => state.user);

    const chatBodyRef = React.useRef<any>(null);

    useEffect(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        // chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, secondUser])

    return (
        <Box className='flex-1 overflow-hidden'>
            <Box className="h-full relative">
                <Box className="h-full w-full overflow-y-auto scrollbar" ref={chatBodyRef}>
                    <Box className='flex flex-col px-2 pb-2'>
                        {messages.map((message, i) => (
                            <ChatBubble key={i} message={message} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(ChatBody);