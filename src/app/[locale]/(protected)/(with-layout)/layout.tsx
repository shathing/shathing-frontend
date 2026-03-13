import { ReactNode } from "react";
import DefaultLayout from "@/components/layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
