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

  const hasVideo = searchParams?.get('has_video');

  // if (!id) notFound();

  const { socket, isConnected } = useSocket();
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  // const remoteVideoRef = useRef<Record<string, HTMLVideoElement>>({});
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const peerConnectionRef = React.useRef<RTCPeerConnection | null>(null);

  const localStreamRef = React.useRef<MediaStream | null>(null);
  const remoteStreamRef = React.useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = React.useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState<boolean>(true);
  const localPeerId = useRef<string | null>(null);

  React.useEffect(() => {
    if (!isConnected) return;
    console.log('roomId', roomId);
    socket.emit('room:join', roomId);

    socket.on('room:created', handleRoomCreated);
    socket.on('room:joined', handleRoomJoined);

  }, [isConnected])


  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localStreamRef.current = stream;
    localVideoRef.current!.srcObject = stream;
  }

  const handleRoomCreated = async({ peerId, roomId }: { peerId: string, roomId: string }) => {
    localPeerId.current = peerId;
    console.log('peerId', peerId);
    await getLocalStream();
  }

  const handleRoomJoined = async({ peerId, roomId }: { peerId: string, roomId: string }) => {
    localPeerId.current = peerId;
    console.log('peerId', peerId);
    await getLocalStream();
    socket.emit('start_call', {
        roomId,
        senderId: peerId
    })
  }

  async function makeCall() {

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', {
      offer,
      roomId,
      peerId: localPeerId.current
    });
}

//   async function getConnectedDevices(type) {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     return devices.filter(device => device.kind === type)
// }

// navigator.mediaDevices.addEventListener('devicechange', event => {
//   const newCameraList = getConnectedDevices('video');
//   console.log(newCameraList);
// });

// getConnectedDevices('videoinput').then((devices) => {
//   console.log('devices', devices);
// });


  return (
    <div>
      <video ref={localVideoRef} autoPlay  />
      <video ref={remoteVideoRef} autoPlay />

    </div>

  )
}

export default VideoCall
