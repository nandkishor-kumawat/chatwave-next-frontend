import React from 'react'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
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
import ChatContainer from './ChatContainer';
import Navbar from './Navbar';
import UserCard from './UserCard';
import { Avatar, Button, Drawer, Stack } from '@mui/material';
import PermanentDrawer from './PermanentDrawer';
import useWindowSize from '@/custom hooks/useWindowSize';

type Props = {
    open: boolean,
    handleDrawerClose: () => void,
    children: React.ReactNode
}

const drawerWidth = 250;


const TemporaryDrawer = ({ open, handleDrawerClose, children }: Props) => {
    return (
        <Box sx={{
            // position: { sm: 'relative', xs: 'absolute' },
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
            minWidth: '50px'
        }}>

            <Box
                sx={{
                    position: 'fixed',
                    top: '70px',
                    left: '-10px',
                    zIndex: 1000,
                    // display: { sm: 'none', xs: 'block' },
                }}
            >
                <IconButton onClick={handleDrawerClose} sx={{ p: 0 }} >
                    {!open ? <ChevronRightIcon sx={{ color: 'white', width: '30px', height: '30px' }} /> : <ChevronLeftIcon sx={{ color: 'white', width: '30px', height: '30px' }} />}
                </IconButton>
            </Box>


            <Drawer
                open={open}
                anchor='left'
                sx={{
                    zIndex: 1000,
                    '& .MuiDrawer-paper': {
                        backgroundColor: '#0e0f30',
                        width: drawerWidth 
                    }
                }}
            >
                <Toolbar sx={{ backgroundColor: 'transparent' }} />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}  >
                    <IconButton onClick={handleDrawerClose}>
                        {!open ? <ChevronRightIcon sx={{ color: 'white' }} /> : <ChevronLeftIcon sx={{ color: 'white' }} />}
                    </IconButton>
                </Box>

                <Box
                    role="presentation"
                    onClick={handleDrawerClose}
                    onKeyDown={handleDrawerClose}
                >
                    {children}
                </Box>
            </Drawer>





        </Box>
    )
}

export default React.memo(TemporaryDrawer)