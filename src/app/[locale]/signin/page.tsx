import { Icon } from "@/components/Icon";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./SignInForm";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata() {
  const t = await getTranslations("Signin");
  return {
    title: t("title"),
  };
}

export default async function Page() {
  const t = await getTranslations("Signin");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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
            <SignInForm />
          </CardContent>
          <Separator orientation="horizontal" />
          <CardFooter className="flex h-5 items-center gap-4 text-sm">
            <LocaleSwitcher />
            <Separator orientation="vertical" />
            {/* TODO: 회원가입 */}
            <Link href="/signup" className="underline-offset-4 hover:underline">
              {t("signup")}
            </Link>
            {/* TODO: 비밀번호 찾기 */}
            <Separator orientation="vertical" />
            <Link href="#" className="underline-offset-4 hover:underline">
              {t("find-password")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
