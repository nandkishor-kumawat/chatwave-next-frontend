import { useAppSelector } from '@/redux/store'
import { Box } from '@mui/material'
import React from 'react'


const ChatBubble = ({ message }: any) => {
    const secondUser = useAppSelector((state) => state.user.secondUser)
    //chat-start || chat-end
    const type = message.sender_id === secondUser.email ? 'start' : 'end'
    console.log({ message })
    return (
        <>
            <Box className={`chat chat-${type}`}>
                {/* <Box className="chat-image avatar">
                    <Box className="w-10 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </Box>
                </Box> */}
                <Box className="chat-header">
                    {/* Obi-Wan Kenobi */}
                    <time className="text-xs opacity-50 text-white">{message.sentAt}</time>
                </Box>
                <Box className="chat-bubble">{message.message}</Box>
                {/* <Box className="chat-footer opacity-50">
                    Delivered
                </Box> */}
            </Box>
        </>
    )
}

export default React.memo(ChatBubble)