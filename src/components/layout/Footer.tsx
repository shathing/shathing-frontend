import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center bg-green-400">
      <div className="w-full max-w-5xl flex items-center justify-between px-4">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
