"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useSocket } from '../providers';


const drawerWidth = 280;

const PermanentDrawer = ({ children }: { children: React.ReactNode }) => {
    const { socket } = useSocket();
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: 900,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#0e0f30'
                },
                display: { xs: 'none', sm: 'block' },
            }}
            className='h-full'
        >
            <Toolbar />
            <p className='py-3 text-center text-white'>{socket?.id}</p>
            <Box sx={{ overflow: 'auto' }} className='scrollbar'>
                {children}
            </Box>
        </Drawer>
    );
}
export default React.memo(PermanentDrawer)