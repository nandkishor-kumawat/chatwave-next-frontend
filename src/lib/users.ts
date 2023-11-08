// import { User } from "./types";

type User = {
    id: string;
}

const users: User[] = [];

export const addUser = (user:User) => {
    users.push(user)
    // users = users.reduce((acc, user) => {
    //     const existingUser = acc.find(u => u.id === user.id && u.email !== null);
    //     if (!existingUser && user.email !== null) {
    //         acc.push(user);
    //     }
    //     return acc;
    // }, []);
}


export const removeUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

export const getUser = (id: string) => users.find((user) => user.id === id);

// export const getUsersInRoom = (room: string) => users.filter((user) => user.room === room);

