"use client"
import React, { useState } from 'react'
import { Box, Divider, FormControl, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Textarea from '../styled/TextArea';
import { chatActions } from '@/actions';
import { Conversation } from '@prisma/client';
import { userActions } from '@/redux/features'
import { useSession } from '@/hooks';
import { useSocket } from '../providers';
import { SOCKET_ACTIONS } from '@/constants';
import { useSearchParams } from 'next/navigation';

const ChatForm = () => {

    const [message, setMessage] = useState<string>('')
    const secondUser = useAppSelector((state) => state.user.secondUser)
    const textref = React.useRef<any>(null)
    const dispatch = useAppDispatch();
    const { session } = useSession();
    const { socket } = useSocket();
    const searchParams = new URLSearchParams(useSearchParams() as any);
    const room = searchParams.get('room') || 'default';

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            senderId: session?.user?.id,
            receiverId: secondUser.id,
            message,
            sentAt: new Date()
        } as Conversation;
        dispatch(userActions.addConversation({ userId: secondUser.id, conversation: data }))
        socket.toMapId(secondUser.id).emit(SOCKET_ACTIONS.MESSAGE, { ...data, sentAt: data.sentAt.toISOString() });
        setMessage('');
        e.target.message.value = '';
        textref.current.focus();
        const msg = await chatActions.sendMessage(data);
        if (msg) {
            dispatch(userActions.addConversation({ userId: secondUser.id, conversation: msg, replace: true }));
            // socket.toMapId(secondUser.id).emit(SOCKET_ACTIONS.MESSAGE, msg);
        }
    }

    return (
        <>
            <Box className='w-full pt-2'>
                <Divider color="#434D5B" />

                <form onSubmit={handleSubmit} id='chat-form' name='chat-form'>
                    <FormControl
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            py: 1,
                            px: 2,
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Textarea
                                maxRows={4}
                                name='message'
                                placeholder="Type your message..."
                                className='scrollbar'
                                onChange={(e: any) => setMessage(e.target.value.trim())}
                                ref={textref}
                                id="message"
                            />
                        </Box>

                        <Button
                            variant="outlined"
                            type='submit'
                            sx={{
                                display: message ? 'block' : 'none',
                            }}>SEND</Button>
                    </FormControl>
                </form>
            </Box>
        </>
    )
}


export default React.memo(ChatForm)