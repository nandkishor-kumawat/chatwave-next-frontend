import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const res = await fetch('https://ipapi.co/json', {
        headers: request.headers
    }).then(res => res.json());
    return NextResponse.json(res);
}
