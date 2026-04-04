import { Icon } from "@/components/Icon";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { AuthForm } from "./AuthForm";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return { title: t("title") };
}

export default async function Page() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex min-h-svh w-full min-w-xs items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <Link href="/">
            <Icon name="shathing" height="40" width="40" />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
          <Separator orientation="horizontal" />
          <CardFooter className="flex h-5 items-center gap-4 text-sm">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
