import { useAppSelector } from '@/redux/store'
import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import React from 'react'

type PropTypes = {
    onlineUsers: any;
    typingUsers: any;
}

const ChatHeader = ({onlineUsers, typingUsers}: PropTypes) => {
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const isOnline = onlineUsers.find((user: any) => user.email === secondUser.email);
    const isTyping = typingUsers.find((user: any) => user.email === secondUser.email);
    // if(!secondUser) return null
    return (
        <>
            <Box
                sx={{
                    cursor: 'pointer',
                    "&:hover": {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                }}
            >
                <Stack py={1} px={2} direction="row" alignItems="center" useFlexGap gap={2} >
                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                    <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>{secondUser?.name}</Typography>
                        {isOnline ? <Typography variant="caption" sx={{ color: '#51ff51' }}>Online</Typography> : null}
                    </Stack>
                </Stack>
                <Divider color="#434D5B" />
            </Box>
        </>
    )
}


export default ChatHeader