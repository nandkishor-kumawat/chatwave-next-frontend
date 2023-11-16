import { io } from 'socket.io-client';

// const URL: string = 'https://elfin-brainy-balloon.glitch.me';

const URL: string = 'https://chatwave-next-backend.onrender.com';
// const URL: string = 'localhost:4000';
const socket = io(URL, {
    autoConnect: false
});

export default socket;