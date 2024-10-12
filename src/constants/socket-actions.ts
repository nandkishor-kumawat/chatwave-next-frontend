export const SOCKET_ACTIONS = {
    NEW_USER: 'new-user',
    LEAVE_ROOM: 'leave-room',
    MESSAGE: 'message',
    CHANGE_MEDIA: 'change-media',
    NEW_USER_RESPONSE: 'new-user-response',
    ROOM_CREATED: 'room:created',
    ROOM_JOINED: 'room:joined',
    ROOM_FULL: 'room:full',

    JOIN_ROOM: 'join-room',
    ICE_CANDIDATE: 'ice-candidate',
    OFFER: 'offer',
    ANSWER: 'answer',

    CALL_DATA: 'call:data',
} as const;