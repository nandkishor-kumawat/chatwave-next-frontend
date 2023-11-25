import React from 'react'
import { Box, Typography } from '@mui/material'

const Loader: React.FC = () => {
    return (
        <Box className='w-full h-full absolute z-10 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            {/* <span className="loading loading-dots loading-lg"></span> */}
            <Typography className="loading loading-ring w-[5rem] text-[red]"></Typography>
        </Box>
    )
}

export default React.memo(Loader)