import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { inviteCode, name, password } = await req.json();

    if (!inviteCode || !name || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const invite = await prisma.invitation.findUnique({
      where: { inviteCode, status: "pending" },
      include: { organization: true },
    });

    if (!invite || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      // Find or create user
      let u = await tx.user.findUnique({ where: { email: invite.email } });
      
      if (u) {
        // Verify password if user exists
        const isValid = await bcrypt.compare(password, u.password);
        if (!isValid) throw new Error("Invalid password for existing account");
      } else {
        u = await tx.user.create({
          data: {
            email: invite.email,
            name,
            password: hashedPassword,
          },
        });
      }

      // Create membership (ignore if already exists to be safe)
      await tx.membership.upsert({
        where: {
          userId_organizationId: {
            userId: u.id,
            organizationId: invite.organizationId,
          }
        },
        create: {
          userId: u.id,
          organizationId: invite.organizationId,
          role: invite.role,
        },
        update: {
          role: invite.role, // Update role if already a member
        }
      });

      // Mark invite as accepted
      await tx.invitation.update({
        where: { id: invite.id },
        data: { status: "accepted" },
      });

      return u;
    });

    await createSession({
      userId: user.id,
      orgId: invite.organizationId,
      orgName: invite.organization.name,
      role: invite.role,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim Error", error);
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
