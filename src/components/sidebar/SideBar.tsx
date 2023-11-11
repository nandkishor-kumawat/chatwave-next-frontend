import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChatContainer from '../chat/ChatContainer';
import Navbar from '../Navbar';
import UserCard from '../UserCard';
import { Avatar, Button, Drawer, Stack } from '@mui/material';
import PermanentDrawer from './PermanentDrawer';
import useWindowSize, { Size } from '@/custom hooks/useWindowSize';
import TemporaryDrawer from './TemporaryDrawer';



type Props = {
    // open: boolean
    // handleDrawerClose: () => void,
    size: Size
}


export default function MiniDrawer({ size }: Props) {

    const [open, setOpen] = React.useState<boolean>(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(prev => !prev);
    };

    const listD = () => (
        <List>
            {Array.from(new Array(24)).map((_, index) => (
                <UserCard key={index} open={open} />
            ))}
        </List>)

    // return (
    //     <PermanentDrawer>
    //         {listD()}
    //     </PermanentDrawer>
    // )


    return (
        <>



   



            {size?.width > 600 ? (
                <PermanentDrawer>
                    {listD()}
                </PermanentDrawer>
            ) : (
                <TemporaryDrawer open={open} handleDrawerClose={handleDrawerClose}>
                    {listD()}
                </TemporaryDrawer>
            )}

        </>


    );
}
