import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request) {
    const { weekLayout, programStructure } = await request.json();

    console.log(weekLayout);
    console.log(programStructure);

    return NextResponse.json({
        status: 201,
        message: "Program created successfully"
    })
}