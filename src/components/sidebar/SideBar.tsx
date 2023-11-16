"use client"
import * as React from 'react';
import List from '@mui/material/List';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import useWindowSize, { Size } from '@/custom hooks/useWindowSize';
import TemporaryDrawer from './TemporaryDrawer';
import { useAppSelector } from '@/redux/store';
import { Box } from '@mui/material';



type PropTypes = {
    changeRoom: (room: string) => void;
    onlineUsers: any[];
    typingUsers: any[];
}


export default function SideBar({ changeRoom, onlineUsers, typingUsers }: PropTypes) {

    const [open, setOpen] = React.useState<boolean>(false);
    const currentUser = useAppSelector(state => state.user.currentUser);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(prev => !prev);
    };

    const listD = () => (
        <Box>
            {onlineUsers.filter((user) => user.id !== currentUser.id).map((user, index) => (
                <UserCard key={index} user={user} />
            ))}
            {/* {Array.from(new Array(24)).map((_, index) => (
                <UserCard key={index} user={{ id: 'loading', name: 'loading', email: 'loading' }} />
            ))} */}
        </Box>
    )



    // return (
    //     <PermanentDrawer>
    //         {listD()}
    //     </PermanentDrawer>
    // )


    return (
        <>


            <PermanentDrawer>
                {listD()}
            </PermanentDrawer>

            <TemporaryDrawer open={open} handleDrawerClose={handleDrawerClose}>
                {listD()}
            </TemporaryDrawer>







            {/* {size?.width > 600 ? (
                <PermanentDrawer>
                    {listD()}
                </PermanentDrawer>
            ) : (
                <TemporaryDrawer open={open} handleDrawerClose={handleDrawerClose}>
                    {listD()}
                </TemporaryDrawer>
            )} */}

        </>


    );
}
