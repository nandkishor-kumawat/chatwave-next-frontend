import React from 'react'
import Room from './_room';

const page = ({
    searchParams
}: {
    searchParams: {
        room: string;
        id: string;
        has_video: string;
    }
}) => {
    const { room, id, has_video } = searchParams;
    return (
        <Room room={room} id={id} has_video={has_video} />
    )
}

export default page
