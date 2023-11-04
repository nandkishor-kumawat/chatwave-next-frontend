import { io } from 'socket.io-client';

const URL: string = 'https://elfin-brainy-balloon.glitch.me';

// const URL = 'https://chatwave-backend.vercel.app';
const socket = io(URL, {
    autoConnect: false
});

export default socket;