import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  const deleteSet = await prisma.set.delete({
    where: { id: id },
  });

  return NextResponse.json({
    message: "Set deleted successfully",
    setId: deleteSet.id,
  });
}
