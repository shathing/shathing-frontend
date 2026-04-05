import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Me");
  return { title: t("title") };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
