import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { OperationsSession } from "@ecommerce/types";

export async function requireSession(loginPath = "/login"): Promise<OperationsSession> {
  const session = await getSession();
  if (!session) redirect(loginPath);
  return session;
}

export async function requireRole(
  role: OperationsSession["user"]["role"],
  loginPath = "/login"
): Promise<OperationsSession> {
  const session = await requireSession(loginPath);
  const hierarchy = { viewer: 0, operator: 1, admin: 2 };
  if (hierarchy[session.user.role] < hierarchy[role]) {
    redirect("/");
  }
  return session;
}
