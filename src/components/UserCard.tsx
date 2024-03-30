'use client'
import { Skeleton, Box, Stack, Avatar, Typography, Divider } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { switchUser } from '@/redux/features/userSlice';
import StyledBadge from './styled/StyledBadge';
import { useParams, useRouter } from 'next/navigation';

type propTypes = {
    user: {
        id: string;
        name: string;
        email: string;
    },
    isOnline?: boolean;
}

const UserCard = ({ user, isOnline }: propTypes) => {

    const dispatch = useAppDispatch()
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const router = useRouter();
    const params = useParams();

    const changeUser = () => {
        dispatch(switchUser(user))
        router.replace(`/chat/inbox/${user.id}`);
    }


    return (

        <Box
            px={1}
            sx={{
                cursor: 'pointer',
                backgroundColor: user.id === params?.id ? 'rgb(38 54 93 / 50%)' : null,
                "&:hover": {
                    backgroundColor: 'rgb(38 54 93 / 30%)',
                }
            }}
            onClick={changeUser}
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

    )
}

export default UserCard