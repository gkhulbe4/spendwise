import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        organizationId: Number(session.orgId),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // In a real app, you'd send an email here.
    // For this prompt, we return the link to the admin to "copy".
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${invitation.inviteCode}`;

    return NextResponse.json({ inviteLink });
  } catch (error) {
    console.error("Invite Error", error);
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
  }
}
