import { prisma } from "@/lib/prisma";
import ClaimForm from "./ClaimForm";
import { notFound } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const invite = await prisma.invitation.findUnique({
    where: { inviteCode: code },
    include: { organization: true },
  });

  if (!invite || invite.status !== "pending" || invite.expiresAt < new Date()) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4 selection:bg-[#0677fd]/30">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="text-[14px] font-medium text-[#0677fd] mb-2 uppercase tracking-wider">Workspace invitation</div>
          <h1 className="text-[24px] font-semibold text-[#ededed]">Join {invite.organization.name}</h1>
          <p className="text-[14px] text-[#737373] mt-2">Finish setting up your account to join your team</p>
        </div>

        <div className="p-6 bg-[#141414] border border-[#262626] rounded-2xl shadow-xl">
          <ClaimForm inviteCode={code} email={invite.email} />
        </div>
      </div>
    </div>
  );
}
