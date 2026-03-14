import { REFRESH_TOKEN } from "@/constants/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!(await cookies()).has(REFRESH_TOKEN)) redirect("/auth");

  return children;
}
