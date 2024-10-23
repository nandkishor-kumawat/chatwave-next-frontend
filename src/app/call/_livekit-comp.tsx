"use client";
import '@livekit/components-styles';
import { useSocket } from "@/components/providers";
import {
    ControlBar,
    GridLayout,
    LayoutContextProvider,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    VideoConference,
    useParticipants,
    useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

const LiveKitComp = ({ token, room }: { token: string; room: string }) => {

    const searchParams = useSearchParams();
    const router = useRouter();

    const { socket, isConnected } = useSocket();

    const handleRoomJoin = useCallback(() => {

    }, []);

    const handleRoomLeave = useCallback(() => {
        console.log('leaviong/...')
        router.back();
    }, []);



    return (
        <LayoutContextProvider>
            <span className='absolute top-4 left-4 w-3 h-3 rounded-full z-50 animate-pulse' style={{
                backgroundColor: isConnected ? 'green' : 'red'
            }}></span>
            <LiveKitRoom
                video={false}
                audio={false}
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: '100dvh' }}
                onConnected={handleRoomJoin}
                onDisconnected={handleRoomLeave}
            >
                {/* <VideoConference /> */}
                <RoomAudioRenderer />
                <MyVideoConference />
                <ControlBar
                    controls={{
                        screenShare: false,
                    }}
                />
            </LiveKitRoom>
        </LayoutContextProvider>
    )
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: true },
    );
    const participants = useParticipants();

    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}


export default LiveKitComp
