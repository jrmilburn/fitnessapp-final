import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

    const { userId } = await params;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    return NextResponse.json(user);

}