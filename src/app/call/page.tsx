"use client"
import React from 'react'
import { useSearchParams, useRouter, notFound } from 'next/navigation'
import { useAppSelector } from '@/redux/store'
import { ICE_SERVERS } from '@/config/servers'
import { Button, ButtonGroup } from '@mui/material'
import { useSocket } from '@/lib/providers/socket-provider'
import { SOCKET_ACTIONS } from '@/constants/socket-actions'


const CallPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const id = searchParams?.get('id');
    const roomName = searchParams?.get('room');
    const hasVideo = searchParams?.get('has_video');

    if (!id) notFound();

    const { socket } = useSocket();

    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
    const peerConnectionRef = React.useRef<RTCPeerConnection | null>(null);
    const hostRef = React.useRef(false);
    const localStreamRef = React.useRef<MediaStream | null>(null);
    const remoteStreamRef = React.useRef<MediaStream | null>(null);

    const [mute, setMute] = React.useState(false);
    const [webCam, setWebCam] = React.useState(true);


    React.useEffect(() => {
        if (!socket) return

        socket.emit('call:join', roomName);

        socket.on('call:created', handleRoomCreated);

        socket.on('call:joined', handleRoomJoined);
        socket.on('call:ready', initiateCall)

        socket.on('leave', onPeerLeave);

        socket.on('offer', handleReceivedOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handlerNewIceCandidateMsg);

        socket.on(SOCKET_ACTIONS.CHANGE_MEDIA, (a: any) => {
            console.log(a)
        })

    }, [socket, roomName])

    const handleAnswer = (answer: RTCSessionDescription) => {
        peerConnectionRef.current!
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
    };
    const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        peerConnectionRef.current!
            .addIceCandidate(candidate)
            .catch((e) => console.log(e));
    };

    const onPeerLeave = () => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        // if (remoteVideoRef.current?.srcObject) {
        //     remoteVideoRef.current.srcObject
        //         .getTracks()
        //         .forEach((track) => track.stop()); // Stops receiving all track of Peer.
        // }

        // Safely closes the existing connection established with the peer who left.
        if (peerConnectionRef.current) {
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
    }

    const handleRoomCreated = () => {
        console.log('room created')
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                localStreamRef.current = stream;
                localVideoRef.current!.srcObject = stream;
                socket.emit('call:ready', roomName);

            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
                alert(err)
            });
    };



    const handleRoomJoined = () => {
        console.log('room joined')
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: hasVideo === 'true',
            })
            .then((stream) => {
                localStreamRef.current = stream;
                localVideoRef.current!.srcObject = stream;
                socket.emit('call:ready', roomName);
            })
            .catch((err) => {
                /* handle the error */
                console.log('error', err);
                alert(err)
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            peerConnectionRef.current = createPeerConnection();
            peerConnectionRef.current.addTrack(
                localStreamRef.current!.getTracks()[0],
                localStreamRef.current!,
            );
            peerConnectionRef.current.addTrack(
                localStreamRef.current!.getTracks()[1],
                localStreamRef.current!,
            );
            peerConnectionRef.current
                .createOffer()
                .then((offer) => {
                    peerConnectionRef.current!.setLocalDescription(offer);
                    socket.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleReceivedOffer = (offer: RTCSessionDescription) => {
        if (!hostRef.current) {
            peerConnectionRef.current = createPeerConnection();
            if (localStreamRef.current) {
                peerConnectionRef.current.addTrack(
                    localStreamRef.current.getTracks()[0],
                    localStreamRef.current,
                );
                peerConnectionRef.current.addTrack(
                    localStreamRef.current.getTracks()[1],
                    localStreamRef.current,
                );
            }
            peerConnectionRef.current.setRemoteDescription(offer);

            peerConnectionRef.current
                .createAnswer()
                .then((answer) => {
                    peerConnectionRef.current!.setLocalDescription(answer);
                    socket.emit('answer', answer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const createPeerConnection = () => {
        const connection = new RTCPeerConnection(ICE_SERVERS);

        connection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, roomName);
            }
        };

        connection.ontrack = (event) => {
            remoteVideoRef.current!.srcObject = event.streams[0];
            console.log(event)
        };

        return connection;
    };

    const toggleMediaStream = (type: string, state: boolean) => {
        socket.emit(SOCKET_ACTIONS.CHANGE_MEDIA, roomName, { type, state: !state });
        localStreamRef.current!.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = !state;
                socket.emit(SOCKET_ACTIONS.CHANGE_MEDIA, roomName, { type, state: !state });
            }
        });
    };

    const toggleMic = () => {
        toggleMediaStream('audio', mute);
        setMute((prev) => !prev);
    };

    const toggleCamera = () => {
        toggleMediaStream('video', webCam);
        setWebCam((prev) => !prev);
    };



    return (
        <>
            <div>id: {id}, hasVideo: {hasVideo}</div>
            {/* <video className='scale-x-[-1] scale-y-1' id="localVideo" autoPlay muted ref={localVideoRef}></video> */}
            <video width={400} autoPlay ref={localVideoRef} />
            <video width={400} autoPlay ref={remoteVideoRef} />

            <ButtonGroup sx={{ flex: 1, justifyContent: 'flex-end', mr: 1 }}>
                <Button variant='outlined' onClick={handleRoomJoined}>
                    Start
                </Button>
                <Button variant='outlined' onClick={toggleMic}>
                    {mute ? 'Unmute' : 'Mute'}
                </Button>
                <Button variant='outlined' onClick={toggleCamera}>
                    {webCam ? 'Disable' : 'Enable'}
                </Button>
            </ButtonGroup>
        </>
    )
}

export default CallPage