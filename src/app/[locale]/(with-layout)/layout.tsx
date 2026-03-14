import { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full flex justify-center bg-blue-300">
        <div className="w-full max-w-5xl px-4">{children}</div>
      </main>
      <Footer />
    </>
  );
}
