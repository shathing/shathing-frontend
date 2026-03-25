import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import LoginButton from "@/components/LoginButton";
import { cookies } from "next/headers";
import { REFRESH_TOKEN } from "@/constants/auth";

export default async function Header() {
  const t = await getTranslations("Header");
  const isAuthenticated = (await cookies()).has(REFRESH_TOKEN);

  return (
    <header className="h-12 w-full flex justify-center">
      <div className="w-full max-w-5xl flex items-center justify-between px-4">
        <Link href="/">
          <Icon name="shathing" />
        </Link>
        <nav>
          <ul className="flex gap-5">
            {[
              { href: "/share", title: t("share") },
              { href: "/post", title: t("post") },
            ].map(({ href, title }, idx) => (
              <li key={idx}>
                <Button asChild variant="ghost">
                  <Link href={href}>{title}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <LoginButton isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
