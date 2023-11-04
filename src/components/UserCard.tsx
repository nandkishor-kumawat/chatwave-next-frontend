import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import React from 'react'



const UserCard = ({ open }: { open: boolean }) => {
    if (false) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '0 5px' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={200} height={40} />
            </Box>
        )
    }
    // return (
    //     <ListItem disablePadding sx={{ display: 'block' }}>
    //         <ListItemButton
    //             sx={{
    //                 minHeight: 48,
    //                 justifyContent: open ? 'initial' : 'center',
    //                 px: 2.5,
    //             }}
    //         >
    //             <ListItemIcon
    //                 sx={{
    //                     minWidth: 0,
    //                     mr: open ? 3 : 'auto',
    //                     justifyContent: 'center',
    //                 }}
    //             >
    //                 <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
    //             </ListItemIcon>
    //             {/* <ListItemText primary={text}  /> */}
    //             {open && <Stack>
    //                 <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>Remy Sharp</Typography>
    //                 <Typography variant="caption" sx={{ color: '#ccc' }}>Remy Sharp</Typography>
    //             </Stack>}
    //         </ListItemButton>
    //     </ListItem>
    // )

    return (
        <>
            <Box
                px={1}
                sx={{
                    cursor: 'pointer',
                    "&:hover": {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                }}
            >
                <Stack p={1} direction="row" alignItems="center" useFlexGap gap={2} >
                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                    <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>Remy Sharp</Typography>
                        <Typography variant="caption" sx={{ color: '#ccc' }}>Remy Sharp</Typography>
                    </Stack>
                </Stack>
                <Divider color="#ccc" />

            </Box>
        </>
    )
}

export default UserCard