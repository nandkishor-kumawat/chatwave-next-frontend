// pages/Login.tsx
import React from 'react';
import { Button, TextField, Container, Typography, Paper } from '@mui/material';

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
        input: {
            color: 'white',
            backgroundColor: 'rgb(255 255 255 / 5%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        label: {
            color: 'white',
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={containerStyle}>
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h5">Login</Typography>
                <form style={formStyle}>
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="Email"
                        // color='primary'
                        sx={inputStyle}
                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    //     setName(event.target.value);
                    //   }}
                    />
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        sx={inputStyle}
                    />

                    <Button
                        variant="outlined"
                        type="button"
                        className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;
