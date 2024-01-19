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
    if (index !== -1) users.splice(index, 1);
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
        const data = {
          email: email,
          name: email.split('@')[0],
          id: socket.id,
          typing: {
            status: false,
            to: null
          }
        }
        addUser(data);
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
        io.emit('message', data);
      })

      socket.on('room:join', (roomId: string) => {
        const { rooms } = io.sockets.adapter;
        const room = rooms.get(roomId);
        console.log(room)
        if (!room) {
          io.emit("room:created",{
            roomId: roomId,
            peerId: socket.id
          });
          console.log("room:created")
          socket.join(roomId);
        } else if (room.size !== 7) {

          io.emit("room:joined",{
            roomId: roomId,
            peerId: socket.id
          })

          console.log("room:joined")
          socket.join(roomId);
        } else {
          io.emit("room:full");
          console.log("room:full")
        }

      })

      socket.on('change-media', (room, data) => {
        console.log('change media')
        // console.log(io.sockets.adapter.rooms.get(room));
        io.to(room).emit('change-media', data);
      })

 
      // Triggered when the person who joined the room is ready to communicate.
      socket.on("call:ready", (roomName) => {
        io.to(roomName).emit("call:ready"); // Informs the other peer in the room.
      });

      // Triggered when server gets an icecandidate from a peer in the room.
      socket.on("ice-candidate", (candidate: RTCIceCandidate, roomName: string) => {
        console.log(candidate);
        io.to(roomName).emit("ice-candidate", candidate); // Sends Candidate to the other peer in the room.
      });

      // Triggered when server gets an offer from a peer in the room.
      socket.on("offer", (offer, roomName) => {
        io.to(roomName).emit("offer", offer); // Sends Offer to the other peer in the room.
      });

      // Triggered when server gets an answer from a peer in the room.
      socket.on("answer", (answer, roomName) => {
        io.to(roomName).emit("answer", answer); // Sends Answer to the other peer in the room.
      });

      socket.on("leave", (roomName) => {
        socket.leave(roomName);
        io.to(roomName).emit("leave");
      });

      socket.on('start_call', (event) => {
        console.log(`Broadcasting start_call event to peers in room ${event.roomId} from peer ${event.senderId}`)
        io.to(event.roomId).emit('start_call', {
          senderId: event.senderId
      })})
    
      //Events emitted to only one peer
      socket.on('webrtc_offer', (event) => {
        console.log(`Sending webrtc_offer event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
        io.to(event.receiverId).emit('webrtc_offer', {
          sdp: event.sdp,
          senderId: event.senderId
      })})
    
      socket.on('webrtc_answer', (event) => {
        console.log(`Sending webrtc_answer event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
        io.to(event.receiverId).emit('webrtc_answer', {
          sdp: event.sdp,
          senderId: event.senderId
      })})
    
      socket.on('webrtc_ice_candidate', (event) => {
        console.log(`Sending webrtc_ice_candidate event to peers in room ${event.roomId} from peer ${event.senderId} to peer ${event.receiverId}`)
        io.to(event.receiverId).emit('webrtc_ice_candidate', event)
      })

      socket.on('disconnect', () => {
        console.log(socket.id, '🔥: A user disconnected');
        removeUser(socket.id as string);
        // socket.leave(socket.id as string);
        io.emit('newUserResponse', users);
        io.emit('leave')
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;