"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@ecommerce/auth";

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await login(email, password);
  if (!result.success) return { error: result.error };

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
