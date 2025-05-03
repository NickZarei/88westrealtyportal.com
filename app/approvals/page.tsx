import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // adjust path if needed
import { Session } from "next-auth";

const checkAccess = (session: Session | null): boolean => {
  return !!session && ["admin", "ceo", "hr"].includes(session.user?.role || "");
};

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!checkAccess(session)) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Approvals Page</h1>
      {/* Render approvals list or admin controls here */}
    </div>
  );
}
