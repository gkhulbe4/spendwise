import { getSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orgName } = await req.json();
    if (!orgName) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    // Create the new organization and membership
    const organization = await prisma.organization.create({
      data: {
        name: orgName,
        memberships: {
          create: {
            userId: session.userId,
            role: "admin",
          },
        },
      },
    });

    // Automatically switch to the new organization
    await createSession({
      userId: session.userId,
      orgId: organization.id.toString(),
      orgName: organization.name,
      role: "admin",
      name: session.name,
      email: session.email,
    });

    return NextResponse.json({ success: true, orgId: organization.id.toString() });
  } catch (error) {
    console.error("Create Org Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
