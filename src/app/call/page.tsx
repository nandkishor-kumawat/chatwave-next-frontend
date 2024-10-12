import React from 'react'
import LiveKitComp from './_livekit-comp';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

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
    // TODO: verify roomId
    const { token, error } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-participant-token?room=${room}`,
        {
            headers: headers()
        }
    ).then((res) => res.json());
    if (error === "Unauthorized") redirect(`login?callbackUrl=/${encodeURIComponent(`call?${new URLSearchParams(searchParams).toString()}`)}`);
    if (!token) notFound();
    return (
        <LiveKitComp token={token} room={room} />
    )
}

export default page
