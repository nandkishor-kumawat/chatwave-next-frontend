"use client"
import * as React from 'react';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import TemporaryDrawer from './TemporaryDrawer';
import { useAppSelector } from '@/redux/store';
import { Box } from '@mui/material';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import useChat from '@/hooks/useChat';



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
    const { onlineUsers } = useChat()
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const currentUser = useAppSelector(state => state.user.currentUser);
    const [allUsers, setAllUsers] = React.useState<User[]>([]);

    console.log(onlineUsers)

    React.useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            const querySnapshot = await getDocs(collection(db, "users"));
            const users = querySnapshot.docs.map(doc => doc.data()) as User[];
            setAllUsers(users)
            setIsLoading(false)
        }
        fetchUsers()
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(prev => !prev);
    };


    const listD = () => (
        isLoading ? (
            <Box>
                {Array.from(new Array(3)).map((_, index) => (
                    <UserCard key={index} />
                ))}
            </Box>
        ) : (
            <Box>
                {allUsers.filter((user) => user.email !== currentUser.email).map((user, index) => {
                    const isOnline = onlineUsers.find((u: { email: string; }) => u.email === user.email);
                    return (
                        <UserCard key={index} user={user} isOnline={!!isOnline} />
                    )
                })}
            </Box>
        )

    )

    if(!currentUser) return 


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
