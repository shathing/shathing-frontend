import { redirect } from "next/navigation";
import VerifyEmailTokenClient from "./VerifyEmailTokenClient";

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;

  if (!token) {
    redirect("/auth");
  }

  return <VerifyEmailTokenClient token={token} />;
}
