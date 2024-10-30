"use server"
import { getAuth } from "@/lib/auth";
import { AccessToken } from "livekit-server-sdk";

export const getParticipantToken = async (room: string) => {

    if (!room) {
        return {
            error: 'Missing "room" parameter'
        };
    }

    const { user } = await getAuth();

    if (!user) {
        return {
            error: "Unauthorized"
        };
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        return {
            error: "Server misconfigured"
        };
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: user.id, name: user.name });

    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return { token: await at.toJwt() };
}