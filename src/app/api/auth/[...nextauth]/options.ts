import type { DefaultUser, NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
interface User {
    id: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            profile(profile) {
                console.log(profile)
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    role: "user"
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "jsmith",
                    required: true
                },
                password: {
                    label: "Password",
                    type: "password",
                    required: true
                }
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string }
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const data = userCredential.user;
                const userRef = doc(db, 'users', data?.uid);
                const userData = await getDoc(userRef);
                const user = userData.data();

                if (user) {
                    return {
                        id: user?.id,
                        name: user.name,
                        email: user.email,
                    }
                }


                return null;
            },
        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        async session({ session, token }:any) {
            if (session?.user) session.user.id = token.id
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET
}