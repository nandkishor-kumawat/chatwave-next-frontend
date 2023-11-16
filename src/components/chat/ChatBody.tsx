'use client'
import { Box } from '@mui/material'
import React from 'react'
import ChatBubble from './ChatBubble'
import { useAppSelector } from '@/redux/store'


type PropTypes = {
    messages: any;
}

const ChatBody = ({ messages }: PropTypes) => {
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const currentUser = useAppSelector((state) => state.user.currentUser);
    console.log(currentUser)
    console.log(JSON.stringify(messages, null, 2))

    return (
        <Box className='flex-1 overflow-hidden px-2'>
            <Box className="h-full relative">
                <div className="h-full w-full overflow-y-auto scrollbar">
                    <Box className='flex flex-col'>
                        {/* {Array(39).fill(0).map((_, i) => (
                            <ChatBubble key={i} type={Math.round(Math.random()) % 2 === 0 ? 'start' : 'end'} />
                        ))} */}
                        {messages.filter((message: any) =>
                            (message.to === secondUser.id && message.from === currentUser.id) ||
                            (message.to === currentUser.id && message.from === secondUser.id)
                        ).map((message: any, i: number) => (
                            <ChatBubble key={i} message={message} />
                        ))}
                    </Box>
                </div>
            </Box>
        </Box>
    )
}

export default ChatBody