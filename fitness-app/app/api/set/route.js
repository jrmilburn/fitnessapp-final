import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(request) {

    const { weight, reps, complete, setId } = await request.json();

    const updatedSet = await prisma.set.update({
        where: {
            id: setId
        },
        data: {
            weight: weight,
            reps: reps,
            complete: complete
        },
        
    })

    return NextResponse.json({
        status: "Set updated successfully",
        set: updatedSet
    })

}