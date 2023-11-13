"use client"
// pages/Login.tsx
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FilledInput, CircularProgress } from '@mui/material';
import { GoogleAuthProvider, getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from '@/redux/store';
import { setCurrentUser } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

const provider = new GoogleAuthProvider();

function Login() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    };

    const paperStyle = {
        padding: '2rem',
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

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const router = useRouter()

    const handleLogin = () => {
        if (!email || !password) return;
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                dispatch(setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoUrl: user.photoURL
                }));
                router.push('/');

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('invalid credentials', errorCode, errorMessage);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const signInWithGoogle = () => {
        signInWithRedirect(auth, provider);
        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = result && GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;

                // The signed-in user info.
                const user = result?.user;
                console.log(user)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {

                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });

    }

    return (
        <Container component="main" maxWidth="md" sx={containerStyle}>
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h5">Login</Typography>
                <form style={formStyle}>

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

                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        variant="outlined"
                        type="button"
                        className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}

                    </Button>

                    <div className='flex items-center justify-center'>
                        <div className="flex items-center justify-center gap-2 border border-gray-500 p-2 rounded-md cursor-pointer hover:bg-gray-500 hover:bg-opacity-10 transition-colors duration-300 ease-in-out"
                        // onClick={signInWithGoogle}
                        >
                            <FcGoogle />
                            <span>Sign in with google</span>
                        </div>
                    </div>
                </form>

            </Paper>
        </Container >
    );
}

export default Login;
