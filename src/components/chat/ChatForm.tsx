import React, { useState } from 'react'
import { Box, Divider, FormControl, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Textarea from '../styled/TextArea';





type PropTypes = {
    sendMessage: (data: any) => void
}

const ChatForm = ({ sendMessage }: PropTypes) => {


    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<string>('')
    const secondUser = useAppSelector((state) => state.user.secondUser)
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const textref = React.useRef<any>(null)


    const handleSubmit = (e: any) => {

        e.preventDefault();
        sendMessage({
            receiver_id: secondUser.email,
            sender_id: currentUser.email,
            message,
            sentAt: Date.now()
        })
        setMessage('');
        e.target.message.value = ''
        textref.current.focus()
    }


    return (
        <>
            <Box className='w-full pt-2'>
                <Divider color="#434D5B" />

                <form onSubmit={handleSubmit}>
                    <FormControl
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            py: 1,
                            px: 2,
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Textarea
                                maxRows={4}
                                name='message'
                                placeholder="Type your message..."
                                className='scrollbar'
                                onChange={e => setMessage(e.target.value.trim())}
                                ref={textref}
                            />
                        </Box>

                        <Button
                            variant="outlined"
                            type='submit'
                            sx={{
                                display: message ? 'block' : 'none',
                            }}>SEND</Button>
                    </FormControl>
                </form>



            </Box>
        </>
    )
}


export default React.memo(ChatForm)