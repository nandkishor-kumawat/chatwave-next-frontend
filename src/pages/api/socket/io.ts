import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '@/lib/types';
import { SOCKET_ACTIONS } from '@/constants';
import { User } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

let users: any[] = [];

const addUser = (user: User) => {
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) users.splice(index, 1);
  users.push(user)
}

const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.socketId === id);
  users.splice(index, 1);
}

const getSId = (userId: string) => {
  const user = users.find((user) => user.id === userId);
  return user?.socketId as string;
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {

  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log(socket.id, 'connected')
      socket.on(SOCKET_ACTIONS.NEW_USER, (data: any) => {
        addUser({
          ...data,
          socketId: socket.id,
          typing: {
            status: false,
            to: null
          }
        });
        io.emit(SOCKET_ACTIONS.NEW_USER_RESPONSE, users);
      });

      socket.on('typing', (from: string, status: boolean, to: string) => {
        const user = users.find((user) => user.email === from);
        if (user) {
          user.typing.to = to;
          user.typing.status = status;
        }
        io.emit(SOCKET_ACTIONS.NEW_USER_RESPONSE, users);
      });

      socket.on(SOCKET_ACTIONS.MESSAGE, (data: any) => {
        const { receiverId } = data;
        const receiver = getSId(receiverId);
        io.to(receiver).emit(SOCKET_ACTIONS.MESSAGE, data);
      })

      socket.on(SOCKET_ACTIONS.ROOM_JOINED, (roomId: string, id: string) => {
        const { rooms } = io.sockets.adapter;
        const room = rooms.get(roomId);

        io.emit(SOCKET_ACTIONS.ROOM_JOINED, { roomId: roomId, peerId: socket.id });
        socket.join(roomId);
        console.log(SOCKET_ACTIONS.ROOM_JOINED, roomId, socket.id);

        socket.on('disconnect', () => {
          removeUser(socket.id as string);
          socket.leave(roomId);
          io.to(roomId).emit("leave", socket.id);
        });
      })

      socket.on("room:join", (data) => {
        const { email, room } = data;
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
      });

      socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });

      socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });

      socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });

      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });

      socket.on(SOCKET_ACTIONS.CHANGE_MEDIA, (room, data) => {
        console.log('change media')
        // console.log(io.sockets.adapter.rooms.get(room));
        io.to(room).emit(SOCKET_ACTIONS.CHANGE_MEDIA, data);
      })

      socket.on(SOCKET_ACTIONS.OFFER, (data) => {
        console.log(SOCKET_ACTIONS.OFFER)
        io.to(data.roomId).emit(SOCKET_ACTIONS.OFFER, data);
      })

      socket.on(SOCKET_ACTIONS.ANSWER, (data) => {
        console.log(SOCKET_ACTIONS.ANSWER)
        io.to(data.roomId).emit(SOCKET_ACTIONS.ANSWER, data);
      })

      socket.on('ice-candidate', (data) => {
        console.log('ice-candidate')
        io.to(data.roomId).emit('ice-candidate', data);
      })

      socket.on('disconnect', () => {
        console.log(socket.id, '🔥: A user disconnected');
        removeUser(socket.id as string);
        socket.leave(socket.id as string);
        io.emit(SOCKET_ACTIONS.NEW_USER_RESPONSE, users);
      });

    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;