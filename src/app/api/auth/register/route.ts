import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, orgName } = await req.json();

    if (!name || !email || !password || !orgName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    let user = existingUser;

    if (existingUser) {
      // Verify password if user exists
      const isValid = await bcrypt.compare(password, existingUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid password for existing account" }, { status: 401 });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { name, email: normalizedEmail, password: hashedPassword },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to resolve user" }, { status: 500 });
    }

    // Create org and membership
    const organization = await prisma.organization.create({
      data: {
        name: orgName,
        memberships: {
          create: {
            userId: user.id,
            role: "admin",
          }
        }
      }
    });

    await createSession({
      userId: user.id,
      orgId: organization.id.toString(),
      orgName: organization.name,
      role: "admin",
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
