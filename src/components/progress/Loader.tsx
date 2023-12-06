import React from 'react'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

const Loader: React.FC = () => {
    return (
        <Container className="text-white h-full w-full flex justify-center items-center">
            <CircularProgress />
        </Container>
    )
}

export default React.memo(Loader)