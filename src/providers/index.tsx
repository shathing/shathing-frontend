import { ReactNode } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <NextIntlClientProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
}
