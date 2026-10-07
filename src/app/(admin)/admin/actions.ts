"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminDb, checkPassword, requireAdmin, signOut } from "@/lib/admin";

export async function login(_: { error?: string } | null, form: FormData) {
  const result = await checkPassword(String(form.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin");
}

export async function setSuggestionStatus(id: number, status: "new" | "accepted" | "declined") {
  await requireAdmin();
  await adminDb().from("resource_suggestions").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function setMessageStatus(id: number, status: "new" | "done") {
  await requireAdmin();
  await adminDb().from("contact_messages").update({ status }).eq("id", id);
  revalidatePath("/admin");
}
