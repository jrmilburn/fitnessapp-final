import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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

export async function POST(request) {

    const { weight, reps, complete, exerciseId } = await request.json();

    const sets = await prisma.set.findMany({
        where: {
            exerciseId: exerciseId
        }
    })

    const newSet = await prisma.set.create({
        data: {
            weight: weight,
            reps: reps,
            complete: complete,
            exerciseId: exerciseId,
            setNo: sets.length + 1
        },
        
    })

    return NextResponse.json({
        status: "Set created successfully",
        set: newSet
    })

}