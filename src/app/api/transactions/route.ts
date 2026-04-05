import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { organizationId: Number(session.orgId) },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only admins can create transactions in this platform (as per user brief: Admin manages financial data)
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can add transactions" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, amount, category, type, status, date } = body;

    if (!title || amount === undefined || !category || !type || !status || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        type,
        status,
        date: new Date(date),
        organizationId: Number(session.orgId),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
