import { lucia, getAuth } from "@/lib/auth"
import { cookies } from "next/headers";

export const GET = async (request: Request) => {
    const { session } = await getAuth();

    if (session) await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return Response.json({ success: true });
}