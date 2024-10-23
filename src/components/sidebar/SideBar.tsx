import * as React from 'react';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import TemporaryDrawer from './TemporaryDrawer';
import { Box } from '@mui/material';
import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';


export default async function SideBar() {
    const session = await getAuth();

    if (!session?.user) return null;

    const currentUser = session?.user;

    const allUsers = await prisma.user.findMany({
        where: {
            email: {
                not: currentUser.email
            }
        },
        select: {
            name: true,
            email: true,
            id: true,
            coverPicture: true,
            profilePicture: true,
            createdAt: true
        }
    });

    const listD = (
        <Box>
            {allUsers.map((user, index) => {
                return (
                    <UserCard key={index} user={user as User} />
                )
            })}
        </Box>
    )

    return (
        <>
            <PermanentDrawer>{listD}</PermanentDrawer>
            <TemporaryDrawer>{listD}</TemporaryDrawer>
        </>
    );
}
