import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { EMAIL } from "@/constants/company";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 w-full border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
        <small>{`© ${year}. Yang jeong un. All rights reserved.`}</small>
        <small>{EMAIL}</small>
      </div>
    </footer>
  );
}
