"use client"
// pages/SignUp.tsx
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FilledInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FcGoogle } from 'react-icons/fc';

function SignUp() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    };

    const paperStyle = {
        padding: '2rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgb(255 255 255 / 5%)',
        color: '#fff',
        // background: 'rgba(255, 255, 255, 0)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(2.9px)',
        // - webkit - backdrop - filter: blur(2.9px);
        border: '1px solid rgba(255, 255, 255, 0.3)'
    };

    const formStyle = {
        width: '100%',
        marginTop: '1rem',
    };

    const inputStyle = {

        color: 'white',
        backgroundColor: 'rgb(255 255 255 / 5%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',


    };

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPassword2, setShowPassword2] = useState<boolean>(false);


    return (
        <Container component="main"  sx={containerStyle} className='max-w-3xl'>
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h5">Create your account</Typography>
                <form style={formStyle}>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={{ color: 'white' }} htmlFor="filled-adornment-name">Name</InputLabel>
                        <FilledInput
                            sx={inputStyle}
                            id="filled-adornment-name"
                            type='text'
                            value={name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setName(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={{ color: 'white' }} htmlFor="filled-adornment-email">Email</InputLabel>
                        <FilledInput
                            sx={inputStyle}
                            id="filled-adornment-email"
                            type='email'
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={{ color: 'white' }} htmlFor="filled-adornment-password">Password</InputLabel>
                        <FilledInput
                            sx={inputStyle}
                            id="filled-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end" sx={{ background: 'transparent' }}>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((show) => !show)}
                                        // onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={{ color: 'white' }} htmlFor="filled-adornment-confirm-password">Confirm Password</InputLabel>
                        <FilledInput
                            sx={inputStyle}
                            id="filled-adornment-confirm-password"
                            type={showPassword2 ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end" sx={{ background: 'transparent' }}>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword2((show) => !show)}
                                        // onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword2 ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={password2}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword2(event.target.value);
                            }}
                        />
                    </FormControl>

                    <Button
                        variant="outlined"
                        type="button"
                        className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        SignUp
                    </Button>
                </form>

                <div className='flex items-center justify-center'>
                    <div className="flex items-center justify-center gap-2 border border-gray-500 p-2 rounded-md cursor-pointer hover:bg-gray-500 hover:bg-opacity-10 transition-colors duration-300 ease-in-out"
                        // onClick={signInWithGoogle}
                    >
                        <FcGoogle />
                        <span>Sign in with google</span>
                    </div>
                </div>
            </Paper>
        </Container>
    );
}

export default SignUp;
