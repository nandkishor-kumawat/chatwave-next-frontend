import useChat from '@/custom hooks/useChat';
import React from 'react'
import Image from 'next/image'
import SideBar from '@/components/sidebar/SideBar';
import { Box, Container, IconButton } from '@mui/material';
import ChatContainer from '@/components/chat/ChatContainer';
import { useAppSelector } from '@/redux/store';

const ChatScreen = () => {

    const secondUser = useAppSelector((state) => state.user.secondUser);

    const {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
        changeRoom
    } = useChat();


    return (
        <Box className='relative z-0 flex h-full w-full overflow-hidden'>

            <SideBar changeRoom={changeRoom} onlineUsers={onlineUsers} typingUsers={typingUsers} />

            {secondUser ? <ChatContainer
                messages={messages}
                onlineUsers={onlineUsers}
                typingUsers={typingUsers}
                sendMessage={sendMessage}
            /> : null}

        </Box>
    )
}

export default ChatScreen