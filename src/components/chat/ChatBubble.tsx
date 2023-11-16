import { useAppSelector } from '@/redux/store'
import React from 'react'


const ChatBubble = ({ message }:any) => {
    const secondUser = useAppSelector((state) => state.user.secondUser)
    //chat-start || chat-end
    const type = message.from === secondUser.id ? 'start' : 'end'
    return (
        <>
            <div className={`chat chat-${type}`}>
                {/* <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div> */}
                <div className="chat-header">
                    {/* Obi-Wan Kenobi */}
                    <time className="text-xs opacity-50 text-white">{message.sentAt}</time>
                </div>
                <div className="chat-bubble">{message.msg}</div>
                {/* <div className="chat-footer opacity-50">
                    Delivered
                </div> */}
            </div>
        </>
    )
}

export default React.memo(ChatBubble)