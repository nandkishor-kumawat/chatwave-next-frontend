"use client"
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FilledInput, CircularProgress, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { containerStyle, inputStyles, labelStyle, paperStyle } from './styles';
import { signIn, useSession } from 'next-auth/react';

function Login() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/';
    const {data} = useSession();

    if(data?.user) {
        router.push(callbackUrl);
    }

    const handleLogin =async () => {
        if (!email || !password) return;
        setIsLoading(true);

        try {
          const data = await signIn('credentials', {
                email,
                password,
                callbackUrl
            })
            console.log(data)

        } catch (error) {
            console.log(error)
        }finally {
            setIsLoading(false);
        }
    }

    const signInWithGoogle = async() => {
      await signIn('google',{
        redirect:true,
        callbackUrl
    })
    }

    return (
        <Container component="main" maxWidth="md" sx={containerStyle} className='h-full m-auto'>
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h5">Login</Typography>
                <form style={{
                    width: '100%',
                    marginTop: '1rem',
                }}>

                    <FormControl sx={{ width: '100%', my: 1 }} variant="filled" >
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

                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        variant="outlined"
                        type="button"
                        className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}

                    </Button>

                    <Box className='flex items-center justify-center'>
                        <Box className="flex items-center justify-center gap-2 border border-gray-500 p-2 rounded-md cursor-pointer hover:bg-gray-500 hover:bg-opacity-10 transition-colors duration-300 ease-in-out"
                        onClick={signInWithGoogle}
                        >
                            <FcGoogle />
                            <Typography>Sign in with google</Typography>
                        </Box>
                    </Box>
                </form>

            </Paper>
        </Container >
    );
}

export default Login;
