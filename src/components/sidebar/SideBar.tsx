import * as React from 'react';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import TemporaryDrawer from './TemporaryDrawer';
import { Box } from '@mui/material';
import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';



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

export default async function SideBar() {
    const session = await getAuth();
    const currentUser = session?.user;

    const allUsers = await prisma.user.findMany();


    const listD = () => (

        <Box>
            {allUsers.filter((user) => user.email !== currentUser?.email).map((user, index) => {
                return (
                    <UserCard key={index} user={user} />
                )
            })}
        </Box>
    )

    if (!session?.user) return


    return (
        <>
            <PermanentDrawer>
                {listD()}
            </PermanentDrawer>

            {/* <TemporaryDrawer open={open} handleDrawerClose={handleDrawerClose}>
                {listD()}
            </TemporaryDrawer> */}
        </>
    );
}
