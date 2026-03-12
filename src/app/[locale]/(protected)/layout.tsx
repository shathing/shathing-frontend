import { REFRESH_TOKEN } from "@/constants/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  if (!cookieStore.has(REFRESH_TOKEN)) redirect("/auth");

  return children;
}
