'use client'
import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import React from 'react'
import { User } from "@/lib/types";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { switchUser } from '@/redux/features/userSlice';


type propTypes = {
    user: User
}

const UserCard = ({ user }: propTypes) => {

    const dispatch = useAppDispatch()
    const secondUser = useAppSelector((state) => state.user.secondUser)

    if (!user) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '0 5px' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={200} height={40} />
            </Box>
        )
    }



    return (
        <>
            <Box
                px={1}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: user.id === secondUser?.id ? 'rgb(38 54 93 / 50%)' : null,
                    "&:hover": {
                        backgroundColor: 'rgb(38 54 93 / 30%)',
                    }
                }}
                onClick={() => dispatch(switchUser(user))}
            >
                <Stack p={1} direction="row" alignItems="center" useFlexGap gap={2} >
                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                    <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>{user.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#ccc' }}>{user.email}</Typography>
                    </Stack>
                </Stack>

                <Divider color="#434D5B" />

            </Box>
        </>
    )
}

export default UserCard