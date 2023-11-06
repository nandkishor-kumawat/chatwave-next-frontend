import { Box } from '@mui/material'
import React from 'react'
import ChatBubble from './ChatBubble'

const ChatBody = () => {
    return (
        <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
        }}>
            {Array(13).fill(0).map((_, i) => (
                <ChatBubble key={i} type={Math.round(Math.random()) % 2 === 0 ? 'start' : 'end'} />
            ))}
        </Box>
    )
}

export default ChatBody