"use server"

import { revalidatePath } from "next/cache";
import { hash, verify } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export const signIn = async ({
    email,
    password
}: {
    email: string,
    password: string
}) => {

    if (!email || !password) {
        return {
            error: 'All fields are required'
        }
    }

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (user && !user.password) {
        return {
            error: 'This account was created with Google, please sign in with Google'
        }
    }

    if (!user) {
        return {
            error: 'Invalid credentials'
        }
    }

    const passwordValid = await verify(user.password!, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    if (!passwordValid) {
        return {
            error: 'Invalid credentials'
        }
    }

    await createSession(user.id);
    revalidatePath('/', 'layout');
    return {
        user
    }
}

export const signUp = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return {
            error: 'All fields are required'
        }
    }

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    })

    try {
        const existingUser = await prisma.user.findFirst({
            where: { email }
        })
        if (existingUser) {
            return { error: 'User already exists' }
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: passwordHash,
                username: email.split('@')[0]
            }
        })
        await createSession(user.id);
        revalidatePath('/', 'layout')
        return { user }
    } catch (error) {
        console.log(error)
        return { error: 'Error creating user' }
    }
}

export const signOut = async () => {
    await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/signout', {
        headers: headers()
    })

    const callbackUrl = new URL(headers().get('referer') ?? '/').pathname;
    revalidatePath('/', 'layout')
    redirect(`/login?callbackUrl=${callbackUrl}`);
}
