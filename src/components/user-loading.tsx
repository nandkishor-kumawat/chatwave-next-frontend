import { Box, Divider, Skeleton } from '@mui/material'
import React from 'react'

export default function UserLoading() {
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: '5px',
            }}>
                <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    sx={{ bgcolor: '#434D5B' }}
                />
                <Box sx={{ flex: 1, alignSelf: 'flex-start' }}>
                    <Skeleton width="60%" height={20} sx={{ bgcolor: '#434D5B' }} />
                    <Skeleton width="25%" height={15} sx={{ bgcolor: '#434D5B' }} />
                </Box>
            </Box>
            <Divider color="#434D5B" />
        </>
    )
}
