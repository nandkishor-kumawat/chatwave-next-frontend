"use client";
import { ICE_SERVERS } from '@/config/servers';
import { useSocket } from '@/lib/providers/socket-provider';
import { notFound, useSearchParams } from 'next/navigation';
import React, { useRef } from 'react'

const mediaConstraints = {
    audio: true,
    video: true,
}
const offerOptions = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: true,
};

const VideoCall = () => {
    const searchParams = useSearchParams()

    const id = searchParams?.get('id');
    const roomId = searchParams?.get('room');
    console.log(roomId)
    const hasVideo = searchParams?.get('has_video');

    // if (!id) notFound();

    const { socket } = useSocket();
    const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
    const remoteVideoRef = useRef<Record<string, HTMLVideoElement>>({});
    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    // const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
    const peerConnectionRef = React.useRef<RTCPeerConnection | null>(null);

    const localStreamRef = React.useRef<MediaStream | null>(null);
    const remoteStreamRef = React.useRef<MediaStream | null>(null);

    const [isMuted, setIsMuted] = React.useState<boolean>(false);
    const [isVideoEnabled, setIsVideoEnabled] = React.useState<boolean>(true);
    const localPeerId = useRef<string | null>(null);


    React.useEffect(() => {
        if (!socket) return

        socket.emit('call:join', roomId);

        socket.on('call:created', handleRoomCreated);

        socket.on('call:joined', handleRoomJoined);

        socket.on('start_call', handleStartCall)

        socket.on('webrtc_offer', async (event) => {
            console.log(`Socket event callback: webrtc_offer. RECEIVED from ${event.senderId}`)
            const remotePeerId = event.senderId;
          
            peerConnections.current[remotePeerId] = new RTCPeerConnection(ICE_SERVERS)
            console.log(new RTCSessionDescription(event.sdp))
            peerConnections.current[remotePeerId].setRemoteDescription(new RTCSessionDescription(event.sdp))
            console.log(`Remote description set on peer ${localPeerId.current} after offer received`)
            addLocalTracks(peerConnections.current[remotePeerId])
          
            peerConnections.current[remotePeerId].ontrack = (event) => setRemoteStream(event, remotePeerId)
            peerConnections.current[remotePeerId].oniceconnectionstatechange = (event) => checkPeerDisconnect(event, remotePeerId);
            peerConnections.current[remotePeerId].onicecandidate = (event) => sendIceCandidate(event, remotePeerId)
            await createAnswer(peerConnections.current[remotePeerId], remotePeerId)
          })

        socket.on('webrtc_answer', async (event) => {
            console.log(`Socket event callback: webrtc_answer. RECEIVED from ${event.senderId}`)
          
            console.log(`Remote description set on peer ${localPeerId.current} after answer received`)
            peerConnections.current[event.senderId].setRemoteDescription(new RTCSessionDescription(event.sdp))
            //addLocalTracks(peerConnections[event.senderId])
            console.log(new RTCSessionDescription(event.sdp))
          })
          
          /**
           * Mensaje webrtc_ice_candidate. Candidato ICE recibido de otro par
           */
          socket.on('webrtc_ice_candidate', (event) => {
            const senderPeerId = event.senderId;
            console.log(`Socket event callback: webrtc_ice_candidate. RECEIVED from ${senderPeerId}`)
          
            // ICE candidate configuration.
            var candidate = new RTCIceCandidate({
              sdpMLineIndex: event.label,
              candidate: event.candidate,
            })
            peerConnections.current[senderPeerId].addIceCandidate(candidate)
          })
          

        socket.on('change-media', (a: any) => {
            console.log(a)
        })

    }, [socket, roomId])

    const setLocalStream = async () => {
        console.log('Local stream set')
        try {
            const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
            localStreamRef.current = stream;
            localVideoRef.current!.srcObject = stream;
        } catch (error) {
            console.error('Could not get user media', error)
        }
    }

    const handleRoomCreated = async ({ peerId }: { peerId: string }) => {
        localPeerId.current = peerId;
        console.log(`Created room ${roomId}`);
        await setLocalStream();
    };

    const handleRoomJoined = async ({ peerId, roomId }: { peerId: string, roomId: string }) => {
        localPeerId.current = peerId;
        console.log(`Joined room ${peerId}`);
        await setLocalStream();

        socket.emit('start_call', {
            roomId,
            senderId: localPeerId.current
        })
    }

    const addLocalTracks = (rtcPeerConnection: RTCPeerConnection) => {
        if(localStreamRef.current){
        localStreamRef.current!.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track, localStreamRef.current!)
        })}
    }

    const setRemoteStream = (event: RTCTrackEvent, remotePeerId: string) => {
        remoteVideoRef.current[remotePeerId]!.srcObject = event.streams[0];
    }

    const checkPeerDisconnect = (event: Event, remotePeerId: string) => {
        var state = peerConnections.current[remotePeerId].iceConnectionState;
      
        if (state === "failed" || state === "closed" || state === "disconnected") {
            //Se eliminar el elemento de vídeo del DOM si se ha desconectado el par
            console.log(`Peer ${remotePeerId} has disconnected`);
            delete peerConnections.current[remotePeerId];
            delete remoteVideoRef.current[remotePeerId];
        }
    }

    const sendIceCandidate = (event: RTCPeerConnectionIceEvent, remotePeerId: string) => {
        if (event.candidate) {
       
            socket.emit('webrtc_ice_candidate', {
                senderId: localPeerId.current,
                receiverId: remotePeerId,
                roomId: roomId,
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
            })
        }
    }

    const createOffer = async (rtcPeerConnection: RTCPeerConnection, remotePeerId: string) => {
        try {
          let sessionDescription = await rtcPeerConnection.createOffer(offerOptions);
          rtcPeerConnection.setLocalDescription(sessionDescription);
     
          socket.emit('webrtc_offer', {
            type: 'webrtc_offer',
            sdp: sessionDescription,
            roomId: roomId,
            senderId: localPeerId.current,
            receiverId: remotePeerId
          })
        } catch (error) {
          console.error(error)
        }
    }

    const createAnswer = async (rtcPeerConnection: RTCPeerConnection, remotePeerId: string) => {
        try {
        let  sessionDescription = await rtcPeerConnection.createAnswer(offerOptions)
          rtcPeerConnection.setLocalDescription(sessionDescription)
          console.log(`Sending answer from peer ${localPeerId.current} to peer ${remotePeerId}`)
          socket.emit('webrtc_answer', {
            type: 'webrtc_answer',
            sdp: sessionDescription,
            roomId: roomId,
            senderId: localPeerId.current,
            receiverId: remotePeerId
          })
        } catch (error) {
          console.error(error)
        }
      

    }

    const handleStartCall = async ({ roomId, senderId }: { roomId: string, senderId: string }) => {
        const remotePeerId = senderId;
        peerConnections.current[remotePeerId] = new RTCPeerConnection(ICE_SERVERS)
        addLocalTracks(peerConnections.current[remotePeerId])

        peerConnections.current[remotePeerId].ontrack = (event) => setRemoteStream(event, remotePeerId)
        peerConnections.current[remotePeerId].oniceconnectionstatechange = (event) => checkPeerDisconnect(event, remotePeerId);
        peerConnections.current[remotePeerId].onicecandidate = (event) => sendIceCandidate(event, remotePeerId)

        await createOffer(peerConnections.current[remotePeerId], remotePeerId)
    }

    console.log(remoteVideoRef.current)

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted playsInline />

        </div>

    )
}

export default VideoCall
