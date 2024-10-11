import React from 'react'

const VideoPlayer = ({
    stream,
    peer
}: {
    stream: MediaStream;
    peer?: RTCPeerConnection;
}) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (videoRef.current) {
            if (peer) {
                peer.ontrack = (event) => {
                    videoRef.current!.srcObject = event.streams[0];
                }
            } else {
                videoRef.current.srcObject = stream;
            }
        }
    }, [stream, peer])

    return (
        <video
            autoPlay
            playsInline
            muted
            ref={videoRef}
        // style={{
        //     width: '100%',
        //     height: '100%',
        //     objectFit: 'cover',
        //     borderRadius: '10px'
        // }}
        />
    )
}

export default VideoPlayer
