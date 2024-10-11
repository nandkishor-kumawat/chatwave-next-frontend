"use client"
import React from 'react'
import { Box } from '@mui/material'
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { userActions } from '@/redux/features'

interface ChatContainerProps {
    secondUserId: string;
}


const ChatContainer: React.FC<ChatContainerProps> = ({
    secondUserId
}) => {
    const { conversations } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const messages = React.useMemo(() => {
        if (secondUserId in conversations) {
            return conversations[secondUserId];
        }
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/${secondUserId}`, {
            cache: 'no-cache',
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(userActions.setConversations({ userId: secondUserId, conversations: data.conversations }));
            })
            .catch((error) => {
                console.error(error);
            });
        return [];
    }, [conversations, secondUserId, dispatch]);

    return (
        <Box className='relative h-full flex max-w-full flex-1 overflow-hidden'>
            <Box component={'main'} className='relative h-full w-full flex-1 overflow-hidden transition-width'>
                <Box className='flex h-full flex-col' role='presentation'>
                    <ChatHeader />
                    <ChatBody messages={messages} />
                    <ChatForm key={secondUserId} />
                </Box>
            </Box>
        </Box>
    )
}

export default ChatContainer;
