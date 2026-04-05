import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (id === session.userId) {
    return NextResponse.json(
      { error: "Cannot remove yourself" },
      { status: 400 },
    );
  }

  try {
    await prisma.membership.delete({
      where: {
        userId_organizationId: {
          userId: id,
          organizationId: Number(session.orgId),
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Member Error", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();
    if (!role || !["admin", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await prisma.membership.update({
      where: {
        userId_organizationId: {
          userId: id,
          organizationId: Number(session.orgId),
        },
      },
      data: { role },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Member Error", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    );
  }
}
