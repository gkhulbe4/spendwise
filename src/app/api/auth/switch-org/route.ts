import { getSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orgId } = await req.json();
    const parsedOrgId = Number(orgId);
    if (isNaN(parsedOrgId)) {
      return NextResponse.json({ error: "Invalid Organization ID format" }, { status: 400 });
    }

    // Verify user actually belongs to this org
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.userId,
          organizationId: parsedOrgId,
        }
      },
      include: { organization: true }
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden: Not an organization member" }, { status: 403 });
    }

    // Update the session with new org context
    await createSession({
      ...session,
      orgId: membership.organizationId.toString(),
      orgName: membership.organization.name,
      role: membership.role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Switch Org Error", error);
    return NextResponse.json({ error: "Failed to switch organization" }, { status: 500 });
  }
}
