'use client'
import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import React from 'react'
import { User } from "@/lib/types";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { switchUser } from '@/redux/features/userSlice';
import StyledBadge from './styled/StyledBadge';
import Link from 'next/link';



type propTypes = {
    user: {
        id: string;
        name: string;
        email: string;
    },
    isOnline: boolean;
}

const UserCard = ({ user, isOnline }: propTypes) => {

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
        <Link href={`/chat/inbox/${user.id}`}>
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

                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        invisible={!isOnline}
                    >
                        <Avatar alt={user.name.toUpperCase()} src="https://mui.com/static/images/avatar/1.jpg" />
                    </StyledBadge>

                    <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>{user.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#ccc' }}>{user.email}</Typography>
                    </Stack>
                </Stack>

                <Divider color="#434D5B" />

            </Box>
        </Link>
    )
}

export default UserCard