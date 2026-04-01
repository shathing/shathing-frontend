import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { EMAIL, COPYRIGHT } from "@/constants/company";

export default function Footer() {
  return (
    <footer className="h-12 w-full flex justify-center border-t overflow-hidden">
      <div className="w-full max-w-5xl flex px-4 items-center justify-between">
        <div className="flex gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
        <div className="hidden sm:flex gap-2">
          <small>{COPYRIGHT}</small>
          <small>{EMAIL}</small>
        </div>
      </div>
    </footer>
  );
}
