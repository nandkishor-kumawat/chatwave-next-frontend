import { Server } from 'socket.io';
import { addUser, removeUser } from '@/lib/users'
// import { addMessage } from '@/lib/messages';
import {
  USER_JOIN_CHAT_EVENT,
  USER_LEAVE_CHAT_EVENT,
  NEW_CHAT_MESSAGE_EVENT,
  START_TYPING_MESSAGE_EVENT,
  STOP_TYPING_MESSAGE_EVENT
} from '@/constants/eventconst';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/types';

function ioHandler(req: NextApiRequest, res: NextApiResponse) {



  let users: User[] = [];

  const addUser = (user:User) => {
    users.push(user)
    // users = users.reduce((acc, user) => {
    //   const existingUser = acc.find(u => u.id === user.id && u.email !== null);
    //   if (!existingUser && user.email !== null) {
    //     acc.push(user);
    //   }
    //   return acc;
    // }, []);
  }

  const removeUser = (id: String) => {
    const index = users.findIndex((user) => user.id === id);

    users = users.filter(user => user.id !== id);
  }

  const getUser = (id: string) => users.find((user) => user.id === id);

  if (!(res.socket as any).server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server((res.socket as any).server);

    io.on('connection', (socket) => {
      console.log(socket.id, 'connected')

      socket.on('newUser', (email) => {
        addUser({
          email,
          id: socket.id,
          typing: {
            status: false,
            to: null
          },
          name: ''
        });
        socket.join(email);
        console.log(socket.rooms)
        io.emit('newUserResponse', users);
      });

      socket.on('typing', (from, status, to) => {
        const user = users.find((user) => user.email === from);
        if (user) {
          user.typing.to = to;
          user.typing.status = status;
        }
        io.emit('newUserResponse', users);
      });


      socket.on('disconnect', () => {
        console.log(socket.id, '🔥: A user disconnected');
        removeUser(socket.id);
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
