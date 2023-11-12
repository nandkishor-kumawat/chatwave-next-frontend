"use client"
import * as React from 'react';
import List from '@mui/material/List';
import UserCard from '../UserCard';
import PermanentDrawer from './PermanentDrawer';
import useWindowSize, { Size } from '@/custom hooks/useWindowSize';
import TemporaryDrawer from './TemporaryDrawer';
import useChat from '@/custom hooks/useChat';
import { useAppSelector } from '@/redux/store';



type Props = {
    // open: boolean
    // handleDrawerClose: () => void,
    size: Size
}


export default function MiniDrawer({ size }: Props) {

    const [open, setOpen] = React.useState<boolean>(false);
    const { onlineUsers } = useChat()
    const currentUser = useAppSelector(state => state.user.currentUser)


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(prev => !prev);
    };

    const listD = () => (
        <List>
            {onlineUsers.filter((user) => user.id !== currentUser?.id).map((user, index) => (
                <UserCard key={index} user={user} />
            ))}
            {/* {Array.from(new Array(24)).map((_, index) => (
                <UserCard key={index} name={name} />
            ))} */}
        </List>
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
