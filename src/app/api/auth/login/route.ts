import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, orgId } = await req.json();

    if (!email || !password || !orgId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ 
        where: { email: normalizedEmail },
        include: { 
          memberships: {
            include: { organization: true }
          }
        }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Find the specific membership for the provided orgId
    const parsedOrgId = Number(orgId);
    if (isNaN(parsedOrgId)) {
      return NextResponse.json({ error: "Invalid Organization ID format" }, { status: 400 });
    }

    const activeMembership = user.memberships.find(m => m.organizationId === parsedOrgId);

    if (!activeMembership) {
      console.log(`User ${normalizedEmail} attempted login to org ${parsedOrgId} but only has memberships in:`, user.memberships.map(m => m.organizationId));
      return NextResponse.json({ error: "You are not a member of this organization" }, { status: 403 });
    }

    await createSession({
      userId: user.id,
      orgId: activeMembership.organizationId.toString(),
      orgName: activeMembership.organization.name,
      role: activeMembership.role,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
