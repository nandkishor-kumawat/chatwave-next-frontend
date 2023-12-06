"use client"
import React from 'react'
import { useSearchParams, useRouter, notFound } from 'next/navigation'
import { useAppSelector } from '@/redux/store'
import { ICE_SERVERS } from '@/config/servers'
import { Button, ButtonGroup } from '@mui/material'


const CallPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const id = searchParams?.get('id');
    const hasVideo = searchParams?.get('has_video');

    if (!id) notFound();

    const socket = useAppSelector((state) => state.socket.socket);

    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
    const peerConnection = React.useRef<RTCPeerConnection | null>(null);

    const localStream = React.useRef<MediaStream | null>(null);
    const remoteStream = React.useRef<MediaStream | null>(null);

    const [mute, setMute] = React.useState(false);
    const [webCam, setWebCam] = React.useState(true);

    React.useEffect(() => {
        if(!socket) return

        socket.on('ready', (id: string) => {
            console.log('in client', id)
        })

        navigator.mediaDevices.getUserMedia({
            video: hasVideo === 'true',
            audio: true
        }).then((stream) => {
            localStream.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        })

        return () => {
            if (localStream.current) {
              localStream.current.getTracks().forEach((track) => track.stop());
            }
          };
    }, [hasVideo, socket])


    const roomJoin = () => {
        navigator.mediaDevices.getUserMedia({
            video: hasVideo === 'true',
            audio: true
        }).then((stream) => {
            localStream.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                socket.emit('ready', id);
            }
        })
    }



    const createPeerConnection = () => {
        const connection = new RTCPeerConnection(ICE_SERVERS);

        connection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate);
            }
        };

        connection.ontrack = (event) => {
            remoteVideoRef.current!.srcObject = event.streams[0];
        };

        return connection;
    };

    const toggleMediaStream = (type:string, state:boolean) => {
        localStream.current!.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = !state;
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
            <video className='scale-x-[-1] scale-y-1' id="localVideo" autoPlay muted ref={localVideoRef}></video>

            <ButtonGroup sx={{ flex: 1, justifyContent: 'flex-end', mr: 1 }}>
                <Button variant='outlined' onClick={roomJoin}>
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