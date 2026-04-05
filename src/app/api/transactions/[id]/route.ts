import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    
    // Check if it belongs to org
    const existing = await prisma.transaction.findFirst({
        where: { id, organizationId: Number(session.orgId) }
    });

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { title, amount, category, type, status, date } = body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category && { category }),
        ...(type && { type }),
        ...(status && { status }),
        ...(date && { date: new Date(date) }),
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    
    // Check if it belongs to org
    const existing = await prisma.transaction.findFirst({
        where: { id, organizationId: Number(session.orgId) }
    });

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
