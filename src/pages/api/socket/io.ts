import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo, User } from '@/lib/types';

export const config = {
    api: {
        bodyParser: false,
    },
};



const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    let users: User[] = [];

    const addUser = (user: User) => {
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
        users.push(user)
    }

    const removeUser = (id: String) => {
        const index = users.findIndex((user) => user.id === id);
        users.splice(index, 1);
    }


    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            // @ts-ignore
            addTrailingSlash: false,
        });
        io.on('connection', (socket) => {
            console.log(socket.id, 'connected')
            socket.on('newUser', (email: string) => {
                addUser({
                  email: email,
                  name: email.split('@')[0],
                  id: socket.id,
                  typing: {
                    status: false,
                    to: null
                  }
                });
                // socket.join(socket.id as string);
                // io.in(roomId as string).emit('newUserResponse', users);
                io.emit('newUserResponse', users);
        
              });
        
              socket.on('typing', (from: string, status: boolean, to: string) => {
                const user = users.find((user) => user.email === from);
                if (user) {
                  user.typing.to = to;
                  user.typing.status = status;
                }
                io.emit('newUserResponse', users);
              });
        
              socket.on('message', (data: any) => {
                // addMessage(data);
                io.emit('message', data);
              })
        
              // socket.on('ready', (id: string) => {
              //   console.log(socket.id, 'ready')
              //   socket.join(id);
              // })
        
              socket.on('change-media', (room, data) => {
                console.log('change media')
                io.to(room).emit('change-media', data);
              })
        
              socket.on("join", (roomName) => {
                const {rooms} = io.sockets.adapter;
                const room = rooms.get(roomName);
            
                // room == undefined when no such room exists.
                if (room === undefined) {
                  socket.join(roomName);
                  socket.emit("created");
                } else if (room.size === 1) {
                  // room.size == 1 when one person is inside the room.
                  socket.join(roomName);
                  socket.emit("joined");
                } else {
                  // when there are already two people inside the room.
                  socket.emit("full");
                }
                console.log(rooms);
              });
            
              // Triggered when the person who joined the room is ready to communicate.
              socket.on("ready", (roomName) => {
                socket.broadcast.to(roomName).emit("ready"); // Informs the other peer in the room.
              });
            
              // Triggered when server gets an icecandidate from a peer in the room.
              socket.on("ice-candidate", (candidate: RTCIceCandidate, roomName: string) => {
                console.log(candidate);
                socket.broadcast.to(roomName).emit("ice-candidate", candidate); // Sends Candidate to the other peer in the room.
              });
            
              // Triggered when server gets an offer from a peer in the room.
              socket.on("offer", (offer, roomName) => {
                socket.broadcast.to(roomName).emit("offer", offer); // Sends Offer to the other peer in the room.
              });
            
              // Triggered when server gets an answer from a peer in the room.
              socket.on("answer", (answer, roomName) => {
                socket.broadcast.to(roomName).emit("answer", answer); // Sends Answer to the other peer in the room.
              });
          
              socket.on("leave", (roomName) => {
                socket.leave(roomName);
                socket.broadcast.to(roomName).emit("leave");
              });
        
              socket.on('disconnect', () => {
                console.log(socket.id, '🔥: A user disconnected');
                removeUser(socket.id as string);
                // socket.leave(socket.id as string);
                io.emit('newUserResponse', users);
              });
        });
        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;