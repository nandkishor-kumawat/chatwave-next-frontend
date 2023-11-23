'use client'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { useAppSelector } from '@/redux/store'


type PropTypes = {
    messages: any;
}

const ChatBody = ({ messages }: PropTypes) => {
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const currentUser = useAppSelector((state) => state.user.currentUser);
    
    const chatBodyRef = React.useRef<any>(null);
    
    useEffect(() => {
        console.log(JSON.stringify(messages, null, 2))
        if (chatBodyRef.current) {
            // chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages])

    return (
        <Box className='flex-1 overflow-hidden'>
            <Box className="h-full relative">
                <Box className="h-full w-full overflow-y-auto scrollbar"  ref={chatBodyRef}>
                    <Box className='flex flex-col px-2'>
                        {messages.filter((message: any) =>
                            (message.receiver_id === secondUser.email && message.sender_id === currentUser.email) ||
                            (message.receiver_id === currentUser.email && message.sender_id === secondUser.email)
                        ).map((message: any, i: number) => (
                            <ChatBubble key={i} message={message} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ChatBody