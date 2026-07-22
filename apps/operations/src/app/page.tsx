import { redirect } from "next/navigation";
import { getSession } from "@ecommerce/auth";

export default async function RootPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}
