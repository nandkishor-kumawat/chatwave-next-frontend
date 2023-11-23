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
import ChatContainer from '../chat/ChatContainer';
import Navbar from '../Navbar';
import UserCard from '../UserCard';
import { Avatar, Button, Drawer, Stack } from '@mui/material';
import PermanentDrawer from './PermanentDrawer';
import useWindowSize from '@/custom hooks/useWindowSize';

type Props = {
    open: boolean,
    handleDrawerClose: () => void,
    children: React.ReactNode
}

const drawerWidth = 280;


const TemporaryDrawer = ({ open, handleDrawerClose, children }: Props) => {
    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: '120px',
                    left: '-10px',
                    zIndex: 1000,
                }}
            >
                <IconButton onClick={handleDrawerClose} sx={{
                    p: 0,
                    width: '40px',
                    aspectRatio: '1/1',
                    backgroundColor: '#2c74ff',
                    borderRadius: '0% 100% 100% 0% / 0% 100% 100% 0%',
                    left: '-4px',
                    top: '-7px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgb(138 180 248 / 50%)',
                        left: '10px'
                    }
                }}
                    className='bg-[#2c74ff]'
                >
                    {!open ? <ChevronRightIcon sx={{ color: 'white', fontSize: '40px', }} /> : <ChevronLeftIcon sx={{ color: 'white', fontSize: '40px' }} />}
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
                    },
                    display: { sm: 'none', xs: 'block' }
                }}
                className='scrollbar'
                
            >
                <Toolbar sx={{ backgroundColor: 'transparent' }} />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}  >
                    <IconButton onClick={handleDrawerClose} >
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
        </>

    )
}

export default React.memo(TemporaryDrawer)