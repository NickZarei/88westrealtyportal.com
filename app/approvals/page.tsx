import { redirect } from "next/navigation";

const session = {
  user: {
    name: "Test User",
    role: "admin",
  },
};

const checkAccess = (session: any): boolean => {
  return !!session && ["admin", "ceo", "hr"].includes(session.user?.role || "");
};

export default async function ApprovalsPage() {
  if (!checkAccess(session)) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Approvals Page</h1>
      <p>Welcome, {session.user.name}.</p>
    </div>
  );
}
