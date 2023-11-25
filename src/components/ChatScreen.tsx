import React, { useEffect, useMemo } from 'react'
import useChat from '@/custom hooks/useChat';
import SideBar from '@/components/sidebar/SideBar';
import { Box } from '@mui/material';
import ChatContainer from '@/components/chat/ChatContainer';
import { useAppSelector } from '@/redux/store';
import StartChat from './chat/StartChat';

const ChatScreen = () => {

    const secondUser = useAppSelector((state) => state.user.secondUser);
    
    const {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
        changeRoom,
        getSocket
    } = useChat();

    const socket = useMemo(() => getSocket(), [getSocket]);


    return (
        <Box className='relative z-0 flex h-full w-full overflow-hidden'>

            <SideBar changeRoom={changeRoom} onlineUsers={onlineUsers} typingUsers={typingUsers} />

            {secondUser ? <ChatContainer
                messages={messages}
                onlineUsers={onlineUsers}
                typingUsers={typingUsers}
                sendMessage={sendMessage}
            /> : <StartChat />}

        </Box>
    )
}

export default ChatScreen