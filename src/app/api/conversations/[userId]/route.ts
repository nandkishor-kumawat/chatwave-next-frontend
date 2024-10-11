import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IParams {
    params: { userId: string }
}

// GET: /api/conversations/[userId]?limit=10&skip=0&page=1
// GET all conversations between the current user and the user with the ID params.userId
export const GET = async (req: Request, { params }: IParams) => {
    const session = await getAuth();
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    if (!params.userId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const limit = +(searchParams.get('limit') || 10);
    const skip = +(searchParams.get('skip') || 0);
    const page = +(searchParams.get('page') || 1);

    const usersId = [session.user.id, params.userId];

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                AND: [
                    { senderId: { in: usersId } },
                    { receiverId: { in: usersId } }
                ]
            },

        });
        return NextResponse.json({ conversations }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error", conversations: [] }, { status: 500 });
    }
}

// POST: /api/conversations/[userId]
// Send message to user with ID params.userId
export const POST = async (req: Request, { params }: IParams) => {
    const session = await getAuth();
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    if (!params.userId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { message } = await req.json();

    if (!message) return NextResponse.json({ error: "Invalid message" }, { status: 400 });

    try {
        const conversation = await prisma.conversation.create({
            data: {
                senderId: session.user.id,
                receiverId: params.userId,
                message
            }
        });

        return NextResponse.json(conversation, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: /api/conversations/[userId]
// DELETE all conversations between the current user and the user with the ID params.userId
export const DELETE = async (req: Request, { params }: IParams) => {
    const session = await getAuth();
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    if (!params.userId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const usersId = [session.user.id, params.userId];
    try {
        const conversations = await prisma.conversation.deleteMany({
            where: {
                AND: [
                    { senderId: { in: usersId } },
                    { receiverId: { in: usersId } }
                ]
            }
        });

        return NextResponse.json(conversations, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}