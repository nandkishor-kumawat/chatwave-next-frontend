"use client"
import { Skeleton, Box, Stack, Avatar, Typography, Divider, ListItem, ListItemButton, ListItemIcon, FormControl, InputLabel, Input, FormHelperText, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setChatMessage } from '@/redux/features/userSlice';
const ChatForm = () => {
    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
        width: 100%;
        font-family: IBM Plex Sans, sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        color: ${theme.palette.mode !== 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode !== 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode !== 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode !== 'dark' ? grey[900] : grey[50]};
        resize: none;
    
        &:hover {
          border-color: ${blue[400]};
        }
    
        &:focus {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode !== 'dark' ? blue[600] : blue[200]};
        }
    
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    const BootstrapInput = styled(InputBase)(({ theme }) => ({
        'label + &': {
            marginTop: theme.spacing(3),
        },
        '& .MuiInputBase-input': {
            borderRadius: 4,
            width: '100%',
            position: 'relative',
            backgroundColor: theme.palette.mode !== 'light' ? '#F3F6F9' : '#1A2027',
            border: '1px solid',
            borderColor: theme.palette.mode !== 'light' ? '#E0E3E7' : '#2D3843',
            color: theme.palette.mode !== 'light' ? '#000' : '#fff',
            fontSize: 16,
            padding: '10px 12px',
            transition: theme.transitions.create([
                'border-color',
                'background-color',
                'box-shadow',
            ]),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
                borderColor: theme.palette.primary.main,
            },
        },
    }));

    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.user.message);
    const user = useAppSelector((state) => state.user.secondUser)

    useEffect(() => {
        // console.log(message)
    }, [message])
    

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const msg = e.target.message
        // msg.value = 'this is '
        dispatch(setChatMessage(msg.value))

    }


    return (
        <>
            <Box
                sx={{
                    "&:hover": {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                }}
            >
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
                            />
                        </Box>

                        <Button variant="outlined" type='submit'>SEND</Button>
                    </FormControl>
                </form>



            </Box>
        </>
    )
}


export default React.memo(ChatForm)