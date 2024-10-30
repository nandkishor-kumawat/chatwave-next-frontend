import React from 'react'
import LiveKitComp from './_livekit-comp';
import { notFound, redirect } from 'next/navigation';
import { callActions } from '@/actions';

const page = async ({
    searchParams,
}: {
    searchParams: {
        room: string;
        id: string;
        has_video: string;
    }
}) => {
    const { room, id, has_video } = searchParams;
    if (!room) redirect('/chat')
    // TODO: verify roomId
    const { token, error } = await callActions.getParticipantToken(room);
    if (error === "Unauthorized") redirect(`login?callbackUrl=/${encodeURIComponent(`call?${new URLSearchParams(searchParams).toString()}`)}`);
    if (!token) notFound();

    return (
        <LiveKitComp token={token} room={room} />
    )
}

export default page
