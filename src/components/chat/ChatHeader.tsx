"use client"
import React from 'react'
import { useAppSelector } from '@/redux/store'
import { Box, Stack, Avatar, Typography, Divider, Button, ButtonGroup } from '@mui/material'
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { authActions } from '@/actions';

type PropTypes = {
    onlineUsers?: any;
    typingUsers?: any;
}

const ChatHeader = ({ onlineUsers, typingUsers }: PropTypes) => {
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const isOnline = onlineUsers?.find((user: any) => user.email === secondUser.email);
    const isTyping = typingUsers?.find((user: any) => user.email === secondUser.email);


    const showInfo = async () => {
        await authActions.signOut();
    }


    // if(!secondUser) return null
    return (
        <>
            <Box
            // sx={{
            //     cursor: 'pointer',
            //     "&:hover": {
            //         backgroundColor: 'rgba(0,0,0,0.1)',
            //     }
            // }}
            >
                <Stack py={1} px={2} direction="row" alignItems="center" useFlexGap gap={2} >
                    <Avatar alt={secondUser?.name} src="https://mui.com/static/images/avatar/1.jpg" />
                    <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>{secondUser?.name}</Typography>
                        {isOnline ? <Typography variant="caption" sx={{ color: '#51ff51' }}>Online</Typography> : null}
                    </Stack>


                    <ButtonGroup sx={{ flex: 1, justifyContent: 'flex-end', mr: 1 }}>
                        <Button variant='text'>
                            <Link
                                suppressHydrationWarning
                                href={`/call?has_video=false&id=${secondUser?.id}&room=${uuidv4()}`}>
                                <CallIcon sx={{ color: 'white' }} />
                            </Link>
                        </Button>

                        <Button variant='text'>
                            <Link
                                suppressHydrationWarning
                                href={`/call?has_video=true&id=${secondUser?.id}&room=${uuidv4()}`}>
                                <VideoCallIcon sx={{ color: 'white' }} />
                            </Link>
                        </Button>

                        <Button variant='text' onClick={showInfo}>
                            <MoreVertIcon sx={{ color: 'white' }} />
                        </Button>

                    </ButtonGroup>
                </Stack>
                <Divider color="#434D5B" />
            </Box>
        </>
    )
}


export default ChatHeader