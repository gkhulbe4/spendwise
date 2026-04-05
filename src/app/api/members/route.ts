import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.membership.findMany({
    where: { organizationId: Number(session.orgId) },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const members = memberships.map(m => ({
    id: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    joinedAt: m.createdAt,
  }));

  return NextResponse.json(members);
}
