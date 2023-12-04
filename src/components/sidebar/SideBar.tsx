"use client"
import * as React from 'react';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import TemporaryDrawer from './TemporaryDrawer';
import { useAppSelector } from '@/redux/store';
import { Box } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import { rdb } from '@/firebase';



type PropTypes = {
    changeRoom: (room: string) => void;
    onlineUsers: any[];
    typingUsers: any[];
}
type User = {
    id: string;
    name: string;
    email: string;
}

export default function SideBar() {
    const onlineUsers = useAppSelector(state => state.user.onlineUsers);

    const [open, setOpen] = React.useState<boolean>(false);
    const currentUser = useAppSelector(state => state.user.currentUser);
    const [allUsers, setAllUsers] = React.useState<User[]>([])

    React.useEffect(() => {

        onValue(ref(rdb, 'users'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                let users = Object.entries(data).map(([id, value]: [string, any]) => ({ id, ...value }));
                setAllUsers(users)
            }
        });
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(prev => !prev);
    };

    const listD = () => (
        <Box>
            {allUsers.filter((user) => user.email !== currentUser.email).map((user, index) => {
                const isOnline = onlineUsers.find((u: { email: string; }) => u.email === user.email);
                return (
                    <UserCard key={index} user={user} isOnline={isOnline} />
                )
            })}
            {/* {Array.from(new Array(24)).map((_, index) => (
                <UserCard key={index} user={{ id: 'loading', name: 'loading', email: 'loading' }} />
            ))} */}
        </Box>
    )


    return (
        <>
            <PermanentDrawer>
                {listD()}
            </PermanentDrawer>

            <TemporaryDrawer open={open} handleDrawerClose={handleDrawerClose}>
                {listD()}
            </TemporaryDrawer>
        </>
    );
}
