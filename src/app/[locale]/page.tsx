import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <LocaleSwitcher />
    </>
  );
}
