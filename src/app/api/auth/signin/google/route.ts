import { google } from "@/lib/auth";
import { generateState } from "arctic";
import { generateId } from "lucia";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateId(32);

    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["openid", "email", "profile"],
    });

    cookies().set("google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    cookies().set("google_oauth_code_verifier", codeVerifier, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });
    return Response.redirect(url);
}