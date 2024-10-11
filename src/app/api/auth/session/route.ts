import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await getAuth();
    return NextResponse.json(session);
}