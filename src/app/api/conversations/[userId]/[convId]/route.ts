import { getAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IParams {
    params: { userId: string, convId: string }
}


// DELETE: /api/conversations/[userId]/[convId]
// Delete conversation with ID params.convId
export const DELETE = async (req: Request, { params }: IParams) => {
    const session = await getAuth();
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    if (!params.userId || !params.convId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    try {
        const conversation = await prisma.conversation.delete({
            where: {
                id: params.convId,
            }
        });

        return NextResponse.json(conversation, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
