import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/types';
import { addMessage } from '@/lib/messages';

function ioHandler(req: NextApiRequest, res: NextApiResponse) {

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

  const getUser = (id: string) => users.find((user) => user.id === id);

  if (!(res.socket as any).server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server((res.socket as any).server);

    io.on('connection', (socket: any) => {
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

      socket.on('ready', (id: string) => {
        console.log(socket.id, 'ready')
        socket.join(id);
        io.to(id).emit('ready', id);
      })

      socket.on('change-media', (room:string, data:any) => {
        console.log('change media')
        io.to(room).emit('change-media', data);
      })

      socket.emit('ice-candidate', (candidate: any) => {
        io.emit('ice-candidate', candidate)
      })

      socket.on('disconnect', () => {
        console.log(socket.id, '🔥: A user disconnected');
        removeUser(socket.id as string);
        // socket.leave(socket.id as string);
        io.emit('newUserResponse', users);
      });
    });


    (res.socket as any).server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler;
