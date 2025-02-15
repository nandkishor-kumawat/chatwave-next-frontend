import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./prisma";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { Lucia, User, Session } from "lucia";
import { Google } from "arctic";
import { User as PrismaUser } from "@prisma/client";
import { userAgent } from "next/server";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback/google"
);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (databaseUserAttributes) => ({
        email: databaseUserAttributes.email,
        name: databaseUserAttributes.name,
        profilePicture: databaseUserAttributes.profilePicture,
        coverPicture: databaseUserAttributes.coverPicture,
        username: databaseUserAttributes.username,
        role: databaseUserAttributes.role,
    })
});

export const getAuth = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null
            };
        }

        const result = await lucia.validateSession(sessionId);
        // next.js throws when you attempt to set cookie when rendering page
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
        } catch { }
        return result;
    }
);

export const createSession = async (userId: string, provider: 'google' | 'credentials' = 'credentials') => {
    const h = headers();
    const { ua, browser, os } = userAgent({ headers: h });
    //https://ipapi.co/json

    // const {
    //     ip,
    //     city,
    //     region,
    //     country_name: country,
    //     latitude,
    //     longitude,
    //     timezone,
    //     postal
    // } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-info`).then(res => res.json());

    // const { ip: ip4 } = await fetch('https://api.ipify.org?format=json').then(res => res.json());

    const deviceInfo = {
        userAgent: ua,
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        // ip: ip,
        // ip4,
        // city,
        // region,
        // country,
        // latitude,
        // longitude,
        // timezone,
        // postal,
        ip: h.get("x-forwarded-for"),
        city: decodeURIComponent(h.get("x-vercel-ip-city") ?? ""),
        region: h.get("x-vercel-ip-region"),
        country: h.get("x-vercel-ip-country"),
        latitude: h.get("x-vercel-ip-latitude"),
        longitude: h.get("x-vercel-ip-longitude"),
        timezone: h.get("x-vercel-ip-timezone"),
        postal: h.get("x-vercel-ip-postal-code")
    }
    const session = await lucia.createSession(userId, { provider, ...deviceInfo });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return session;
}

export const deleteSession = async (sessionId: string) => {
    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: PrismaUser;
    }
}
