'use client'
import { useAppSelector } from '@/redux/store'
import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import React from 'react'

const ChatHeader = () => {
    const user = useAppSelector((state) => state.user.secondUser)
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
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>{user.id}</Typography>
                        <Typography variant="caption" sx={{ color: '#ccc' }}>Online</Typography>
                    </Stack>
                </Stack>
                <Divider color="#434D5B" />

            </Box>
        </>
    )
}


export default ChatHeader