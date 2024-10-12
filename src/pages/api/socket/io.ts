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
  console.log('removingt user', id)
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

      // --------------------  CHAT FUNCTIONALITY -------------------- //
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


      // --------------------  VIDEO CALL FUNCTIONALITY -------------------- //
      socket.on("room:join", (data) => {
        const { email, room } = data;
        socket.join(room);
        socket.to(room).emit("user:joined", { email, id: socket.id });
        io.to(socket.id).emit("room:join", data);

        socket.on('disconnect', () => {
          console.log(socket.id, '🔥disconnected');
          socket.leave(room);
        })
      });

      socket.on("user:call", ({ room, offer }) => {
        socket.to(room).emit("incomming:call", { room, offer });
      });

      socket.on("call:accepted", ({ room, ans }) => {
        socket.to(room).emit("call:accepted", { room, ans });
      });

      socket.on("peer:nego:needed", ({ room, offer }) => {
        console.log("peer:nego:needed", offer);
        socket.to(room).emit("peer:nego:needed", { room, offer });
      });

      socket.on("peer:nego:done", ({ room, ans }) => {
        console.log("peer:nego:done", ans);
        socket.to(room).emit("peer:nego:final", { room, ans });
      });


      socket.on('disconnect', () => {
        console.log(socket.id, '🔥: A user disconnected');
        removeUser(socket.id as string);
        socket.leave(socket.id as string);
        io.emit(SOCKET_ACTIONS.NEW_USER_RESPONSE, users);
      })

    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;