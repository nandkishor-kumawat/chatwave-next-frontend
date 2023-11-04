import { Box } from '@mui/material'
import React from 'react'
import ChatBubble from './ChatBubble'

const ChatContainer = () => {
    return (
        <Box sx={{
            flex: 1,
            overflowY: 'scroll',
            p: 2,
        }}>
            {Array(24).fill(0).map((_, i) => (
                <ChatBubble key={i} type={Math.round(Math.random()) % 2 === 0 ? 'start' : 'end'} />
            ))}
        </Box>
    )
}

export default React.memo(ChatContainer);
