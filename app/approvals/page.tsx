import { Session } from "next-auth";

const checkAccess = (session: Session | null): boolean => {
  if (!session || !["admin", "ceo", "hr"].includes(session.user?.role || "")) {
    return false;
  }
  return true;
};
