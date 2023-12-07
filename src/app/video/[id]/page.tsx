"use client"
import { useSocket } from '@/lib/providers/socket-provider';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        }
    ],
};

const Room = () => {

    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);

    const userVideoRef = useRef<any>();
    const peerVideoRef = useRef<any>();
    const rtcConnectionRef = useRef<any>(null);
    const userStreamRef = useRef<any>();
    const hostRef = useRef(false);

    const { socket } = useSocket()
    const params = useParams()

    const roomName = params?.id;
    console.log({roomName})
    useEffect(() => {
        if (!socket) return
        // First we join a room
        socket.emit('join', roomName);

        socket.on('joined', handleRoomJoined);
        // If the room didn't exist, the server would emit the room was 'created'
        socket.on('created', handleRoomCreated);
        // Whenever the next person joins, the server emits 'ready'
        socket.on('ready', initiateCall);

        // Emitted when a peer leaves the room
        socket.on('leave', onPeerLeave);

        // // If the room is full, we show an alert
        // socket.on('full', () => {
        //     window.location.href = '/';
        // });

        // Event called when a remote user initiating the connection and
        socket.on('offer', handleReceivedOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handlerNewIceCandidateMsg);

    }, [roomName, socket]);

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                socket.emit('ready', roomName);
            })
            .catch((err) => {
                /* handle the error */
                console.log('error', err);
                alert(err)
            });
    };



    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
                alert(err)
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socket.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const onPeerLeave = () => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving all track of Peer.
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    }

    /**
     * Takes a userid which is also the socketid and returns a WebRTC Peer
     *
     * @param  {string} userId Represents who will receive the offer
     * @returns {RTCPeerConnection} peer
     */

    const createPeerConnection = () => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        return connection;

    };

    const handleReceivedOffer = (offer) => {
        if (!hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current.setRemoteDescription(offer);

            rtcConnectionRef.current
                .createAnswer()
                .then((answer) => {
                    rtcConnectionRef.current.setLocalDescription(answer);
                    socket.emit('answer', answer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleAnswer = (answer) => {
        rtcConnectionRef.current
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
    };

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomName);
        }
    };

    const handlerNewIceCandidateMsg = (incoming) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current
            .addIceCandidate(candidate)
            .catch((e) => console.log(e));
    };

    const handleTrackEvent = (event) => {
        // eslint-disable-next-line prefer-destructuring
        peerVideoRef.current.srcObject = event.streams[0];
    };

    const toggleMediaStream = (type, state) => {
        userStreamRef.current.getTracks().forEach((track) => {
            if (track.kind === type) {
                // eslint-disable-next-line no-param-reassign
                track.enabled = !state;
            }
        });
    };

    const toggleMic = () => {
        toggleMediaStream('audio', micActive);
        setMicActive((prev) => !prev);
    };

    const toggleCamera = () => {
        toggleMediaStream('video', cameraActive);
        setCameraActive((prev) => !prev);
    };

    const leaveRoom = () => {
        socket.emit('leave', roomName); // Let's the server know that user has left the room.

        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stops receiving all track of User.
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving audio track of Peer.
        }

        // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    };

    return (
        <div className='flex flex-col'>
            <video width={400}  autoPlay ref={userVideoRef} />
            <video width={400} autoPlay ref={peerVideoRef} />
            <button onClick={toggleMic} type="button">
                {micActive ? 'Mute Mic' : 'UnMute Mic'}
            </button>
            <button onClick={leaveRoom} type="button">
                Leave
            </button>
            <button onClick={toggleCamera} type="button">
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
        </div>
    );
};

export default Room;