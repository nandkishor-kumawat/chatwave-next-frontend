import { rdb } from "@/firebase";
import { ref, set, get, onValue, remove, child, push } from "firebase/database";


class Fsocket {
    id: string | null;
    private targetRoom: string | undefined;
    private db: any;

    constructor() {
        this.db = rdb;
        this.id = null;
        this.targetRoom = undefined;
        this.createSocketId();
    }

    private async createSocketId() {
        try {
            const socketRef = ref(this.db, "sockets");
            const newSocketRef = push(socketRef);
            this.id = newSocketRef.key; // Use the key as the socket ID
            await set(newSocketRef, { createdAt: new Date().toISOString() });
            console.log(`Socket created with ID: ${this.id}`);
        } catch (error) {
            console.error("Error creating socket ID: ", error);
        }
    }

    disconnect() {
        if (this.id) {
            const socketRef = ref(this.db, `sockets/${this.id}`);
            remove(socketRef);
            console.log(`Socket disconnected with ID: ${this.id}`);
        }
    }

    // Emit data to the Realtime Database
    async emit(event: string, data: any) {
        const theData = typeof data === "object" ? data : { data }; // Ensure data is an object
        if (event === 'connect') {
            const connectRef = ref(this.db, `sockets/${this.id}`);
            await set(connectRef, theData);
            return;
        }
        try {
            let path = `events/${event}`;
            if (this.targetRoom) {
                path = `rooms/${this.targetRoom}/events/${event}`;
            }
            const eventRef = ref(this.db, path);
            await set(eventRef, theData);
            console.log(`Event '${event}' emitted to room: ${this.targetRoom}`);
            this.targetRoom = undefined;
        } catch (error) {
            console.error(error);
        }
    }

    to(room: string) {
        console.log('room', room);
        this.targetRoom = room;
        return this;
    }

    // Listen to an event with real-time updates
    on(event: string, callback: (data: any) => void) {
        if (event === 'connect' && this.id) {
            const connectRef = ref(this.db, `sockets/${this.id}`);
            const unsub = onValue(connectRef, (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                }
            });
            return unsub;
        }

        if (event === 'disconnect' && !this.id) {
            const disconnectRef = ref(this.db, `sockets/${this.id}`);
            console.log(disconnectRef.key)
            const unsub = onValue(disconnectRef, (snapshot) => {
                callback(true);
            });
            return unsub;
        }

        // Listen to general events
        const eventRef = ref(this.db, `events/${event}`);
        const unsub = onValue(eventRef, (snapshot) => {
            if (snapshot.exists()) {
                const currentData = snapshot.val();
                console.log(currentData)
                callback(currentData);
                remove(eventRef);
                console.log(`Listening to event: ${event}`);
            }
        });
        return unsub;
    }

    // Join a room (represented by a Realtime Database path)
    async join(room: string) {
        try {
            console.log({ room })
            const membersRef = ref(this.db, `rooms/${room}/members`);
            const memberRef = push(membersRef);
            await set(memberRef, { memberId: this.id });
            console.log(`Joined room: ${room} with member ID: ${memberRef.key}`);
        } catch (error) {
            console.error(error);
        }
    }
    off(event: string) {
        if (event === 'connect' && this.id) {
            const connectRef = ref(this.db, `sockets/${this.id}`);
            onValue(connectRef, () => { });
        }

        if (event === 'disconnect' && !this.id) {
            const disconnectRef = ref(this.db, `sockets/${this.id}`);
            onValue(disconnectRef, () => { });
        }

        // Listen to general events
        const eventRef = ref(this.db, `events/${event}`);
        onValue(eventRef, () => { });
    }

    // Leave a room (delete membership document)
    async leave(room: string) {
        try {
            const memberRef = ref(this.db, `rooms/${room}/members/${this.id}`);
            await remove(memberRef);
            console.log(`Left room: ${room}`);
        } catch (error) {
            console.error(error);
        }
    }

    // List all rooms (Realtime Database paths)
    async rooms() {
        try {
            const roomsRef = ref(this.db, "rooms");
            const snapshot = await get(roomsRef);
            if (snapshot.exists()) {
                const roomsList = Object.keys(snapshot.val());
                console.log("Rooms available: ", roomsList);
                return roomsList;
            } else {
                console.log("No rooms available");
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

export default Fsocket;
