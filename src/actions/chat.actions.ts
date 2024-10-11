"use server";

import { getAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Conversation } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const sendMessage = async (data: Conversation) => {
    const { user } = await getAuth();
    if (!user) return;
    try {
        const msg = await prisma.conversation.create({
            data: {
                ...data,
                senderId: user.id
            }
        });

        return msg;
    } catch (error) {
        console.error(error);
        return null;
    }
}