"use client"
// pages/SignUp.tsx
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FilledInput, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/firebase';
import { containerStyle, inputStyles, labelStyle, paperStyle } from '../login/styles';

function SignUp() {

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPassword2, setShowPassword2] = useState<boolean>(false);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
        getRedirectResult(auth)
            .then((result) => {
                const credential = result && GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result?.user;
                console.log(user)
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    const handleSignUp = () => {

        if (password !== password2) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

    }

    return (
        <Container component="main" sx={containerStyle} className='max-w-2xl h-full m-auto' >
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h5">Create your account</Typography>
                <form style={{
                    width: '100%',
                    marginTop: '1rem',
                }}>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={labelStyle} htmlFor="filled-adornment-name">Name</InputLabel>
                        <FilledInput
                            sx={inputStyles}
                            id="filled-adornment-name"
                            type='text'
                            value={name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setName(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={labelStyle} htmlFor="filled-adornment-email">Email</InputLabel>
                        <FilledInput
                            sx={inputStyles}
                            id="filled-adornment-email"
                            type='email'
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled">
                        <InputLabel sx={labelStyle} htmlFor="filled-adornment-password">Password</InputLabel>
                        <FilledInput
                            sx={inputStyles}
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
                        <InputLabel sx={labelStyle} htmlFor="filled-adornment-confirm-password">Confirm Password</InputLabel>
                        <FilledInput
                            sx={inputStyles}
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
                        onClick={handleSignUp}
                        variant="outlined"
                        type="button"
                        className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        SignUp
                    </Button>
                </form>

                {/* <Box className='flex items-center justify-center'>
                    <Box className="flex items-center justify-center gap-2 border border-gray-500 p-2 rounded-md cursor-pointer hover:bg-gray-500 hover:bg-opacity-10 transition-colors duration-300 ease-in-out"
                        onClick={signInWithGoogle}
                    >
                        <FcGoogle />
                        <Typography>Sign in with google</Typography>
                    </Box>
                </Box> */}
            </Paper>
        </Container>
    );
}

export default SignUp;
