import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  // Fetch all memberships for the switcher
  const memberships = await prisma.membership.findMany({
    where: { userId: session.userId },
    include: { organization: true },
  });

  return NextResponse.json({
    ...session,
    memberships: memberships.map((m) => ({
      orgId: m.organizationId,
      orgName: m.organization.name,
      role: m.role,
    })),
  });
}
